import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import Navbar from './components/Navbar';
import SecureUpload from './pages/Upload';
import Auth from './pages/Auth';
import HomeAuth from './pages/HomeAuth';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path='/'

              element={<Home />}
            />
            <Route
              path='/home-auth'

              element={<HomeAuth />}
            />
            <Route
              path='/auth'

              element={<Auth />}
            />
            <Route
              path='/upload'

              element={<SecureUpload />}
            />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
