import FollowersModal from "@/components/FollowersModal";
import FollowingsModal from "@/components/FollowingsModal";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/hooks/use-toast";
import { getUserByID } from "@/services/api/users";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DefaultUserImg from "@/assets/images/default-user-img.png";
import UserPost from "@/components/UserPost";
import { BadgeCheck, Loader2Icon, Lock } from "lucide-react";

function ProfileDetail() {
  const { id } = useParams();

  const { toast } = useToast();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const currentUserData = await getUserByID(id);
        setCurrentUser(currentUserData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, setCurrentUser]);

  console.log("Current user", currentUser?.followers);
  console.log("user", user.userID);

  return (
    <div>
      <div className="grid grid-cols-12 gap-x-6 mt-4">
        <div className="col-span-12 lg:col-span-5 border rounded-lg mb-3 lg:mb-0">
          <div className="flex flex-col gap-y-2 justify-around items-center h-full py-5 relative">
            <div className="w-40 h-40 overflow-hidden rounded-full border border-gray-300">
              <img
                src={
                  currentUser?.profilePicture
                    ? currentUser.profilePicture
                    : DefaultUserImg
                }
                className="w-full h-full object-cover"
                alt=""
              />
            </div>

            <div className="text-center flex flex-col items-center gap-y-1.5">
              <h2 className="text-xl font-semibold flex items-center gap-x-2">
                {loading ? (
                  <Skeleton className="h-5 w-48 mb-1" />
                ) : (
                  currentUser?.fullName
                )}

                {currentUser?.isVerified && (
                  <BadgeCheck className="stroke-[#4f3ed0] w-5 h-5" />
                )}
              </h2>
              <span className="text-muted-foreground">
                {loading ? (
                  <Skeleton className="h-5 w-48" />
                ) : (
                  currentUser?.email
                )}
              </span>
              <div className="flex items-center gap-x-2 mt-2">
                <FollowersModal currentUser={currentUser} loading={loading} />

                <FollowingsModal currentUser={currentUser} loading={loading} />
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <Button size="sm" variant="outline">
                Posts{" "}
                {loading ? (
                  <Skeleton className="h-3 w-3" />
                ) : (
                  currentUser?.posts?.length
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="flex flex-col justify-center border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-b-accent py-2 bg-[#E9ECEF]">
              <div className="px-4 flex items-center justify-between w-full">
                <h2 className="text-lg font-medium">
                  {currentUser?.username} profile
                </h2>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
              <h2 className="text-[#6C757D] text-base">Username:</h2>

              <span className="truncate max-w-xs">
                {loading ? (
                  <Skeleton className="h-5 w-48" />
                ) : (
                  currentUser?.username
                )}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
              <h2 className="text-[#6C757D] text-base">Fullname:</h2>
              <span className="truncate max-w-xs">
                {loading ? (
                  <Skeleton className="h-5 w-48" />
                ) : (
                  currentUser?.fullName
                )}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
              <h2 className="text-[#6C757D] text-base">Email:</h2>
              <span className="truncate max-w-xs">
                {loading ? (
                  <Skeleton className="h-5 w-48" />
                ) : (
                  currentUser?.email
                )}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
              <h2 className="text-[#6C757D] text-base">Bio:</h2>
              <span className="truncate max-w-xs">
                {loading ? (
                  <Skeleton className="h-5 w-48" />
                ) : currentUser?.bio ? (
                  currentUser.bio
                ) : (
                  <span className="text-muted-foreground">
                    Don't have a bio
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* posts */}
      <div className="mt-10">
        {currentUser?.isPublic ||
        currentUser?.followers?.includes(user.userID) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 gap-x-4">
            {loading ? (
              <div className="flex justify-center w-full col-span-12">
                <Loader2Icon className="w-6 h-6 animate-spin" />
              </div>
            ) : currentUser?.posts?.length === 0 ? (
              <h1 className="text-center flex justify-center w-full col-span-12">
                Don't have any post
              </h1>
            ) : (
              currentUser?.posts?.map((post) => {
                return (
                  <UserPost
                    key={post.id}
                    post={post}
                    setCurrentUser={setCurrentUser}
                    currentUser={currentUser}
                  />
                );
              })
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center">
            <Lock className="w-10 h-10" />
            <h2 className="text-muted-foreground text-sm">Private profile</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileDetail;
