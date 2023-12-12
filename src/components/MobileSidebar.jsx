import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { Button } from "./ui/Button";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import SearchUsers from "./SearchUsers";
import { cn } from "@/lib/utils";

function MobileSidebar({ users, setUsers }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="flex lg:hidden">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="lg:hidden">
        <SheetHeader className="space-y-4">
          <SheetTitle>
            <Link to="/">
              <h1 className="text-3xl lg:text-4xl font-semibold font-prime">
                ok<span className="text-brand">social.</span>
              </h1>
            </Link>
          </SheetTitle>
          {/* <SheetDescription>Welcome to sidebar.</SheetDescription> */}
          <div className="gap-x-2 items-center">
            <Link
              to="/feed"
              className={cn(
                "px-3 py-1 hover:bg-accent rounded",
                location.pathname === "/feed" && "bg-accent"
              )}
              onClick={() => setOpen(false)}
            >
              Feed
            </Link>
            <Link
              to="/profile"
              className={cn(
                "px-3 py-1 hover:bg-accent rounded",
                location.pathname === "/profile" && "bg-accent"
              )}
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
          </div>

          <div className="flex w-full justify-center">
            <SearchUsers users={users} setUsers={setUsers} />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSidebar;
