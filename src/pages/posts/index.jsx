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
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { editUserRequest } from "@/services/api/users";
import { nanoid } from "nanoid";
import { addNewUserPost, updateUser } from "@/redux/slices/userSlice";

function Posts() {
  const [loading, setLoading] = useState();

  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const { handleSubmit, handleChange, handleBlur, errors, values, touched } =
    useFormik({
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
          };

          dispatch(addNewUserPost(newPost));
          console.log(user);
          //   const editedUser = await editUserRequest(user.id, user);
          //   console.log(editedUser);

          //   setUser((prevUser) => ({
          //     ...prevUser,
          //     posts: [...prevUser?.posts, newPost],
          //   }));

          //   setUser(editedUser);

          //   dispatch(updateUser(user));
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
      <Dialog>
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
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <br />

      {JSON.stringify(user?.posts)}
    </div>
  );
}

export default Posts;
