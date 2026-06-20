import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import FooterSeam from './components/FooterSeam';
import DiscountPopup from './components/DiscountPopup';
import { useNav } from './lib/nav';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import StoryPage from './pages/StoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ReviewsPage from './pages/ReviewsPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

const SiteChrome = ({ children }) => {
  const { current, navigate } = useNav();
  return (
    <div className="page-bg">
      <Nav current={current} navigate={navigate} />
      <div className="header-rule" aria-hidden="true"></div>
      {children}
      <FooterSeam />
      <Footer navigate={navigate} />
      <DiscountPopup />
    </div>
  );
};

const App = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/admin-login" element={<div className="admin-shell"><AdminLoginPage /></div>} />
      <Route path="/admin" element={<div className="admin-shell"><AdminPage /></div>} />

      <Route path="/" element={<SiteChrome><HomePage /></SiteChrome>} />
      <Route path="/shop" element={<SiteChrome><ShopPage /></SiteChrome>} />
      <Route path="/shop/:id" element={<SiteChrome><ShopPage /></SiteChrome>} />
      <Route path="/story" element={<SiteChrome><StoryPage /></SiteChrome>} />
      <Route path="/product/:id" element={<SiteChrome><ProductPage /></SiteChrome>} />
      <Route path="/cart" element={<SiteChrome><CartPage /></SiteChrome>} />
      <Route path="/bag" element={<SiteChrome><CartPage /></SiteChrome>} />
      <Route path="/order-success" element={<SiteChrome><OrderSuccessPage /></SiteChrome>} />
      <Route path="/reviews" element={<SiteChrome><ReviewsPage /></SiteChrome>} />
      <Route path="/shipping" element={<SiteChrome><ShippingPage /></SiteChrome>} />
      <Route path="/returns" element={<SiteChrome><ReturnsPage /></SiteChrome>} />
      <Route path="/faq" element={<SiteChrome><FaqPage /></SiteChrome>} />
      <Route path="/contact" element={<SiteChrome><ContactPage /></SiteChrome>} />
      <Route path="*" element={<SiteChrome><HomePage /></SiteChrome>} />
    </Routes>
  </>
);

export default App;
