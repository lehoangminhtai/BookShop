import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import '../css/bootstrap.min.css'
import '../css/style.css'
const Footer = () => {
    return (
        <div class="container-fluid bg-light text-white-50 footer pt-5 mt-5">
        <div class="container py-5">
            <div class="pb-4 mb-4" style={{ borderBottom: "1px solid rgba(226, 175, 24, 0.5)" }}>
                <div class="row g-4">
                    <div class="col-lg-3">
                       
                    </div>
                    <div class="col-lg-6">
                        
                    </div>
                    <div class="col-lg-3">
                        <div class="d-flex justify-content-end pt-3">
                            <a class="btn  btn-outline-secondary me-2 btn-md-square rounded-circle" href=""><i class="fab fa-twitter"></i></a>
                            <a class="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href=""><i class="fab fa-facebook-f"></i></a>
                            <a class="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href=""><i class="fab fa-youtube"></i></a>
                            <a class="btn btn-outline-secondary btn-md-square rounded-circle" href=""><i class="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-5">
                <div class="col-lg-3 col-md-6">
                    <div class="footer-item">
                        <h5 class=" mb-3">Tại sao nên chọn chúng tôi</h5>
                        <p class="mb-4">"Chọn chúng tôi – nơi tạo nên website mua sách chuyên nghiệp, nhanh chóng, và tối ưu trải nghiệm người dùng!"</p>
                        <a href="" class="btn border-secondary py-2 px-4 rounded-pill text-secondary">Xem thêm</a>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="d-flex flex-column text-start footer-item">
                        <h5 class=" mb-3">Thông tin cửa hàng</h5>
                        <a class="btn-link" href="">Về chúng tôi</a>
                        <a class="btn-link" href="">Liên lạc</a>
                        <a class="btn-link" href="">Chính sách</a>
                       
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="d-flex flex-column text-start footer-item">
                        <h5 class="h3 text-dark">Vui vẻ, tốt lành!</h5>
                       
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="footer-item">
                        <h5 class=" mb-3">Liên lạc</h5>
                        <p>Số 1 VVN, Linh Chiều, Thủ Đức, TP.HCM</p>
                        <p>Email: bookshop@gmail.com</p>
                        <p>SĐT: 0326344084</p>
                       
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Footer
