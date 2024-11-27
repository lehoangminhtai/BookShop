import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//component
import AdSidebar from '../../components/admin/AdSidebar';
import AdDiscountForm from '../../components/admin/AdDiscountForm';
import AdEditDiscount from '../../components/admin/AdEditDiscount';
//services
import { getAllDiscount, deleteDiscount } from '../../services/discountService';
import { toast,ToastContainer } from 'react-toastify';

const AdDiscount = () => {
    const [books, setBooks] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [showModal, setShowModal] = useState(false); 
    const [showModalEdit, setShowModalEdit] = useState(false); 
    const [dataDiscount, setDataDiscount] = useState(null)
    const navigate = useNavigate();



    const fetchDiscounts = async () => {
        const response = await getAllDiscount();
        const data = response.data;
        if (data) {
            setDiscounts(data.discounts)
        }

    }    
    useEffect(() => {
        fetchDiscounts();
    }, []);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showModal]);


    const handleCreateDiscount = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        fetchDiscounts();
    };
    const handleEditDiscount = (discount) => {
        const data = { 
            discountId: discount._id,
            discountCodeE: discount.discountCode,
            discountNameE: discount.discountName,
            discountDescriptionE: discount.discountDescription,
            percentE: discount.percent,
            amountE: discount.amount,
            maxAmountDiscountE :discount.maxAmountDiscount,
            minOfTotalPriceE: discount.minOfTotalPrice,
            maxUsageE: discount.maxUsage,
            dateStartE: discount.dateStart,
            dateExpireE: discount.dateExpire,
            discountForE: discount.discountFor,
            discountTypeE: discount.discountType}
            
        setDataDiscount(data)
        
        setShowModalEdit(true);
    };

    const handleDeleteDiscount = async (discountId) =>{
        try{
            const response = await deleteDiscount(discountId);
            if(response.data.success){
                toast.success('Xóa mã giảm thành công')
                fetchDiscounts()
            }
            else{
                toast.error(response.data.message)
            }
        }
        catch(error){
            toast.error('Có lỗi khi kết nối tới server')
        }
    }

    const closeModalEdit = () => {
        setShowModalEdit(false);
        fetchDiscounts();
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container">
                {/* Header actions */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex">
                        <button className="btn btn-secondary me-2">Bulk Actions</button>
                        <button className="btn btn-secondary">Filters</button>
                    </div>
                    <input type="text" placeholder="Search..." className="form-control w-25" />
                    <div className="d-flex">
                        <button className="btn btn-primary ms-2">Export</button>
                        <button className="btn btn-primary ms-2">Import</button>
                        <button className="btn btn-primary ms-2" onClick={handleCreateDiscount}>Create</button>
                    </div>
                </div>

                {/* Book Table */}
                <table className="table ">
                    <thead className="thead-light">
                        <tr>
                            <th>STT</th>
                            <th>Thông Tin</th>
                            <th>Đã Sử Dụng</th>
                            <th>Ngày Bắt Đầu</th>
                            <th>Ngày Kết Thúc</th>

                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {discounts.map((discount, index) => (
                            <tr key={discount._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="bg-primary text-white p-3 rounded">
                                        <span> MÃ GIẢM: <span>{discount.discountCode} </span> <i className="far fa-copy"></i></span>
                                        <br />
                                        <small className="text-warning fst-italic h6">
                                            {discount.discountName}
                                        </small>
                                        <br />
                                        <small>Giảm {discount.discountType === 'percentage' ? discount.percent + `% (tối đa ${formatCurrency(discount.maxAmountDiscount)})` : formatCurrency(discount.amount)} cho 
                                            đơn hàng từ {formatCurrency(discount.minOfTotalPrice)} trở lên</small>

                                    </div>
                                </td>
                                <td className='text-center'>{discount.usedBy.length}</td>
                                <td>{new Date(discount.dateStart).toLocaleString()}</td>
                                <td className={`${discount.dateExpire ? '' :'text-center'}`}>{discount.dateExpire ? new Date(discount.dateExpire).toLocaleString() : '--'}</td>

                                <td>
                                <button className="btn btn-link text-primary" onClick={() => handleEditDiscount(discount)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn btn-link text-danger" onClick={() => handleDeleteDiscount(discount._id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
            
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                        <select className="form-control d-inline w-auto">
                            <option>10</option>
                            <option>20</option>
                            <option>30</option>
                        </select>
                        <span className="ml-2">Show from 1 to 10 in 24 records</span>
                    </div>
                    <div className="btn-group" role="group">
                        <button className="btn btn-secondary">Previous</button>
                        <button className="btn btn-primary">1</button>
                        <button className="btn btn-secondary">2</button>
                        <button className="btn btn-secondary">3</button>
                        <button className="btn btn-secondary">Next</button>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay ">
                        <div className="modal-content">
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                            <AdDiscountForm onClose={closeModal} />
                            <button className="" onClick={closeModal}>Quay lại</button>
                        </div>
                    </div>
                )}
                {showModalEdit && (
                    <div className="modal-overlay ">
                        <div className="modal-content">
                            <button className="close-btn" onClick={closeModalEdit}>&times;</button>
                            <AdEditDiscount onClose={closeModalEdit} discountData = {dataDiscount} />
                            <button className="" onClick={closeModalEdit}>Quay lại</button>
                        </div>
                    </div>
                )}
            </div>
        <ToastContainer/>
        </div>
    );
};

export default AdDiscount;
