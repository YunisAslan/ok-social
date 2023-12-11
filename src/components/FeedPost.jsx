import DefaultUserImg from "@/assets/images/default-user-img.png";
import { BadgeCheck } from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserByID } from "@/services/api/users";
import PostCommentsModal from "./PostCommentsModal";
import PostLikeBtn from "./PostLikeBtn";

function FeedPost({ post }) {
  const user = useSelector((state) => state.user.user);

  const [currentUser, setCurrentUser] = useState(null);

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
            <PostLikeBtn post={post} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedPost;
