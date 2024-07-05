import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/create-post', verifyToken, createPost)
router.get('/get-posts', getPosts)
router.delete('/delete-post/:postId/:userId', verifyToken, deletePost)
router.put('/update-post/:postId/:userId', verifyToken, updatePost)

export default router;