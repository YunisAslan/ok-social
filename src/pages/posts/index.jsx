import { Button } from "@/components/ui/Button";
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
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";
import { editUserRequest, getUserByID } from "@/services/api/users";
import UserPost from "@/components/UserPost";
import { Loader2Icon } from "lucide-react";

function Posts() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState();

  const user = useSelector((state) => state.user.user);
  const [currentUser, setCurrentUser] = useState(null);

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

  return (
    <div>
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
                <span className="text-sm text-red-500">{errors.imageURL}</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 gap-x-4">
        {loading ? (
          <div className="flex justify-center">
            <Loader2Icon className="w-6 h-6 animate-spin" />
          </div>
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
  );
}

export default Posts;
