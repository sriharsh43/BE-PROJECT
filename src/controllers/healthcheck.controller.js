import {ApiError} from "../utils/ApiError.js"
import {apiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const healthcheck = asyncHandler(async (req, res) => {
    res.status(200).json(apiResponse(200, "OK"))
})

export {
    healthcheck
}