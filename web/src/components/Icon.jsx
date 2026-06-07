// Inline SVG icon set ported from the design prototype's Icon component.
const Icon = ({ name, size = 20, stroke = 1.6 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case 'bag': return <svg {...props}><path d="M5 7h14l-1 13H6L5 7z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" /></svg>;
    case 'user': return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>;
    case 'arrow-right': return <svg {...props}><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></svg>;
    case 'arrow-left': return <svg {...props}><path d="M19 12H5" /><path d="m11 19-7-7 7-7" /></svg>;
    case 'heart': return <svg {...props}><path d="M12 21s-7-4.5-9.5-9.5C.8 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.2 4 4.5 7.5C19 16.5 12 21 12 21z" /></svg>;
    case 'heart-fill': return <svg {...props} fill="currentColor"><path d="M12 21s-7-4.5-9.5-9.5C.8 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.2 4 4.5 7.5C19 16.5 12 21 12 21z" /></svg>;
    case 'star': return <svg {...props} fill="currentColor"><path d="m12 2 3 7 7 .8-5.2 4.8 1.5 7.4L12 18l-6.3 4 1.5-7.4L2 9.8 9 9z" /></svg>;
    case 'star-empty': return <svg {...props}><path d="m12 2 3 7 7 .8-5.2 4.8 1.5 7.4L12 18l-6.3 4 1.5-7.4L2 9.8 9 9z" /></svg>;
    case 'check': return <svg {...props}><path d="M4 12l5 5L20 7" /></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
    case 'minus': return <svg {...props}><path d="M5 12h14" /></svg>;
    case 'truck': return <svg {...props}><path d="M3 16V6a1 1 0 0 1 1-1h11v11" /><path d="M15 9h5l2 4v3h-2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>;
    case 'leaf': return <svg {...props}><path d="M11 20s8-2 10-10c0 0-7-2-10 3-2 3-2 7 0 7z" /><path d="M11 20c-3-3-3-7 0-10" /></svg>;
    case 'sparkle': return <svg {...props}><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /></svg>;
    case 'shield': return <svg {...props}><path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z" /></svg>;
    case 'chevron-right': return <svg {...props}><path d="m9 6 6 6-6 6" /></svg>;
    case 'chevron-down': return <svg {...props}><path d="m6 9 6 6 6-6" /></svg>;
    case 'clock': return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'map-pin': return <svg {...props}><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case 'phone': return <svg {...props}><path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>;
    case 'mail': return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case 'google': return <svg width={size} height={size} viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z" /><path fill="#34A853" d="M12 22c2.8 0 5.1-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7C4.5 19.7 8 22 12 22z" /><path fill="#FBBC05" d="M6.2 13.6c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V6.9H2.7C2 8.4 1.6 10.2 1.6 12s.4 3.6 1.1 5.1l3.5-2.7z" /><path fill="#EA4335" d="M12 5.4c1.5 0 2.9.5 3.9 1.5l3-3C17 2.2 14.7 1.3 12 1.3 8 1.3 4.5 3.6 2.7 6.9l3.5 2.7C7 7.2 9.3 5.4 12 5.4z" /></svg>;
    case 'instagram': return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" /></svg>;
    case 'facebook': return <svg {...props}><path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3V3z" /></svg>;
    case 'tiktok': return <svg {...props}><path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 4c.5 2.5 2.5 4.5 5 5" /></svg>;
    default: return null;
  }
};

export default Icon;
