import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStateContext } from '../../context/UserContext';
import { useDispatch } from 'react-redux';
import { logout } from '../../actions/UserAction';
import ConfirmDialog from '../customer/BookExchange/ConfirmDialog';
const AdSidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);


  const { user, setUser } = useStateContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [showConfirm, setShowConfirm] = useState(false);

  const logoutFunc = () => {
    setShowConfirm(true); // Hiển thị dialog khi bấm logout
  };

  const handleLogoutConfirmed = () => {
    dispatch(logout());
    setUser(null);
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const toggleExchangeDropdown = () => setExchangeOpen(!exchangeOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex">
      <aside
        className="bg-white text-dark"
        style={{
          width: '250px',
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <div className="p-4 text-center border rounded shadow-sm bg-light">
          <h3 className="h3 text-primary d-flex align-items-center justify-content-center gap-2">
            BookShop
          </h3>
          <hr />
          <div className="d-flex flex-column align-items-center">
            <img
              src={user?.image || 'https://via.placeholder.com/100'}
              className="rounded-circle mb-3 border border-primary shadow-sm mt-1"
              alt="User Avatar"
              style={{ height: '70px', width: '70px', objectFit: 'cover' }}
            />
            <h4 className="text-primary">{user?.fullName || 'Anonymous User'}</h4>
            <p className="text-muted small">
              <i className="bi bi-envelope me-1"></i>{user?.email || 'No email provided'}
            </p>
          </div>
        </div>

        <nav className="mt-3">
          <ul className="nav flex-column" style={{ padding: '0' }}>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'bg-primary text-white' : 'text-dark'} d-flex align-items-center`}
              >
                <i className="fas fa-home me-2"></i> <span>Bảng điều khiển</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown();
                }}
                className={`nav-link d-flex justify-content-between align-items-center text-dark`}
              >
                <span className="d-flex align-items-center">
                  <i className="fas fa-shopping-cart me-2"></i>Sản Phẩm</span>
                <i className={`fas ${dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </Link>
              {dropdownOpen && (
                <ul className="nav flex-column ms-3"

                >
                  <li className="nav-item ms-3" style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Link
                      to="/admin/category-book"
                      className={`nav-link ${isActive('/admin/category-book') ? 'bg-primary text-white' : 'text-dark'}`}
                      onClick={(e) => {

                        e.stopPropagation()
                      }}
                    >
                      Loại Sách
                    </Link>
                  </li>
                  <li className="nav-item ms-3" style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Link
                      to="/admin/book"
                      className={`nav-link ${isActive('/admin/book') ? 'bg-primary text-white' : 'text-dark'}`}
                    >
                      Sách
                    </Link>
                  </li>
                  <li className="nav-item ms-3" style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Link
                      to="/admin/book-sale-price"
                      className={`nav-link ${isActive('/admin/book-sale-price') ? 'bg-primary text-white' : 'text-dark'}`}
                    >
                      Giá sách bán
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link
                to="/admin/order"
                className={`nav-link ${isActive('/admin/order') ? 'bg-primary text-white' : 'text-dark'} d-flex align-items-center`}
              >
                <i className="fas fa-store me-2"></i> <span>Đơn Hàng</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link
                to="/admin/discounts"
                className={`nav-link ${isActive('/admin/discounts') ? 'bg-primary text-white' : 'text-dark'} d-flex align-items-center`}
              >
                <i className="fas fa-cogs me-2"></i> <span>Giảm giá</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link
                to="/admin/shipping"
                className={`nav-link ${isActive('/admin/shipping') ? 'bg-primary text-white' : 'text-dark'} d-flex align-items-center`}
              >
                <i className="fas fa-truck me-2"></i> <span>Vận chuyển</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link
                to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'bg-primary text-white' : 'text-dark'} d-flex align-items-center`}
              >
                <i className="fas fa-user me-2"></i> <span>Người dùng</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link
                to="/admin/logs"
                className={`nav-link ${isActive('/admin/logs') ? 'bg-primary text-white' : 'text-dark'} d-flex align-items-center`}
              >
                <i className="fas fa-history me-2"></i>
                <span>Kiểm tra Log</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  toggleExchangeDropdown();
                }}
                className="nav-link d-flex justify-content-between align-items-center text-dark"
              >
                <span className="d-flex align-items-center">
                  <i className="fas fa-exchange-alt me-2"></i>Trao đổi sách
                </span>
                <i className={`fas ${exchangeOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </Link>

              {exchangeOpen && (
                <ul className="nav flex-column ms-3">
                  <li className="nav-item ms-3" style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Link
                      to="/admin/exchange-books"
                      className={`nav-link ${isActive('/admin/exchange-books') ? 'bg-primary text-white' : 'text-dark'}`}
                    >
                      Danh sách bài đăng
                    </Link>
                  </li>
                  <li className="nav-item ms-3" style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Link
                      to="/admin/exchange-requests"
                      className={`nav-link ${isActive('/admin/exchange-requests') ? 'bg-primary text-white' : 'text-dark'}`}
                    >
                      Danh sách giao dịch
                    </Link>
                  </li>
                  <li className="nav-item ms-3" style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Link
                      to="/admin/reports"
                      className={`nav-link ${isActive('/admin/exchange-status') ? 'bg-primary text-white' : 'text-dark'}`}
                    >
                      Tố cáo
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  logoutFunc();
                }}
                className="nav-link text-dark d-flex align-items-center"
              >
                <i className="fas fa-sign-out-alt me-2"></i> <span>Đăng xuất</span>
              </Link>
            </li>

          </ul>
        </nav>
      </aside>
      {showConfirm && (
        <ConfirmDialog
          handleClose={() => setShowConfirm(false)}
          content="Bạn có chắc chắn muốn đăng xuất không?"
          onConfirm={handleLogoutConfirmed}
        />
      )}

    </div>

  );
};

export default AdSidebar;