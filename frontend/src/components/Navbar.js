import { useStateContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
// import '../css/Navbar.scss'
import '../css/bootstrap.min.css'
import '../css/style.css'
const Navbar = () => {

    const navigate = useNavigate()
    const { user, setPage, setUserFormData, initialUserState, initialErrorObj, setErrorObj } = useStateContext()

    const navigateToRegister = () => {
        setPage('register')
        setUserFormData(initialUserState)
        setErrorObj(initialErrorObj)
    }

    const navigateToLogin = () => {
        setPage('login')
        setUserFormData(initialUserState)
        setErrorObj(initialErrorObj)
    }

    return (
        <div className="navbar">
            {
                user ? (
                    <div className="container-fluid fixed-top">

                        <div className="container px-0">
                            <nav className="navbar navbar-light bg-white navbar-expand-xl">
                                <a href="index.html" className="navbar-brand"><h1 className="text-primary display-6">BOOKSHOP</h1></a>


                                <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                                    <span className="fa fa-bars text-primary"></span>
                                </button>
                                <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                                    <div className="navbar-nav mx-auto">
                                        <Link to="/" className="nav-item nav-link active">Trang chủ</Link>
                                        <Link to="/" className="nav-item nav-link">Mua Sách</Link>
                                        <Link to="/" className="nav-item nav-link">Mượn Sách</Link>
                                        <Link to="/" className="nav-item nav-link">Trao đổi sách</Link>

                                        <Link to="/contact" className="nav-item nav-link">Liên lạc</Link>
                                    </div>
                                    <div className="d-flex m-3 me-0">
                                        <button className="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4" data-bs-toggle="modal" data-bs-target="#searchModal"><i className="fas fa-search text-primary"></i></button>
                                        <a href="cart" className="position-relative me-4 my-auto">
                                            <i className="fa fa-shopping-bag fa-2x"></i>
                                            <span
                                                className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                                                style={{ top: '-5px', left: '15px', height: '20px', minWidth: '20px' }}
                                            >
                                                3
                                            </span>

                                        </a>
                                        <a href="home-auth" className="my-auto">
                                            <i className="fas fa-user fa-2x"></i>
                                        </a>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                ) : (
                    <div className="container-fluid fixed-top">

                        <div className="container px-0">
                            <nav className="navbar navbar-light bg-white navbar-expand-xl">
                                <a href="index.html" className="navbar-brand"><h1 className="text-primary display-6">BOOKSHOP</h1></a>


                                <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                                    <span className="fa fa-bars text-primary"></span>
                                </button>
                                <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                                    <div className="navbar-nav mx-auto">
                                        <Link to="/" className="nav-item nav-link active">Trang chủ</Link>
                                        <Link to="/" className="nav-item nav-link">Mua Sách</Link>
                                        <Link to="/" className="nav-item nav-link">Mượn Sách</Link>
                                        <Link to="/" className="nav-item nav-link">Trao đổi sách</Link>

                                        <Link to="/contact" className="nav-item nav-link">Liên lạc</Link>
                                    </div>
                                    <div className="d-flex m-3 me-0">
                                        <button className="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4" data-bs-toggle="modal" data-bs-target="#searchModal"><i className="fas fa-search text-primary"></i></button>
                                        <a href="cart" className="position-relative me-4 my-auto">
                                            <i className="fa fa-shopping-bag fa-2x"></i>
                                            <span
                                                className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                                                style={{ top: '-5px', left: '15px', height: '20px', minWidth: '20px' }}
                                            >
                                                3
                                            </span>

                                        </a>
                                        <a href="home-auth" className="my-auto">
                                            <i className="fas fa-user fa-2x"></i>
                                        </a>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Navbar
