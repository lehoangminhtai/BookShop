import React, { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { toast, ToastContainer } from "react-toastify";
//component
import AdSidebar from "../../components/admin/AdSidebar";
//services
import { getCategoryBooks, createCategoryBook, updateCategoryBook,deleteCategoryBook} from "../../services/categoryBookService";


const AdCategoryBook = () => {
    const [categoryBooks, setCategoryBooks] = useState([]);
    const [categoryBook, setCategoryBook] = useState();
    const [bookCount, setBookCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState({
        
        name: "",
        permalink: ""
    });
    const [images, setImages] = useState();
    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);

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

    const fetchCategoryBooks = async() =>{
        try {
            const result = await getCategoryBooks();
            setCategoryBooks(result.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    }
    useEffect(() => {
        
        fetchCategoryBooks();
    }, []);

    const handleCategoryClick = (category) => {
        setIsEdit(true)
        const isEmptyError = {}
        setErrors(isEmptyError)
        setCategoryBook(category)
        setBookCount(category.bookCount)
        console.log(category.bookCount)
        setSelectedCategory({
            name: category.nameCategory,
            permalink: `http://localhost:3000/book-categories/${category.nameCategory.replace(/\s+/g, '-').toLowerCase()}/${category._id}` // tạo permalink từ tên
        });
      setImages(category?.image)
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        const updatedErrors = { ...errors };

        if (name.trim() !== '') {
            delete updatedErrors['name']; // Xóa lỗi nếu input không rỗng
        }

        setErrors(updatedErrors);
        setSelectedCategory({
            name,
            permalink: `http://localhost:3000/book-categories/${name.replace(/\s+/g, '-').toLowerCase()}` // Cập nhật permalink theo tên
        });
    };

    const handleResetImage = () => {
        setImages()
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!selectedCategory.name) newErrors.name = 'Thêm tên cho loại sách';
        if (selectedCategory.name.length <2 || selectedCategory.name.length > 100) newErrors.name = 'Vui lòng nhập tên loại hợp lệ';
        if (!images) newErrors.images = 'Không thể thiếu ảnh cho loại sách';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }
        try {
            const categoryData = { nameCategory: selectedCategory.name, image: images }
            
           
            if(!isEdit){
                const response = await createCategoryBook(categoryData);
                console.log(response)
                if(response.success){
                    toast.success('Thêm thành công')
                    setIsEdit(true)
                    fetchCategoryBooks();
                }
                
                else if(!response.success){
                    toast.error(response.message)
                }
            }
            else{
                const categoryId = categoryBook._id
                const response = await updateCategoryBook(categoryId,categoryData);
               
                if(response.success){
                    toast.success('Cập nhật thành công')
                    fetchCategoryBooks();
                }
                
                else if(!response.success){
                    toast.error(response.message)
                }
            }
            

        } catch (error) {
    
                toast.error(error)
            
        }
    }

    const handleAddCategoryBook = () => {
        setIsEdit(false)
        const isEmptyError = {}
        setErrors(isEmptyError)
        setSelectedCategory({
            name: '',
            permalink: `http://localhost:3000/book-categories/` // tạo permalink từ tên
        });
        setImages()
    }

    const handleDeleteCategoryBook = async () =>{
        const categoryId = categoryBook._id
        console.log(categoryId)

        try {
            const response = await deleteCategoryBook(categoryId)
            console.log(response)
            if(response.success){
                toast.success('Xóa thành công thể loại: '+ selectedCategory.name)
                setIsEdit(false)
                fetchCategoryBooks()
                setBookCount(0)
                setCategoryBook()
                setImages();
                setSelectedCategory({
                    name: '',
                    permalink: `http://localhost:3000/book-categories/` // tạo permalink từ tên
                });
            }
            else if(!response.success){
                toast.success('Xóa thất bại thể loại: '+ selectedCategory.name)
            }
        } catch (error) {
            
        }
    }

    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container d-flex gap-4">
                {/* Categories List */}
                <div className="col-md-4 bg-white p-4 rounded shadow">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h2 className="h5">Loại sách</h2>
                        <button className="btn btn-primary" onClick={handleAddCategoryBook}>+ Thêm</button>
                    </div>
                    <ul className="list-group">
                        {categoryBooks.map((category, index) => (
                            <li
                                key={index}
                                className={`list-group-item d-flex justify-content-between align-items-center p-3 ${selectedCategory.name === category.nameCategory ? 'border-primary' : ''}`}
                                onClick={() => handleCategoryClick(category)}
                                style={{
                                    cursor: 'pointer',
                                    border: selectedCategory.name === category.nameCategory ? '2px solid #007bff' : 'none'
                                }}
                            >
                                <div>
                                    <i className="fas fa-file-alt me-2"></i>
                                    {category.nameCategory}
                                </div>
                               
                                <span className="text-secondary">({category.bookCount})</span>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Category Editor */}
                <div className="col-md-8 bg-white p-4 rounded shadow">
                    <div className="mb-3">
                        <label className="form-label">Tên <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            value={selectedCategory.name}
                            onChange={handleNameChange} // Sử dụng hàm mới để thay đổi tên
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Permalink </label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedCategory.permalink}
                            readOnly // Đặt thành chỉ đọc
                        />
                        <a href={selectedCategory.permalink} className={`text-primary d-block mt-1 ${!isEdit && 'disabled-link'}`}

                        >Xem: {selectedCategory.permalink}</a>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Hình ảnh: <span className="text-danger">*</span></label>
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
                            <div className="mt-2 d-flex align-items-center">
                                <img
                                    src={images}
                                    alt="Selected"
                                    style={{ height: '200px' }}
                                    className="img-thumbnail"
                                />
                                <button
                                    className="btn btn-danger btn-sm"
                                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '-15px' }}
                                    onClick={handleResetImage}
                                >
                                    &times;
                                </button>
                            </div>
                        )}

                    </div>
                    <div className="d-flex justify-content-between mt-5">
                        <button className={`btn ${isEdit ? 'btn-secondary' : 'btn-primary'}`} onClick={handleSave}>{isEdit ? 'Lưu' : 'Thêm'}</button>
                       
                        {bookCount ===0 && (<button className="btn btn-danger" onClick={handleDeleteCategoryBook}>Xóa</button>)}
                    </div>
                </div>
            </div>
        <ToastContainer/>
        </div>
    );
};

export default AdCategoryBook;
