import ShakingHandsSvg from "@/assets/Illustrations/shaking-hands.svg";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { registerFormSchema } from "@/validations/RegisterFormSchema";
import { createUserRequest, getAllUsers } from "@/services/api/users";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

function Register() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    }

    loadData();
  }, [setUsers]);

  const { handleSubmit, handleChange, handleBlur, errors, values, touched } =
    useFormik({
      initialValues: {
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        isPublic: false,
      },
      onSubmit: async (values) => {
        try {
          setLoading(true);

          const newUser = {
            username: values.username,
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            isPublic: values.isPublic,
            bio: "",
            followers: [],
            followings: [],
            requests: [],
            posts: [],
            stories: [],
            isVerified: false,
            isAdmin: false,
            profilePicture: "",
          };

          const existUsername = users.find(
            (user) => user.username === newUser.username
          );

          const existEmail = users.find((user) => user.email === newUser.email);

          if (existUsername && existEmail) {
            toast({
              title: "This username and email already exists!",
              description: "Select another.",
              variant: "destructive",
            });

            return;
          }

          if (existUsername) {
            toast({
              title: "This username already exists!",
              description: "Select another username.",
              variant: "destructive",
            });

            return;
          }

          if (existEmail) {
            toast({
              title: "This email already exists!",
              description: "Select another email address.",
              variant: "destructive",
            });
            return;
          }

          const brandNewUser = await createUserRequest(newUser);

          toast({
            title: "Successfully registered!",
            description: "You must be login with your account.",
          });

          navigate("/login");
        } catch (err) {
          console.error(err);
          toast({
            title: "Something went wrong!",
            description: "Please try again later!",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },

      validationSchema: registerFormSchema,
    });

  return (
    <div className="flex items-center">
      <div className="w-1/2 hidden md:block">
        <img src={ShakingHandsSvg} alt="" className="w-full h-full" />
      </div>

      {/* login form */}
      <div className="w-full md:w-1/2">
        <div className="flex flex-col items-center justify-center px-2 md:px-6 py-8 mx-auto lg:py-0 mt-3">
          <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0">
            <div className="space-y-4 md:space-y-6 md:p-8">
              <h1 className="text-xl font-bold md:text-2xl">
                Create your account
              </h1>

              <form className="space-y-3" action="" onSubmit={handleSubmit}>
                <div>
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
                    <span className="text-sm text-red-500">
                      {errors.username}
                    </span>
                  ) : null}
                </div>

                <div>
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
                    <span className="text-sm text-red-500">
                      {errors.fullName}
                    </span>
                  ) : null}
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

                <div>
                  <Label htmlFor="password" className="mb-2 block">
                    Password
                  </Label>

                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  {errors.password && touched.password ? (
                    <span className="text-sm text-red-500">
                      {errors.password}
                    </span>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="mb-2 block">
                    Confirm password
                  </Label>

                  <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  {errors.confirmPassword && touched.confirmPassword ? (
                    <span className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center space-x-2 py-2">
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
                    <span className="text-sm text-red-500">
                      {errors.isPublic}
                    </span>
                  ) : null}
                </div>

                <Button type="submit" className="w-full" isLoading={loading}>
                  Sign up
                </Button>

                <p className="text-sm font-light text-muted-foreground">
                  Have an account ?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-gray-600 hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
