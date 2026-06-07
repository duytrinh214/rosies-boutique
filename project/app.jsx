/* global React, ReactDOM, Nav, Footer, HomePage, ShopPage, StoryPage, ProductPage, AccountPage, CartPage, ReviewsPage, LoginPage, AdminLoginPage, AdminPage, ShippingPage, ReturnsPage, FaqPage, ContactPage */
const { useState, useEffect } = React;

const App = () => {
  // hash-routed: #home, #shop, #product/:id, #account, #cart, #reviews, #login, #admin-login, #admin
  const parseHash = () => {
    const raw = window.location.hash.replace(/^#/, '') || 'home';
    const [page, id] = raw.split('/');
    return { page, params: id ? { id } : {} };
  };
  const [route, setRoute] = useState(parseHash());

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (page, params = {}) => {
    const hash = page + (params.id ? '/' + params.id : '');
    window.location.hash = hash;
  };

  // admin routes use a stripped-down chrome (no public nav/footer)
  const isAdminRoute = route.page === 'admin' || route.page === 'admin-login';

  const renderPage = () => {
    switch (route.page) {
      case 'home':return <HomePage navigate={navigate} />;
      case 'shop':return <ShopPage navigate={navigate} params={route.params} />;
      case 'story':return <StoryPage navigate={navigate} />;
      case 'product':return <ProductPage navigate={navigate} params={route.params} />;
      case 'account':return <AccountPage navigate={navigate} />;
      case 'cart':return <CartPage navigate={navigate} />;
      case 'reviews':return <ReviewsPage navigate={navigate} />;
      case 'shipping':return <ShippingPage navigate={navigate} />;
      case 'returns':return <ReturnsPage navigate={navigate} />;
      case 'faq':return <FaqPage navigate={navigate} />;
      case 'contact':return <ContactPage navigate={navigate} />;
      case 'login':return <LoginPage navigate={navigate} />;
      case 'admin-login':return <AdminLoginPage navigate={navigate} />;
      case 'admin':return <AdminPage navigate={navigate} />;
      default:return <HomePage navigate={navigate} />;
    }
  };

  if (isAdminRoute) {
    return <div className="admin-shell">{renderPage()}</div>;
  }

  return (
    <div className="page-bg">
      <Nav current={route.page} navigate={navigate} />
      <div className="header-rule" aria-hidden="true"></div>
      {renderPage()}
      <Footer navigate={navigate} current={route.page} />
    </div>);

};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);