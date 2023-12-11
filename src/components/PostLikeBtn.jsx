import { editUserRequest, getUserByID } from "@/services/api/users";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { ThumbsUp } from "lucide-react";

function PostLikeBtn({ post, user }) {
  const [postLikesCount, setPostLikesCount] = useState(
    post?.likes?.length || 0
  );

  const [isLiked, setIsLiked] = useState(
    post?.likes?.includes(user.userID) || false
  );

  const handleLike = async () => {
    try {
      if (isLiked) {
        setPostLikesCount(() => postLikesCount - 1);
        setIsLiked(false);

        const postCreatorData = await getUserByID(post.creatorID);

        const updatedPost = {
          ...post,
          likes: post.likes.filter((userId) => userId !== user.userID),
        };

        const updatedPosts = postCreatorData.posts.map((userPost) =>
          userPost.id === updatedPost.id ? updatedPost : userPost
        );

        await editUserRequest(post.creatorID, {
          posts: updatedPosts.map((updatedPost) => ({
            id: updatedPost.id,
            title: updatedPost.title,
            imageURL: updatedPost.imageURL,
            likes: updatedPost.likes,
            date: updatedPost.date,
            comments: updatedPost?.comments,
            creatorID: updatedPost?.creatorID,
          })),
        });
      } else {
        setPostLikesCount(() => postLikesCount + 1);
        setIsLiked(true);

        const postCreatorData = await getUserByID(post.creatorID);
        const updatedPost = { ...post, likes: [...post.likes, user.userID] };

        const updatedPosts = postCreatorData.posts.map((userPost) =>
          userPost.id === updatedPost.id ? updatedPost : userPost
        );

        await editUserRequest(post.creatorID, {
          posts: updatedPosts.map((updatedPost) => ({
            id: updatedPost.id,
            title: updatedPost.title,
            imageURL: updatedPost.imageURL,
            likes: updatedPost.likes,
            date: updatedPost.date,
            comments: updatedPost?.comments,
            creatorID: updatedPost?.creatorID,
          })),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleLike}>
        {isLiked ? (
          <ThumbsUp className="fill-primary" />
        ) : (
          <ThumbsUp className="fill-white" />
        )}
      </Button>

      <span>{postLikesCount}</span>
    </>
  );
}

export default PostLikeBtn;
