import { useEffect, useState } from "react";
import { useChatStore } from "../../../../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useStateContext } from "../../../../context/UserContext";

const Sidebar = () => {
  const { connectSocket, getUsers, users, selectedUser, setSelectedUser, isUsersLoading, onlineUsers } = useChatStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { user } = useStateContext();

  useEffect(() => {
    if (user) {
      connectSocket(user);
    }
  }, [user]);



  useEffect(() => {
    getUsers(user);
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />

  return (
    <aside className=" border-end  transition-all">
      <div className="border-bottom pb-2">
        <div className="mt-3 d-none d-lg-flex align-items-center gap-2">
          <label className="cursor-pointer d-flex align-items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="form-check-input"
            />
            <span className="small text-dark">Online</span>
          </label>
          <span className="text-muted small">({onlineUsers.length - 1})</span>
        </div>
      </div>

      <div className="navbar-nav-scroll py-3 flex-grow-1">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`btn w-100 text-start d-flex align-items-center gap-3 p-2 border-0 ${selectedUser?._id === user._id ? "bg-light" : ""}`}
          >
            <div className="position-relative mx-auto mx-lg-0">
              <img
                src={user?.image}
                alt={user.name}
                className="rounded-circle border object-cover"
                style={{ width: "48px", height: "48px" }}
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                  style={{ width: "12px", height: "12px" }}
                />
              )}
            </div>

            <div className="d-none d-lg-block text-start text-truncate">
              <div className="fw-medium text-truncate">{user.fullName}</div>
              <div className="small text-muted">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-muted py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
