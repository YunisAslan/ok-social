import DefaultUserImg from "@/assets/images/default-user-img.png";
import { BadgeCheck, MessageCircleIcon, ThumbsUp } from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { editUserRequest, getUserByID } from "@/services/api/users";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog } from "./ui/Dialog";
import PostCommentsModal from "./PostCommentsModal";

function FeedPost({ post }) {
  const user = useSelector((state) => state.user.user);

  const [currentUser, setCurrentUser] = useState(null);
  const [postLikesCount, setPostLikesCount] = useState(
    post?.likes?.length || 0
  );
  const [isLiked, setIsLiked] = useState(
    post?.likes?.includes(user.userID) || false
  );

  useEffect(() => {
    async function loadData() {
      try {
        const currentUserData = await getUserByID(user.userID);
        setCurrentUser(currentUserData);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  const handleLike = async () => {
    try {
      const postCreatorData = await getUserByID(post.creatorID);

      if (isLiked) {
        const updatedPost = {
          ...post,
          likes: post.likes.filter((userId) => userId !== user.userID),
        };

        setPostLikesCount(() => postLikesCount - 1);
        setIsLiked(false);

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
          })),
        });
      } else {
        const updatedPost = { ...post, likes: [...post.likes, user.userID] };
        setPostLikesCount(() => postLikesCount + 1);
        setIsLiked(true);

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
          })),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full border border-border rounded-lg px-3 py-5 flex flex-col gap-y-3">
      <div className="flex items-center gap-x-2">
        <div className="w-12 h-12 overflow-hidden rounded-full">
          <img
            src={post?.creatorPicture ? post.creatorPicture : DefaultUserImg}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-base font-semibold">
            <Link
              to={`/profile/${post.creatorID}`}
              className="flex items-center gap-x-1"
            >
              {post.creatorUsername}

              {post?.creatorIsVerified && (
                <BadgeCheck className="stroke-[#4f3ed0] w-4 h-4" />
              )}
            </Link>
          </h1>
          <p className="text-xs text-muted-foreground">
            {moment(post.date).format("LLL")}
          </p>
        </div>
      </div>

      <div className="w-full h-60 rounded overflow-hidden">
        <img
          src={post.imageURL}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <p>{post.title}</p>

        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <PostCommentsModal post={post} currentUser={currentUser} />
          </div>

          <div className="flex items-center gap-x-1">
            <Button variant="ghost" size="icon" onClick={handleLike}>
              {isLiked ? (
                <ThumbsUp className="fill-primary" />
              ) : (
                <ThumbsUp className="fill-white" />
              )}
            </Button>

            <span>{postLikesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedPost;
