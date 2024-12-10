import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../context/UserContext';
import { useDispatch } from 'react-redux';
import { logout } from '../../actions/UserAction';

const AdSidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { users, setUser } = useStateContext()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logoutFunc = () => {
    dispatch(logout())
    setUser(null)
    navigate('/')
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="d-flex">
      <aside
        className="bg-white text-dark"
        style={{
          width: '250px',
          borderRadius: '10px', // Border radius cho toàn bộ sidebar
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Box shadow cho toàn bộ sidebar
          overflow: 'hidden',
        }}
      >
        <div className="p-4">
          <h1 className="h4 text-primary">Dashboard</h1>
        </div>
        <nav className="mt-3">
          <ul className="nav flex-column" style={{ padding: '0' }}>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to="/admin" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-home me-2"></i> <span>Bảng điều khiển</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0',  // Border radius cho toàn bộ sidebar
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <a
                href="#ecommerce"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown();
                }}
                className="nav-link text-dark d-flex justify-content-between align-items-center"
              >
                <span className="d-flex align-items-center">
                  <i className="fas fa-shopping-cart me-2"></i>Sản Phẩm
                </span>
                <i className={`fas ${dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </a>
              {dropdownOpen && (
                
                <ul className="nav flex-column ms-3" >
                  <li className="nav-item ms-5" style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Link to="/admin/category-book" className="nav-link text-dark">
                      Loại Sách
                    </Link>
                  </li>
                  <li className="nav-item ms-5" style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Link to="/admin/book" className="nav-link text-dark">
                      Sách
                    </Link>
                  </li>
                  <li className="nav-item ms-5" style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Link to={'/admin/book-sale-price'} className="nav-link text-dark">
                      Giá sách bán
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to={'/admin/order'} className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-store me-2"></i> <span>Đơn Hàng</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to={'/admin/discounts'} className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-cogs me-2"></i> <span>Giảm giá</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <a href="#pages" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-file-alt me-2"></i> <span>Báo cáo</span>
              </a>
            </li>
            
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to={'/admin/shipping'} className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-truck me-2"></i> <span>Vận chuyển</span>
              </Link>
            </li>
            
            
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to={"/admin/users"} className="nav-link text-dark d-flex align-items-center">
                <i className="fas  fa-user me-2"></i> <span>Khách hàng</span>
              </Link>
            </li>
            <li className="nav-item" onClick={logoutFunc} style={{ borderBottom: '1px solid #e0e0e0' }}>
            <Link to="/logout" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-sign-out-alt me-2"></i> <span>Đăng xuất</span>
              </Link>
            </li>
           
           
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default AdSidebar;
