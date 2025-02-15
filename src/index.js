import mongoose from "mongoose";

(async ()=>{
    try {
        mongoose.connect(`${process.env.MONGO_DB_URL}`)
    } catch (error) {
        console.error("ERROR",error)
        throw error
    }
})
()
