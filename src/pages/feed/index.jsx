import FeedPost from "@/components/FeedPost";
import { getAllUsers, getUserByID } from "@/services/api/users";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Feed() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followingUsersPosts, setFollowingUsersPosts] = useState([]);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [setUsers]);

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
  }, [setCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      const followingUsersData = users.filter((u) =>
        currentUser?.followings.includes(u.id)
      );
      setFollowingUsers(followingUsersData);
    }
  }, [currentUser, users]);

  useEffect(() => {
    const posts = followingUsers.reduce((acc, followingUser) => {
      return acc.concat(
        (followingUser.posts || []).map((post) => ({
          ...post,
          creatorID: followingUser.id,
          creatorUsername: followingUser.username,
          creatorPicture: followingUser.profilePicture,
          creatorIsVerified: followingUser.isVerified,
        }))
      );
    }, []);

    setFollowingUsersPosts(posts);
  }, [followingUsers]);

  return (
    <div className="flex flex-col gap-y-5 w-1/2 mx-auto">
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : (
        followingUsersPosts
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((post) => {
            return <FeedPost key={post.id} post={post} />;
          })
      )}

      {followingUsersPosts.length === 0 && (
        <div className="flex justify-center">
          You don't have any feed post for now
        </div>
      )}
    </div>
  );
}

export default Feed;
