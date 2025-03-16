import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {apiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    const totalVideos = await Video.countDocuments({ channel: channelId })
    const totalViews = await Video.aggregate([
        { $match: { channel: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ])
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId })
    const totalLikes = await Like.countDocuments({ video: { $in: await Video.find({ channel: channelId }).select('_id') } })

    res.status(200).json(apiResponse(200, "Channel stats fetched successfully", {
        totalVideos,
        totalViews: totalViews[0] ? totalViews[0].totalViews : 0,
        totalSubscribers,
        totalLikes
    }))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    const videos = await Video.find({ channel: channelId })

    res.status(200).json(apiResponse(200, "Channel videos fetched successfully", videos))
})

export {
    getChannelStats, 
    getChannelVideos
}