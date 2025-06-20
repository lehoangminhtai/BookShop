import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../context/UserContext';
import { useDispatch } from 'react-redux';
import { logout } from '../../actions/UserAction';
import ConfirmDialog from '../customer/BookExchange/ConfirmDialog';
const CustomerSidebar = () => {

  const { users, setUser } = useStateContext()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showConfirm, setShowConfirm] = useState(false);
  const logoutFunc = () => {
    setShowConfirm(true); // Hiển thị dialog khi bấm logout
  };

  const handleLogoutConfirmed = () => {
    dispatch(logout());
    setUser(null);
    navigate('/');
  };

  return (
    <div className="d-flex">
      <aside
        className="bg-white text-dark"
        style={{
          width: '200px',
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <div className="p-4">
          <h1 className="h4 text-primary">Thông Tin</h1>
        </div>
        <nav className="mt-3">
          <ul className="nav flex-column" style={{ padding: '0' }}>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to="/account" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-cog me-2"></i> <span>Tài khoản của tôi</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to="/account/orders" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-box me-2"></i> <span>Đơn hàng</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to="/account/reviews" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-star me-2"></i> <span>Đánh giá</span>
              </Link>
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

export default CustomerSidebar;