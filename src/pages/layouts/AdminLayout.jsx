import Navbar from "@/components/admin/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (!localUser) {
      navigate("/admin/login");

      return;
    }

    if (!localUser.isAdmin) {
      navigate("/");

      setTimeout(() => {
        toast({
          title: "You cannot reach out this page!",
          variant: "destructive",
        });
      }, 0);

      return;
    }

    if (localUser && localUser?.isAdmin) {
      navigate("/admin/users");
    }
  }, []);

  return (
    <>
      {location.pathname !== "/admin/login" && <Navbar />}

      <Outlet />
    </>
  );
}

export default AdminLayout;
