import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

   

    return (
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-4">
                    <div class="bg-white p-3 rounded shadow-sm">
                        <img alt="Book cover" class="img-fluid" src="https://storage.googleapis.com/a1aa/image/fHDE1FUHUOSlAaNNfRbSRwdmraOGBDybf6yId8w7kJEddHYnA.jpg" />
                        <div class="d-flex mt-2">
                            <img alt="Thumbnail" class="img-thumbnail me-2" src="https://storage.googleapis.com/a1aa/image/xZSj8KZcXI7OPhwaxAJUslPYaqZ4tjyxbtM0eY6lE0nZ3B2JA.jpg" width="50" />
                            <img alt="Thumbnail" class="img-thumbnail" src="https://storage.googleapis.com/a1aa/image/xZSj8KZcXI7OPhwaxAJUslPYaqZ4tjyxbtM0eY6lE0nZ3B2JA.jpg" width="50" />
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="bg-white p-3 rounded shadow-sm">
                        <h1 class="fs-4 fw-bold">Lớp Học Mật Ngữ Phiên Bản Mới - Tập 2</h1>
                        <p>Nhà xuất bản: <strong>Báo Sinh Viên Việt Nam - Hoa Học Trò</strong></p>
                        <p>Hình thức bìa: <strong>Bìa Mềm</strong></p>
                        <p>Tác giả: <strong>B R O Group</strong></p>
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
                            <input class="form-control mx-2 text-center" id="quantity" type="text" value="1" style={{width:"50px"}} />
                            <button class="btn btn-outline-secondary">+</button>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-outline-danger me-2"><i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng</button>
                            <button class="btn btn-danger">Mua ngay</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
