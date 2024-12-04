import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdSidebar from '../../components/admin/AdSidebar';
import { getBookSales } from "../../services/bookSaleService";

const AdBookSale = () => {
    const [bookSales, setBookSales] = useState([]);  // State lưu trữ dữ liệu sách bán
    const [loading, setLoading] = useState(true);  // State cho việc loading
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const fetchBookSales = async () => {
            try {
                const response = await getBookSales();
                setBookSales(response.data); 
                setLoading(false);  // Thay đổi trạng thái loading
            } catch (err) {
                console.error('Error fetching book sales:', err);
                setLoading(false);
            }
        };

        fetchBookSales();
    }, []);
   
    // Hàm xử lý khi thay đổi giá
    const handlePriceChange = (index, event) => {
        const newPrice = event.target.value;

        // Nếu giá trị là chuỗi rỗng thì không thay đổi, nếu không thì kiểm tra xem có phải là số hợp lệ
        if (newPrice === "" || !isNaN(newPrice) && newPrice >= 0) {
            const updatedBookSales = [...bookSales];
            updatedBookSales[index].price = newPrice === "" ? "" : parseFloat(newPrice);  // Giữ giá trị trống nếu người dùng xóa
            setBookSales(updatedBookSales);
        }
    };

    // Hàm xử lý khi thay đổi giảm giá
    const handleDiscountChange = (index, event) => {
        const newDiscount = event.target.value;

        // Nếu là chuỗi trống, giữ giá trị trống; nếu không kiểm tra nếu là số hợp lệ và <= 100
        if (newDiscount === "" || (!isNaN(newDiscount) && newDiscount >= 0 && newDiscount <= 100)) {
            const updatedBookSales = [...bookSales];
            updatedBookSales[index].discount = newDiscount === "" ? "" : parseFloat(newDiscount);  // Giữ giá trị trống nếu người dùng xóa
            setBookSales(updatedBookSales);
        } else if (newDiscount > 100) {
            // Nếu giá trị phần trăm vượt quá 100, thì trả về 100
            const updatedBookSales = [...bookSales];
            updatedBookSales[index].discount = 100;
            setBookSales(updatedBookSales);
        }
    };

    return (
        <div className="d-flex">
            {/* Sidebar Component */}
            <AdSidebar />

            {/* Main content */}
            <div className="p-4 w-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    {/* Search box */}
                    <div className="position-relative">
                        <input type="text" placeholder="Tìm kiếm..." className="form-control w-100" />
                        <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                    </div>

                    {/* Reload button */}
                    <button className="btn btn-outline-secondary d-flex align-items-center">
                        <i className="fas fa-sync-alt me-2"></i> Tải lại
                    </button>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    {loading ? (
                        <div>Loading...</div>  // Hiển thị khi đang tải dữ liệu
                    ) : (
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-start">STT <i className="fas fa-sort"></i></th>
                                    <th className="text-start">Ảnh</th>
                                    <th className="text-start">Sách</th>
                                    <th className="text-start">Số lượng (Tồn kho)</th>
                                    <th className="text-start">Giá gốc (VNĐ)</th> 
                                    <th className="text-start">Giảm (%)</th>
                                    <th className="text-start">Giá giảm (VNĐ)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookSales.map((bookSale, index) => (
                                    <tr key={bookSale._id} >
                                        <td>{index + 1}</td>
                                        <td>
                                            <Link to ={`/chi-tiet/${bookSale.bookId._id}`}>
                                            <img
                                                src={bookSale.bookId?.images[0] || "https://placehold.co/50x50"}
                                                alt="Product image"
                                                className="img-fluid"
                                                style={{ width: "50px" }}
                                            />
                                            </Link>
                                        </td>
                                        <td>
                                            <div className="text-primary">{bookSale.bookId.title}</div>
                                            <div className="text-muted">{bookSale.bookId.author}</div>
                                        </td>
                                        <td>
                                            <div className={`${bookSale.quantity ===0 ? 'bg-danger text-light' : 'text-primary'} `} >{bookSale.quantity}</div>
                                           
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                
                                                <input
                                                    type="number"
                                                    className="form-control w-75 ms-2"
                                                    value={bookSale.price.toLocaleString()}
                                                    onChange={(e) => handlePriceChange(index, e)}  // Cập nhật giá khi thay đổi
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                               
                                                <input
                                                    type="number"
                                                    className="form-control w-75 ms-2"
                                                    value={bookSale.discount}
                                                    onChange={(e) => handleDiscountChange(index, e)}  // Cập nhật giảm giá khi thay đổi
                                                    min={0} max={100} // Giới hạn giá trị từ 0 đến 100
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                
                                                <input
                                                    type="text"
                                                    className="form-control w-75 ms-2"
                                                    value={bookSale.price !== "" && bookSale.discount !== "" 
                                                        ? (bookSale.price - (bookSale.price * bookSale.discount) / 100 ).toLocaleString()
                                                        : ""}
                                                    readOnly
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <button></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdBookSale;
