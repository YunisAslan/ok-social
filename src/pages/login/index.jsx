import React, { useEffect, useState } from "react";
import AchievementSvg from "@/assets/Illustrations/achievement.svg";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { useFormik } from "formik";
import { loginFormSchema } from "@/validations/LoginFormSchema";
import { Label } from "@/components/ui/Label";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers } from "@/services/api/users";
import { useDispatch } from "react-redux";
import { setIsLogin } from "@/redux/slices/userSlice";

function Login() {
  const [loading, setLoading] = useState();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadData() {
      try {
        const allUsers = await getAllUsers();

        setUsers(allUsers);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, [setUsers]);

  const { handleSubmit, handleChange, handleBlur, errors, values, touched } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },

      onSubmit: async (values) => {
        try {
          setLoading(true);

          let isAuth = false;
          let isAdmin = false;
          console.log(users);

          users.forEach((user) => {
            if (
              user.username === values.username &&
              user.password === values.password &&
              user.isAdmin
            ) {
              isAuth = true;
              isAdmin = true;

              const secureUserInfo = {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                password: user.password,
                isPublic: user.isPublic,
                bio: user?.bio ? user?.bio : "",
                followers: [],
                followings: [],
                requests: [],
                posts: user?.posts || [],
                stories: [],
                profilePicture: user?.profilePicture
                  ? user?.profilePicture
                  : "",
                isAdmin: user.isAdmin,
              };

              dispatch(setIsLogin({ userID: secureUserInfo.id }));
            } else if (
              user.username === values.username &&
              user.password === values.password
            ) {
              isAuth = true;
              isAdmin = false;

              const secureUserInfo = {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                password: user.password,
                isPublic: user.isPublic,
                bio: user?.bio ? user?.bio : "",
                followers: [],
                followings: [],
                requests: [],
                posts: user?.posts || [],
                stories: [],
                profilePicture: user?.profilePicture
                  ? user?.profilePicture
                  : "",
                isAdmin: user.isAdmin,
              };

              dispatch(setIsLogin({ userID: secureUserInfo.id }));
            }
          });

          if (isAdmin && isAuth) {
            navigate("/admin/users");
          } else if (isAuth) {
            navigate("/profile");

            toast({
              title: "Successfully login!",
            });
          } else {
            toast({
              title: "Your email or password incorrect!",
              variant: "destructive",
            });
          }
        } catch (err) {
          console.error(err);
          toast({
            title: "Something went wrong!",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },

      validationSchema: loginFormSchema,
    });

  return (
    <div className="flex items-center">
      <div className="w-1/2 hidden md:block">
        <img src={AchievementSvg} alt="" className="w-full h-full" />
      </div>

      {/* login form */}
      <div className="w-full md:w-1/2">
        <div className="flex flex-col items-center justify-center px-2 md:px-6 py-8 mx-auto lg:py-0 mt-3">
          <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0">
            <div className="space-y-4 md:space-y-6 md:p-8">
              <h1 className="text-xl font-bold md:text-2xl">
                Sign in to your account
              </h1>

              <form
                className="space-y-4 md:space-y-6"
                action=""
                onSubmit={handleSubmit}
              >
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

                <Button type="submit" className="w-full" isLoading={loading}>
                  Sign in
                </Button>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet ?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:underline"
                  >
                    Sign up
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

export default Login;
