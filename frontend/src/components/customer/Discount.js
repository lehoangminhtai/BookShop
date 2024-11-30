import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

//service
import { getDiscountForUser } from "../../services/discountService";

const Discount = ({onClose, totalPrice }) => {
    const navigate = useNavigate()
    const [discounts, setDiscounts] = useState([]);
    const [discountSelected, setDiscountSelected] = useState();
    const [showMore, setShowMore] = useState(false); // Trạng thái để điều khiển hiển thị discount thêm

    useEffect(() => {
        fetchDiscounts();
    }, []);

    useEffect(()=>{
        if(discountSelected){
            onClose(discountSelected);
        }
    },[discountSelected, onClose])

    const fetchDiscounts = async () => {
        try {
            const response = await getDiscountForUser();
            if (response.data.success) {
                setDiscounts(response.data.discounts);
            }
        } catch (error) {
            // Handle error
        }
    };

    const handleBuyMore = () =>{
        document.body.classList.remove("no-scroll");
        navigate('/');
        
    }

    const handleSelectDiscount = (discount) =>{
        if(totalPrice>=discount.minOfTotalPrice){
            setDiscountSelected(discount)
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Hàm để toggle hiển thị "Xem thêm" và "Rút gọn"
    const toggleShowMore = () => {
        setShowMore(prevState => !prevState);
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-center align-items-center">
                <div className="w-100">
                    <h5 className="text-primary text-center h5"><i className="fas fa-gift" style={{ color: "red" }}></i> CHỌN MÃ KHUYẾN MÃI</h5>
                    <div className="card-body">
                        <div className="mb-4">
                            <input type="text" className="form-control text-black" placeholder="Nhập mã khuyến mãi/Quà tặng" />
                            <button className="btn btn-primary w-100 mt-3">Áp dụng</button>
                        </div>

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
                                                <button className="btn btn-primary btn-sm ms-3 text-nowrap" onClick={(e) => handleSelectDiscount(discount)}>Áp dụng</button>
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
