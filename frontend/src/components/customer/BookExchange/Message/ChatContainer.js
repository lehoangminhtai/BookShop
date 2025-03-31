import { useChatStore } from "../../../../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
//context
import { useStateContext } from "../../../../context/UserContext";

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
    <div className="d-flex flex-column flex-grow-1 overflow-auto">
      <ChatHeader />

      {/* Messages Container */}
      <div className="flex-grow-1 overflow-auto p-3">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`d-flex ${message.senderId === user?._id ? "align-self-end text-end" : "align-self-start text-start"}`}
            ref={messageEndRef}
          >
            {/* Avatar */}
            <div className="me-2">
              {/* <img
                src={
                  message.senderId === user?._id
                    ? authUser.profilePic || "/avatar.png"
                    : selectedUser.profilePic || "/avatar.png"
                }
                alt="profile pic"
                className="rounded-circle border"
                width="40"
                height="40"
              /> */}
            </div>

            {/* Message Content */}
            <div>
              <div className="text-muted small">
                <time>{(message.createdAt)}</time>
              </div>

              <div className="bg-light p-2 rounded shadow-sm">
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
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
