/*import { Router } from 'express'
import { registerUser } from '../controllers/user.controller.js'
import { upload } from '../middleware/multer.js'
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

export default router*/
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.route("/register").post(
    (req, res, next) => {
        console.log("Received request:", req.body);
        console.log("Received files:", req.files);
        next();
    },
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

export default router;
