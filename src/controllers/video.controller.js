import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import { apiResponse } from "../utils/ApiResponse.js"
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
        res.status(200).json(new apiResponse(200, 'Videos fetched successfully', {
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
    const { title, description } = req.body;
    const { file } = req;

    if (!file) {
        throw new ApiError(400, 'No video file uploaded');
    }

    try {
        // Upload video to Cloudinary
        const uploadResult = await uploadOnCloudinary(file.path);

        // Create a new video document
        const newVideo = new Video({
            title,
            description,
            videoUrl: uploadResult.secure_url,
            user: req.user._id // Assuming you have user information in req.user
        });

        // Save the video document to the database
        await newVideo.save();

        // Send the response
        res.status(201).json(new ApiResponse(201, 'Video published successfully', newVideo));
    } catch (error) {
        throw new ApiError(500, 'An error occurred while publishing the video');
    }
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID');
    }

    try {
        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(404, 'Video not found');
        }

        res.status(200).json(new ApiResponse(200, 'Video fetched successfully', video));
    } catch (error) {
        throw new ApiError(500, 'An error occurred while fetching the video');
    }
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, thumbnail } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID');
    }

    try {
        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(404, 'Video not found');
        }

        // Update video details
        if (title) video.title = title;
        if (description) video.description = description;
        if (thumbnail) video.thumbnail = thumbnail;

        // Save the updated video document to the database
        await video.save();

        // Send the response
        res.status(200).json(new apiResponse(200, 'Video updated successfully', video));
    } catch (error) {
        throw new ApiError(500, 'An error occurred while updating the video');
    }
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID');
    }

    try {
        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(404, 'Video not found');
        }

        // Delete the video document from the database
        await video.remove();

        // Send the response
        res.status(200).json(new apiResponse(200, 'Video deleted successfully'));
    } catch (error) {
        throw new ApiError(500, 'An error occurred while deleting the video');
    }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID');
    }

    try {
        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(404, 'Video not found');
        }

        // Toggle the publish status
        video.isPublished = !video.isPublished;

        // Save the updated video document to the database
        await video.save();

        // Send the response
        res.status(200).json(new apiResponse(200, 'Video publish status toggled successfully', video));
    } catch (error) {
        throw new ApiError(500, 'An error occurred while toggling the publish status');
    }
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}