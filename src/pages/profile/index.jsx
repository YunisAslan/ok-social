import { Button, buttonVariants } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { logOut } from "@/redux/slices/userSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DefaultUserImg from "@/assets/images/default-user-img.png";
import EditProfile from "@/components/EditProfile";
import {
  getUserByID,
  editUserRequest,
  getAllUsers,
} from "@/services/api/users";
import { Skeleton } from "@/components/ui/Skeleton";
import { BadgeCheck, LogOut } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { newPostFormSchema } from "@/validations/NewPostFormSchema";
import { useFormik } from "formik";
import { nanoid } from "nanoid";
import UserPost from "@/components/UserPost";
import { Loader2Icon } from "lucide-react";
import FollowersModal from "@/components/FollowersModal";
import FollowingsModal from "@/components/FollowingsModal";
import RequestsModal from "@/components/RequestsModal";

function Profile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const currentUserData = await getUserByID(user.userID);
        setCurrentUser(currentUserData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
    errors,
    values,
    touched,
  } = useFormik({
    initialValues: {
      title: "",
      imageURL: "",
    },

    onSubmit: async (values) => {
      try {
        setLoading(true);

        const newPost = {
          id: nanoid(),
          title: values.title,
          imageURL: values.imageURL,
          likes: [],
          date: Date.now(),
          comments: [],
          creatorID: currentUser.id,
        };

        const updatedUser = {
          ...currentUser,
          posts: [...currentUser.posts, newPost],
        };

        const editedUser = await editUserRequest(user.userID, updatedUser);

        // update ui
        setCurrentUser(() => ({
          ...currentUser,
          posts: [...currentUser.posts, newPost],
        }));

        setOpen(false);
        resetForm();
      } catch (err) {
        console.error(err);
        toast({
          title: "Something went wrong!",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },

    validationSchema: newPostFormSchema,
  });

  useEffect(() => {
    async function loadData() {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    }

    loadData();
  }, [setUsers]);

  const handleRequestVerify = () => {
    const filterAdmins = users.filter((user) => user.isAdmin);
    let isLetting = false;

    filterAdmins.forEach(async (admin) => {
      if (!admin?.requests.includes(currentUser?.id)) {
        admin?.requests.push(currentUser?.id);
        isLetting = true;

        const editedUser = await editUserRequest(admin.id, admin);
      }
    });

    if (!isLetting) {
      toast({
        title: "You have already sent a request!",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Your request has been sent successfully!",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-3xl font-semibold">Profile</h2>
        <div>
          {!currentUser?.isVerified && (
            <Button size="sm" onClick={handleRequestVerify}>
              Request Verify
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-6 mt-4">
        <div className="col-span-12 lg:col-span-5 border rounded-lg mb-3 lg:mb-0">
          <div className="flex flex-col gap-y-2 justify-around items-center h-full py-5 relative">
            <div className="absolute right-2 top-2">
              <Button
                size="icon"
                className="bg-gray-300 hover:bg-gray-400"
                onClick={() => {
                  dispatch(logOut());
                  navigate("/login");

                  toast({
                    title: "Successfully log out!",
                  });
                }}
              >
                <LogOut className="w-5 h-5 text-primary" />
              </Button>
            </div>

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

              <RequestsModal currentUser={currentUser} loading={loading} />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="flex flex-col justify-center border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-b-accent py-2 bg-[#E9ECEF]">
              <div className="px-4 flex items-center justify-between w-full">
                <h2 className="text-lg font-medium">Edit your profile</h2>

                <EditProfile
                  key={currentUser?.id}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
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
              <h2 className="text-[#6C757D] text-base">Password:</h2>
              <span className="truncate max-w-xs">
                {loading ? (
                  <Skeleton className="h-5 w-48" />
                ) : (
                  currentUser?.password
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create new post</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new post</DialogTitle>
            </DialogHeader>

            <form
              className="space-y-4 md:space-y-6"
              action=""
              onSubmit={handleSubmit}
            >
              <div>
                <Label htmlFor="title" className="mb-2 block">
                  Title
                </Label>

                <Input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Lorem ipsum.."
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {errors.title && touched.title ? (
                  <span className="text-sm text-red-500">{errors.title}</span>
                ) : null}
              </div>

              <div>
                <Label htmlFor="imageURL" className="mb-2 block">
                  image URL
                </Label>

                <Input
                  type="text"
                  name="imageURL"
                  id="imageURL"
                  placeholder="Lorem ipsum.."
                  value={values.imageURL}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {errors.imageURL && touched.imageURL ? (
                  <span className="text-sm text-red-500">
                    {errors.imageURL}
                  </span>
                ) : null}
              </div>

              <div>
                <Button type="submit" isLoading={loading}>
                  Submit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <br />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 gap-4">
          {loading ? (
            <div className="flex justify-center w-full col-span-12">
              <Loader2Icon className="w-6 h-6 animate-spin" />
            </div>
          ) : currentUser?.posts?.length === 0 ? (
            <h1 className="text-center flex justify-center w-full col-span-12">
              You don't have any post
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
      </div>
    </div>
  );
}

export default Profile;
