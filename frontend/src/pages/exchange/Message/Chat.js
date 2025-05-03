import { useChatStore } from "../../../store/useChatStore";
import Sidebar from "../../../components/customer/BookExchange/Message/SideBarChat";
import NoChatSelected from "../../../components/customer/BookExchange/Message/NoChatSelected";
import ChatContainer from "../../../components/customer/BookExchange/Message/ChatContainer";

const Chat = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="d-flex align-items-center justify-content-center " 
    style={{overflow: "hidden"}}>
      <div className="container py-4">
        <div className=" w-100" >
          <div className="row g-0">
            <div className="col-4 ">
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
