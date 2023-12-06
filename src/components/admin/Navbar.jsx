import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { logOut } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleLogout = () => {
    dispatch(logOut());

    navigate("/admin/login");

    toast({
      title: "Successfully log out!",
    });
  };

  return (
    <nav className="h-[90px] flex items-center shadow-[rgba(50,_50,_105,_0.05)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-4xl font-semibold font-prime">
              ok<span className="text-[#FF9A05]">social.</span>
            </h1>
          </Link>

          <div className="flex gap-x-2 items-center">
            <Link
              to="/admin/users"
              className={cn(
                "px-3 py-1 hover:bg-accent rounded",
                location.pathname === "/admin/users" && "bg-accent"
              )}
            >
              Users
            </Link>

            <Button onClick={handleLogout}>Log out</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
