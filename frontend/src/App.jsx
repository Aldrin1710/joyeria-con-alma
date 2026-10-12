import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/login';
import Admin from './pages/admin';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/login-joyeria" element={<Login />} />
          <Route path="/admin-panel" element={<Admin />} />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}