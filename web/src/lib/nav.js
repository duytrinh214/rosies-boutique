import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Maps the prototype's `navigate(page, { id })` calls onto real routes, so
// page components ported from the design keep the same call signature.
export const pageToPath = (page, params = {}) => {
  if (page === 'home') return '/';
  if (params && params.id) return `/${page}/${params.id}`;
  return `/${page}`;
};

export const useNav = () => {
  const rrNavigate = useNavigate();
  const location = useLocation();
  const routeParams = useParams();

  const navigate = (page, params = {}) => {
    rrNavigate(pageToPath(page, params));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const segment = location.pathname.split('/')[1];
  const current = segment === '' ? 'home' : segment;

  return { navigate, current, params: routeParams };
};
