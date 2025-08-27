import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { getSocketId, io } from "../server.js";

function deleteMultipleImages(imageUrls) {
  return Promise.all(
    imageUrls.map((url) => {
      const publicId = url.split("/").pop().split(".")[0];
      return cloudinary.uploader.destroy(publicId);
    })
  );
}
async function createPost(req, res) {
  try {
    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let uploadedUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files?.map((file) => {
        return cloudinary.uploader.upload(file.path).then((result) => {
          // Remove the file after upload
          fs.unlinkSync(file.path);
          return result.secure_url;
        });
      });
      uploadedUrls = await Promise.all(uploadPromises);
    }

    await Post.create({
      content,
      author: user._id,
      media: uploadedUrls || [],
    });
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function deletePost(req, res) {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }
    // Delete media from Cloudinary
    if (post.media && post.media.length > 0) {
      await deleteMultipleImages(post.media);
    }
    await Post.findByIdAndDelete(postId);
    // Also delete associated comments
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("author", "_id fullName avatar username isVerified")
      .populate("likes", "fullName avatar")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "fullName username avatar isVerified",
        },
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getAllUserPosts(req, res) {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const posts = await Post.find({ author: userId })
      .populate("author", "_id fullName avatar username isVerified")
      .populate("likes", "fullName avatar")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "fullName username avatar isVerified",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function likePost(req, res) {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    const post = await Post.findById(postId).populate("author", "_id");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.likes.includes(userId)) {
      // User already liked the post, so we remove the like
      post.likes = post.likes.filter((like) => like.toString() !== userId);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        likesCount: post.likes.length,
      });
    } else {
      // User has not liked the post yet, so we add the like
      post.likes.push(userId);
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post liked successfully",
        likesCount: post.likes.length,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function commentOnPost(req, res) {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const { comment } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const commentOnPost = await Comment.create({
      user: userId,
      content: comment,
      post: postId,
    });
    const commentPost = await Comment.findById(commentOnPost._id)
      .populate("user", "fullName username avatar isVerified");
    post.comments.push(commentOnPost._id);
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: commentPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getPostById(req, res) {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
      .populate("author", "_id fullName avatar username isVerified")
      .populate("likes", "fullName avatar")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "fullName username avatar isVerified",
        }
      })
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function updateCommentOnPost(req, res) {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;
    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this comment",
      });
    }
    comment.content = content;
    await comment.save();
    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function deleteCommentOnPost(req, res) {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }
    const post = await Post.findById(comment.post);
    if (post) {
      post.comments = post.comments.filter(
        (c) => c.toString() !== commentId
      );
      await post.save();
    }
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });

  }
}

async function likeComment(req, res) {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    if (comment.likes.includes(userId)) {
      // User already liked the comment, so we remove the like
      comment.likes = comment.likes.filter((like) => like.toString() !== userId);
      await comment.save();
      return res.status(200).json({
        success: true,
        message: "Comment unliked successfully",
        likesCount: comment.likes.length,
      });
    } else {
      // User has not liked the comment yet, so we add the like
      comment.likes.push(userId);
      await comment.save();
      return res.status(200).json({
        success: true,
        message: "Comment liked successfully",
        likesCount: comment.likes.length,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function dislikeComment(req, res) {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    if (comment.dislikes.includes(userId)) {
      // User already disliked the comment, so we remove the dislike
      comment.dislikes = comment.dislikes.filter((dislike) => dislike.toString() !== userId);
      await comment.save();
      return res.status(200).json({
        success: true,
        message: "Comment undisliked successfully",
        dislikesCount: comment.dislikes.length,
      });
    } else {
      // User has not disliked the comment yet, so we add the dislike
      comment.dislikes.push(userId);
      await comment.save();
      return res.status(200).json({
        success: true,
        message: "Comment disliked successfully",
        dislikesCount: comment.dislikes.length,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
export {
  createPost,
  deletePost,
  getAllPosts,
  getAllUserPosts,
  likePost,
  commentOnPost,
  getPostById,
  updateCommentOnPost,
  deleteCommentOnPost,
  likeComment,
  dislikeComment
};
