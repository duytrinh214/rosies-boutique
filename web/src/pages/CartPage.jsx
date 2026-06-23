import { useState, useEffect, useRef, Fragment } from 'react';
import { useNav } from '../lib/nav';
import Icon from '../components/Icon';
import { useCart } from '../lib/stores';
import { FALLBACK_BG } from '../lib/products';

const DELIVERY_LABELS = {
  standard: 'Standard delivery · 2–4 business days',
  express: 'Express delivery · next-day before 2pm' };

// =========================================================
// CART / CHECKOUT
// =========================================================
const CartPage = () => {
  const { navigate } = useNav();
  const cart = useCart();
  const [step, setStep] = useState('cart'); // cart → shipping → done
  const [shipping, setShipping] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', unit: '', suburb: '', state: '', postcode: '', instructions: '', method: 'standard' });
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState('');
  const [order, setOrder] = useState(null);
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [discountBusy, setDiscountBusy] = useState(false);

  const applyDiscount = async (e) => {
    if (e) e.preventDefault();
    if (!discountInput.trim()) return;
    // Guard: only 1 code per cart
    if (appliedDiscount) {
      setDiscountError('Only one discount code can be applied per order.');
      return;
    }
    setDiscountBusy(true);
    setDiscountError('');
    try {
      const res = await fetch('/api/validate-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountInput.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!data.valid) {
        setDiscountError(data.error || 'That code isn\'t recognised or has already been used.');
        setAppliedDiscount(null);
      } else {
        setAppliedDiscount({ code: data.code, percent: data.percent });
        setDiscountError('');
        setDiscountInput('');
      }
    } catch {
      setDiscountError('Could not validate code — please try again.');
    } finally {
      setDiscountBusy(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError('');
  };

  const subtotal = cart.total;
  const discountAmount = appliedDiscount ? 10 : 0; // flat $10 off
  const taxBase = Math.max(0, subtotal - discountAmount);
  const shippingCost = shipping.method === 'express' ? 12 : 0;
  const total = taxBase + shippingCost;

  return (
    <div className="page-fade">
      <section style={{ padding: '64px 56px 90px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>

          {step !== 'done' &&
          <>
              <h1 className="serif" style={{ fontSize: 64, fontWeight: 500, margin: '12px 0 36px', letterSpacing: '-0.02em' }}>
                Your <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>bag.</span>
              </h1>
              <Stepper step={step} setStep={setStep} />
            </>
          }

          {step === 'done' ?
          <ConfirmedView navigate={navigate} order={order} /> :

          <div className="g-stack" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, marginTop: 32 }}>
              {/* LEFT */}
              <div>
                {step === 'cart' && <CartItems cart={cart} navigate={navigate} />}
                {step === 'shipping' && <ShippingForm shipping={shipping} setShipping={setShipping} />}
              </div>

              {/* RIGHT — summary */}
              <aside>
                <div className="card" style={{ padding: 28, position: 'sticky', top: 24 }}>
                  <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 20px' }}>Order summary</h3>
                  <div style={{ display: 'grid', gap: 14, marginBottom: 18, maxHeight: 220, overflowY: 'auto' }}>
                    {cart.items.map((it) =>
                  <div key={it.key} style={{ display: 'flex', gap: 12 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', background: FALLBACK_BG, flexShrink: 0 }}>
                          <img src={/^https?:\/\//.test(it.img) ? it.img : '/' + it.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {e.target.style.display = 'none';}} />
                        </div>
                        <div style={{ flex: 1, fontSize: 13.5 }}>
                          <div style={{ fontWeight: 500 }}>{it.name}</div>
                          <div className="muted" style={{ fontSize: 12 }}>{it.size} · Qty {it.qty}</div>
                        </div>
                        <div className="serif" style={{ fontWeight: 600 }}>${it.price * it.qty}</div>
                      </div>
                  )}
                  </div>
                  <hr className="divider" />
                  <SummaryRow label="Subtotal" value={`$${subtotal}`} />
                  {appliedDiscount &&
                <SummaryRow label={`Discount · ${appliedDiscount.code}`} value={`−$${discountAmount}`} accent />
                }
                  {step === 'cart' ?
                <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--muted)' }}>Shipping calculated at checkout</div> :

                <>
                      <SummaryRow label={`Shipping (${shipping.method})`} value={shippingCost === 0 ? 'Free' : `$${shippingCost}`} />
                      <hr className="divider" />
                      <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold large />
                    </>
                }

                  {step === 'payment' &&
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--hairline)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>Deliver to</span>
                        <button onClick={() => setStep('shipping')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12.5, color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}>Edit</button>
                      </div>
                      <div style={{ display: 'grid', gap: 7, fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                        <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                          {(shipping.firstName || shipping.lastName) ? `${shipping.firstName} ${shipping.lastName}`.trim() : <span className="muted" style={{ fontWeight: 400, fontStyle: 'italic' }}>No name added</span>}
                        </div>
                        {(shipping.address || shipping.suburb) ?
                      <div>
                            {shipping.unit && `${shipping.unit}, `}{shipping.address}<br />
                            {[shipping.suburb, shipping.state, shipping.postcode].filter(Boolean).join(' ')}
                          </div> :
                      <div className="muted" style={{ fontStyle: 'italic' }}>No address added</div>
                      }
                        {shipping.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="phone" size={13} /> {shipping.phone}</div>}
                        {shipping.email && <div style={{ display: 'flex', alignItems: 'center', gap: 7, wordBreak: 'break-all' }}><Icon name="mail" size={13} /> {shipping.email}</div>}
                        {shipping.instructions &&
                      <div style={{ marginTop: 4, padding: '8px 12px', background: 'var(--bg-pill)', borderRadius: 9, fontSize: 12.5, fontStyle: 'italic' }}>
                            “{shipping.instructions}”
                          </div>
                      }
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3, fontSize: 12.5, color: 'var(--muted)' }}>
                          <Icon name="truck" size={14} /> {DELIVERY_LABELS[shipping.method] || shipping.method}
                        </div>
                      </div>
                    </div>
                }

                  {step === 'cart' &&
                <div style={{ marginTop: 18 }}>
                      {appliedDiscount ?
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--bg-pill)', border: '1px solid var(--hairline-strong)', borderRadius: 10 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--ink)', color: '#fff' }}>
                            <Icon name="check" size={13} />
                          </span>
                          <div style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--ink)' }}>{appliedDiscount.code}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>$10 off applied</div>
                          </div>
                          <button onClick={removeDiscount} aria-label="Remove code"
                      style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 4, display: 'inline-flex' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M6 18L18 6" /></svg>
                          </button>
                        </div> :

                  <form onSubmit={applyDiscount}>
                          <label style={{ fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
                            Discount code
                          </label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input
                        type="text"
                        value={discountInput}
                        onChange={(e) => {setDiscountInput(e.target.value);setDiscountError('');}}
                        placeholder="ROSIE-XXXXX"
                        autoComplete="off"
                        style={{
                          flex: 1, minWidth: 0, padding: '11px 14px', border: '1px solid var(--hairline-strong)',
                          borderRadius: 10, background: '#fff', fontSize: 13.5,
                          fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', color: 'var(--ink)',
                          textTransform: 'uppercase'
                        }} />

                            <button type="submit" className="btn btn-secondary" style={{ padding: '11px 18px', fontSize: 13 }} disabled={discountBusy}>
                              {discountBusy ? '...' : 'Apply'}
                            </button>
                          </div>
                          {discountError &&
                    <div style={{ marginTop: 8, fontSize: 12.5, color: '#a8463b', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16v0" /></svg>
                              {discountError}
                            </div>
                    }
                          <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--muted)', letterSpacing: '0.01em' }}>
                            Have a welcome code from our newsletter? Paste it here.
                          </div>
                        </form>
                  }
                    </div>
                }

                  <div style={{ marginTop: 18 }}>
                    {step === 'cart' && <button className="btn btn-primary btn-block" onClick={() => setStep('shipping')}>Continue to shipping <Icon name="arrow-right" size={16} /></button>}
                    {step === 'shipping' &&
                  <Fragment>
                        {payError &&
                    <div style={{ marginBottom: 12, padding: '11px 14px', background: '#fbeae5', border: '1px solid #f0c9bf', borderRadius: 10, fontSize: 13, color: '#a8463b', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16v0" /></svg>
                            {payError}
                          </div>
                    }
                        <button className="btn btn-primary btn-block" disabled={processing} style={processing ? { opacity: 0.75, cursor: 'wait' } : undefined} onClick={async () => {
                      setPayError(''); setProcessing(true);
                      try {
                        const res = await fetch('/api/create-checkout-session', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            items: cart.items,
                            shipping,
                            discountCode: appliedDiscount?.code || null,
                            discountAmount: discountAmount || 0,
                          }),
                        });
                        const data = await res.json();
                        if (!res.ok || !data.url) throw new Error(data.error || 'Could not create checkout session');
                        // Discount code will be marked as used automatically by Stripe webhook
                        window.location.href = data.url;
                      } catch (err) {
                        setPayError(err.message || 'Payment failed. Please try again.');
                        setProcessing(false);
                      }
                    }}>
                          {processing ?
                      <Fragment><span className="spinner" /> Redirecting to payment…</Fragment> :
                      <Fragment>Continue to payment <Icon name="arrow-right" size={16} /></Fragment>
                      }
                        </button>
                        <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--muted)', textAlign: 'center' }}>You'll be taken to Stripe's secure checkout to complete payment.</div>
                      </Fragment>
                  }
                  </div>

                  {/* Promo */}
                  {step === 'cart' &&
                <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-pill)', borderRadius: 12, fontSize: 13, color: 'var(--ink-soft)' }}>
                      <strong style={{ color: 'var(--ink)' }}>Sweet —</strong> add ${Math.max(0, 80 - cart.total)} more for free shipping.
                    </div>
                }
                </div>
              </aside>
            </div>
          }
        </div>
      </section>
    </div>);

};

const Stepper = ({ step, setStep }) => {
  const steps = [
  { id: 'cart', label: 'Bag' },
  { id: 'shipping', label: 'Shipping' }];

  const idx = steps.findIndex((s) => s.id === step);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
      {steps.map((s, i) =>
      <Fragment key={s.id}>
          <button onClick={() => i <= idx && setStep(s.id)} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 9999,
          background: i === idx ? 'var(--ink)' : 'transparent',
          color: i === idx ? '#fff' : i < idx ? 'var(--ink)' : 'var(--muted)',
          border: 'none', cursor: i <= idx ? 'pointer' : 'default',
          fontSize: 14, fontFamily: 'inherit'
        }}>
            <span style={{
            width: 24, height: 24, borderRadius: '50%',
            background: i === idx ? '#fff' : i < idx ? 'var(--ink)' : 'transparent',
            color: i === idx ? 'var(--ink)' : i < idx ? '#fff' : 'var(--muted)',
            border: i > idx ? '1px solid var(--hairline-strong)' : 'none',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600
          }}>{i < idx ? <Icon name="check" size={12} /> : i + 1}</span>
            {s.label}
          </button>
          {i < steps.length - 1 && <div style={{ flex: '0 0 24px', height: 1, background: 'var(--hairline-strong)' }}></div>}
        </Fragment>
      )}
    </div>);

};

const CartItems = ({ cart, navigate }) => {
  if (cart.items.length === 0) {
    return (
      <div className="card" style={{ padding: 56, textAlign: 'center' }}>
        <div className="serif" style={{ fontSize: 28, fontWeight: 500, marginBottom: 8 }}>Your bag is empty</div>
        <p className="muted" style={{ marginBottom: 24 }}>Browse our latest bouquets and gift sets.</p>
        <button className="btn btn-primary" onClick={() => navigate('shop')}>Shop atelier <Icon name="arrow-right" size={16} /></button>
      </div>);

  }
  return (
    <div className="card" style={{ padding: 0 }}>
      {cart.items.map((it, i) =>
      <div key={it.key} className="cart-item-row" style={{
        display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 24, alignItems: 'center',
        padding: 24, borderBottom: i < cart.items.length - 1 ? '1px solid var(--hairline)' : 'none'
      }}>
          <div className="img-elevated-sm cart-item-img" style={{ borderRadius: 14, overflow: 'hidden', background: FALLBACK_BG, flexShrink: 0 }}>
            <img src={/^https?:\/\//.test(it.img) ? it.img : '/' + it.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => {e.target.style.display = 'none';}} />
          </div>
          <div className="cart-item-body" style={{ minWidth: 0 }}>
            <div className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{it.name}</div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>Size: {it.size}</div>
            <div className="cart-item-controls" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--hairline-strong)', borderRadius: 9999 }}>
                <button onClick={() => cart.setQty(it.key, it.qty - 1)} style={{ background: 'none', border: 'none', padding: '8px 14px', cursor: 'pointer', color: 'var(--ink)' }}><Icon name="minus" size={12} /></button>
                <span style={{ padding: '0 10px', minWidth: 20, textAlign: 'center', fontSize: 14 }}>{it.qty}</span>
                <button onClick={() => cart.setQty(it.key, it.qty + 1)} style={{ background: 'none', border: 'none', padding: '8px 14px', cursor: 'pointer', color: 'var(--ink)' }}><Icon name="plus" size={12} /></button>
              </div>
              <button onClick={() => cart.remove(it.key)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline', fontFamily: 'inherit' }}>Remove</button>
            </div>
          </div>
          <div className="serif cart-item-price" style={{ fontSize: 22, fontWeight: 600, textAlign: 'right' }}>${it.price * it.qty}</div>
        </div>
      )}
    </div>);

};

// Mock AU address index — in production this is a Places/Geoscape Autocomplete API call.
const AU_ADDRESS_DB = [
{ line: '123 Collins Street', suburb: 'Melbourne', state: 'VIC', postcode: '3000' },
{ line: '350 Collins Street', suburb: 'Melbourne', state: 'VIC', postcode: '3000' },
{ line: '101 Collins Street', suburb: 'Melbourne', state: 'VIC', postcode: '3000' },
{ line: '12 Chapel Street', suburb: 'Windsor', state: 'VIC', postcode: '3181' },
{ line: '88 Chapel Street', suburb: 'Prahran', state: 'VIC', postcode: '3181' },
{ line: '5 Acland Street', suburb: 'St Kilda', state: 'VIC', postcode: '3182' },
{ line: '240 Lygon Street', suburb: 'Carlton', state: 'VIC', postcode: '3053' },
{ line: '7 Brunswick Street', suburb: 'Fitzroy', state: 'VIC', postcode: '3065' },
{ line: '1 Martin Place', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
{ line: '200 George Street', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
{ line: '48 Oxford Street', suburb: 'Darlinghurst', state: 'NSW', postcode: '2010' },
{ line: '15 Campbell Parade', suburb: 'Bondi Beach', state: 'NSW', postcode: '2026' },
{ line: '32 King Street', suburb: 'Newtown', state: 'NSW', postcode: '2042' },
{ line: '60 Queen Street', suburb: 'Brisbane City', state: 'QLD', postcode: '4000' },
{ line: '25 James Street', suburb: 'Fortitude Valley', state: 'QLD', postcode: '4006' },
{ line: '18 Cavill Avenue', suburb: 'Surfers Paradise', state: 'QLD', postcode: '4217' },
{ line: '77 Rundle Mall', suburb: 'Adelaide', state: 'SA', postcode: '5000' },
{ line: '9 King William Street', suburb: 'Adelaide', state: 'SA', postcode: '5000' },
{ line: '120 Hay Street', suburb: 'Perth', state: 'WA', postcode: '6000' },
{ line: '44 St Georges Terrace', suburb: 'Perth', state: 'WA', postcode: '6000' },
{ line: '14 Bunda Street', suburb: 'Canberra', state: 'ACT', postcode: '2601' },
{ line: '3 Salamanca Place', suburb: 'Hobart', state: 'TAS', postcode: '7000' },
{ line: '22 Mitchell Street', suburb: 'Darwin', state: 'NT', postcode: '0800' }];


const AddressAutocomplete = ({ shipping, setShipping, set }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef(null);

  const q = (shipping.address || '').trim().toLowerCase();
  const matches = q.length < 2 ? [] :
  AU_ADDRESS_DB.filter((a) =>
  `${a.line} ${a.suburb} ${a.state} ${a.postcode}`.toLowerCase().includes(q)).
  slice(0, 6);

  useEffect(() => {
    const onDoc = (e) => {if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);};
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const choose = (a) => {
    setShipping({ ...shipping, address: a.line, suburb: a.suburb, state: a.state, postcode: a.postcode });
    setOpen(false);
  };

  const onKey = (e) => {
    if (!open || !matches.length) return;
    if (e.key === 'ArrowDown') {e.preventDefault();setActive((i) => (i + 1) % matches.length);}
    else if (e.key === 'ArrowUp') {e.preventDefault();setActive((i) => (i - 1 + matches.length) % matches.length);}
    else if (e.key === 'Enter') {e.preventDefault();choose(matches[active]);}
    else if (e.key === 'Escape') {setOpen(false);}
  };

  return (
    <div style={{ gridColumn: 'span 1', position: 'relative' }} ref={boxRef}>
      <label className="input-label">Street address<span style={{ color: '#c2655a', marginLeft: 3 }}>*</span></label>
      <div style={{ position: 'relative' }}>
        <input
          className="input"
          value={shipping.address}
          placeholder="Start typing your address…"
          autoComplete="off"
          style={{ paddingLeft: 42 }}
          onChange={(e) => {set('address', e.target.value);setOpen(true);setActive(0);}}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey} />

        <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none', display: 'flex' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
        </span>
      </div>
      {open && matches.length > 0 &&
      <ul style={{
        position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30,
        margin: 0, padding: 6, listStyle: 'none', background: 'var(--surface)',
        border: '1px solid var(--hairline-strong)', borderRadius: 12,
        boxShadow: '0 16px 40px -12px rgba(43,29,24,0.28)', maxHeight: 280, overflowY: 'auto'
      }}>
          {matches.map((a, i) =>
        <li key={i}
        onMouseEnter={() => setActive(i)}
        onMouseDown={(e) => {e.preventDefault();choose(a);}}
        style={{
          padding: '11px 12px', borderRadius: 8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 11,
          background: i === active ? 'var(--bg-pill)' : 'transparent'
        }}>
              <span style={{ color: 'var(--muted)', display: 'flex', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{a.line}</span>
                <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)' }}>{a.suburb} {a.state} {a.postcode}</span>
              </span>
            </li>
        )}
          <li style={{ padding: '8px 12px 4px', fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
            Suggestions by address lookup
          </li>
        </ul>
      }
    </div>);

};

const ShippingForm = ({ shipping, setShipping }) => {
  const set = (k, v) => setShipping({ ...shipping, [k]: v });
  const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
  return (
    <div className="card" style={{ padding: 32 }}>
      <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: '0 0 6px' }}>Shipping details</h2>
      <p className="muted" style={{ fontSize: 14, margin: '0 0 24px' }}>Where should we send your flowers? We deliver Australia-wide.</p>

      <div style={{ fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', marginBottom: 14 }}>Contact</div>
      <div className="g-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <CheckoutField label="First name" value={shipping.firstName} onChange={(v) => set('firstName', v)} placeholder="Charlotte" required />
        <CheckoutField label="Last name" value={shipping.lastName} onChange={(v) => set('lastName', v)} placeholder="Nguyen" required />
        <CheckoutField label="Email" type="email" value={shipping.email} onChange={(v) => set('email', v)} placeholder="charlotte@email.com" span={2} required />
        <CheckoutField label="Phone" type="tel" value={shipping.phone} onChange={(v) => set('phone', v)} placeholder="0400 000 000" span={2} required />
      </div>

      <div style={{ fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', margin: '30px 0 14px' }}>Delivery address</div>
      <div className="g-stack-sm" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
        <AddressAutocomplete shipping={shipping} setShipping={setShipping} set={set} />
        <CheckoutField label="Unit / Apt" value={shipping.unit} onChange={(v) => set('unit', v)} placeholder="Optional" />
        <CheckoutField label="Suburb" value={shipping.suburb} onChange={(v) => set('suburb', v)} placeholder="Melbourne" required />
        <div className="g-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <SelectField label="State" value={shipping.state} onChange={(v) => set('state', v)} options={AU_STATES} placeholder="State" required />
          <CheckoutField label="Postcode" type="text" value={shipping.postcode} onChange={(v) => set('postcode', v)} placeholder="3000" required />
        </div>
        <CheckoutField label="Delivery instructions" value={shipping.instructions} onChange={(v) => set('instructions', v)} placeholder="Leave at front door, ring bell, etc. (optional)" span={2} />
      </div>

      <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, margin: '36px 0 16px' }}>Delivery method</h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {[
        { id: 'standard', label: 'Standard delivery', sub: '2–4 business days', price: 'Free' },
        { id: 'express', label: 'Express delivery', sub: 'Next-day before 2pm', price: '$12' }].
        map((m) =>
        <label key={m.id} style={{
          display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px',
          border: shipping.method === m.id ? '1.5px solid var(--ink)' : '1px solid var(--hairline-strong)',
          borderRadius: 14, cursor: 'pointer'
        }}>
            <input type="radio" name="ship" checked={shipping.method === m.id} onChange={() => set('method', m.id)} style={{ accentColor: 'var(--ink)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{m.label}</div>
              <div className="muted" style={{ fontSize: 13 }}>{m.sub}</div>
            </div>
            <div className="serif" style={{ fontWeight: 600 }}>{m.price}</div>
          </label>
        )}
      </div>
    </div>);

};

const CheckoutField = ({ label, value, onChange, span = 1, placeholder = '', type = 'text', required = false }) =>
<div style={{ gridColumn: `span ${span}` }}>
    <label className="input-label">{label}{required && <span style={{ color: '#c2655a', marginLeft: 3 }}>*</span>}</label>
    <input className="input" type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  </div>;

const SelectField = ({ label, value, onChange, options, span = 1, placeholder = 'Select', required = false }) =>
<div style={{ gridColumn: `span ${span}` }}>
    <label className="input-label">{label}{required && <span style={{ color: '#c2655a', marginLeft: 3 }}>*</span>}</label>
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)} style={{ cursor: 'pointer', color: value ? 'var(--ink)' : 'var(--muted)' }}>
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o} value={o} style={{ color: 'var(--ink)' }}>{o}</option>)}
    </select>
  </div>;


// Small brand wordmarks used inside the Stripe-style Payment Element tabs.
const StripeBadge = () =>
<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--muted)' }}>
    Powered by
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.02em', color: '#635bff', fontSize: 14 }}>stripe</span>
  </span>;

const PAY_TABS = [
{ id: 'card', label: 'Card' },
{ id: 'apple', label: 'Apple Pay' },
{ id: 'paypal', label: 'PayPal' },
{ id: 'afterpay', label: 'Afterpay' }];


// Stripe-Element-style bordered input. In production these rows are replaced by the
// real <PaymentElement /> mounted from Stripe.js — they never touch your DOM/state.
const StripeRow = ({ children, style }) =>
<div style={{ padding: '13px 14px', borderTop: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', ...style }}>{children}</div>;

const stripeInputStyle = { flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--ink)' };

const CardBrandDots = () =>
<div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
    {['#1a1f71', '#eb001b', '#006fcf'].map((c, i) =>
  <span key={i} style={{ width: 26, height: 17, borderRadius: 3, background: c, opacity: 0.9 }} />
  )}
  </div>;

const PaymentForm = ({ payment, setPayment, total }) => {
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', postcode: '' });
  const setC = (k, v) => setCard({ ...card, [k]: v });
  const instalment = (Math.round((total / 4) * 100) / 100).toFixed(2);

  return (
    <div className="card" style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: 0 }}>Payment</h2>
        <StripeBadge />
      </div>
      <p className="muted" style={{ fontSize: 14, margin: '0 0 22px' }}>All transactions are secure and encrypted. Choose how you'd like to pay.</p>

      {/* ---- Stripe Payment Element (mock) ---- */}
      <div style={{ border: '1px solid var(--hairline-strong)', borderRadius: 14, overflow: 'hidden', background: 'var(--surface)' }}>
        {/* method tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PAY_TABS.length}, 1fr)`, background: 'var(--bg-pill)' }}>
          {PAY_TABS.map((t) =>
          <button key={t.id} type="button" onClick={() => setPayment(t.id)}
          style={{
            padding: '12px 6px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            fontSize: 13, fontWeight: payment === t.id ? 600 : 500,
            color: payment === t.id ? 'var(--ink)' : 'var(--muted)',
            background: payment === t.id ? 'var(--surface)' : 'transparent',
            borderBottom: payment === t.id ? '2px solid #635bff' : '2px solid transparent'
          }}>{t.label}</button>
          )}
        </div>

        {/* card form */}
        {payment === 'card' &&
        <div>
            <StripeRow style={{ borderTop: 'none', gap: 12 }}>
              <input value={card.number} onChange={(e) => setC('number', e.target.value)} placeholder="Card number" inputMode="numeric" style={stripeInputStyle} />
              <CardBrandDots />
            </StripeRow>
            <div className="g-stack-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <StripeRow>
                <input value={card.expiry} onChange={(e) => setC('expiry', e.target.value)} placeholder="MM / YY" inputMode="numeric" style={stripeInputStyle} />
              </StripeRow>
              <StripeRow style={{ borderLeft: '1px solid var(--hairline)' }}>
                <input value={card.cvc} onChange={(e) => setC('cvc', e.target.value)} placeholder="CVC" inputMode="numeric" style={stripeInputStyle} />
              </StripeRow>
            </div>
            <StripeRow>
              <input value={card.postcode} onChange={(e) => setC('postcode', e.target.value)} placeholder="Postcode" inputMode="numeric" style={stripeInputStyle} />
            </StripeRow>
          </div>
        }

        {/* wallet / redirect methods */}
        {payment === 'apple' &&
        <StripeRow style={{ borderTop: 'none', flexDirection: 'column', alignItems: 'stretch', gap: 12, padding: 20 }}>
            <div style={{ background: '#000', color: '#fff', borderRadius: 10, padding: '14px 0', textAlign: 'center', fontWeight: 600, fontSize: 16, letterSpacing: '0.01em' }}>
               Pay
            </div>
            <p className="muted" style={{ fontSize: 13, margin: 0, textAlign: 'center' }}>You'll confirm with Face ID or Touch ID after placing your order.</p>
          </StripeRow>
        }
        {payment === 'paypal' &&
        <StripeRow style={{ borderTop: 'none', flexDirection: 'column', alignItems: 'stretch', gap: 12, padding: 20 }}>
            <div style={{ background: '#ffc439', color: '#003087', borderRadius: 10, padding: '14px 0', textAlign: 'center', fontWeight: 800, fontStyle: 'italic', fontSize: 17 }}>
              PayPal
            </div>
            <p className="muted" style={{ fontSize: 13, margin: 0, textAlign: 'center' }}>You'll be redirected to PayPal to approve this payment, then returned here.</p>
          </StripeRow>
        }
        {payment === 'afterpay' &&
        <StripeRow style={{ borderTop: 'none', flexDirection: 'column', alignItems: 'stretch', gap: 12, padding: 20 }}>
            <div style={{ background: '#b2fce4', color: '#0a0a0a', borderRadius: 10, padding: '14px 0', textAlign: 'center', fontWeight: 700, fontSize: 15 }}>
              4 payments of ${instalment}
            </div>
            <p className="muted" style={{ fontSize: 13, margin: 0, textAlign: 'center' }}>Interest-free, paid fortnightly. You'll be redirected to Afterpay to confirm.</p>
          </StripeRow>
        }
      </div>

      <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-pill)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5, color: 'var(--ink-soft)' }}>
        <Icon name="shield" size={18} /> Card details are encrypted and handled by Stripe — they never touch our servers.
      </div>
    </div>);

};

const SummaryRow = ({ label, value, bold, large, accent }) =>
<div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: large ? 16 : 14, fontWeight: bold ? 600 : 400, color: accent ? 'var(--accent)' : undefined }}>
    <span className={bold || accent ? '' : 'muted'} style={bold ? { fontFamily: 'var(--font-serif)', fontSize: 18 } : accent ? { letterSpacing: '0.02em' } : {}}>{label}</span>
    <span style={bold ? { fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600 } : accent ? { fontWeight: 600 } : {}}>{value}</span>
  </div>;


const ConfirmedView = ({ navigate, order }) =>
<div style={{ textAlign: 'center', padding: '40px 0', maxWidth: 640, margin: '0 auto' }}>
    <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--bg-pill)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, color: 'var(--ink)' }}>
      <Icon name="check" size={48} />
    </div>
    <span className="pill"><span className="pill-dot"></span>Order confirmed</span>
    <h1 className="serif" style={{ fontSize: 64, fontWeight: 500, lineHeight: 1.05, margin: '24px 0 18px', letterSpacing: '-0.02em' }}>
      Thank you, <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>{order.shipping.firstName}.</span>
    </h1>
    <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: 32 }}>
      Your atelier is hand-tying your order. We'll send a confirmation to <strong>{order.shipping.email}</strong> and dispatch within 2 hours.
    </p>
    <div className="card" style={{ padding: 28, textAlign: 'left', marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="muted" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Order</div>
          <div className="serif" style={{ fontSize: 22, fontWeight: 500, marginTop: 4 }}>{order.ref}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="muted" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Total</div>
          <div className="serif" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>${order.total}</div>
        </div>
      </div>
      <hr className="divider" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
        <Icon name="truck" size={20} /> {(DELIVERY_LABELS[order.shipping.method] || 'Delivery').split(' · ')[0]} to {order.shipping.address}, {order.shipping.suburb} {order.shipping.state} {order.shipping.postcode}
      </div>
    </div>
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <button className="btn btn-primary" onClick={() => navigate('home')}>Back to home <Icon name="arrow-right" size={16} /></button>
      <button className="btn btn-secondary" onClick={() => navigate('shop')}>Keep shopping</button>
    </div>
  </div>;


export default CartPage;
