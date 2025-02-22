import dotenv from "dotenv"
import {app} from './app.js'
import connectDB from "./db/index.js"
dotenv.config({
    path: './.env'
})

connectDB()

.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is started at port ${process.env.PORT}`); 
    })   
})
.catch((error)=>{
    console.log(`MONGODB CONNECTION FAILED...! ${error}`);
    
})
