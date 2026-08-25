import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

function SpiceStripSVG() {
  return (
    <div className="w-full overflow-hidden" style={{ height: 72, background: '#1A0A05' }}>
      <svg viewBox="0 0 1200 72" preserveAspectRatio="xMidYMid slice"
           xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="1200" height="72" fill="#1A0A05"/>
        {/* Spoon 1 — red chilli */}
        <ellipse cx="80" cy="36" rx="22" ry="14" fill="#AA1A1A" transform="rotate(-20,80,36)"/>
        <rect x="94" y="31" width="38" height="7" rx="3.5" fill="#8B1414" transform="rotate(-20,80,36)"/>
        <ellipse cx="76" cy="33" rx="9" ry="6" fill="#FF3A3A" transform="rotate(-20,80,36)"/>
        {/* Spoon 2 — turmeric */}
        <ellipse cx="210" cy="38" rx="24" ry="15" fill="#D4A843" transform="rotate(15,210,38)"/>
        <rect x="225" y="33" width="40" height="8" rx="4" fill="#B8892A" transform="rotate(15,210,38)"/>
        <ellipse cx="206" cy="36" rx="10" ry="7" fill="#FFD700" transform="rotate(15,210,38)"/>
        {/* Seeds */}
        <circle cx="160" cy="24" r="3.5" fill="#8B6914" opacity="0.8"/>
        <circle cx="168" cy="52" r="3" fill="#8B6914" opacity="0.7"/>
        {/* Star anise */}
        <text x="158" y="42" fontSize="18" fill="#8B4513" opacity="0.85" fontFamily="serif">✳</text>
        {/* Spoon 3 — coriander green */}
        <ellipse cx="340" cy="36" rx="21" ry="13" fill="#5A8B1A" transform="rotate(-10,340,36)"/>
        <rect x="353" y="32" width="36" height="7" rx="3.5" fill="#4A7A14" transform="rotate(-10,340,36)"/>
        <ellipse cx="336" cy="35" rx="8" ry="6" fill="#7AB82A" transform="rotate(-10,340,36)"/>
        {/* Cardamom */}
        <ellipse cx="405" cy="28" rx="5" ry="10" fill="#4A7A14" opacity="0.85" transform="rotate(20,405,28)"/>
        <ellipse cx="418" cy="50" rx="5" ry="9" fill="#3A6A10" opacity="0.75" transform="rotate(-8,418,50)"/>
        {/* Spoon 4 — black pepper */}
        <ellipse cx="500" cy="40" rx="22" ry="14" fill="#2A2A2A" transform="rotate(18,500,40)"/>
        <rect x="514" y="35" width="38" height="7" rx="3.5" fill="#111111" transform="rotate(18,500,40)"/>
        <ellipse cx="496" cy="38" rx="9" ry="6" fill="#555555" transform="rotate(18,500,40)"/>
        <circle cx="458" cy="26" r="4" fill="#1A1A1A" opacity="0.9"/>
        <circle cx="450" cy="50" r="3.5" fill="#333333" opacity="0.8"/>
        {/* Cinnamon sticks */}
        <rect x="560" y="22" width="5" height="26" rx="2.5" fill="#8B4513" opacity="0.85" transform="rotate(12,562,35)"/>
        <rect x="570" y="18" width="5" height="26" rx="2.5" fill="#6B3410" opacity="0.75" transform="rotate(7,572,31)"/>
        {/* Spoon 5 — garam masala brown */}
        <ellipse cx="660" cy="36" rx="23" ry="14" fill="#8B4513" transform="rotate(-15,660,36)"/>
        <rect x="675" y="31" width="39" height="8" rx="4" fill="#6B3410" transform="rotate(-15,660,36)"/>
        <ellipse cx="656" cy="34" rx="9" ry="7" fill="#C06820" transform="rotate(-15,660,36)"/>
        {/* Spoon 6 — red chilli powder */}
        <ellipse cx="800" cy="38" rx="24" ry="15" fill="#CC2A00" transform="rotate(10,800,38)"/>
        <rect x="815" y="33" width="40" height="8" rx="4" fill="#AA2000" transform="rotate(10,800,38)"/>
        <ellipse cx="796" cy="36" rx="10" ry="7" fill="#FF5500" transform="rotate(10,800,38)"/>
        {/* Dried chillies */}
        <path d="M860,20 Q872,12 884,22 Q890,32 878,36 Q866,38 858,30 Z" fill="#8B0000" opacity="0.9"/>
        <line x1="860" y1="20" x2="857" y2="10" stroke="#228B22" strokeWidth="2.5"/>
        <path d="M888,46 Q900,38 912,48 Q918,58 906,62 Q894,64 886,56 Z" fill="#AA1A00" opacity="0.8"/>
        <line x1="888" y1="46" x2="885" y2="36" stroke="#228B22" strokeWidth="2"/>
        {/* Spoon 7 — pink salt */}
        <ellipse cx="1000" cy="36" rx="22" ry="13" fill="#E8A0A0" transform="rotate(-16,1000,36)"/>
        <rect x="1014" y="32" width="38" height="7" rx="3.5" fill="#C07070" transform="rotate(-16,1000,36)"/>
        <ellipse cx="996" cy="34" rx="9" ry="6" fill="#FFB0B0" transform="rotate(-16,1000,36)"/>
        <circle cx="960" cy="24" r="3.5" fill="#FFB0B0" opacity="0.7"/>
        <circle cx="952" cy="50" r="3" fill="#E8A0A0" opacity="0.6"/>
        {/* Spoon 8 — curry orange */}
        <ellipse cx="1120" cy="40" rx="23" ry="14" fill="#E8920A" transform="rotate(12,1120,40)"/>
        <rect x="1135" y="35" width="39" height="8" rx="4" fill="#C07008" transform="rotate(12,1120,40)"/>
        <ellipse cx="1116" cy="38" rx="9" ry="7" fill="#FFB800" transform="rotate(12,1120,40)"/>
        {/* Gold line */}
        <rect x="0" y="68" width="1200" height="4" fill="url(#fg)"/>
        <defs>
          <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#8B1A1A"/>
            <stop offset="33%"  stopColor="#D4A843"/>
            <stop offset="66%"  stopColor="#8B1A1A"/>
            <stop offset="100%" stopColor="#D4A843"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2D1810] text-white mt-auto" role="contentinfo">

      {/* Gold border */}
      <div className="h-1 w-full"
           style={{ background: 'linear-gradient(90deg,#8B1A1A 0%,#D4A843 30%,#8B1A1A 60%,#D4A843 100%)' }}
           aria-hidden="true" />

      {/* Spice strip */}
      <SpiceStripSVG />

      {/* Main content */}
      <div className="container-page py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col items-center sm:items-start">
            <div className="bg-white rounded-xl p-4 mb-4 flex flex-col items-center shadow-lg">
              <img src="/daadi-maa-logo.png" alt="Daadi Maa Spices"
                width={100} height={100}
                className="w-24 h-24 object-contain" />
              <p className="text-[10px] mt-1 text-center italic"
                 style={{ color: '#7A6B63', fontFamily: 'Georgia,serif' }}>
                Natural, Pure, Safe
              </p>
            </div>

            <p className="text-xs text-white/50 text-center sm:text-left mb-1">A Product of:</p>
            <h2 className="font-sans font-bold text-base text-white text-center sm:text-left mb-3">
              F & J SONS FOODS (PVT) LTD.
            </h2>
            <p className="text-white/60 text-xs leading-relaxed max-w-xs text-center sm:text-left">
              Premium quality spices authentically sourced and crafted to bring rich, vibrant
              flavours to every meal. Trusted by households across Pakistan.
            </p>

            <div className="flex gap-3 mt-4">
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center">
                <p className="text-[10px] font-bold text-accent">AHCS</p>
                <p className="text-[9px] text-white/50">PS 3733:2019</p>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center">
                <p className="text-[10px] font-bold text-accent">HALAL</p>
                <p className="text-[9px] text-white/50">KPFSHFA/2021</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/',                            label: 'Home' },
                { to: '/shop',                        label: 'Shop All Spices' },
                { to: '/shop?category=recipe-mixes',  label: 'Recipe Mixes' },
                { to: '/shop?category=spice-powders', label: 'Spice Powders' },
                { to: '/shop?category=salts',         label: 'Himalayan Salts' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="text-sm text-white/65 hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/65">
                <MapPin size={14} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Head Office: Mardan Swabi Road, Village Baghicha Dheri, District Mardan, KPK
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/65">
                <Phone size={14} className="text-accent flex-shrink-0" />
                <div>
                  <a href="tel:03149007440" className="hover:text-accent transition-colors block">0314-9007440</a>
                  <a href="tel:03332001341" className="hover:text-accent transition-colors block">0333-2001341</a>
                </div>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/65">
                <Mail size={14} className="text-accent flex-shrink-0" />
                <a href="mailto:sales@fjsons.pk" className="hover:text-accent transition-colors">
                  sales@fjsons.pk
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/65">
                <Globe size={14} className="text-accent flex-shrink-0" />
                <a href="https://www.fjsons.pk" target="_blank" rel="noopener noreferrer"
                   className="hover:text-accent transition-colors">
                  www.fjsons.pk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40 text-center sm:text-left">
            © {year} F & J Sons Foods (Pvt) Ltd. All rights reserved.
          </p>
          <Link to="/admin/login"
            className="text-xs text-white/25 hover:text-white/50 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
