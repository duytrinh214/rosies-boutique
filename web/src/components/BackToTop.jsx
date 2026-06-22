import { useState, useEffect } from 'react';

// Floating "scroll to top" control. Appears once the user has scrolled
// past one viewport, fades in at the bottom-right, and smoothly returns
// the page to the top when pressed.
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={'back-to-top' + (visible ? ' is-visible' : '')}
      onClick={toTop}
      aria-label="Back to top"
      type="button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};

export default BackToTop;
