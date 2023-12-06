import { Button, buttonVariants } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { logOut } from "@/redux/slices/userSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DefaultUserImg from "@/assets/images/default-user-img.png";
import EditProfile from "@/components/EditProfile";

function Profile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const [currentUser, setCurrentUser] = useState(user);

  return (
    <div>
      <h2 className="text-3xl font-semibold">Profile</h2>

      <div className="grid grid-cols-12 gap-x-6 mt-4">
        <div className="order-2 col-span-12 lg:col-span-7 lg:order-1">
          <div className="flex flex-col justify-center border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-b-accent py-2 bg-[#E9ECEF]">
              <div className="px-4 flex items-center justify-between w-full">
                <h2 className="text-lg font-medium">Edit your profile</h2>
                <EditProfile
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
              <h2 className="text-[#6C757D] text-base">Username:</h2>
              <span className="truncate max-w-xs">{currentUser?.username}</span>
            </div>

            <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
              <h2 className="text-[#6C757D] text-base">Fullname:</h2>
              <span className="truncate max-w-xs">{currentUser?.fullName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
              <h2 className="text-[#6C757D] text-base">Email:</h2>
              <span className="truncate max-w-xs">{currentUser?.email}</span>
            </div>

            <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
              <h2 className="text-[#6C757D] text-base">Password:</h2>
              <span className="truncate max-w-xs">{currentUser?.password}</span>
            </div>

            <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
              <h2 className="text-[#6C757D] text-base">Bio:</h2>
              <span className="truncate max-w-xs">
                {currentUser?.bio ? (
                  currentUser.bio
                ) : (
                  <span className="text-muted-foreground">
                    You don't have a bio
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="order-1 col-span-12 lg:col-span-5 lg:order-2 border rounded-lg mb-3 lg:mb-0">
          <div className="flex flex-col gap-y-2 justify-between items-center h-full py-5">
            <div className="w-44 h-44 overflow-hidden rounded-full border border-gray-300">
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

            <div className="text-center">
              <h2 className="text-xl font-semibold">{currentUser?.fullName}</h2>
              <span className="text-muted-foreground">
                {currentUser?.email}
              </span>
            </div>

            <div className="flex items-center gap-x-2">
              <Link
                to="/profile/requests"
                className={buttonVariants({
                  variant: "outline",
                  size: "default",
                })}
              >
                Requests
              </Link>

              <Button
                size="default"
                onClick={() => {
                  dispatch(logOut());
                  navigate("/login");

                  toast({
                    title: "Successfully log out!",
                  });
                }}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-semibold mt-4">Statistics</h2>
      <div className="mt-5 flex flex-col justify-center border border-border rounded-lg overflow-hidden w-1/3">
        <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
          <h2 className="text-[#6C757D] text-base">Followers:</h2>
          <span className="truncate max-w-xs">
            {currentUser?.followers?.length}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
          <h2 className="text-[#6C757D] text-base">Followings:</h2>
          <span className="truncate max-w-xs">
            {currentUser?.followings?.length}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-b-accent px-4 py-3 gap-x-3 h-14">
          <h2 className="text-[#6C757D] text-base">Posts:</h2>
          <span className="truncate max-w-xs">
            {currentUser?.posts?.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
