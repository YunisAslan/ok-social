import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  editUserRequest,
  getAllUsers,
  getUserByID,
} from "@/services/api/users";
import { Table } from "antd";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DefaultUserImg from "@/assets/images/default-user-img.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Users() {
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const allUsers = await getAllUsers();

        const filteredUsers = allUsers.filter((user) => !user?.isAdmin);
        setUsers(filteredUsers);

        const filteredRequests = allUsers.filter((user) =>
          currentUser?.requests.includes(user.id)
        );

        setRequests(filteredRequests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [setUsers, currentUser?.requests, setRequests]);

  useEffect(() => {
    async function loadData() {
      const userData = await getUserByID(user?.userID);
      setCurrentUser(userData);
    }

    loadData();
  }, [setCurrentUser]);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Is verified",
      dataIndex: "isVerified",
      render: (val) => (val ? "true" : "false"),
    },
  ];

  const handleAccept = async (reqUser) => {
    const filteredVerifyRequests = currentUser?.requests.filter(
      (item) => item != reqUser.id
    );

    const updatedCurrentUser = {
      ...currentUser,
      requests: filteredVerifyRequests,
    };

    const updatedUser = {
      ...reqUser,
      isVerified: true,
    };

    await editUserRequest(reqUser.id, updatedUser);
    await editUserRequest(currentUser.id, updatedCurrentUser);

    const filteredRequests = requests.filter((req) => req.id !== reqUser.id);

    setRequests(filteredRequests);
  };

  const handleDecline = async (reqUser) => {
    const filteredVerifyRequests = currentUser?.requests.filter(
      (item) => item != reqUser.id
    );

    const updatedCurrentUser = {
      ...currentUser,
      requests: filteredVerifyRequests,
    };

    const updatedUser = {
      ...reqUser,
      isVerified: false,
    };

    await editUserRequest(reqUser.id, updatedUser);
    await editUserRequest(currentUser.id, updatedCurrentUser);

    const filteredRequests = requests.filter((req) => req.id !== reqUser.id);

    setRequests(filteredRequests);
  };

  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Verify requests {requests.length}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify requests</DialogTitle>
            <div className="pt-2 flex flex-col gap-y-2">
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                requests.map((request) => {
                  return (
                    <div
                      key={request?.id}
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
                          onClick={() => handleDecline(request)}
                        >
                          Decline
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

      <div className="w-full lg:w-3/4 mx-auto">
        <h1 className="text-center text-2xl font-medium py-2">Users</h1>
        <Table
          rowKey={(obj) => obj.id}
          columns={columns}
          dataSource={users}
          onChange={onChange}
          loading={loading}
          className="overflow-auto"
        />
      </div>
    </div>
  );
}

export default Users;
