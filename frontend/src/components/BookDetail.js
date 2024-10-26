import { useBookContext } from "../hooks/useBookContext";

const BookDetail = ({ book }) => {
  const { dispatch } = useBookContext();

  const handleClick = async () => {
    const response = await fetch("/api/books/" + book._id, {
      method: "DELETE",
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_BOOK", payload: json });
    }
  };

  return (
    <div className="row">

      {/* Hình ảnh sách */}
      {Array.isArray(book.images) ? (
        book.images.map((image, index) => (
          <div key={index} className="col-md-4 col-lg-3 col-xl-3 mb-4">  {/* Sử dụng lớp "col" và "mb-4" để căn hàng và có khoảng cách giữa các phần tử */}
            <div className="rounded position-relative fruite-item">
              <div className="fruite-img" />

              <img
                src={image}
                alt={`Book image ${index + 1}`}
                className="img-fluid w-100 rounded-top"
                style={{ objectFit: 'cover', height: '200px' }}
              />
            </div>
            <div className="text-white bg-secondary px-3 py-1 rounded position-absolute" style={{ top: '10px', left: '10px' }}>
              Fruits
            </div>
            <div className="p-4 border border-secondary border-top-0 rounded-bottom">
              <h4 style={{ fontSize: '16px' }}>{book.title}</h4>  {/* Giảm kích thước tiêu đề */}
              <p><strong>Tác giả:</strong> {book.author}</p>
              <div className="d-flex justify-content-between">
                <p className="text-dark fs-6 fw-bold mb-0">{book.categoryId?.nameCategory}</p>
                <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary">
                  <i className="fa fa-shopping-bag me-2 text-primary"></i> 
                </a>
              </div>
            </div>
          </div>

        ))
      ) : (

        <div class="col-md-6 col-lg-6 col-xl-4">
          <div class="rounded position-relative fruite-item">
            <div class="fruite-img" />

            <img

              src="https://placehold.co/200x300"
              alt={book.title}
              className="img-fluid w-100 rounded-top"

            />

          </div>
          <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style={{ top: '10px', left: '10px' }}>Fruits</div>
          <div class="p-4 border border-secondary border-top-0 rounded-bottom">
            <h4>{book.title}</h4>
            <p><strong>Tác giả:</strong> {book.author}</p>
            <div class="d-flex justify-content-between flex-lg-wrap">
              <p class="text-dark fs-5 fw-bold mb-0"><strong>Danh mục:</strong> {book.categoryId?.nameCategory}</p>
              <a href="#" class="btn border border-secondary rounded-pill px-3 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
            </div>
          </div>
        </div>
      )}

    </div>


  );
};

export default BookDetail;
