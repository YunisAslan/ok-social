import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Skeleton } from "./ui/Skeleton";
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/api/users";
import { Link } from "react-router-dom";
import { BadgeCheck, Loader2 } from "lucide-react";
import DefaultUserImg from "@/assets/images/default-user-img.png";
import FollowRequestBtn from "./FollowRequestBtn";

function FollowingsModal({ loading, currentUser }) {
  const [followings, setFollowings] = useState([]);
  const [followingsLoading, setFollowingsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setFollowingsLoading(true);

        const allUsers = await getAllUsers();

        const filteredFollowings = allUsers.filter((user) =>
          currentUser?.followings.includes(user?.id)
        );

        setFollowings(filteredFollowings);
      } catch (err) {
        console.error(err);
      } finally {
        setFollowingsLoading(false);
      }
    }

    loadData();
  }, [currentUser?.followings]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Followings{" "}
          {loading ? (
            <Skeleton className="h-3 w-3" />
          ) : (
            currentUser?.followings?.length
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Followings</DialogTitle>
          <div className="pt-2 flex flex-col gap-y-2">
            {followingsLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              followings.map((following) => {
                return (
                  <div
                    key={following.id}
                    className="flex items-center justify-between hover:bg-accent px-2 py-1 rounded"
                  >
                    <div className="flex items-center gap-x-2">
                      <div className="w-12 h-12 overflow-hidden rounded-full">
                        <img
                          src={
                            following?.profilePicture
                              ? following.profilePicture
                              : DefaultUserImg
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h1 className="text-base font-semibold flex items-center gap-x-2">
                          <Link to={`/profile/${following.id}`}>
                            {following.username}
                          </Link>

                          {following?.isVerified && (
                            <BadgeCheck className="stroke-[#4f3ed0] w-4 h-4" />
                          )}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                          {following.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <FollowRequestBtn
                        currentUser={currentUser}
                        user={following}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default FollowingsModal;
