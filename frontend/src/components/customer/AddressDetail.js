import React, { useState, useEffect } from 'react';

const AddressDetail = ({ address, provinces, onEdit, onDelete, onChoose}) => {
    // Định nghĩa state để lưu dữ liệu wards và district
    const [wards, setWards] = useState([]);
    const [districts, setDistricts] = useState([]);

    // Lấy thông tin wards từ API
    const fetchWards = async (districtId) => {
        try {
            const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
            if (response.ok) {
                const data = await response.json();
                if (data.error === 0) {
                    return data.data;
                } else {
                    console.error('Error fetching wards:', data.error);
                    return [];
                }
            } else {
                console.error('HTTP error:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Failed to fetch wards:', error);
            return [];
        }
    };
    const fetchDistricts = async (provinceId) => {
        try {
            const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
            if (response.ok) {
                const data = await response.json();
                if (data.error === 0) {
                    return data.data;
                } else {
                    console.error('Error fetching districts:', data.error);
                    return [];
                }
            } else {
                console.error('HTTP error:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Failed to fetch wards:', error);
            return [];
        }
    };

    
    // Sử dụng useEffect để tải dữ liệu
    useEffect(() => {
        const loadWards = async () => {
            if (address.idDistrict) {
                const wardsData = await fetchWards(address.idDistrict);
                setWards(wardsData);
            }
        };

        const loadDistricts = async () => {
            if (address.idProvince) {
                const districtData = await fetchDistricts(address.idProvince);
                setDistricts(districtData);
            }
        };

        loadWards();
        loadDistricts();
    }, [address.idDistrict, address.idProvince]);

    // Tìm thông tin ward và district từ state
    const wardName = wards.find(w => w.id === address.idWard.toString())?.full_name;
    const districtName = districts.find(d => d.id === address.idDistrict.toString())?.full_name;
    const provinceName = provinces.find(p => p.id === address.idProvince.toString())?.full_name;

    return (
        <div className="card w-100 mb-3 d-flex justify-content-center position-relative">
            {/* Nút Edit và Delete */}
            <div className="position-absolute top-0 end-0 p-2">
                <button onClick={() => onEdit(address,provinces, districts, wards)} className="btn  btn-sm me-2" style={{color: "blue"}}> 
                    <i className="fas fa-pen"></i>
                </button>
                <button onClick={() => onDelete(address._id)} className="btn btn-sm" style={{color: "red"}}>
                    <i className="fas fa-trash-alt"></i>
                </button>
            </div>

            <div className="card-body" onClick={()=> onChoose(address)}>
                <h5 className="card-title">{address.name} {address.isDefault &&(<small>( Mặc định )</small>)}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{address.phone}</h6>
                <p className="card-text">
                    {address.street},
                    {wardName && <span> {wardName},</span>}
                    {districtName && <span> {districtName},</span>}
                    {provinceName && <span> {provinceName}</span>}
                </p>
            </div>
        </div>
    );
};

export default AddressDetail;
