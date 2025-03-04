import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const AddBookExchange = () => {
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
        <div className="container mt-4">
            <h2>Thêm sách để trao đổi</h2>
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
                                <img key={index} src={img} alt="Book Preview" style={{ width: '100px', height: '100px', marginRight: '5px' }} className="img-thumbnail" />
                            ))}
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary">Đăng sách</button>
            </form>
        </div>
    );
};

export default AddBookExchange;
