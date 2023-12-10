import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Skeleton } from "./ui/Skeleton";
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import { editUserRequest, getAllUsers } from "@/services/api/users";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import DefaultUserImg from "@/assets/images/default-user-img.png";

function RequestsModal({ currentUser, loading }) {
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setRequestsLoading(true);

        const allUsers = await getAllUsers();

        const filteredRequests = allUsers.filter((user) =>
          currentUser?.requests.includes(user.id)
        );

        setRequests(filteredRequests);
      } catch (err) {
        console.error(err);
      } finally {
        setRequestsLoading(false);
      }
    }

    loadData();
  }, [currentUser?.requests]);

  const handleAccept = async (requestedUser) => {
    const updatedCurrentUser = {
      ...currentUser,
      followers: [...currentUser.followers, requestedUser.id],
    };

    const updatedFromUser = {
      ...requestedUser,
      followings: [...requestedUser.followings, currentUser.id],
    };

    await editUserRequest(currentUser.id, updatedCurrentUser);
    await editUserRequest(requestedUser.id, updatedFromUser);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Requests{" "}
          {loading ? (
            <Skeleton className="h-3 w-3" />
          ) : (
            currentUser?.requests?.length
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Requests</DialogTitle>
          <div className="pt-2 flex flex-col gap-y-2">
            {requestsLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              requests?.map((request, i) => {
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between hover:bg-accent px-2 py-1 rounded"
                  >
                    <div className="flex items-center gap-x-2">
                      <div className="w-12 h-12 overflow-hidden rounded-full">
                        <img
                          src={
                            request?.profilePicture
                              ? request.profilePicture
                              : DefaultUserImg
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h1 className="text-base font-semibold">
                          <Link to={`/profile/${request.id}`}>
                            {request.username}
                          </Link>
                        </h1>
                        <p className="text-xs text-muted-foreground">
                          {request.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-x-2">
                      <Button size="sm" onClick={() => handleAccept(request)}>
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(request)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default RequestsModal;
