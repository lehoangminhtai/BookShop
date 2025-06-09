import { useChatStore } from "../../../../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, onlineUsers } = useChatStore();

  return (
    <div className="p-2 border-bottom">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          {/* Avatar */}
          <div className="position-relative">
            <img 
              src={selectedUser?.image} 
              alt={selectedUser?.fullName} 
              className="rounded-circle" 
              style={{ width: '40px', height: '40px' }}
            />
          </div>

          {/* User info */}
          <div>
            <h6 className="mb-0">{selectedUser?.fullName}</h6>
            <p className="text-muted small mb-0">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)} className="btn-close" aria-label="Close"></button>
      </div>
    </div>
  );
};

export default ChatHeader;
