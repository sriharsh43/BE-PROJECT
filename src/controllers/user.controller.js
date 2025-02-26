
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import {apiResponse} from "../utils/apiResponse.js"
const registerUser = asyncHandler(async (req, res) => {
    console.log("req.files:", req.files); // Debugging

    const { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Debugging: Check if files exist
    if (!req.files || !req.files.avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Avatar file upload failed");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new apiResponse(200, createdUser, "User registered Successfully"));
});
const loginUser = asyncHandler(async (req,res)=>{
    /*
        req-body -> Data
        username or email -> For login
        Find the user available
        Check the password
        Acess and Refresh token
        Send cookies
        Send response
     */
    const{email,username,password} = req.body;
    if (!username || !email) {
        throw new ApiError(400,"User name or email is required...")
    }
    //Find the user available
    const user = await User.findOne({
        $or : [{username},{email}]
    })
    if (!user) {
        throw new ApiError(404,"User does not exist")
    }
    //Check the password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid ) {
        throw new ApiError(401,"Incorrect Password")
    }




} )

export 
{registerUser,
loginUser
}   