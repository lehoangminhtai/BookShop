import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//service
import { searchBookSales, getBookSalesByCategory, getBookSales, getTopBooks, getLastBooks} from "../../services/homeService";

//component
import BookDetail from '../../components/BookDetail';

const ShowMoreBook = () => {
    const { type} = useParams();
    const navigate = useNavigate();
    const [bookSales, setBookSales] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1, // Chuyển thành số nguyên
        limit: 16,
        totalPages: 0 // Tổng số trang
    });

    const fetchTopBooks = async () =>{
        const data = { page: pagination.page, limit: pagination.limit }; 
        try {
            const response = await getTopBooks(data); // Gọi API tìm kiếm
           
            if (response.success) {
                if (pagination.page === 1) {
                    setBookSales(response.books); // Nếu là trang đầu tiên, reset danh sách
                } else {
                    setBookSales(prev => [...prev, ...response.books]); // Thêm sách mới vào danh sách cũ
                }
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.totalPages // Cập nhật tổng số trang từ API
                }));
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }
    const fetchNewBooks = async () =>{
        const data = { page: pagination.page, limit: pagination.limit }; 
        try {
            const response = await getLastBooks(data);
           
            if (response.success) {
                if (pagination.page === 1) {
                    setBookSales(response.books); // Nếu là trang đầu tiên, reset danh sách
                } else {
                    setBookSales(prev => [...prev, ...response.books]); // Thêm sách mới vào danh sách cũ
                }
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.totalPages // Cập nhật tổng số trang từ API
                }));
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }
    const fetchBooks = async () =>{
        const data = { page: pagination.page, limit: pagination.limit }; 
        try {
            const response = await getBookSales(data);
           
            if (response.success) {
                if (pagination.page === 1) {

                const shuffled = [...response.data].filter(book => book?._id).sort(() => Math.random() - 0.5);
                setBookSales(shuffled);
                    
                } else {
                    setBookSales(prev => [...prev, ...[...response.data].filter(book => book?._id).sort(() => Math.random() - 0.5)]); 
                }
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.totalPages 
                }));
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    useEffect(() => {
       if(type === 'hot-deal'){
            fetchTopBooks();
       }
       else if(type === 'last-book'){
        fetchNewBooks();
       }
       else if(type === 'others'){
        fetchBooks();
       }
       else {
        navigate('/not-found')
       }
    }, [pagination.page]); 

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
                       {type === 'hot-deal' ? 'Sách bán chạy': type === 'last-book' ? 'Sách mới':'Có thể bạn sẽ thích'}
                    </div>
                </div>
            </div>
            <div className="container mt-5 ms-5">
                <div className="row align-items-center">
                    {bookSales.length > 0 ? bookSales.map(book => book?._id && (
                        <div key={book?._id} className="col-md-4 col-sm-6 col-lg-3">
                            <BookDetail  book={type === 'hot-deal' ? book : book.bookId} />
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

export default ShowMoreBook;
