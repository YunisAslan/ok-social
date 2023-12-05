import Navbar from "@/components/Navbar";
import { useEffect, useLayoutEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const localUser = JSON.parse(localStorage.getItem("user"));
  //   if (!localUser) {
  //     navigate("/login");
  //   }
  // }, []);

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Navbar />
      )}

      <main className="max-w-7xl mx-auto py-4 min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
