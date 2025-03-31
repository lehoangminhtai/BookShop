import { useChatStore } from "../../../store/useChatStore";
import Sidebar from "../../../components/customer/BookExchange/Message/SideBarChat";
import NoChatSelected from "../../../components/customer/BookExchange/Message/NoChatSelected";
import ChatContainer from "../../../components/customer/BookExchange/Message/ChatContainer";

const Chat = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="shadow d-flex align-items-center justify-content-center">
      <div className="container py-5">
        <div className=" w-100" style={{  height: "calc(100vh - 8rem)" }}>
          <div className="row h-100 g-0">
            <div className="col-4 bg-white border-end">
              <Sidebar />
            </div>
            <div className="col-8 bg-white">
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
