import Icon from '../components/Icon';

export const INFO_INK = '#2b1d18';

// ============================================================
// SHARED — page hero (breadcrumb + pill + title + intro)
// ============================================================
export const InfoHero = ({ pill, title, titleItalic, intro }) =>
<section style={{ padding: '64px 56px 24px' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto', padding: '32px 0 40px' }}>
        <span className="pill"><span className="pill-dot"></span>{pill}</span>
        <h1 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1.0, margin: '24px 0 20px', fontWeight: 500, letterSpacing: '-0.025em', color: INFO_INK }}>
          {title} {titleItalic && <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>{titleItalic}</span>}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--ink-soft)', maxWidth: 600, margin: '0 auto', textWrap: 'pretty' }}>
          {intro}
        </p>
      </div>
    </div>
  </section>;


export const InfoBlock = ({ icon, title, body }) =>
<div className="card" style={{ padding: '34px 38px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', background: 'rgba(43,29,24,0.05)', color: 'var(--ink)' }}>
        <Icon name={icon} size={19} stroke={1.5} />
      </span>
      <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: 0, color: INFO_INK }}>{title}</h3>
    </div>
    <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-soft)', margin: 0, textWrap: 'pretty' }}>{body}</p>
  </div>;


export const CheckRow = ({ text, ok }) =>
<div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
    <span style={{ flex: 'none', display: 'inline-flex', color: ok ? '#5a7a4a' : '#b07064' }}>
      {ok ?
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> :
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
    }
    </span>
    <span style={{ fontSize: 15, color: 'var(--ink-soft)' }}>{text}</span>
  </div>;


export const ContactLine = ({ icon, label, value }) =>
<div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
    <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: 'rgba(43,29,24,0.05)', color: 'var(--ink)' }}>
      <Icon name={icon} size={19} stroke={1.5} />
    </span>
    <div>
      <div style={{ fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 16, color: INFO_INK, lineHeight: 1.5 }}>{value}</div>
    </div>
  </div>;


export const Field = ({ label, children }) =>
<label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    <span style={{ fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>{label}</span>
    {children}
  </label>;


export const InfoCTA = ({ navigate }) =>
<section style={{ padding: '0 56px 100px' }}>
    <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, color: 'var(--ink)', marginBottom: 22 }} aria-hidden="true">
        <span style={{ width: 60, height: 1, background: 'currentColor', opacity: 0.4 }}></span>
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
          <rect x="6.5" y="6.5" width="9" height="9" transform="rotate(45 11 11)" />
          <rect x="9.5" y="9.5" width="3" height="3" transform="rotate(45 11 11)" fill="currentColor" stroke="none" />
        </svg>
        <span style={{ width: 60, height: 1, background: 'currentColor', opacity: 0.4 }}></span>
      </div>
      <h3 className="serif" style={{ fontSize: 42, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 26px', color: INFO_INK }}>
        Ready to find a stem to <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>keep?</span>
      </h3>
      <div style={{ display: 'inline-flex', gap: 14 }}>
        <button className="btn btn-primary" onClick={() => navigate('shop')}>Browse the atelier <Icon name="arrow-right" size={16} /></button>
        <button className="btn btn-secondary" onClick={() => navigate('contact')}>Contact us</button>
      </div>
    </div>
  </section>;
