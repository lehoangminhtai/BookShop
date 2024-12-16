import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
//service
import { searchBookSales } from "../../services/homeService";
//component
import BookDetail from '../../components/BookDetail';

const ListBook = () => {
    const { query } = useParams();
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1; // Trang hiện tại (mặc định là 1)
    const [bookSales, setBookSales] = useState([]);
    const [total, setTotal] = useState();
    const [pagination, setPagination] = useState({
        page: parseInt(page), // Chuyển thành số nguyên
        limit: 8,
        totalPages: 0 // Tổng số trang
    });

    const searchBooks = async () => {
        const formattedQuery = query.replace(/-/g, ' ');
        const data = { query: formattedQuery, page: pagination.page }; // Thêm page vào request

        try {
            const response = await searchBookSales(data); // Gọi API tìm kiếm
            

            if (response.success) {
                setTotal(response.totalBookSales)
                if (pagination.page === 1) {
                    setBookSales(response.bookSales); // Nếu là trang đầu tiên, reset danh sách
                } else {
                    setBookSales(prev => [...prev, ...response.bookSales]); // Thêm sách mới vào danh sách cũ
                }
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.totalPages // Cập nhật tổng số trang từ API
                }));
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    useEffect(() => {
        searchBooks(); // Gọi API khi component được render
    }, [pagination.page]); // Chạy lại khi page thay đổi

    const handleShowMore = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination(prev => ({
                ...prev,
                page: prev.page + 1 // Tăng trang hiện tại lên 1
            }));
        }
    };

    return (
        <div className="container mt-5">
            
            <div class="container mt-3">
                <div class="d-flex align-items-center p-2" style={{ backgroundColor: "#FFDAB9", borderRadius: "10px" }}>
                    <div class="d-flex align-items-center justify-content-center me-2" style={{ padding: "10px" }}>
                        <i class="fa-solid fa-list"></i>
                    </div>
                    <div class="fw-bold" style={{ color: "#333333" }}>
                    Kết quả tìm kiếm: "{query.replace(/-/g, ' ')}"  <i><p className="text-danger small">{total} kết quả phù hợp</p></i>
                   
                    </div>
                </div>
            </div>
            <div className="container mt-5 ms-5">
                <div className="row align-items-center">
                    {bookSales.length > 0 ? bookSales.map(book => book?._id && (
                        <div key={book?._id} className="col-md-4 col-sm-6 col-lg-3">
                            <BookDetail book={book.bookId} />
                        </div>
                    )) : (
                        <div className="text-danger text-center">Không tìm thấy kết quả phù hợp</div>
                    )}
                </div>
            </div>
            {pagination.page < pagination.totalPages && ( // Hiển thị nút "Xem thêm" nếu còn trang
                <div className="d-flex justify-content-center mt-2">
                    <button className="btn d-flex align-items-center" onClick={handleShowMore}>
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6"></path>
                        </svg>
                        <span className="ms-2">Xem thêm</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListBook;
