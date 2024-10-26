import { useEffect } from "react";
import { useBookContext } from "../hooks/useBookContext";
import { fetchBook } from "../services/bookService";

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

    return (
        <div >
            <div className="container-fluid py-5 mb-5 hero-header">
                <div className="container py-5">
                    <div className="row g-5 align-items-center">
                        <div className="col-md-12 col-lg-7">
                            <h4 className="mb-3 text-secondary">Book Enviroment</h4>
                            <h1 className="mb-5 display-3 text-primary">Sale & Borrow Books</h1>
                            <div className="position-relative mx-auto">
                                <input className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill" type="number" placeholder="Search" />
                                <button
                                    type="submit"
                                    className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
                                    style={{ top: '0', right: '25%' }}
                                >
                                    Submit Now
                                </button>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-5">
                            <div id="carouselId" className="carousel slide position-relative" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active rounded">
                                        <img src="https://i.pinimg.com/control/474x/b7/45/59/b74559537f4ea86ef4f6e79a732263ed.jpg" className="img-fluid w-100 h-100 bg-secondary rounded" alt="First slide" />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Fruites</a>
                                    </div>
                                    <div className="carousel-item rounded">
                                        <img src="https://i.pinimg.com/control/474x/57/cf/2f/57cf2f93ff49e1725fcc31af7ee0b77a.jpg" className="img-fluid w-100 h-100 rounded" alt="Second slide" />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Vesitables</a>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselId" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselId" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {books && books.map(book => (
                    <BookDetail key={book._id} book={book} />
                ))}
                <BookForm />
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