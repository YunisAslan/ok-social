import AdminLayout from "@/pages/layouts/AdminLayout";
import RootLayout from "@/pages/layouts/RootLayout";
import Login from "@/pages/login";
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
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: "Users",
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);
