import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "./ui/Button";
import { Edit2 } from "lucide-react";
import { Input } from "./ui/Input";
import { useEffect, useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { useFormik } from "formik";
import { editUserFormSchema } from "@/validations/EditUserFormSchema";
import { editUserRequest, getAllUsers } from "@/services/api/users";
import { useToast } from "@/hooks/use-toast";
import { setIsLogin } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";

function EditProfile({ currentUser, setCurrentUser }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { toast } = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadData() {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    }

    loadData();
  }, [setUsers]);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    values,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      username: currentUser?.username,
      fullName: currentUser?.fullName,
      email: currentUser?.email,
      currentPassword: currentUser?.password,
      newPassword: "",
      confirmNewPassword: "",
      profilePicture: currentUser?.profilePicture,
      bio: currentUser?.bio,
      isPublic: currentUser?.isPublic,
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const editedUser = {
          username: values.username,
          fullName: values.fullName,
          email: values.email,
          password: values.newPassword
            ? values.newPassword
            : values.currentPassword,
          isPublic: values.isPublic,
          bio: values.bio,
          followers: [],
          followings: [],
          requests: [],
          posts: [],
          stories: [],
          isVerified: false,
          isAdmin: false,
          profilePicture: values.profilePicture,
        };

        //   const existUsername = users.find(
        //     (user) => user.username === editedUser.username
        //   );

        //   const existEmail = users.find(
        //     (user) => user.email === editedUser.email
        //   );

        //   if (existUsername && existEmail) {
        //     toast({
        //       title: "This username and email already exists!",
        //       description: "Select another.",
        //       variant: "destructive",
        //     });

        //     return;
        //   }

        //   if (existUsername) {
        //     toast({
        //       title: "This username already exists!",
        //       description: "Select another username.",
        //       variant: "destructive",
        //     });

        //     return;
        //   }

        //   if (existEmail) {
        //     toast({
        //       title: "This email already exists!",
        //       description: "Select another email address.",
        //       variant: "destructive",
        //     });
        //     return;
        //   }

        const brandNewEditedUser = await editUserRequest(
          currentUser.id,
          editedUser
        );

        setCurrentUser(brandNewEditedUser);
        dispatch(setIsLogin(brandNewEditedUser));

        toast({
          title: "Successfully edited!",
        });

        setFieldValue("", "");
      } catch (err) {
        console.error(err);
        toast({
          title: "Something went wrong!",
          description: "Please try again later!",
        });
      } finally {
        setLoading(false);
      }
    },

    validationSchema: editUserFormSchema,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit2 className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        <form className="space-y-3" action="" onSubmit={handleSubmit}>
          <div className="flex items-center gap-x-2">
            <div className="w-full">
              <Label htmlFor="username" className="mb-2 block">
                Username
              </Label>

              <Input
                type="text"
                name="username"
                id="username"
                placeholder="Acme"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.username && touched.username ? (
                <span className="text-sm text-red-500">{errors.username}</span>
              ) : null}
            </div>

            <div className="w-full">
              <Label htmlFor="fullName" className="mb-2 block">
                Fullname
              </Label>

              <Input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="John Doe"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.fullName && touched.fullName ? (
                <span className="text-sm text-red-500">{errors.fullName}</span>
              ) : null}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email
            </Label>

            <Input
              type="text"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.email && touched.email ? (
              <span className="text-sm text-red-500">{errors.email}</span>
            ) : null}
          </div>

          <div className="flex items-center gap-x-2">
            <div className="w-full">
              <Label htmlFor="currentPassword" className="mb-2 block">
                Current password
              </Label>

              <Input
                type="text"
                name="currentPassword"
                id="currentPassword"
                placeholder="••••••••"
                readOnly
                value={currentUser?.password}
                //   onChange={handleChange}
                //   onBlur={handleBlur}
              />

              {/* {errors.currentPassword && touched.currentPassword ? (
              <span className="text-sm text-red-500">{errors.currentPassword}</span>
            ) : null} */}
            </div>

            <div className="w-full">
              <Label htmlFor="newPassword" className="mb-2 block">
                New password
              </Label>

              <Input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="••••••••"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.newPassword && touched.newPassword ? (
                <span className="text-sm text-red-500">
                  {errors.newPassword}
                </span>
              ) : null}
            </div>
          </div>

          <div>
            <Label htmlFor="confirmNewPassword" className="mb-2 block">
              Confirm new password
            </Label>

            <Input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              placeholder="••••••••"
              value={values.confirmNewPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.confirmNewPassword && touched.confirmNewPassword ? (
              <span className="text-sm text-red-500">
                {errors.confirmNewPassword}
              </span>
            ) : null}
          </div>

          <div>
            <Label htmlFor="profilePicture" className="mb-2 block">
              Profile img
            </Label>

            <Input
              type="text"
              name="profilePicture"
              id="profilePicture"
              placeholder="https://acme.png"
              value={values.profilePicture}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.profilePicture && touched.profilePicture ? (
              <span className="text-sm text-red-500">
                {errors.profilePicture}
              </span>
            ) : null}
          </div>

          <div>
            <Label htmlFor="bio" className="mb-2 block">
              Bio
            </Label>

            <Textarea
              type="text"
              name="bio"
              id="bio"
              placeholder="Lorem ipsum dolor sit amet.."
              value={values.bio}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.bio && touched.bio ? (
              <span className="text-sm text-red-500">{errors.bio}</span>
            ) : null}
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="checkbox"
              id="isPublic"
              className="w-4 h-4 p-0 border border-primary rounded-sm appearance-none focus:outline-none checked:bg-primary checked:border-transparent text-black"
              name="isPublic"
              checked={values.isPublic}
              onChange={handleChange}
            />

            <Label htmlFor="isPublic">Public account</Label>

            {errors.isPublic && touched.isPublic ? (
              <span className="text-sm text-red-500">{errors.isPublic}</span>
            ) : null}
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Confirm
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfile;
