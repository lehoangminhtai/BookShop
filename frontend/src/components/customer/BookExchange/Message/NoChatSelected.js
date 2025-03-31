const NoChatSelected = () => {
    return (
      <div className="w-100 d-flex flex-column align-items-center justify-content-center p-5 bg-light">
        <div className="text-center">
          {/* Icon Display */}
          <div className="d-flex justify-content-center mb-3">
            <div className="position-relative">
              <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-25 rounded-3 p-3">
                <i className="fa fa-comment-dots text-primary fs-2"></i>
              </div>
            </div>
          </div>
  
          {/* Welcome Text */}
          <h2 className="fw-bold">Trao đổi thông tin</h2>
          <p className="text-dark mt-2">
            Chọn một cuộc trò chuyện để bắt đầu trao đổi thông tin với người dùng khác.
          </p>
        </div>
      </div>
    );
  };
  
  export default NoChatSelected;
  