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
import { registerUser,loginUser,logOutUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import {verifyJWT} from "../middleware/auth.middleware.js"

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
router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logOutUser)

export default router;
