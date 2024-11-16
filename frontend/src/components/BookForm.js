import { useEffect, useState } from "react";
import { useBookContext } from "../hooks/useBookContext";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; 
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone'; // Import Dropzone

const BookForm = () => {
    const { dispatch } = useBookContext();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState(EditorState.createEmpty());
    const [images, setImages] = useState('');
    const [publisher, setPublisher] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    // Xử lý hình ảnh khi kéo thả hoặc chọn tệp
    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFileToBase(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false, // Chỉ cho phép một hình ảnh
    });

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImages(reader.result);
            const updatedErrors = { ...errors };
            delete updatedErrors.images; // Xóa lỗi nếu ảnh được chọn
            setErrors(updatedErrors);
        };
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('/api/categoryBooks');
            const json = await response.json();
            if (response.ok) {
                setCategories(json);
            } else {
                console.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);
    
    const handleInputChange = (e, field) => {
        const value = e.target.value;
        const updatedErrors = { ...errors };

        if (value.trim() !== '') {
            delete updatedErrors[field]; // Xóa lỗi nếu input không rỗng
        }

        setErrors(updatedErrors);

        if (field === "title") setTitle(value);
        if (field === "author") setAuthor(value);
        if (field === "publisher") setPublisher(value);
        if (field === "categoryId") setCategoryId(value);
    };

    const onEditorStateChange = (editorState) => {
        setDescription(editorState);

        const updatedErrors = { ...errors };
        if (editorState.getCurrentContent().hasText()) {
            delete updatedErrors.description; // Xóa lỗi nếu mô tả không trống
        }
        setErrors(updatedErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!title) newErrors.title = 'Vui lòng nhập tên sách';
        if (!author) newErrors.author = 'Vui lòng nhập tên tác giả';
        if (!description.getCurrentContent().hasText()) newErrors.description = 'Mô tả gì đó về cuốn sách đi';
        if (!images) newErrors.images = 'Không thể thiếu ảnh cho cuốn sách';
        if (!publisher) newErrors.publisher = 'Cho cuốn sách nhà xuất bản';
        if (!categoryId) newErrors.categoryId = 'Thuộc thể loại sách nào';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            const descriptionHtml = draftToHtml(convertToRaw(description.getCurrentContent()));
            const { data } = await axios.post('/api/books', { 
                title, author, description: descriptionHtml, images, publisher, categoryId 
            });

            if (data.success) {
                setTitle('');
                setDescription(EditorState.createEmpty());
                setImages('');
                setPublisher('');
                setAuthor('');
                setCategoryId('');
                toast.success('Thêm sách thành công');
                const response = await fetch('/api/books');
                const json = await response.json();
                dispatch({ type: 'CREATE_BOOK', payload: json });
            } else {
                toast.error('Lỗi thêm sách');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi thêm sách');
        }
    };

    return (
        <div className="">
            <form className="create container mt-4" onSubmit={handleSubmit}>
                <h3 className="text-center mb-4">Thêm sách mới</h3>

                <div className="mb-3">
                    <label className="form-label">Tên sách: </label>
                    <input
                        type="text"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        onChange={(e) => handleInputChange(e, 'title')}
                        value={title}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Tác giả: </label>
                    <input
                        type="text"
                        className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                        onChange={(e) => handleInputChange(e, 'author')}
                        value={author}
                    />
                    {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                </div>

                <div className="form-group col-md-12 editor" style={{ border: '2px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                    <label className="font-weight-bold">
                        Mô tả <span className="required"> * </span>
                    </label>
                    <Editor
                        editorState={description}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChange}
                    />
                    {errors.description && <div className="text-danger">{errors.description}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Hình ảnh: </label>
                    <div 
                        {...getRootProps()} 
                        className={`dropzone ${isDragActive ? 'active-dropzone' : ''}`}
                        style={{
                            border: '2px dashed #007bff',
                            padding: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            borderRadius: '5px'
                        }}
                    >
                        <input {...getInputProps()} />
                        {isDragActive 
                            ? <p>Thả file của bạn vào đây...</p> 
                            : <p>Kéo và thả hình ảnh vào đây, hoặc nhấn để chọn</p>
                        }
                    </div>
                    {errors.images && <div className="text-danger">{errors.images}</div>}
                    {images && (
                        <div className="mt-2">
                            <img src={images} alt="Selected" style={{ width: '200px', height: '200px' }} className="img-thumbnail" />
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Nhà sản xuất: </label>
                    <input
                        type="text"
                        className={`form-control ${errors.publisher ? 'is-invalid' : ''}`}
                        onChange={(e) => handleInputChange(e, 'publisher')}
                        value={publisher}
                    />
                    {errors.publisher && <div className="invalid-feedback">{errors.publisher}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Thể loại: </label>
                    <select
                        className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                        onChange={(e) => handleInputChange(e, 'categoryId')}
                        value={categoryId}
                    >
                        <option value="">Chọn thể loại</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.nameCategory}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">Thêm</button>
            </form>

            <ToastContainer />
        </div>
    );
};

export default BookForm;
