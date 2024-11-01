import { useEffect } from "react";
import { useBookContext } from "../hooks/useBookContext";
import { fetchBook } from "../services/bookService";


import '../css/bootstrap.min.css'
import '../css/style.css'
//Component
import BookDetail from '../components/BookDetail';
import BookForm from "../components/BookForm";

const Home = () => {

    const { books, dispatch } = useBookContext();
    useEffect(() => {
        const getBooks = async () => {
            try {
                const bookData = await fetchBook();
                dispatch({ type: 'SET_BOOKS', payload: bookData })
            }
            catch (error) {
                console.error('Error fetching books:', error);
            }

        }
        getBooks()
    }, [dispatch])

    const icons = [
        { src: "https://res.cloudinary.com/dyu419id3/image/upload/v1730310747/halloween_tegys2.webp", alt: "Halloween icon", label: "Halloween" },
        { src: "https://placehold.co/64x64", alt: "Kinh Tế icon", label: "Kinh Tế" },

        { src: "https://res.cloudinary.com/dyu419id3/image/upload/v1730310747/manga_kx6lvg.webp", alt: "Manga icon", label: "Manga" },
        { src: "https://placehold.co/64x64", alt: "Flash Sale icon", label: "Flash Sale" },
        { src: "https://placehold.co/64x64", alt: "Mã Giảm Giá icon", label: "Mã Giảm Giá" },
        { src: "https://placehold.co/64x64", alt: "Ngoại Văn icon", label: "Ngoại Văn" },
        { src: "https://placehold.co/64x64", alt: "Phiên Chợ Sách Cũ icon", label: "Phiên Chợ Sách Cũ" },
        { src: "https://placehold.co/64x64", alt: "Sản Phẩm Mới icon", label: "Sản Phẩm Mới" }
    ];
   

    return (
        <div >
            <div className="container-fluid py-5 mb-5 hero-header">
                <div className="container py-5 ">
                    <div className="row align-items-center">
                        <div className="col-md-12 col-lg-6">
                            <h4 className="mb-3 text-primary">Healing Environment</h4>
                            <h3 className="mb-3 display-5 text-secondary">Happy & Peaceful Books</h3>
                            <div className="position-relative mx-auto">
                                <input
                                    className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                                    type="text"
                                    placeholder="Túp lều bác Tom"
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
                                    style={{ top: '0', right: '25%' }}
                                >
                                    <i className="fa fa-search fa-2x"></i>
                                </button>
                            </div>
                        </div>


                        <div className="col-md-12 col-lg-6">

                            <div id="carouselOne" className="carousel slide mb-4 position-relative" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active rounded">
                                        <img
                                            src="https://i.pinimg.com/control/474x/b7/45/59/b74559537f4ea86ef4f6e79a732263ed.jpg"
                                            className="img-fluid w-100 bg-secondary rounded"
                                            alt="First slide"
                                        />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">50% sale</a>
                                    </div>
                                    <div className="carousel-item rounded">
                                        <img
                                            src="https://i.pinimg.com/control/474x/57/cf/2f/57cf2f93ff49e1725fcc31af7ee0b77a.jpg"
                                            className="img-fluid w-100 rounded"
                                            alt="Second slide"
                                        />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Free ship</a>
                                    </div>
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#carouselOne"
                                    data-bs-slide="prev"
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#carouselOne"
                                    data-bs-slide="next"
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>


                            <div id="carouselTwo" className="carousel slide position-relative" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active rounded">
                                        <img
                                            src="https://i.pinimg.com/control/474x/57/cf/2f/57cf2f93ff49e1725fcc31af7ee0b77a.jpg"
                                            className="img-fluid w-100 bg-secondary rounded"
                                            alt="First slide"
                                        />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Flash Sale</a>
                                    </div>
                                    <div className="carousel-item rounded">
                                        <img
                                            src="https://i.pinimg.com/control/474x/b7/45/59/b74559537f4ea86ef4f6e79a732263ed.jpg"
                                            className="img-fluid w-100 rounded"
                                            alt="Second slide"
                                        />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Special Offer</a>
                                    </div>
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#carouselTwo"
                                    data-bs-slide="prev"
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#carouselTwo"
                                    data-bs-slide="next"
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" bg-primary p-4 rounded-3 shadow container my-5 d-flex flex-wrap justify-content-center gap-5">

                {icons.map((icon, index) => (
                    <div
                        key={index}
                        className="d-inline-flex flex-column align-items-center text-center p-2  rounded"
                        style={{ width: "90px" }}
                    >
                        <img
                            src={icon.src}
                            alt={icon.alt}
                            className="mb-1"
                            style={{ width: "64px", height: "64px" }}
                        />
                        <p className="small text-white m-0">{icon.label}</p>
                    </div>
                ))}

            </div>
            <div class="container mt-3">
                <div class="d-flex align-items-center p-2" style={{ backgroundColor: "#fce4ec", borderRadius: "10px" }}>
                    <div class="d-flex align-items-center justify-content-center me-2" style={{ padding: "10px" }}>
                        <img alt="Trending icon" height="24" src="https://res.cloudinary.com/dyu419id3/image/upload/v1730313193/icon_dealhot_new_zfmnum.webp" width="24" />
                    </div>
                    <div class="fw-bold text-dark">
                        Xu Hướng Mua Sắm
                    </div>
                </div>
            </div>
            <div className="container mt-5">
                <div className="row">
                    {books && books.map(book => (
                        <div key={book._id} className="col-md-4 col-sm-6 col-lg-3">
                            <BookDetail  book={book} />
                        </div>
                    ))}
                </div>
            </div>

            <div class="container-fluid features py-5">
                <div class="container py-5">
                    <div class="row g-4">
                        <div class="col-md-6 col-lg-3">
                            <div class="features-item text-center rounded bg-light p-4">
                                <div class="features-icon btn-square rounded-circle bg-primary mb-5 mx-auto">
                                    <i class="fas fa-car-side fa-3x text-white"></i>
                                </div>
                                <div class="features-content text-center">
                                    <h5>Miễn phí vận chuyển</h5>
                                    <p class="mb-0">Miễn phí với đơn trên 300.000đ</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="features-item text-center rounded bg-light p-4">
                                <div class="features-icon btn-square rounded-circle bg-primary mb-5 mx-auto">
                                    <i class="fas fa-user-shield fa-3x text-white"></i>
                                </div>
                                <div class="features-content text-center">
                                    <h5>Thanh toán bảo mật</h5>
                                    <p class="mb-0">100% bảo mật thanh toán</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="features-item text-center rounded bg-light p-4">
                                <div class="features-icon btn-square rounded-circle bg-primary mb-5 mx-auto">
                                    <i class="fas fa-exchange-alt fa-3x text-white"></i>
                                </div>
                                <div class="features-content text-center">
                                    <h5>30 Ngày hoàn trả</h5>
                                    <p class="mb-0">Đảm bảo hoàn tiền trong 30 ngày</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="features-item text-center rounded bg-light p-4">
                                <div class="features-icon btn-square rounded-circle bg-primary mb-5 mx-auto">
                                    <i class="fa fa-phone-alt fa-3x text-white"></i>
                                </div>
                                <div class="features-content text-center">
                                    <h5>Hỗ trợ 24/7</h5>
                                    <p class="mb-0">Hỗ trợ mọi lúc nhanh chóng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        // <div classNameNameName="home">
        //     <div classNameNameName="books">
        //         {books && books.map(book => (
        //             <BookDetail key={book._id} book={book} />
        //         ))}
        //     </div>
        //     <BookForm />
        // </div>
    );
}

export default Home;