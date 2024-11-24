import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import SecureUpload from './pages/Upload';
import Auth from './pages/Auth';
import HomeAuth from './pages/HomeAuth';
import Footer from './components/Footer';
import ProductDetail from './pages/user/ProductDetail';
import ScrollToTop from './components/ScrollToTop';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import SuccessPage from './pages/user/Success';
import CustomerOrders from './pages/user/Orders';

//Admin
import Dashboard from './pages/admin/Dashboard';
import AdCategoryBook from './pages/admin/AdCategoryBook';
import AdBook from './pages/admin/AdBook';
import AdBookSale from './pages/admin/AdBookSale';
import BookForm from './components/BookForm';
import AdOrder from './pages/admin/AdOrder';
import AdOrderDetail from './pages/admin/AdOrderDetail';
import AdDiscount from './pages/admin/AdDiscount';

function AppContent() {
  const location = useLocation(); // Lấy thông tin về đường dẫn hiện tại

  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <div className="pages">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home-auth' element={<HomeAuth />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/upload' element={<SecureUpload />} />
          <Route path="/chi-tiet/:productId" element={<ProductDetail />} />
         
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path='/payment/success' element={<SuccessPage/>}></Route>
          <Route path="/account/orders" element={<CustomerOrders />} />

            {/* admin */}

          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/category-book" element={<AdCategoryBook />} />
          <Route path="/admin/book" element={<AdBook />} />
          <Route path="/admin/book/create" element={<BookForm/>} />
          <Route path="/admin/book-sale-price" element={<AdBookSale />} />
          <Route path="/admin/order" element={<AdOrder />} />
          <Route path="/admin/order/edit/:orderId" element={<AdOrderDetail />} />
          <Route path="/admin/discounts" element={<AdDiscount />} />
        </Routes>
      </div>
      {location.pathname !== '/checkout' && !isAdminRoute && <Footer />} {/* Chỉ hiển thị Footer khi không phải là trang /checkout */}
      <Routes>
        
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
