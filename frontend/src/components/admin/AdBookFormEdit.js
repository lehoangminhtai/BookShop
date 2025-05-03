import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import { updateBook, fetchBooks } from "../../services/bookService";
import { serverUrl } from "../../services/config";

const BookFormEdit = ({ book, onClose }) => {
    const [title, setTitle] = useState(book.title || '');
    const [author, setAuthor] = useState(book.author || '');
    const [description, setDescription] = useState(
        book.description
            ? EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(book.description)))
            : EditorState.createEmpty()
    );
    
    const [images, setImages] = useState(book.images || '');
    const [publisher, setPublisher] = useState(book.publisher || '');
    const [categoryId, setCategoryId] = useState(book.categoryId._id || '');
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    // Handle image drop
    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFileToBase(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false, // Only allow one image
    });

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImages(reader.result);
            const updatedErrors = { ...errors };
            delete updatedErrors.images; // Remove error if image is selected
            setErrors(updatedErrors);
        };
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch(`${serverUrl}/api/categoryBooks`);
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
            delete updatedErrors[field]; // Remove error if input is not empty
        }

        setErrors(updatedErrors);

        if (field === "title") setTitle(value);
        if (field === "author") setAuthor(value);
        if (field === "publisher") setPublisher(value);
        if (field === "categoryId"){
            setCategoryId(value) 
            console.log(value)};
    };

    const onEditorStateChange = (editorState) => {
        setDescription(editorState);

        const updatedErrors = { ...errors };
        if (editorState.getCurrentContent().hasText()) {
            delete updatedErrors.description; // Remove error if description is not empty
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
            
            const bookData = { title, author, description: descriptionHtml, images, publisher, categoryId };
            const bookId = book._id
            const responseUpdateBook = await updateBook(bookId, bookData);
            console.log(responseUpdateBook)
            if (responseUpdateBook.success) {
                setTitle('');
                setDescription(EditorState.createEmpty());
                setImages('');
                setPublisher('');
                setAuthor('');
                setCategoryId('');
                toast.success('Cập nhật thành công');
                fetchBooks();
                onClose();
            } else {
                toast.error('Lỗi cập nhật sách');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi cập nhật sách');
        }
    };

    return (
        <div>
            <form className="create container mt-4" onSubmit={handleSubmit}>
                <h3 className="text-center mb-4">Cập nhật sách</h3>

                {/* Title input */}
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

                {/* Author input */}
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

                {/* Description Editor */}
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

                {/* Image Dropzone */}
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

                {/* Publisher input */}
                <div className="mb-3">
                    <label className="form-label">Nhà xuất bản: </label>
                    <input
                        type="text"
                        className={`form-control ${errors.publisher ? 'is-invalid' : ''}`}
                        onChange={(e) => handleInputChange(e, 'publisher')}
                        value={publisher}
                    />
                    {errors.publisher && <div className="invalid-feedback">{errors.publisher}</div>}
                </div>

                {/* Category input */}
                <div className="mb-3">
                    <label className="form-label">Thể loại: </label>
                    <select
                        className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                        onChange={(e) => handleInputChange(e, 'categoryId')}
                        value={categoryId}
                    >
                        
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.nameCategory}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">Cập nhật</button>
            </form>

           
        </div>
    );
};

export default BookFormEdit;
