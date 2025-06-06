import { Link } from 'react-router-dom'
import '../css/bootstrap.min.css'
import '../css/style.css'

const Footer = () => {
    return (
        <footer className=" text-light pt-5 mt-5" style={{"backgroundColor": "#1e3a8a"}}>
            <div className="container">
                <div className="row g-4 mb-4 pb-4 border-bottom border-secondary">
                    <div className="col-md-4">
                        <h5 className="mb-3 text-light">Tại sao chọn chúng tôi?</h5>
                        <p>
                            <i className="fas fa-star me-2 text-warning"></i>
                            "Chọn chúng tôi – nơi tạo nên website mua sách chuyên nghiệp, nhanh chóng, và tối ưu trải nghiệm người dùng!"
                        </p>
                        <Link to="/" className="btn btn-outline-light btn-sm rounded-pill mt-2">Xem thêm</Link>
                    </div>
                    <div className="col-md-4">
                        <h5 className="mb-3 text-light">Thông tin cửa hàng</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="text-light text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Về chúng tôi</Link></li>
                            <li><Link to="/" className="text-light text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Liên lạc</Link></li>
                            <li><Link to="/" className="text-light text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Chính sách</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5 className="mb-3 text-light">Liên hệ</h5>
                        <p><i className="fas fa-map-marker-alt me-2 text-warning"></i>Số 1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP.HCM</p>
                        <p><i className="fas fa-envelope me-2 text-warning"></i>bookshopute@gmail.com</p>
                        <p><i className="fas fa-phone me-2 text-warning"></i>0326 344 084</p>
                    </div>
                </div>

                <div className="row text-center pb-3">
                    <div className="col-md-6 text-md-start mb-3 mb-md-0">
                        <p className="mb-0">&copy; {new Date().getFullYear()} <strong className="text-warning">BookShop UTE</strong>. All rights reserved.</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <a className="btn btn-outline-light btn-sm rounded-circle me-2" href="#"><i className="fab fa-facebook-f"></i></a>
                        <a className="btn btn-outline-light btn-sm rounded-circle me-2" href="#"><i className="fab fa-twitter"></i></a>
                        <a className="btn btn-outline-light btn-sm rounded-circle me-2" href="#"><i className="fab fa-youtube"></i></a>
                        <a className="btn btn-outline-light btn-sm rounded-circle" href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer