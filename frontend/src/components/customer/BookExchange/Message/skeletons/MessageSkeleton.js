const MessageSkeleton = () => {
    // Tạo một mảng gồm 6 tin nhắn skeleton
    const skeletonMessages = Array(6).fill(null);
  
    return (
      <div className="flex-grow overflow-auto p-4">
        {skeletonMessages.map((_, idx) => (
          <div key={idx} className={`d-flex ${idx % 2 === 0 ? "justify-content-start" : "justify-content-end"} mb-3`}>
            {idx % 2 === 0 && (
              <div className="me-2">
                <div className="rounded-circle bg-secondary placeholder-glow" style={{ width: "40px", height: "40px" }}></div>
              </div>
            )}
  
            <div>
              <div className="mb-1 placeholder-glow">
                <span className="placeholder col-3"></span>
              </div>
              <div className="bg-secondary rounded p-3 placeholder-glow" style={{ width: "200px", height: "60px" }}></div>
            </div>
  
            {idx % 2 !== 0 && (
              <div className="ms-2">
                <div className="rounded-circle bg-secondary placeholder-glow" style={{ width: "40px", height: "40px" }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageSkeleton;
  