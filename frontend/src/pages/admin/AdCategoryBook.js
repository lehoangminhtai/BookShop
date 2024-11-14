import React, { useEffect, useState } from "react";
import AdSidebar from "../../components/admin/AdSidebar";
import { getCategoryBooks } from "../../services/categoryBookService";

const AdCategoryBook = () => {
    const [categoryBooks, setCategoryBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({
        name: "",
        permalink: ""
    });

    useEffect(() => {
        async function fetchCategoryBooks() {
            try {
                const result = await getCategoryBooks();
                setCategoryBooks(result.data);
                console.log(result.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        }

        fetchCategoryBooks();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory({
            name: category.nameCategory,
            permalink: `http://localhost:3000/book-categories/${category.nameCategory.replace(/\s+/g, '-').toLowerCase()}` // tạo permalink từ tên
        });
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setSelectedCategory({
            name,
            permalink: `http://localhost:3000/book-categories/${name.replace(/\s+/g, '-').toLowerCase()}` // Cập nhật permalink theo tên
        });
    };

    const handleAddCategoryBook = () => {
        setSelectedCategory({
            name: '',
            permalink: `http://localhost:3000/book-categories/` // tạo permalink từ tên
        });
    }

    return (
        <div className="d-flex mt-5">
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
                                className="list-group-item d-flex justify-content-between align-items-center p-3"
                                onClick={() => handleCategoryClick(category)}
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
                        <label className="form-label">Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={selectedCategory.name} 
                            onChange={handleNameChange} // Sử dụng hàm mới để thay đổi tên
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Permalink <span className="text-danger">*</span></label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={selectedCategory.permalink} 
                            readOnly // Đặt thành chỉ đọc
                        />
                        <a href={selectedCategory.permalink} className="text-primary d-block mt-1">Preview: {selectedCategory.permalink}</a>
                    </div>
                   
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <div className="d-flex mb-2">
                            <button className="btn btn-secondary me-2">Show/Hide Editor</button>
                            <button className="btn btn-secondary">Add media</button>
                        </div>
                        <textarea className="form-control" rows="4"></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdCategoryBook;
