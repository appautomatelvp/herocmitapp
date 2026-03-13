const DS_STYLE = `
  :root {
    --c-primary: #0f4c81;
    --c-primary-light: #1a6fc4;
    --c-accent: #00b4d8;
    --c-accent2: #10b981;
    --c-bg: #f0f4f8;
    --c-surface: #ffffff;
    --c-text: #1a2940;
    --c-text-muted: #64748b;
    --c-border: #e2e8f0;
    --c-danger: #dc2626;
    --c-warning: #d97706;
    --shadow-sm: 0 1px 3px rgba(0,0,0,.08);
    --shadow-md: 0 4px 16px rgba(0,0,0,.10);
    --shadow-lg: 0 8px 32px rgba(0,0,0,.14);
    --r-sm: 10px; --r-md: 16px; --r-lg: 24px;
  }
  @keyframes fadeInUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes slideInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(0,180,216,.4)} 50%{box-shadow:0 0 0 8px rgba(0,180,216,0)} }
  @keyframes shimmer    { from{background-position:-200% 0} to{background-position:200% 0} }
  .animate-fadeInUp   { animation: fadeInUp   .35s ease both }
  .animate-fadeIn     { animation: fadeIn     .25s ease both }
  .animate-slideInRight{ animation: slideInRight .3s ease both }
  .hero-card { background:var(--c-surface); border-radius:var(--r-md); box-shadow:var(--shadow-sm); border:1px solid var(--c-border); }
  .hero-card-hover { transition:box-shadow .2s,transform .2s; }
  .hero-card-hover:hover { box-shadow:var(--shadow-md); transform:translateY(-1px); }
  .hero-btn-primary { background:var(--c-primary); color:#fff; border-radius:var(--r-sm); font-weight:800; transition:background .15s,transform .1s; }
  .hero-btn-primary:hover { background:var(--c-primary-light); }
  .hero-btn-primary:active { transform:scale(.97); }
  .hide-scrollbar::-webkit-scrollbar { display:none; }
  .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
  .tab-active-indicator { position:relative; }
  .tab-active-indicator::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px; background:var(--c-primary); border-radius:2px; }
  .skeleton { background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:6px; }
`;

if (typeof document !== 'undefined' && !document.getElementById('hero-ds')) {
  const s = document.createElement('style');
  s.id = 'hero-ds';
  s.textContent = DS_STYLE;
  document.head.appendChild(s);
}
