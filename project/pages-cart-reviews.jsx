/* global React, PRODUCTS, Icon, Stars, useCart, DiscountStore, ReviewQueueStore, ADMIN_EMAIL, FALLBACK_BG */
const { useState, useEffect, useMemo } = React;

const DELIVERY_LABELS = {
  standard: 'Standard delivery · 2–4 business days',
  express: 'Express delivery · next-day before 2pm',
  same: 'Same-day courier · order before 2pm' };

// =========================================================
// CART / CHECKOUT
// =========================================================
const CartPage = ({ navigate }) => {
  const cart = useCart();
  const [step, setStep] = useState('cart'); // cart → shipping → payment → done
  const [shipping, setShipping] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', unit: '', suburb: '', state: '', postcode: '', instructions: '', method: 'express' });
  const [payment, setPayment] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState('');
  const [order, setOrder] = useState(null);
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');

  // seed cart if empty (so screen always has content for demo)
  useEffect(() => {
    if (cart.items.length === 0 && step === 'cart') {
      cart.add(PRODUCTS[0], 1, 'Standard');
      cart.add(PRODUCTS[6], 2, 'One size');
    }
    // eslint-disable-next-line
  }, []);

  const applyDiscount = (e) => {
    if (e) e.preventDefault();
    const entry = DiscountStore.validate(discountInput);
    if (!entry) {
      setDiscountError('That code isn\'t recognised or has already been used.');
      setAppliedDiscount(null);
      return;
    }
    setAppliedDiscount(entry);
    setDiscountError('');
    setDiscountInput('');
  };
  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError('');
  };

  const subtotal = cart.total;
  const discountAmount = appliedDiscount ? Math.round(subtotal * appliedDiscount.percent / 100) : 0;
  const taxBase = Math.max(0, subtotal - discountAmount);
  const shippingCost = shipping.method === 'express' ? 12 : shipping.method === 'standard' ? 0 : 24;
  const tax = Math.round(taxBase * 0.08);
  const total = taxBase + shippingCost + tax;

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

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, marginTop: 32 }}>
              {/* LEFT */}
              <div>
                {step === 'cart' && <CartItems cart={cart} navigate={navigate} />}
                {step === 'shipping' && <ShippingForm shipping={shipping} setShipping={setShipping} />}
                {step === 'payment' && <PaymentForm payment={payment} setPayment={setPayment} total={total} />}
              </div>

              {/* RIGHT — summary */}
              <aside>
                <div className="card" style={{ padding: 28, position: 'sticky', top: 24 }}>
                  <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 20px' }}>Order summary</h3>
                  <div style={{ display: 'grid', gap: 14, marginBottom: 18, maxHeight: 220, overflowY: 'auto' }}>
                    {cart.items.map((it) =>
                  <div key={it.key} style={{ display: 'flex', gap: 12 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', background: FALLBACK_BG, flexShrink: 0 }}>
                          <img src={it.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {e.target.style.display = 'none';}} />
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
                  <SummaryRow label={`Shipping (${shipping.method})`} value={shippingCost === 0 ? 'Free' : `$${shippingCost}`} />
                  <SummaryRow label="Tax" value={`$${tax}`} />
                  <hr className="divider" />
                  <SummaryRow label="Total" value={`$${total}`} bold large />

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
                            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{appliedDiscount.percent}% off applied</div>
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

                            <button type="submit" className="btn btn-secondary" style={{ padding: '11px 18px', fontSize: 13 }}>
                              Apply
                            </button>
                          </div>
                          {discountError &&
                    <div style={{ marginTop: 8, fontSize: 12.5, color: '#a8463b', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16v0" /></svg>
                              {discountError}
                            </div>
                    }
                          <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--muted)', letterSpacing: '0.01em' }}>
                            Have a Google-review thank-you code? Paste it here.
                          </div>
                        </form>
                  }
                    </div>
                }

                  <div style={{ marginTop: 18 }}>
                    {step === 'cart' && <button className="btn btn-primary btn-block" onClick={() => setStep('shipping')}>Continue to shipping <Icon name="arrow-right" size={16} /></button>}
                    {step === 'shipping' && <button className="btn btn-primary btn-block" onClick={() => setStep('payment')}>Continue to payment <Icon name="arrow-right" size={16} /></button>}
                    {step === 'payment' &&
                  <React.Fragment>
                        {payError &&
                    <div style={{ marginBottom: 12, padding: '11px 14px', background: '#fbeae5', border: '1px solid #f0c9bf', borderRadius: 10, fontSize: 13, color: '#a8463b', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16v0" /></svg>
                            {payError}
                          </div>
                    }
                        <button className="btn btn-primary btn-block" disabled={processing} style={processing ? { opacity: 0.75, cursor: 'wait' } : undefined} onClick={() => {
                      // Simulates stripe.confirmPayment({ elements, clientSecret }).
                      // In production: POST /create-payment-intent → confirmPayment → await result;
                      // fulfilment happens server-side on the payment_intent.succeeded webhook.
                      setPayError('');setProcessing(true);
                      setTimeout(() => {
                        setOrder({ total, subtotal, shipping, payment, ref: 'RB-' + Math.floor(100000 + Math.random() * 900000) });
                        if (appliedDiscount) DiscountStore.markUsed(appliedDiscount.code);
                        cart.clear();setProcessing(false);setStep('done');
                      }, 1700);
                    }}>
                          {processing ?
                      <React.Fragment><span className="spinner" /> Processing payment…</React.Fragment> :
                      <React.Fragment>Pay ${total} <Icon name="arrow-right" size={16} /></React.Fragment>
                      }
                        </button>
                        <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--muted)', textAlign: 'center' }}>By paying you agree to our terms. You can cancel within 1 hour of ordering.</div>
                      </React.Fragment>
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
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' }];

  const idx = steps.findIndex((s) => s.id === step);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
      {steps.map((s, i) =>
      <React.Fragment key={s.id}>
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
        </React.Fragment>
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
      <div key={it.key} style={{
        display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 24, alignItems: 'center',
        padding: 24, borderBottom: i < cart.items.length - 1 ? '1px solid var(--hairline)' : 'none'
      }}>
          <div className="img-elevated-sm" style={{ width: 110, height: 130, borderRadius: 14, overflow: 'hidden', background: FALLBACK_BG }}>
            <img src={it.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {e.target.style.display = 'none';}} />
          </div>
          <div>
            <div className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{it.name}</div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>Size: {it.size}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--hairline-strong)', borderRadius: 9999 }}>
              <button onClick={() => cart.setQty(it.key, it.qty - 1)} style={{ background: 'none', border: 'none', padding: '8px 14px', cursor: 'pointer', color: 'var(--ink)' }}><Icon name="minus" size={12} /></button>
              <span style={{ padding: '0 10px', minWidth: 20, textAlign: 'center', fontSize: 14 }}>{it.qty}</span>
              <button onClick={() => cart.setQty(it.key, it.qty + 1)} style={{ background: 'none', border: 'none', padding: '8px 14px', cursor: 'pointer', color: 'var(--ink)' }}><Icon name="plus" size={12} /></button>
            </div>
            <button onClick={() => cart.remove(it.key)} style={{ background: 'none', border: 'none', marginLeft: 16, color: 'var(--muted)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline', fontFamily: 'inherit' }}>Remove</button>
          </div>
          <div className="serif" style={{ fontSize: 22, fontWeight: 600 }}>${it.price * it.qty}</div>
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
  const boxRef = React.useRef(null);

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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <CheckoutField label="First name" value={shipping.firstName} onChange={(v) => set('firstName', v)} placeholder="Charlotte" required />
        <CheckoutField label="Last name" value={shipping.lastName} onChange={(v) => set('lastName', v)} placeholder="Nguyen" required />
        <CheckoutField label="Email" type="email" value={shipping.email} onChange={(v) => set('email', v)} placeholder="charlotte@email.com" span={2} required />
        <CheckoutField label="Phone" type="tel" value={shipping.phone} onChange={(v) => set('phone', v)} placeholder="0400 000 000" span={2} required />
      </div>

      <div style={{ fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', margin: '30px 0 14px' }}>Delivery address</div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
        <AddressAutocomplete shipping={shipping} setShipping={setShipping} set={set} />
        <CheckoutField label="Unit / Apt" value={shipping.unit} onChange={(v) => set('unit', v)} placeholder="Optional" />
        <CheckoutField label="Suburb" value={shipping.suburb} onChange={(v) => set('suburb', v)} placeholder="Melbourne" required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <SelectField label="State" value={shipping.state} onChange={(v) => set('state', v)} options={AU_STATES} placeholder="State" required />
          <CheckoutField label="Postcode" type="text" value={shipping.postcode} onChange={(v) => set('postcode', v)} placeholder="3000" required />
        </div>
        <CheckoutField label="Delivery instructions" value={shipping.instructions} onChange={(v) => set('instructions', v)} placeholder="Leave at front door, ring bell, etc. (optional)" span={2} />
      </div>

      <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, margin: '36px 0 16px' }}>Delivery method</h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {[
        { id: 'standard', label: 'Standard delivery', sub: '2–4 business days', price: 'Free' },
        { id: 'express', label: 'Express delivery', sub: 'Next-day before 2pm', price: '$12' },
        { id: 'same', label: 'Same-day courier', sub: 'Within the metro area · order before 2pm', price: '$24' }].
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
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
      <button className="btn btn-primary" onClick={() => navigate('account')}>View order <Icon name="arrow-right" size={16} /></button>
      <button className="btn btn-secondary" onClick={() => navigate('shop')}>Keep shopping</button>
    </div>
  </div>;


// =========================================================
// REVIEWS (Google reviews)
// =========================================================
// Configure your Google Business Profile here. When wired to a backend,
// the `reviews` array below should be replaced with a fetch() to the
// Google Business Profile API (or a serverless proxy) using `placeId`.
const GOOGLE_BUSINESS = {
  placeId: 'YOUR_GOOGLE_PLACE_ID',
  profileUrl: 'https://www.google.com/maps/search/?api=1&query=Rosie%27s+Boutique',
  writeReviewUrl: 'https://search.google.com/local/writereview?placeid=YOUR_GOOGLE_PLACE_ID'
};

// Shared state machine for the "leave a Google review → get a 10% code" flow.
// Used by both the populated CTA and the empty-state card.
const useReviewClaim = () => {
  const [step, setStep] = useState('start'); // start → claim → success | pending | bad
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [issued, setIssued] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const openGoogle = () => {
    try {window.open(GOOGLE_BUSINESS.writeReviewUrl, '_blank', 'noopener,noreferrer');} catch (e) {}
    setStep('claim');
  };
  const submit = (e) => {
    if (e) e.preventDefault();
    if (!rating) {
      setError('Please choose a star rating first.');
      return;
    }
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    // Read the rating and route it through the same pipeline the admin console sees.
    const entry = ReviewQueueStore.ingest({
      name: trimmed.split('@')[0],
      email: trimmed,
      rating,
      body: '(Submitted via the storefront review prompt.)'
    });
    if (entry.status === 'rewarded') {
      setIssued({ code: entry.code, email: trimmed });
      setStep('success'); // 4–5 stars → instant 10% code
    } else if (entry.status === 'pending') {
      setStep('pending'); // 3 stars → forwarded to admin for a decision
    } else {
      setStep('bad'); // 1–2 stars → no automatic code
    }
  };
  const copyCode = () => {
    if (!issued) return;
    try {navigator.clipboard?.writeText(issued.code);} catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const reset = () => {setStep('start');setRating(0);setEmail('');setIssued(null);setError('');setCopied(false);};
  return { step, setStep, rating, setRating, email, setEmail, issued, error, copied, openGoogle, submit, copyCode, reset };
};

const ReviewsPage = ({ navigate }) => {
  // In production: const [reviews, setReviews] = useState([]); useEffect(() => fetch(...).then(setReviews), []);
  // For the prototype the array is seeded from sample Google reviews — set to [] to preview the empty state,
  // or toggle via ?empty=1 in the URL hash.
  const previewEmpty = typeof window !== 'undefined' && window.location.hash.includes('empty');
  const seeded = [
  { name: 'Linh Pham', avatar: 'L', date: '2 days ago', rating: 5, body: 'The Sunset Atelier is absolutely stunning. It arrived hand-tied with the most beautiful raw silk ribbon and the petals look unbelievably real. My mother thought it was a fresh bouquet at first glance.', likes: 24, photos: [PRODUCTS[0].img] },
  { name: 'Henry Nguyen', avatar: 'H', date: '5 days ago', rating: 5, body: "I've been buying from Rosie's Boutique for over two years and the craftsmanship has only gotten better. The peony cluster I ordered for my wife's birthday was a wow moment.", likes: 41, photos: [] },
  { name: 'Mia Tran', avatar: 'M', date: '1 week ago', rating: 5, body: 'The atelier guarantee is the real deal. They refreshed my one-year-old bouquet and it looks brand new. Customer service is warm, fast, and genuinely lovely.', likes: 18, photos: [] },
  { name: 'David Le', avatar: 'D', date: '2 weeks ago', rating: 4, body: 'Beautiful piece, though slightly smaller than I expected — would recommend sizing up for a coffee-table centerpiece. The packaging was immaculate.', likes: 9, photos: [PRODUCTS[4].img] },
  { name: 'Sophie Bui', avatar: 'S', date: '3 weeks ago', rating: 5, body: 'Ordered the Spring Lush for a wedding centerpiece. The presentation was magazine-worthy and the bride cried. Will be back for every milestone moment.', likes: 56, photos: [PRODUCTS[11].img, PRODUCTS[5].img] },
  { name: 'Anna Vu', avatar: 'A', date: '1 month ago', rating: 5, body: 'Same-day delivery within two hours, communication was perfect, and the calla cascade smells faintly of orange blossom. A small business doing things properly.', likes: 32, photos: [] }];

  const reviews = previewEmpty ? [] : seeded;

  const total = reviews.length > 0 ? 2841 : 0;
  const avg = reviews.length > 0 ? 4.9 : 0;
  const dist = [
  { stars: 5, pct: 92 },
  { stars: 4, pct: 6 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 0.5 },
  { stars: 1, pct: 0.5 }];


  const lastSynced = 'just now';
  const hasReviews = reviews.length > 0;

  return (
    <div className="page-fade">
      <section style={{ padding: '64px 56px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
            <button
              onClick={() => navigate('reviews', previewEmpty ? {} : { id: 'empty' })}
              style={{ background: 'transparent', border: '1px dashed var(--hairline-strong)', borderRadius: 999, padding: '5px 12px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: 600, cursor: 'pointer' }}
              title="Toggle a preview of the page when Google has not synced any reviews yet">
              Preview: {previewEmpty ? 'with reviews' : 'no reviews yet'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: hasReviews ? '1.2fr 1fr' : '1fr', gap: 56, alignItems: 'start', marginBottom: 56 }}>
            <div>
              <span className="pill"><span className="pill-dot"></span>From our community</span>
              <h1 className="serif" style={{ fontSize: 80, fontWeight: 500, lineHeight: 1.02, margin: '24px 0 18px', letterSpacing: '-0.02em' }}>
                {hasReviews ?
                <>Loved by <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>thousands.</span></> :

                <>The first <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>chapter</span></>
                }
              </h1>
              <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: 540, lineHeight: 1.5, margin: '0 0 14px' }}>
                Real reviews from real customers, syndicated directly from our Google Business Profile.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--muted)' }}>
                <Icon name="google" size={14} />
                <span>Synced from Google · last updated {lastSynced}</span>
              </div>
            </div>

            {/* Summary card — only when there are reviews */}
            {hasReviews &&
            <div className="card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <Icon name="google" size={28} />
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>Verified by</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Google Reviews</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                  <span className="serif" style={{ fontSize: 72, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em' }}>{avg}</span>
                  <div>
                    <Stars value={avg} size={18} />
                    <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>based on {total.toLocaleString()} reviews</div>
                  </div>
                </div>
                <hr className="divider" />
                {dist.map((d) =>
              <div key={d.stars} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: 13 }}>
                    <span style={{ width: 14, color: 'var(--muted)' }}>{d.stars}</span>
                    <Icon name="star" size={12} />
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-pill)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: d.pct + '%', height: '100%', background: 'var(--ink)' }}></div>
                    </div>
                    <span className="muted" style={{ width: 36, textAlign: 'right' }}>{d.pct}%</span>
                  </div>
              )}
              </div>
            }
          </div>

          {hasReviews ?
          <>
              {/* Filter chips */}
              <div className="chip-strip" style={{ marginBottom: 36 }}>
                {['All reviews', 'Most recent', '5 stars', 'With photos', 'Bouquets', 'Gifts', 'Delivery'].map((c, i) =>
              <button key={c} className={'chip' + (i === 0 ? ' active' : '')}>{c}</button>
              )}
              </div>

              {/* Reviews grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 48 }}>
                {reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
              </div>

              <div className="text-center">
                <button className="btn btn-secondary">Show more reviews <Icon name="chevron-down" size={16} /></button>
              </div>

              {/* CTA */}
              <ReviewClaimCard navigate={navigate} variant="populated" />
            </> :

          <EmptyReviewsState navigate={navigate} />
          }
        </div>
      </section>
    </div>);

};

const EmptyReviewsState = ({ navigate }) =>
<ReviewClaimCard navigate={navigate} variant="empty" />;

// Three-state CTA card used on the Reviews page. Drives customers to leave a
// Google review, captures their email, and issues a discount voucher.
const ReviewClaimCard = ({ navigate, variant }) => {
  const flow = useReviewClaim();
  const isEmpty = variant === 'empty';

  // ---- Common wrapper styles ----
  const cardStyleEmpty = { padding: '88px 80px', textAlign: 'center', maxWidth: 960, margin: '0 auto' };
  const cardStylePop = { marginTop: 80, padding: 56, background: '#fff', borderRadius: 28 };
  const wrapStyle = isEmpty ? cardStyleEmpty : cardStylePop;

  // ============ START STATE ============
  if (flow.step === 'start') {
    if (isEmpty) {
      return (
        <div className="card" style={wrapStyle}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 76, height: 76, borderRadius: '50%', background: 'var(--bg-pill)', marginBottom: 24 }}>
            <Icon name="google" size={34} />
          </div>
          <h2 className="serif" style={{ fontSize: 48, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 18px', color: 'var(--ink)' }}>
            No reviews <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>yet.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 36px' }}>
            Our Google Business Profile hasn't received any reviews so far. If you've ordered from our atelier, we would be honoured to read your thoughts — every word helps a small studio like ours.
          </p>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <button className="btn btn-primary" onClick={flow.openGoogle}
            style={{ whiteSpace: 'nowrap', padding: '16px 30px', fontSize: 14.5 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0 }}>
                <Icon name="google" size={18} />
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>Share your story on Google and we'll send a 10% gift towards your next order</span>
              <Icon name="arrow-right" size={15} />
            </button>
            <a href={GOOGLE_BUSINESS.profileUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12.5, color: 'var(--muted)', letterSpacing: '0.02em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              View our Google Business Profile
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
            </a>
          </div>
        </div>);

    }
    return (
      <div style={{ ...wrapStyle, display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
        <div>
          <h2 className="serif" style={{ fontSize: 40, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
            Loved your <span className="italic">bouquet?</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginTop: 12, marginBottom: 0 }}>
            Share your story on Google and we'll send a 10% gift towards your next order.
          </p>
        </div>
        <button className="btn btn-primary" onClick={flow.openGoogle}>
          <Icon name="google" size={15} /> Write a review <Icon name="arrow-right" size={16} />
        </button>
      </div>);

  }

  // ============ CLAIM STATE — capture email ============
  if (flow.step === 'claim') {
    const formInner =
    <form onSubmit={flow.submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: isEmpty ? '0 auto' : 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: isEmpty ? 'center' : 'flex-start' }}>
          <span style={{ fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>Your rating</span>
          <div style={{ display: 'inline-flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((n) =>
            <button key={n} type="button" aria-label={n + ' star'} onClick={() => { flow.setRating(n); }}
              style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', display: 'inline-flex', color: n <= flow.rating ? '#e0a93b' : 'var(--hairline-strong)' }}>
                <Icon name={n <= flow.rating ? 'star' : 'star-empty'} size={26} />
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
          type="email"
          value={flow.email}
          onChange={(e) => flow.setEmail(e.target.value)}
          placeholder="your@email.com"
          autoFocus
          style={{
            flex: 1, minWidth: 0, padding: '13px 16px', border: '1px solid var(--hairline-strong)',
            borderRadius: 12, background: '#fff', fontSize: 14, fontFamily: 'var(--font-sans)', color: 'var(--ink)'
          }} />

          <button type="submit" className="btn btn-primary" style={{ padding: '13px 22px', fontSize: 14 }}>
            Send my code <Icon name="arrow-right" size={14} />
          </button>
        </div>
        {flow.error &&
      <div style={{ fontSize: 13, color: '#a8463b', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16v0" /></svg>
            {flow.error}
          </div>
      }
        <button type="button" onClick={flow.reset}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12.5, color: 'var(--muted)', textAlign: isEmpty ? 'center' : 'left', textDecoration: 'underline', textUnderlineOffset: 3, alignSelf: isEmpty ? 'center' : 'flex-start' }}>
          Not yet — take me back
        </button>
      </form>;


    return (
      <div className={isEmpty ? 'card' : ''} style={wrapStyle}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: isEmpty ? 76 : 56, height: isEmpty ? 76 : 56, borderRadius: '50%', background: 'var(--bg-pill)', marginBottom: isEmpty ? 24 : 18 }}>
          <Icon name="check" size={isEmpty ? 32 : 24} />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)' }}>
          <span style={{ display: 'inline-flex' }}><Icon name="google" size={12} /></span>
          Step 02 of 02
        </div>
        <h2 className="serif" style={{ fontSize: isEmpty ? 44 : 38, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 14px', color: 'var(--ink)' }}>
          Almost <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>there.</span>
        </h2>
        <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 540, margin: isEmpty ? '0 auto 28px' : '0 0 22px' }}>
          Tell us how we did. Rate <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>4 stars or more</strong> and your one-time <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>10% code</strong> arrives instantly. A 3-star rating is sent to our team for review, and we read every note carefully.
        </p>
        {formInner}
      </div>);

  }

  // ============ PENDING STATE — 3 stars forwarded to admin ============
  if (flow.step === 'pending') {
    return (
      <div className={isEmpty ? 'card' : ''} style={wrapStyle}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: isEmpty ? 76 : 56, height: isEmpty ? 76 : 56, borderRadius: '50%', background: 'var(--bg-pill)', color: 'var(--ink)', marginBottom: isEmpty ? 24 : 18 }}>
          <Icon name="clock" size={isEmpty ? 30 : 24} />
        </div>
        <div style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', marginBottom: 12 }}>
          Under review · awaiting approval
        </div>
        <h2 className="serif" style={{ fontSize: isEmpty ? 44 : 38, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 14px', color: 'var(--ink)' }}>
          Thank you for the <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>honesty.</span>
        </h2>
        <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 560, margin: isEmpty ? '0 auto 22px' : '0 0 22px' }}>
          Your 3-star review has been forwarded to our team at <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{ADMIN_EMAIL}</strong> for a closer look. If approved, your <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>10% code</strong> will be emailed to <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{flow.email}</strong> within one business day.
        </p>
        <div style={{ display: 'inline-flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', justifyContent: isEmpty ? 'center' : 'flex-start' }}>
          <button className="btn btn-secondary" onClick={() => navigate('shop')} style={{ padding: '12px 22px', fontSize: 14 }}>
            Keep browsing <Icon name="arrow-right" size={15} />
          </button>
          <button onClick={flow.reset} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12.5, color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Submit another
          </button>
        </div>
      </div>);

  }

  // ============ BAD STATE — 1–2 stars, no automatic gift ============
  if (flow.step === 'bad') {
    return (
      <div className={isEmpty ? 'card' : ''} style={wrapStyle}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: isEmpty ? 76 : 56, height: isEmpty ? 76 : 56, borderRadius: '50%', background: '#f3e0dc', color: '#a8463b', marginBottom: isEmpty ? 24 : 18 }}>
          <svg width={isEmpty ? 30 : 24} height={isEmpty ? 30 : 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M12 17v0" /><circle cx="12" cy="12" r="9" /></svg>
        </div>
        <div style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', marginBottom: 12 }}>
          We hear you
        </div>
        <h2 className="serif" style={{ fontSize: isEmpty ? 44 : 38, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 14px', color: 'var(--ink)' }}>
          We're so <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>sorry.</span>
        </h2>
        <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 560, margin: isEmpty ? '0 auto 22px' : '0 0 22px' }}>
          This isn't the experience we want for you. Your feedback has been sent straight to our team, and a florist will personally reach out to <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{flow.email}</strong> to make things right. No discount is issued for critical reviews, but we'd love the chance to earn your trust back.
        </p>
        <div style={{ display: 'inline-flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', justifyContent: isEmpty ? 'center' : 'flex-start' }}>
          <button className="btn btn-primary" onClick={() => navigate('contact')} style={{ padding: '12px 22px', fontSize: 14 }}>
            Talk to us <Icon name="arrow-right" size={15} />
          </button>
          <button onClick={flow.reset} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12.5, color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Submit another
          </button>
        </div>
      </div>);

  }

  // ============ SUCCESS STATE — show issued code ============
  return (
    <div className={isEmpty ? 'card' : ''} style={wrapStyle}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: isEmpty ? 76 : 56, height: isEmpty ? 76 : 56, borderRadius: '50%', background: 'var(--ink)', color: '#fff', marginBottom: isEmpty ? 24 : 18 }}>
        <Icon name="check" size={isEmpty ? 32 : 24} />
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted)', marginBottom: 12 }}>
        Thank you · gift unlocked
      </div>
      <h2 className="serif" style={{ fontSize: isEmpty ? 44 : 38, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 14px', color: 'var(--ink)' }}>
        Your <span className="italic" style={{ color: '#5a4a40', fontWeight: 400 }}>10% code</span> is ready.
      </h2>
      <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 560, margin: isEmpty ? '0 auto 26px' : '0 0 22px' }}>
        We've emailed it to <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{flow.issued?.email}</strong>. Apply it at checkout for 10% off your next order — one use, your account, on us.
      </p>
      <div style={{ display: isEmpty ? 'inline-flex' : 'flex', flexDirection: 'column', gap: 14, alignItems: isEmpty ? 'center' : 'flex-start' }}>
        <div style={{ display: 'inline-flex', alignItems: 'stretch', border: '1px dashed var(--hairline-strong)', borderRadius: 14, background: 'var(--bg-pill)', overflow: 'hidden' }}>
          <span style={{ padding: '14px 22px', fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '0.14em', color: 'var(--ink)' }}>
            {flow.issued?.code}
          </span>
          <button type="button" onClick={flow.copyCode}
          style={{ background: 'var(--ink)', color: '#fff', border: 'none', padding: '0 22px', fontFamily: 'var(--font-sans)', fontSize: 12.5, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {flow.copied ? <><Icon name="check" size={13} /> Copied</> : 'Copy'}
          </button>
        </div>
        <div style={{ display: 'inline-flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', justifyContent: isEmpty ? 'center' : 'flex-start' }}>
          <button className="btn btn-primary" onClick={() => navigate('cart')} style={{ padding: '12px 22px', fontSize: 14 }}>
            Open my bag <Icon name="arrow-right" size={15} />
          </button>
          <button onClick={flow.reset} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12.5, color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Issue another
          </button>
        </div>
      </div>
    </div>);

};

const ReviewCard = ({ review }) =>
<article className="card" style={{ padding: 26 }}>
    <header style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
        {review.avatar}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500, fontSize: 15 }}>{review.name}</span>
          <Icon name="google" size={14} />
        </div>
        <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{review.date}</div>
      </div>
      <Stars value={review.rating} size={14} />
    </header>
    <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 14px' }}>{review.body}</p>
    {review.photos.length > 0 &&
  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {review.photos.map((p, i) =>
    <div key={i} className="img-elevated-sm" style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', background: FALLBACK_BG }}>
            <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => {e.target.style.display = 'none';}} />
          </div>
    )}
      </div>
  }
    <div style={{ display: 'flex', gap: 16, paddingTop: 14, borderTop: '1px solid var(--hairline)', fontSize: 13, color: 'var(--muted)' }}>
      <button style={{ background: 'none', border: 'none', display: 'inline-flex', gap: 6, alignItems: 'center', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
        <Icon name="heart" size={14} /> {review.likes} helpful
      </button>
      <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Reply</button>
    </div>
  </article>;


Object.assign(window, { CartPage, ReviewsPage });