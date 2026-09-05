import { useState } from 'react';
import { Phone, Search, Package } from 'lucide-react';

export default function OrderTracking() {
  const [phone, setPhone]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.trim()) setSubmitted(true);
  };

  return (
    <main className="bg-cream min-h-screen">
      <div className="container-page py-12 max-w-lg mx-auto">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow"
            style={{ background: '#8B1E17' }}>
            <Package size={32} className="text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: '#23120B' }}>
            Track Your Order
          </h1>
          <p className="text-sm" style={{ color: '#7C6B5E' }}>
            Enter the phone number you used when placing your order.
          </p>
        </div>

        <div className="card p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="track-phone" className="form-label">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    id="track-phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 0314-9007440"
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3">
                <Search size={16} />
                Track Order
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="font-semibold text-amber-800 mb-1">Order Lookup</p>
                <p className="text-sm text-amber-700">
                  We searched for orders placed with <strong>{phone}</strong>.
                </p>
              </div>

              <div className="bg-cream rounded-xl p-4 space-y-3 border" style={{ borderColor: '#EFE8DF' }}>
                <p className="font-semibold text-sm" style={{ color: '#23120B' }}>
                  Need help with your order?
                </p>
                <p className="text-sm" style={{ color: '#7C6B5E' }}>
                  Call us on the number below and share your phone number — we'll pull up your order right away.
                </p>
                <div className="flex flex-col gap-2">
                  <a href="tel:03149007440"
                    className="btn-primary w-full py-3 text-base">
                    <Phone size={16} />
                    Call 0314-9007440
                  </a>
                  <a href="tel:03332001341"
                    className="btn-outline w-full py-3 text-base">
                    <Phone size={16} />
                    Call 0333-2001341
                  </a>
                </div>
              </div>

              <button onClick={() => { setPhone(''); setSubmitted(false); }}
                className="btn-ghost w-full text-sm">
                Try a different number
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#7C6B5E' }}>
          Available Mon–Sat, 9am–6pm PKT
        </p>
      </div>
    </main>
  );
}
