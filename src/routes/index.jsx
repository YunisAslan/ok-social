import NotFound from "@/components/NotFound";
import AdminLogin from "@/pages/admin/login";
import Users from "@/pages/admin/users";
import Feed from "@/pages/feed";
import AdminLayout from "@/pages/layouts/AdminLayout";
import RootLayout from "@/pages/layouts/RootLayout";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import ProfileDetail from "@/pages/profile-detail";
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
        path: "profile/:id",
        element: <ProfileDetail />,
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
        path: "feed",
        element: <Feed />,
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
  { path: "*", element: <NotFound /> },
]);
