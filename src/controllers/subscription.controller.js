import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {apiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel ID')
    }

    const subscribers = await Subscription.find({ channelId }).populate('userId', 'username')
    return res.status(200).json(apiResponse(200, 'Subscribers fetched successfully', subscribers))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, 'Invalid subscriber ID')
    }

    const subscriptions = await Subscription.find({ userId: subscriberId }).populate('channelId', 'name')
    return res.status(200).json(apiResponse(200, 'Subscribed channels fetched successfully', subscriptions))
})

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user.id // Assuming user ID is available in req.user

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel ID')
    }

    const subscription = await Subscription.findOne({ channelId, userId })

    if (subscription) {
        // If subscription exists, remove it
        await subscription.remove()
        return res.status(200).json(apiResponse(200, 'Unsubscribed successfully'))
    } else {
        // If subscription does not exist, create it
        const newSubscription = new Subscription({ channelId, userId })
        await newSubscription.save()
        return res.status(201).json(apiResponse(201, 'Subscribed successfully'))
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}