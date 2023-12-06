import Navbar from "@/components/Navbar";
import { Fragment, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (location.pathname !== "/register" && !localUser) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Navbar />
      )}

      <main className="max-w-7xl mx-auto py-4 px-4 min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
