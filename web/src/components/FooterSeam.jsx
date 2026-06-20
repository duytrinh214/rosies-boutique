// =========================================================
// SHARED: TORN EDGE — irregular torn-paper transition
// =========================================================
export const TornEdge = ({ fromColor, toColor, flip = false }) => {
  const path = "M0,18 L48,9 L96,22 L144,5 L192,16 L240,3 L288,20 L336,8 L384,24 L432,6 L480,17 L528,2 L576,21 L624,9 L672,15 L720,4 L768,19 L816,7 L864,23 L912,10 L960,16 L1008,3 L1056,20 L1104,8 L1152,14 L1200,5 L1248,18 L1296,9 L1344,22 L1392,6 L1440,16 L1440,40 L0,40 Z";
  return (
    <div aria-hidden="true" style={{ position: 'relative', lineHeight: 0, background: fromColor, transform: flip ? 'scaleY(-1)' : undefined }}>
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 28 }}>
        <path d={path} fill={toColor} />
      </svg>
    </div>
  );
};

// =========================================================
// SHARED: FLORAL FOOTER BORDER — decorative dried-flower sprigs
// =========================================================
export const FloralFooterBorder = () =>
<svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto' }} aria-hidden="true">
    <g opacity="0.9">
      {/* left sprig cluster */}
      <g transform="translate(70,18)" stroke="#8a6a52" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M0 60 C2 40 8 24 18 8" />
        <path d="M8 28 C2 24 -4 24 -10 30" />
        <path d="M12 18 C18 14 24 15 28 20" />
        <ellipse cx="18" cy="8" rx="7" ry="9" fill="#c98a72" stroke="none" transform="rotate(-18 18 8)" />
        <ellipse cx="-10" cy="30" rx="5" ry="6" fill="#e3b8a0" stroke="none" transform="rotate(40 -10 30)" />
        <ellipse cx="28" cy="20" rx="5" ry="6" fill="#d99e84" stroke="none" transform="rotate(-30 28 20)" />
      </g>
      <g transform="translate(150,30)" stroke="#8a6a52" strokeWidth="1" fill="none" strokeLinecap="round">
        <path d="M0 45 C1 28 5 16 12 4" />
        <circle cx="12" cy="4" r="5" fill="#f0d8c4" stroke="none" />
        <circle cx="12" cy="4" r="2" fill="#c98a72" stroke="none" />
      </g>
      {/* right sprig cluster */}
      <g transform="translate(1370,18) scale(-1,1)" stroke="#8a6a52" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M0 60 C2 40 8 24 18 8" />
        <path d="M8 28 C2 24 -4 24 -10 30" />
        <path d="M12 18 C18 14 24 15 28 20" />
        <ellipse cx="18" cy="8" rx="7" ry="9" fill="#c98a72" stroke="none" transform="rotate(-18 18 8)" />
        <ellipse cx="-10" cy="30" rx="5" ry="6" fill="#e3b8a0" stroke="none" transform="rotate(40 -10 30)" />
        <ellipse cx="28" cy="20" rx="5" ry="6" fill="#d99e84" stroke="none" transform="rotate(-30 28 20)" />
      </g>
      <g transform="translate(1290,30) scale(-1,1)" stroke="#8a6a52" strokeWidth="1" fill="none" strokeLinecap="round">
        <path d="M0 45 C1 28 5 16 12 4" />
        <circle cx="12" cy="4" r="5" fill="#f0d8c4" stroke="none" />
        <circle cx="12" cy="4" r="2" fill="#c98a72" stroke="none" />
      </g>
      {/* small scattered leaves along the line */}
      <g fill="#a8c89a" stroke="none" opacity="0.7">
        <ellipse cx="400" cy="55" rx="6" ry="3" transform="rotate(20 400 55)" />
        <ellipse cx="650" cy="62" rx="5" ry="2.5" transform="rotate(-15 650 62)" />
        <ellipse cx="900" cy="50" rx="6" ry="3" transform="rotate(35 900 50)" />
        <ellipse cx="1080" cy="60" rx="5" ry="2.5" transform="rotate(-10 1080 60)" />
      </g>
    </g>
  </svg>;

// =========================================================
// SHARED: FOOTER SEAM — torn edge + floral sprigs, used right
// before <Footer/> on every page so the transition is consistent
// site-wide. fromColor should match whatever background colour
// the page content ends on (defaults to the standard page pink).
// =========================================================
const FooterSeam = ({ fromColor = 'var(--bg-pink)' }) =>
<div style={{ position: 'relative', background: fromColor }} aria-hidden="true">
    <TornEdge fromColor={fromColor} toColor="var(--ink)" />
    <div style={{ position: 'absolute', left: 0, right: 0, top: -6, pointerEvents: 'none' }}>
      <FloralFooterBorder />
    </div>
  </div>;

export default FooterSeam;
