
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import {apiResponse} from "../utils/apiResponse.js"
const registerUser = asyncHandler(async (req,res)=>{
     //Get details from frontend / usermodel
     //validation 
     //check if user is already exist : username , email
     //upload image to cloudinary : avatar
     //create user object : entry in DB
     //remove password and refresh token field
     //check for user creation : null / created
     //return user / error

     //1
     const {fullName,email,username,password} = req.body
     console.log("Username",username);
     console.log("Email",email);
     /*if(fullName == ""){
        throw new ApiError(400,"Full name is required")
     }*/
    //if([fullName,email,username,password].some((field)=> field?.trim() === "") )
    //Input the field values.
    if ([fullName,email,username,password].some((field)=> field?.trim() === "")) {
    } else {
        throw new ApiError(400,"All fields are required")
    }
    //Checking if user is alredy existed
    const existingUser = User.find({
        $or : [{ username },{ email }]
    })
    if (existingUser) {
        throw new ApiError(409,"User already existed")
    }
    //Getting the path of the files
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverLocalPath = req.files?.coverimage[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar is required")
    }
    //Uploading avatar on cloudinary 
    const avatarUploaded =  await uploadOnCloudinary(avatarLocalPath)
    const coverUploaded =  await uploadOnCloudinary(coverLocalPath)
    if (!avatarUploaded) {
        throw new ApiError(400,"Avatar is required")
    }
    //Creating user 
    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverimage : coverimage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })
    //Remove password and refreshtoken
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something has went wrong")
    }
    return res.status(200).json(
        new apiResponse(200,createdUser,"User sucessfully registered")
    )
    
})

export {registerUser}   