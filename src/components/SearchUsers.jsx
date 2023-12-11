import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/Command";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";
import { BadgeCheck, Lock } from "lucide-react";
import { useSelector } from "react-redux";
import {
  editUserRequest,
  getAllUsers,
  getUserByID,
} from "@/services/api/users";
import FollowRequestBtn from "./FollowRequestBtn";

function SearchUsers({ users, setUsers }) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const currentUserData = await getUserByID(user.userID);
        setCurrentUser(currentUserData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // handle command box ctrl + k
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const filteredUsers = users.filter((user) =>
      user.username
        .trim()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );

    if (!searchQuery) {
      setSearchedUsers([]);
    } else {
      setSearchedUsers(filteredUsers);
    }
  }, [searchQuery]);

  return (
    <>
      <div className="w-1/3">
        <Button
          onClick={() => setOpen(!open)}
          className="w-full bg-accent flex justify-between hover:bg-accent/50"
        >
          <span className="text-muted-foreground">Search users..</span>
          <p className="text-sm text-muted-foreground">
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">Ctrl</span>K
            </kbd>
          </p>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          type="text"
          placeholder="Type a username..."
          className="focus-visible:ring-0 ring-white focus-visible:ring-white border-b border-b-accent"
          value={searchQuery}
          onValueChange={(e) => setSearchQuery(e)}
        />

        <CommandList>
          {searchedUsers.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <div className="flex flex-col py-2">
              {searchedUsers.map((user) => {
                return user.isAdmin ? null : (
                  <div
                    key={user.id}
                    className="mx-2 p-2 rounded hover:bg-accent flex justify-between items-center"
                  >
                    <Link
                      className="flex items-center gap-x-2"
                      to={`/profile/${user.id}`}
                      onClick={() => setOpen(false)}
                    >
                      {user?.username}{" "}
                      {user?.isVerified && (
                        <BadgeCheck className="stroke-[#4f3ed0] w-5 h-5" />
                      )}
                    </Link>
                    <div className="flex items-center gap-x-2">
                      {user?.isPublic ? null : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}

                      {user?.id != currentUser?.id && (
                        <FollowRequestBtn
                          user={user}
                          currentUser={currentUser}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default SearchUsers;
