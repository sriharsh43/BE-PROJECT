import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

    // Build the query object
    let queryObj = {};
    if (query) {
        queryObj.$text = { $search: query };
    }
    if (userId && isValidObjectId(userId)) {
        queryObj.user = userId;
    }

    try {
        // Fetch videos from the database
        const videos = await Video.find(queryObj)
            .sort({ [sortBy]: sortType === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Get the total count of videos matching the query
        const totalVideos = await Video.countDocuments(queryObj);

        // Send the response
        res.status(200).json(new ApiResponse(200, 'Videos fetched successfully', {
            videos,
            totalPages: Math.ceil(totalVideos / limit),
            currentPage: page,
            totalVideos
        }));
    } catch (error) {
        throw new ApiError(500, 'An error occurred while fetching videos');
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}