import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdSidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
                    <a href="#customers" className="nav-link text-dark">
                      Giá sách bán
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <a href="#product-specification" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-store me-2"></i> <span>Đơn Hàng</span>
              </a>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <a href="#marketplace" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-cogs me-2"></i> <span>Giảm giá</span>
              </a>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <a href="#pages" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-file-alt me-2"></i> <span>Báo cáo</span>
              </a>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <a href="#blog" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-blog me-2"></i> <span>Blog</span>
              </a>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <a href="#ads" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-truck me-2"></i> <span>Vận chuyển</span>
              </a>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <a href="#payments" className="nav-link text-dark d-flex justify-content-between align-items-center">
                <span className="d-flex align-items-center">
                  <i className="fas fa-credit-card me-2"></i> Thanh toán
                </span>
                <span className="badge bg-primary">11</span>
              </a>
            </li>
            
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <a href="#contact" className="nav-link text-dark d-flex align-items-center">
                <i className="fas  fa-user me-2"></i> <span>Khách hàng</span>
              </a>
            </li>
            
           
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default AdSidebar;
