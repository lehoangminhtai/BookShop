import { useRef, useState } from "react";
import { useChatStore } from "../../../../store/useChatStore";
import { toast } from "react-toastify";
//context
import { useStateContext } from "../../../../context/UserContext";

const MessageInput = () => {
  const {user} = useStateContext();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

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

    try {
      await sendMessage(user,{
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-3 border-top bg-white">
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
                <i class="fa fa-times"  aria-hidden="true" style={{fontSize:"12px"}}></i>
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
    </div>
  );
};

export default MessageInput;
