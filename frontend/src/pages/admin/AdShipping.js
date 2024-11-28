import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
// component
import AdSidebar from "../../components/admin/AdSidebar";
import AdShippingForm from "../../components/admin/AdShippingForm";
import AdShippingEdit from "../../components/admin/AdShippingEdit";
// scss
import '../../css/admin/AdShipping.scss'
// service
import { getAllShipping, addProvinceToShipping, updateProvinceShipping, deleteShipping } from "../../services/shippingService";


const AdShipping = () => {
    const [shippings, setShippings] = useState([]);
    const [shipping, setShipping] = useState([]);
    const [shippingData, setShippingData] = useState()
    const [expandedArea, setExpandedArea] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalAddProvince, setShowModalAddProvince] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedProvincesList, setSelectedProvincesList] = useState([]);
    const [errorProvinces, setErrorProvinces] = useState([]);


    const fetchShipping = async () => {
        const response = await getAllShipping();
        if (response.data.success) {
            setShippings(response.data.shippingFees);
        }
    };

    const handleCreateShippingArea = () => {
        setShowModal(true);
    };

   

    const handleShowModalEdit = (shipping) => {
        
        const shippingData = {
            shippingId: shipping._id,
            areaNameE: shipping.areaName,
            shippingFeeE: shipping.shippingFee,
            provincesE: shipping.provinces
        }
        setShippingData(shippingData)
        setShowModalEdit(true);

    }
    const handleShowModalAddProvince = (shipping) => {
        setShowModalAddProvince(true);
        setShipping(shipping)
    }


    const closeModal = () => {
        setShowModal(false);
        fetchShipping();
    };
    const closeModalEdit = () => {
        setShowModalEdit(false);
        fetchShipping();
    };
    const closeModalAddProvince = () => {
        setShowModalAddProvince(false);
        setSelectedProvince('')
        setSelectedProvincesList([])
        fetchShipping();
    };

    // useEffect
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
                const data = await response.json();

                if (data.error === 0) {
                    setProvinces(data.data);
                } else {
                    console.error('Error fetching provinces:', data.error);
                }
            } catch (error) {
                console.error('Failed to fetch provinces:', error);
            }
        };
        fetchShipping();
        fetchProvinces();
    }, []);

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;

        if (provinceId) {
            const selectedProvinceData = provinces.find((province) => province.id === provinceId);

            // Check if the province is already selected
            if (!selectedProvincesList.some((item) => item.id === provinceId)) {
                setSelectedProvincesList((prevList) => [
                    ...prevList,
                    { id: provinceId, name: selectedProvinceData.full_name },
                ]);
            }

            setSelectedProvince(provinceId);

        }
    };

    const handleRemoveProvince = (provinceId) => {
        setSelectedProvincesList((prevList) => prevList.filter((item) => item.id !== provinceId));
        setSelectedProvince('')
    };

    const handleAddProvince = async () => {
        let errors = false
        for (const province of selectedProvincesList) {
            const dataShipping = { provinceId: province.id, provinceName: province.name, shippingFee: shipping.shippingFee, areaName: shipping.areaName }
            const response = await addProvinceToShipping(dataShipping)

            if (response.data.success) {
                handleRemoveProvince(province.id)
                toast.success(response.data.message)
            }
            else {
                toast.error(response.data.message)
                setErrorProvinces((prev) => [...prev, province]);

                errors = true

            }
        }
        if (!errors) {
            setTimeout(() => {
                closeModalAddProvince();
            }, 2000);
        }

    }

    const handleUpdateProvince = async (province) => {
        const shippingData = {
            provinceId: province.id,
            provinceName: province.name,
            newShippingFee: shipping.shippingFee,
            areaName: shipping.areaName
        };

        const response = await updateProvinceShipping(shippingData);

        if (response.data.success) {
            setErrorProvinces((prev) => prev.filter((item) => item.id !== province.id));
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }

    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Hàm toggle chỉ mở/đóng một vùng
    const toggleContent = (shippingId) => {
        setExpandedArea(prevState => prevState === shippingId ? null : shippingId);
    };

    const handleDeleteShipping = async (shippingId) =>{
        try {
            const response = await deleteShipping(shippingId);

            if (response.data.success) {
                
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
            fetchShipping()
        } catch (error) {
            
        }
    }

    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container row">
                <div className="col-md-3 mb-3">
                    <h1 className="h4 mb-3">Chi Phí Vận Chuyển</h1>
                    <p className="text-muted">Phân loại những vùng gần xa cơ sở cửa hàng</p>
                    <button className="mt-3 btn btn-primary w-100" onClick={handleCreateShippingArea}>Thêm Vùng</button>
                </div>
                {shippings && (
                    <div className="col-md-9 ">
                        {shippings.map((shipping) => (
                            <div key={shipping.areaName} className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h2 className="h5 mb-0">{shipping.areaName}</h2>
                                        <div className="d-flex">
                                            <button className="btn btn-info me-2" onClick={(e) => handleShowModalEdit(shipping)}> <i className="fas fa-edit"></i></button>
                                            <button className="btn btn-danger" onClick={(e) => handleDeleteShipping(shipping._id)}><i className="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                                        <div>
                                            <h3 className="h6">Giá vận chuyển</h3>
                                            <p className="text-muted mb-0">
                                                <h4 className="h4 text-danger fw-bold">{formatCurrency(shipping.shippingFee)}</h4>
                                            </p>
                                        </div>
                                        <span
                                            className="btn btn-outline-secondary"
                                            onClick={() => toggleContent(shipping._id)} // Toggle for this specific area
                                        >
                                            {expandedArea === shipping._id ? "Thu gọn " : "Xem thêm "}
                                            <i className={`fas ${expandedArea === shipping._id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                        </span>
                                    </div>
                                    {/* Nội dung hiển thị các ô */}
                                    {expandedArea === shipping._id && (<div>
                                        <button className="btn btn-primary mb-3" onClick={(e) => handleShowModalAddProvince(shipping)}>Thêm Tỉnh / TP</button>
                                        <div className="row">

                                            {shipping.provinces.map((province) => (
                                                <div key={province.provinceId} className="col-6 col-md-4 col-lg-3 mb-3">
                                                    <div className="card text-center p-2 small-card">
                                                        <i
                                                            className="fas fa-location-dot fa-2x mb-2"
                                                            style={{ color: "#007bff" }}
                                                        ></i>
                                                        <h6 className="card-title mb-0">{province.provinceName}</h6>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showModal && (
                <div className="modal-overlay ">
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeModal}>&times;</button>
                        <AdShippingForm onClose={closeModal} />
                        <button className="" onClick={closeModal}>Quay lại</button>
                    </div>
                </div>
            )}
            {showModalAddProvince && (
                <div className="modal-overlay ">
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeModalAddProvince}>&times;</button>
                        <div className="d-flex justify-content-center "></div>
                        <h3 className="h3 text-center">Thêm tỉnh thành</h3>
                        <div className="container">
                            <label className="fw-bold form-label mb-3">
                                Phí vận chuyển <span className="text-danger">{formatCurrency(shipping.shippingFee)}</span>
                            </label>
                            <div className="mb-5">
                                <label className="fw-bold form-label">
                                    Tỉnh/Thành Phố <span className="text-danger">*</span>
                                </label>


                                <select className="form-control" onChange={handleProvinceChange} value={selectedProvince}>
                                    <option value="">Chọn Tỉnh Thành</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>{province.full_name}</option>
                                    ))}
                                </select>

                            </div>
                            {/* Render selected provinces as cards */}
                            <div className="selected-provinces">
                                {selectedProvincesList.map((province) => (
                                    <div key={province.id} className=" d-flex justify-content-between align-items-center mb-3 p-2 border">
                                        <span className="fw-bold" style={{ color: "black" }}>{province.name}</span>
                                        {errorProvinces.some((error) => error.id === province.id) ? (
                                            // Hiển thị nút Update và Cancel nếu gặp lỗi
                                            <div>
                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => handleUpdateProvince(province)}
                                                >
                                                    Cập nhật phí
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemoveProvince(province.id)}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ) : (
                                            // Hiển thị nút Xóa thông thường nếu không gặp lỗi
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveProvince(province.id)}
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-center mb-2">
                                <button className="btn btn-primary" onClick={handleAddProvince}>
                                    Thêm
                                </button>
                            </div>
                        </div>
                        <button className="" onClick={closeModalAddProvince}>Quay lại</button>
                    </div>
                </div>
            )}
            {showModalEdit && (
                <div className="modal-overlay ">
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeModalEdit}>&times;</button>
                        <AdShippingEdit onClose={closeModalEdit} shippingData={shippingData} />
                        <button className="" onClick={closeModalEdit}>Quay lại</button>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default AdShipping;
