import React, { useState } from "react";
import { useDropzone } from 'react-dropzone';

const PostForm = ({ handleCloseModal }) => {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        publisher: "",
        publicationYear: "",
        categoryId: "",
        condition: "",
        exchangeType: "",
        ownerId: "",
        location: "",
        pageCount: "",
        images: [],
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleRemoveFile = (index) => {
        setFormData((prevData)=>({
            ...prevData,
            images: prevData.images.filter((_, i ) => i !== index)
        }))
        
    };

    const handleClose = () => {
        handleCloseModal();
    };

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFormData((prevData) => ({
                ...prevData,
                images: [...prevData.images, reader.result],
            }));
        };
    };

    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach((file) => setFileToBase(file));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Dữ liệu gửi lên:', formData);

        try {
            const response = await fetch('http://localhost:4000/api/book-exchange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Lỗi từ server:', errorData);
                throw new Error('Có lỗi khi gửi dữ liệu!');
            }


            const result = await response.json();
            console.log('Phản hồi từ server:', result);
        } catch (error) {
            console.error(error);
        }
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
                        <form onSubmit={handleSubmit}>
                            {Object.keys(formData).map((key) => (
                                key !== 'images' && (
                                    <div className="mb-3" key={key}>
                                        <label className="form-label">{key}:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                )
                            ))}

                            <div className="mb-3">
                                <label className="form-label">Hình ảnh:</label>
                                <div
                                    {...getRootProps()}
                                    className={`dropzone ${isDragActive ? 'active-dropzone' : ''}`}
                                    style={{
                                        border: '2px dashed #007bff',
                                        padding: '20px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderRadius: '5px',
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive ? <p>Thả file vào đây...</p> : <p>Kéo & thả ảnh hoặc nhấn để chọn</p>}
                                </div>
                                {formData.images.length > 0 && (
                                    <div className="mt-2 d-flex flex-wrap">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="position-relative d-inline-block me-2 mb-2">
                                              <img
                                                    src={img}
                                                    alt="preview"
                                                    className="img-thumbnail"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
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
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary">Đăng sách</button>
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