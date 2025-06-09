import { useChatStore } from "../../../../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
//context
import { useStateContext } from "../../../../context/UserContext";
//formatting date
import { formatMessageTime } from "../../../../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { user } = useStateContext();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(user, selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="d-flex flex-column flex-grow-1 overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column  position-relative" style={{ height: "73vh" }}>
      <ChatHeader />

      {/* Khung tin nhắn cuộn được */}
      <div
        className="flex-grow-1 navbar-nav-scroll px-3"
        style={{ marginBottom: "70px" }} // Chừa chỗ cho input
      >
        {messages.map((message) => {
          const isMe = message.senderId === user?._id;
          return (
            <div
              key={message._id}
              className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}
              ref={messageEndRef}
            >
              {!isMe && (
                <div className="me-2">
                  <img
                    src={selectedUser.image}
                    alt="profile"
                    className="rounded-circle border"
                    style={{ width: '40px', height: '40px' }}
                  />
                </div>
              )}

              <div className={`d-flex flex-column ${isMe ? "align-items-end" : "align-items-start"}`}>
                <div className="small mb-1">
                  <time>{formatMessageTime(message.createdAt)}</time>
                </div>

                <div
                  className={`p-3 rounded shadow-sm ${isMe ? "bg-primary text-white" : "bg-light text-dark"
                    }`}

                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="img-fluid rounded mb-2"
                      style={{ maxWidth: "200px" }}
                    />
                  )}
                  {message.text && <p className="mb-0">{message.text}</p>}
                </div>
              </div>

              {isMe && (
                <div className="ms-2">
                  <img
                    src={user.image}
                    alt="profile"
                    className="rounded-circle border"
                    style={{ width: '40px', height: '40px' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message Input cố định ở dưới */}
      <div
        className="position-absolute bottom-0 start-0 end-0 bg-white "
        style={{ zIndex: 100 }}
      >
        <MessageInput />
      </div>
    </div>

  );
};

export default ChatContainer;
