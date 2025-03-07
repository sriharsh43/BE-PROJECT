import mongoose,{Schema} from "mongoose";
const likeSchema = new Schema(
    {
        video : {
            type : Schema.Types.ObjectId,
            ref : "Video" 
        }
    }
)