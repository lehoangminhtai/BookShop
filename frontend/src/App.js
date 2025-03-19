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
import MyAccount from './components/customer/MyAccount';
import ReviewsList from './components/customer/ReviewsList';
import ListBook from './pages/user/ListBook';
import CategoryListBook from './pages/user/CategoryListBook';
import ShowMoreBook from './pages/user/ShowMoreBook';

import Page404 from './pages/PageNotFound';

//Admin
import Dashboard from './pages/admin/Dashboard';
import AdCategoryBook from './pages/admin/AdCategoryBook';
import AdBook from './pages/admin/AdBook';
import AdBookSale from './pages/admin/AdBookSale';
import BookForm from './components/BookForm';
import AdOrder from './pages/admin/AdOrder';
import AdOrderDetail from './pages/admin/AdOrderDetail';
import AdDiscount from './pages/admin/AdDiscount';
import AdShipping from './pages/admin/AdShipping';
import AdUser from './pages/admin/AdUser';
import AdLog from './pages/admin/AdLog';

// Exchange
import HomeExchange from './pages/exchange/HomeExchange';
import PostExchangeDetail from './pages/exchange/PostExchangeDetail';
import MyPosts from './pages/exchange/MyPost';
import PostSentRequest from './pages/exchange/PostSentRequest';

import AdminRoute from './components/ProtectedRoute';

import AddBookExchange from './pages/exchange/AddBookExchange'

const AdminRoutes = [
  { path: "/admin", element: <Dashboard /> },
  { path: "/admin/category-book", element: <AdCategoryBook /> },
  { path: "/admin/book", element: <AdBook /> },
  { path: "/admin/book/create", element: <BookForm /> },
  { path: "/admin/book-sale-price", element: <AdBookSale /> },
  { path: "/admin/order", element: <AdOrder /> },
  { path: "/admin/order/edit/:orderId", element: <AdOrderDetail /> },
  { path: "/admin/discounts", element: <AdDiscount /> },
  { path: "/admin/shipping", element: <AdShipping /> },
  { path: "/admin/users", element: <AdUser /> },
  { path: "/admin/logs", element: <AdLog /> },
];

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
          <Route path='/payment/success' element={<SuccessPage />}></Route>
          <Route path="/account/orders" element={<CustomerOrders />} />
          <Route path="/account/reviews" element={<ReviewsList />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/search/:query" element={<ListBook />} />
          <Route path="/book-categories/:nameCategory/:categoryId" element={<CategoryListBook />} />
          <Route path="/:type" element={<ShowMoreBook />} />

          {/* exchange book */}
          <Route path='/exchange' element={<HomeExchange />} />
          <Route path='/exchange-post-detail/:bookExchangeId' element={<PostExchangeDetail />} />
          <Route path='/my-post-exchange' element={<MyPosts />} />
          <Route path='/post-request' element={<PostSentRequest />} />

          <Route path="/not-found" element={<Page404 />} />
          <Route path="*" element={<Page404 />} />

          {/* admin */}
          {AdminRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<AdminRoute>{element}</AdminRoute>}
            />
          ))}
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
