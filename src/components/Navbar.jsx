import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllUsers } from "@/services/api/users";
import SearchUsers from "./SearchUsers";
import MobileSidebar from "./MobileSidebar";

function Navbar() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadData() {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    }

    loadData();
  }, [setUsers]);

  return (
    <nav className="h-[90px] flex items-center shadow-[rgba(50,_50,_105,_0.05)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-3xl lg:text-4xl font-semibold font-prime">
              ok<span className="text-brand">social.</span>
            </h1>
          </Link>

          <div className="hidden lg:flex w-full justify-center">
            <SearchUsers users={users} setUsers={setUsers} />
          </div>

          <MobileSidebar users={users} setUsers={setUsers} />

          <div className="gap-x-2 items-center hidden lg:flex">
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
