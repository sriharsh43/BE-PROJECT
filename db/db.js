import mongoose from "mongoose";

import { my_DB } from "../src/constants.js";

const connectDB = async () => {
    try {
       const connection = await mongoose.connect(`${process.env.MONGO_DB_URL} / ${my_DB}`)
       console.log(`\n MongoDB connected...! DBHost : ${connection.connection.host}`); 
    } catch (error) {
        console.log(`MONGODB CONNECTION ERROR ${error}`);
        process.exit(1)
    }
}

export default connectDB

