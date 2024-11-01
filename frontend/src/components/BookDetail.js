import { useBookContext } from "../hooks/useBookContext";
import { useNavigate } from 'react-router-dom';

const BookDetail = ({ book }) => {
  const { dispatch } = useBookContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    const response = await fetch("/api/books/" + book._id, {
      method: "DELETE",
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_BOOK", payload: json });
    }
  };

  const handleProductClick = (id) => {
    navigate(`/chi-tiet/${id}`);  // Chuyển hướng với ID của sách
  };

  const handleAddToCart = () => {
    alert('add to cart');
  };

  return (
    <div className="tw-w-full tw-max-w-sm tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow tw-dark:bg-gray-800 tw-dark:border-gray-700" onClick={() => handleProductClick(book._id)}>
      <div>
        <img
          src={book.images}  // Đảm bảo rằng book.images chứa đường dẫn đúng đến hình ảnh
          alt={`Book image`}
          className="tw-w-full tw-rounded-lg"  // Sử dụng tw-rounded-lg để có border radius cho tất cả các góc
          style={{ objectFit: 'cover', height: '200px' }}
        />
      </div>
      <div className="tw-px-5 tw-pb-5">
        <h5 className="tw-text-xl tw-font-semibold tw-tracking-tight tw-text-gray-900 tw-dark:text-white">
          {book.title}
        </h5>
        <p><strong>Tác giả:</strong> {book.author}</p>
        <div className="tw-flex tw-items-center tw-mt-2.5 tw-mb-5"></div>
        <div className="tw-flex tw-items-center tw-justify-between">
          <span className="tw-text-3xl tw-font-bold tw-text-gray-900 tw-dark:text-white">$599</span>
          <button
            className="tw-text-white tw-bg-blue-700 tw-hover:bg-blue-800 tw-focus:ring-4 tw-focus:outline-none tw-focus:ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-dark:bg-blue-600 tw-dark:hover:bg-blue-700 tw-dark:focus:ring-blue-800"
            onClick={(event) => {
              event.preventDefault(); // Ngăn không cho chuyển hướng mặc định của thẻ a
              event.stopPropagation(); // Ngăn sự kiện lan truyền lên div cha
              handleAddToCart();
            }}
          >
            <i className="fa fa-shopping-cart" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
