import AdminLogin from "@/pages/admin/login";
import Users from "@/pages/admin/users";
import AdminLayout from "@/pages/layouts/AdminLayout";
import RootLayout from "@/pages/layouts/RootLayout";
import Login from "@/pages/login";
import Posts from "@/pages/posts";
import Profile from "@/pages/profile";
import Register from "@/pages/register";
import { createBrowserRouter } from "react-router-dom";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: "Home",
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "posts",
        element: <Posts />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "login",
        element: <AdminLogin />,
      },
    ],
  },
]);
