import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {apiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const like = await Like.findOne({ user: req.user._id, video: videoId })

    if (like) {
        await like.remove()
        res.status(200).json(apiResponse(200, "Video like removed successfully"))
    } else {
        const newLike = new Like({ user: req.user._id, video: videoId })
        await newLike.save()
        res.status(201).json(apiResponse(201, "Video liked successfully", newLike))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const like = await Like.findOne({ user: req.user._id, comment: commentId })

    if (like) {
        await like.remove()
        res.status(200).json(apiResponse(200, "Comment like removed successfully"))
    } else {
        const newLike = new Like({ user: req.user._id, comment: commentId })
        await newLike.save()
        res.status(201).json(apiResponse(201, "Comment liked successfully", newLike))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    const like = await Like.findOne({ user: req.user._id, tweet: tweetId })

    if (like) {
        await like.remove()
        res.status(200).json(apiResponse(200, "Tweet like removed successfully"))
    } else {
        const newLike = new Like({ user: req.user._id, tweet: tweetId })
        await newLike.save()
        res.status(201).json(apiResponse(201, "Tweet liked successfully", newLike))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({ user: req.user._id, video: { $exists: true } }).populate('video')

    res.status(200).json(apiResponse(200, "Liked videos fetched successfully", likes))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}