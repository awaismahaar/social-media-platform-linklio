import { Router } from "express";
import { authUser } from "../middlewares/authUser.middleware.js";
import {
  commentOnPost,
  createPost,
  deleteCommentOnPost,
  deletePost,
  dislikeComment,
  getAllPosts,
  getAllUserPosts,
  getPostById,
  likeComment,
  likePost,
  updateCommentOnPost,
} from "../controllers/post.controller.js";
import upload from "../utils/multer.js";
let router = Router();

router.post("/create-post", authUser, upload.array("images", 5), createPost);
router.delete("/delete-post/:postId", authUser, deletePost);

router.get("/get-posts", getAllPosts);
router.get("/get-post/:postId", getPostById);
router.get("/get-user-posts/:userId", authUser, getAllUserPosts);
router.get("/like-post/:postId", authUser, likePost);
router.post("/comment-post/:postId", authUser, commentOnPost)
router.put("/update-comment/:commentId", authUser, updateCommentOnPost)
router.delete("/delete-comment/:commentId", authUser, deleteCommentOnPost);
router.get("/like-comment/:commentId", authUser, likeComment);
router.get("/dislike-comment/:commentId", authUser, dislikeComment);

export default router;
