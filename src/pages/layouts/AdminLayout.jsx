import Navbar from "@/components/admin/Navbar";
import { useToast } from "@/hooks/use-toast";
import { getUserByID } from "@/services/api/users";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      const localUserID = JSON.parse(localStorage.getItem("user"));

      if (!localUserID) {
        navigate("/admin/login");

        return;
      }

      const localUser = await getUserByID(localUserID?.userID);

      if (!localUser?.isAdmin) {
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
    }

    loadData();
  }, []);

  return (
    <>
      {location.pathname !== "/admin/login" && <Navbar />}

      <main className="max-w-7xl mx-auto py-4 px-4 min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default AdminLayout;
