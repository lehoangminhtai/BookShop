import React from 'react';
import { Link } from 'react-router-dom';

const CustomerSidebar = () => {
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
        <div className="p-4">
          <h1 className="h4 text-primary">Customer</h1>
        </div>
        <nav className="mt-3">
          <ul className="nav flex-column" style={{ padding: '0' }}>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to="/customer/orders" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-box me-2"></i> <span>Orders</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to="/customer/reviews" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-star me-2"></i> <span>Reviews</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to="/customer/orders-return" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-undo me-2"></i> <span>Order Return Requests</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to="/customer/address" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-map-marker-alt me-2"></i> <span>Address</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to="/customer/account-setting" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-cog me-2"></i> <span>Account Setting</span>
              </Link>
            </li>
            <li className="nav-item" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <Link to="/logout" className="nav-link text-dark d-flex align-items-center">
                <i className="fas fa-sign-out-alt me-2"></i> <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default CustomerSidebar;