import React, { useState } from "react";

const PostForm = ({ handleCloseModal }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleClose = () => {
        handleCloseModal();
    };

    return (
        <div className="modal show fade" tabIndex="-1" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Đăng sách</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Tiêu đề sách</label>
                                <input type="text" className="form-control" id="title" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="author" className="form-label">Tác giả sách</label>
                                <input type="text" className="form-control" id="author" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Mô tả ngắn</label>
                                <textarea className="form-control" id="description"></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="files" className="form-label">Danh sách ảnh hoặc video</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="files"
                                    accept="image/*,video/*"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                <div className="mt-3">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="position-relative d-inline-block me-2 mb-2">
                                            {file.type.startsWith('image') ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="preview"
                                                    className="img-thumbnail"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <video
                                                    src={URL.createObjectURL(file)}
                                                    className="img-thumbnail"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    controls
                                                />
                                            )}
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="publisher" className="form-label">Nhà xuất bản</label>
                                <input type="text" className="form-control" id="publisher" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="publicationYear" className="form-label">Năm xuất bản</label>
                                <input type="number" className="form-control" id="publicationYear" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoryId" className="form-label">ID thể loại sách</label>
                                <input type="text" className="form-control" id="categoryId" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="condition" className="form-label">Tình trạng sách</label>
                                <select className="form-select" id="condition">
                                    <option value="new">Mới</option>
                                    <option value="like-new">Cũ - như mới</option>
                                    <option value="used">Cũ - có dấu hiệu sử dụng</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exchangeType" className="form-label">Loại hình trao đổi</label>
                                <select className="form-select" id="exchangeType">
                                    <option value="points">Dùng điểm</option>
                                    <option value="direct">Trao đổi trực tiếp</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="creditPoints" className="form-label">Số điểm tín dụng</label>
                                <input type="number" className="form-control" id="creditPoints" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ownerId" className="form-label">ID người sở hữu sách</label>
                                <input type="text" className="form-control" id="ownerId" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="receiverId" className="form-label">ID người nhận sách</label>
                                <input type="text" className="form-control" id="receiverId" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Trạng thái sách</label>
                                <select className="form-select" id="status">
                                    <option value="available">Có sẵn</option>
                                    <option value="exchanging">Đang trao đổi</option>
                                    <option value="exchanged">Đã trao đổi</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="location" className="form-label">Địa điểm trao đổi</label>
                                <input type="text" className="form-control" id="location" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="pageCount" className="form-label">Số trang của sách</label>
                                <input type="number" className="form-control" id="pageCount" />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                        <button type="submit" className="btn btn-primary">Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostForm;