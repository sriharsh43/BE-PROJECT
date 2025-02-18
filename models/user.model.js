import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
const userSchema = new Schema(
    {
        username :{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            index : true,
            trim : true
        },
        email :{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        fullname :{
            type : String,
            required : true,
            index: true,
            trim : true
        },
        avatar : {
            type : String, //cloudinary urll
            required  : true,
        },
        coverImage : {
            type : String,
        },
        watchHistory : [{
            type : Schema.Types.ObjectId,
            ref : "Video"
        }],

        password : {
            type : String,
            required : [true,"Password is required"]
        },
        refreshToken : {
            type : String
        },
},{
    timestamps : true
}
)
//To encrypt the password
userSchema.pre("save",async function (next) {
    if (!this.isModified(this.password)) return next()
    this.password = bcrypt.hash(this.password,10)
    next()
})
//To check the entered password is corrrect or not
userSchema.methods.isPasswordCorrect = async function (password) {
    await bcrypt.compare(password,this.password)
}

export const User = mongoose.model("User",userSchema)