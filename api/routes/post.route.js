import express from "express"
import { verifyToken } from "../utils/verifyUser.js";
import { createPost, getPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/create-post', verifyToken, createPost)
router.get('/get-posts', getPosts)

export default router;