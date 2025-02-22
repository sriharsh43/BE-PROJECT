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
        fullName :{
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
    this.password = await bcrypt.hash(this.password,10)
    next()
})
//To check the entered password is corrrect or not
userSchema.methods.isPasswordCorrect = async function (password) {
    await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAcessToken = function () {
    jwt.sign({
        _id : this._id,
        username : this.username,
        email : this.email,
        fullname : this.fullname
    },process.env.ACCESS_TOKEN_SECRET),
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
}
userSchema.methods.generateRefreshAcessToken = function () {
    jwt.sign({
        _id : this._id,
    },process.env.REFRESH_TOKEN_SECRET),
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
}

export const User = mongoose.model("User",userSchema)