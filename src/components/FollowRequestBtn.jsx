import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { editUserRequest } from "@/services/api/users";

function FollowRequestBtn({ user, currentUser }) {
  const [btnStatus, setBtnStatus] = useState(null);

  useEffect(() => {
    const isIncludeFollowers = user?.followers?.includes(currentUser.id);
    const isIncludeFollowings = user?.followings?.includes(currentUser.id);
    const isIncludeRequests = user?.requests?.includes(currentUser.id);

    if (isIncludeRequests) {
      setBtnStatus("Requested");
    } else if (isIncludeFollowers) {
      setBtnStatus("Unfollow");
    } else if (isIncludeFollowings) {
      setBtnStatus("Follow back");
    } else if (!isIncludeFollowers) {
      setBtnStatus("Follow");
    }
  }, [user]);

  const handleFollow = async (user) => {
    if (btnStatus === "Follow") {
      if (user?.isPublic) {
        setBtnStatus("Unfollow");

        await editUserRequest(user.id, {
          followers: [...user.followers, currentUser.id],
        });

        await editUserRequest(currentUser.id, {
          followings: [...currentUser.followings, user.id],
        });
      } else {
        setBtnStatus("Requested");

        await editUserRequest(user.id, {
          requests: [...user.requests, currentUser.id],
        });
      }
    } else if (btnStatus === "Unfollow" || btnStatus === "Requested") {
      if (currentUser.followers.includes(user.id)) {
        setBtnStatus("Follow back");
      } else {
        setBtnStatus("Follow");
      }

      const filteredFollowers = user.followers.filter((u) => {
        return u != currentUser.id;
      });

      const filteredFollowings = currentUser.followings.filter((u) => {
        return u != user.id;
      });

      const filteredRequests = user.requests.filter((u) => u != currentUser.id);

      await editUserRequest(user.id, {
        followers: filteredFollowers,
        requests: filteredRequests,
      });

      await editUserRequest(currentUser.id, {
        followings: filteredFollowings,
      });
    } else if (btnStatus === "Follow back") {
      if (user?.isPublic) {
        setBtnStatus("Unfollow");

        await editUserRequest(user.id, {
          followers: [...user.followers, currentUser.id],
        });

        await editUserRequest(currentUser.id, {
          followings: [...currentUser.followings, user.id],
        });
      } else {
        setBtnStatus("Requested");

        await editUserRequest(user.id, {
          requests: [...user.requests, currentUser.id],
        });
      }
    }
  };

  return (
    <Button size="sm" onClick={() => handleFollow(user)}>
      {btnStatus}
    </Button>
  );
}

export default FollowRequestBtn;
