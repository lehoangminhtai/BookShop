import { useRef, useState } from "react";
import { useChatStore } from "../../../../store/useChatStore";
import { toast } from "react-toastify";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
//context
import { useStateContext } from "../../../../context/UserContext";

const MessageInput = () => {
  const { user } = useStateContext();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const [openProgress, setOpenProgress] = useState(false);
  const handleCloseProgress = () => {
    setOpenProgress(false);
  };
  const handleOpenProgress = () => {
    setOpenProgress(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    handleOpenProgress();
    try {
      await sendMessage(user, {
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    finally {
      handleCloseProgress();
    }
  };

  return (
    <div className=" bg-white">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-2 d-flex align-items-center">
          <div className="position-relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded border img-thumbnail"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
            <button
              onClick={removeImage}
              className="btn btn-sm btn-danger position-absolute top-0 start-100 translate-middle rounded-circle"
              style={{ width: "24px", height: "24px", lineHeight: "1" }}
              type="button"
            >
              <i class="fa fa-times" aria-hidden="true" style={{ fontSize: "12px" }}></i>
            </button>
          </div>
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="d-flex gap-2">
        {/* Text Input */}
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          className="d-none"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <button
          type="button"
          className="btn btn-outline-secondary rounded-circle"
          onClick={() => fileInputRef.current?.click()}
        >
          <i class="fa-solid fa-image"></i>
        </button>

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-primary rounded-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <i class="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
      </form>
      {openProgress && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openProgress}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress color="inherit" />
            <span style={{ marginTop: 12, fontSize: 16 }}>Đang gửi...</span>
          </Box>
        </Backdrop>
      )}

    </div>
  );
};

export default MessageInput;
