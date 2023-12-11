import { MessageCircleIcon, Pen, Trash } from "lucide-react";
import { Button } from "./ui/Button";
import { editUserRequest } from "@/services/api/users";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { useFormik } from "formik";
import { editPostFormSchema } from "@/validations/EditPostFormSchema";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import PostLikeBtn from "./PostLikeBtn";
import PostCommentsModal from "./PostCommentsModal";

function UserPost({ post, currentUser, setCurrentUser }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postID, setPostID] = useState(null);

  const user = useSelector((state) => state.user.user);

  const handleDelete = async (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const filteredPosts = currentUser?.posts.filter(
          (post) => post.id != postId
        );

        currentUser.posts = filteredPosts;

        await editUserRequest(currentUser.id, currentUser);

        // update UI
        setCurrentUser(() => ({
          ...currentUser,
          posts: [...filteredPosts],
        }));

        Swal.fire({
          title: "Deleted!",
          text: "Post has been deleted.",
          icon: "success",
        });
      }
    });
  };

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
      title: post.title,
      imageURL: post.imageURL,
    },

    onSubmit: async (values) => {
      try {
        setLoading(true);

        const find = currentUser?.posts?.find((post) => post.id == postID);

        find.title = values.title;

        const updatedUser = {
          ...currentUser,
          posts: [...currentUser.posts],
        };

        const editedUser = await editUserRequest(currentUser.id, updatedUser);

        setCurrentUser({
          ...editedUser,
          posts: [...editedUser.posts],
        });

        setOpen(false);
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

    validationSchema: editPostFormSchema,
  });

  return (
    <div className="card border border-accent-500 rounded-xl overflow-hidden">
      <div className="w-full h-48">
        <img
          src={post?.imageURL}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h2>{post?.title}</h2>

        <p className="text-muted-foreground text-sm">
          created {moment(post?.date).calendar()}
        </p>

        <div className="flex justify-between items-center gap-x-2 pt-4">
          {user.userID == currentUser.id && (
            <div className="flex items-center gap-x-2">
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-600 w-8 h-8"
                onClick={() => handleDelete(post?.id)}
              >
                <Trash className="w-5 h-5" />
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="bg-brand w-8 h-8"
                    onClick={() => setPostID(post?.id)}
                  >
                    <Pen className="w-5 h-5" />
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit post</DialogTitle>
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
                        <span className="text-sm text-red-500">
                          {errors.title}
                        </span>
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
                        readOnly
                        value={values.imageURL}
                        // onChange={handleChange}
                        // onBlur={handleBlur}
                      />

                      {errors.imageURL && touched.imageURL ? (
                        <span className="text-sm text-red-500">
                          {errors.imageURL}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <Button type="submit" isLoading={loading}>
                        Confirm
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-1">
              <PostCommentsModal post={post} currentUser={user} />
            </div>

            <div className="flex items-center gap-x-1">
              <PostLikeBtn post={post} user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPost;
