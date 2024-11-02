import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchBook } from '../../services/bookService';

const ProductDetail = () => {
    const { productId } = useParams();
    const [bookDetail, setBookDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const getBookDetail = async () => {
            try {
                const book = await fetchBook(productId);
                setBookDetail(book);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching book:', error);
                setError('Không thể tải dữ liệu sách');
                setLoading(false);
            }
        };
        getBookDetail();
    }, [productId]);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;
    if (!bookDetail) return <p>Không tìm thấy sách</p>;

    const getBook = () => {
        alert(productId);
    }

    return (
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-4">
                    <div class="bg-white p-3 rounded shadow-sm d-flex justify-content-center align-items-center">
                        <img
                            alt={`${bookDetail.title}`}
                            class="img-fluid w-90 d-block rounded"
                            src={bookDetail.images}
                            style={{height: "300px", objectFit: "cover"}}
                        />
                        {/* <div class="d-flex mt-2">
                            <img
                                alt="Thumbnail"
                                class="img-thumbnail me-2"
                                src="https://storage.googleapis.com/a1aa/image/xZSj8KZcXI7OPhwaxAJUslPYaqZ4tjyxbtM0eY6lE0nZ3B2JA.jpg"
                                style="width: 50px; height: 50px; object-fit: cover;"
                            />
                            <img
                                alt="Thumbnail"
                                class="img-thumbnail"
                                src="https://storage.googleapis.com/a1aa/image/xZSj8KZcXI7OPhwaxAJUslPYaqZ4tjyxbtM0eY6lE0nZ3B2JA.jpg"
                                style="width: 50px; height: 50px; object-fit: cover;"
                            />
                        </div> */}
                    </div>
                </div>

                <div class="col-md-8">
                    <div class="bg-white p-3 rounded shadow-sm">
                        <h1 class="fs-4 fw-bold">{bookDetail.title}</h1>
                        <p>Nhà xuất bản: <strong>{bookDetail.publisher}</strong></p>
                        <p>Hình thức bìa: <strong>Bìa Mềm</strong></p>
                        <p>Tác giả: <strong>{bookDetail.author}</strong></p>
                        <div class="d-flex align-items-center mb-2">
                            <div class="text-muted">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                            <span class="ms-2">(0 đánh giá)</span>
                        </div>
                        <div class="d-flex align-items-center mb-3">
                            <span class="fs-3 text-danger fw-bold">21.750 đ</span>
                            <span class="ms-2 text-muted text-decoration-line-through">25.000 đ</span>
                            <span class="ms-2 bg-danger text-white px-2 rounded">-13%</span>
                        </div>
                        <div class="bg-light p-3 rounded">
                            <h5>Thông tin vận chuyển</h5>
                            <p>Giao hàng đến <strong>Phường Bến Nghé, Quận 1, Hồ Chí Minh</strong> <a class="text-primary" href="#">Thay đổi</a></p>
                            <p><i class="fas fa-truck"></i> Giao hàng tiêu chuẩn</p>
                            <p>Dự kiến giao <strong>Thứ năm - 31/10</strong></p>
                        </div>
                        <div class="bg-light p-3 rounded mt-3">
                            <div class="d-flex justify-content-between align-items-center">

                                <span class="ms-2">Mã giảm 10k - đơn từ 100k</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">

                                <span class="ms-2">Mã giảm 25k - đơn từ 200k</span>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mt-3">
                            <label class="me-2" for="quantity">Số lượng:</label>
                            <button class="btn btn-outline-secondary">-</button>
                            <input class="form-control mx-2 text-center" id="quantity" type="text" value="1" style={{ width: "50px" }} />
                            <button class="btn btn-outline-secondary">+</button>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-outline-danger me-2"><i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng</button>
                            <button class="btn btn-danger" onClick={getBook}>Mua ngay</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
