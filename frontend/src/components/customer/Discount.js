import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

//service
import { getDiscountForUser } from "../../services/discountService";
//user
import { useStateContext } from "../../context/UserContext";
const Discount = ({ onClose, totalPrice, selectedDiscount }) => {
    const { user } = useStateContext();
    const navigate = useNavigate();
    const [discounts, setDiscounts] = useState([]);
    const [discountSelected, setDiscountSelected] = useState();
    const [discountSelectedProp, setDiscountSelectedProp] = useState(selectedDiscount);
    const [showMore, setShowMore] = useState(false); // Trạng thái để điều khiển hiển thị discount thêm
    
    useEffect(() => {
        fetchDiscounts();
    }, []);

    useEffect(() => {
        if (discountSelected) {
            onClose(discountSelected);
        }
       
    }, [discountSelected, onClose]);

    const fetchDiscounts = async () => {
        try {
            const userId = user._id;
            const data = { userId };
            const response = await getDiscountForUser(data);
            if (response.data.success) {
                setDiscounts(response.data.discounts);
            }
        } catch (error) {
            // Handle error
        }
    };

    const handleBuyMore = () => {
        localStorage.removeItem('discount');
        document.body.classList.remove("no-scroll");
        navigate('/');
    }

    const handleSelectDiscount = (discount) => {
        if (totalPrice >= discount.minOfTotalPrice) {
            setDiscountSelected(discount); // Chọn discount
            localStorage.setItem('discount', JSON.stringify(discount));
        }
    }

    const handleDeselectDiscount = () => {
        setDiscountSelected(null); // Bỏ chọn discount
        setDiscountSelectedProp(null)
        localStorage.removeItem('discount');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const toggleShowMore = () => {
        setShowMore(prevState => !prevState);
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-center align-items-center">
                <div className="w-100">
                    <h5 className="text-primary text-center h5"><i className="fas fa-gift" style={{ color: "red" }}></i> CHỌN MÃ KHUYẾN MÃI</h5>
                    <div className="card-body">
                        

                        <div>
                            <h3 className="h5 mb-3">Mã giảm giá</h3>
                            {discounts && (
                                discounts.slice(0, showMore ? discounts.length : 2).map((discount, index) => (
                                    <div key={index} className="bg-light p-3 mb-3 rounded">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-info text-white p-2 rounded-circle">
                                                <i className="fas fa-gift"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h4 className="h6">{discount.discountName}</h4>
                                                <p className="text-muted">
                                                    Giảm {discount.discountType === 'percentage' ? discount.percent + `% (tối đa ${formatCurrency(discount.maxAmountDiscount)})` : formatCurrency(discount.amount)} cho đơn hàng từ {formatCurrency(discount.minOfTotalPrice)} trở lên
                                                </p>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end align-items-center">
                                            {totalPrice < discount.minOfTotalPrice && (
                                                <div className="w-100 bg-secondary rounded mb-2" style={{ height: '10px' }}>
                                                    <div className="bg-primary" style={{ width: `${(totalPrice / discount.minOfTotalPrice) * 100}%`, height: '100%' }}></div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <small>Mua thêm {formatCurrency(discount.minOfTotalPrice - totalPrice)} để nhận mã khuyến mãi</small>
                                                        <small className="ms-3">{formatCurrency(discount.minOfTotalPrice)}</small>
                                                    </div>
                                                </div>
                                            )}
                                            {totalPrice >= discount.minOfTotalPrice ? (
                                                discountSelectedProp?.discountCode === discount.discountCode ? (
                                                    <button className="btn btn-secondary" onClick={handleDeselectDiscount}>Bỏ Chọn</button>
                                                ) : (
                                                    <button className="btn btn-primary btn-sm ms-3 text-nowrap" onClick={() => handleSelectDiscount(discount)}>Áp dụng</button>
                                                )
                                            ) : (
                                                <button className="btn btn-primary btn-sm ms-3 text-nowrap" onClick={handleBuyMore}>Mua Thêm</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}

                            <div className="text-center">
                                <button
                                    className="btn btn-link text-primary"
                                    onClick={toggleShowMore}
                                >
                                    {showMore ? "Rút gọn" : "Xem thêm"} <i className={`fas fa-chevron-${showMore ? "up" : "down"}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Discount;
