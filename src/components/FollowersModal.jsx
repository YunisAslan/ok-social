import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Skeleton } from "./ui/Skeleton";
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/api/users";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import DefaultUserImg from "@/assets/images/default-user-img.png";

function FollowersModal({ loading, currentUser }) {
  const [followers, setFollowers] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setFollowersLoading(true);

        const allUsers = await getAllUsers();

        const filteredFollowers = allUsers.filter((user) =>
          currentUser?.followers.includes(user?.id)
        );

        setFollowers(filteredFollowers);
      } catch (err) {
        console.error(err);
      } finally {
        setFollowersLoading(false);
      }
    }

    loadData();
  }, [currentUser?.followers]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Followers{" "}
          {loading ? (
            <Skeleton className="h-3 w-3" />
          ) : (
            currentUser?.followers?.length
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
          <div className="pt-2 flex flex-col gap-y-2">
            {followersLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              followers.map((follower) => {
                return (
                  <div
                    key={follower.id}
                    className="flex items-center justify-between hover:bg-accent px-2 py-1 rounded"
                  >
                    <div className="flex items-center gap-x-2">
                      <div className="w-12 h-12 overflow-hidden rounded-full">
                        <img
                          src={
                            follower?.profilePicture
                              ? follower.profilePicture
                              : DefaultUserImg
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h1 className="text-base font-semibold">
                          <Link to={`/profile/${follower.id}`}>
                            {follower.username}
                          </Link>
                        </h1>
                        <p className="text-xs text-muted-foreground">
                          {follower.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Button size="sm">Follow</Button>
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

export default FollowersModal;
