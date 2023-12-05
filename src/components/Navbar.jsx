import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="h-[90px] flex items-center shadow-[rgba(50,_50,_105,_0.05)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-4xl font-semibold font-prime">
              ok-<span className="text-[#FF9A05]">social.</span>
            </h1>
          </Link>

          <div className="flex gap-x-2 items-center">
            <Link
              to="/feed"
              className={cn(
                "px-3 py-1 hover:bg-accent rounded",
                location.pathname === "/feed" && "bg-accent"
              )}
            >
              Feed
            </Link>
            <Link
              to="/requests"
              className={cn(
                "px-3 py-1 hover:bg-accent rounded",
                location.pathname === "/requests" && "bg-accent"
              )}
            >
              Requests
            </Link>
            <Link
              to="/profile"
              className={cn(
                "px-3 py-1 hover:bg-accent rounded",
                location.pathname === "/profile" && "bg-accent"
              )}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
