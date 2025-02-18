import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN, // cors
    credentials : true
}))

app.use(express.json({
    limit : "16kb"  //this is the json limit
}))
//Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded({
    extended : true,
    limit : "16kb"
}))
//It serves static files and is based on serve-static.
app.use(express.static("public"))
app.use(cookieParser())
export {app}

