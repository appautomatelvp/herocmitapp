import React from 'react';
import { DownloadCloud, Loader2 } from 'lucide-react';

// ── Vẽ thẻ dọc (Portrait) chuyên nghiệp rồi tải về ───────────────────────
const downloadHeroCard = async ({ qrDataUrl, name, code, subtitle, group, isGuest }) => {
  const W = 400, H = 640; // Portrait (dọc)
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const accent = isGuest ? '#10b981' : '#3b82f6';
  const accent2 = isGuest ? '#064e3b' : '#1e3a8a';
  const accent3 = isGuest ? '#065f46' : '#1d4ed8';

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, accent2);
  g.addColorStop(1, accent3);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  for (let x = 0; x < W; x += 20) for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill(); }

  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, W, 6);

  ctx.textAlign = 'center';
  ctx.fillStyle = accent;
  ctx.font = 'bold 11px Arial';
  ctx.fillText(isGuest ? 'CMIT • VISITOR PASS' : 'CMIT • HERO SYSTEM', W / 2, 36);

  const cx = W / 2, cy = 120, cr = 52;
  ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(cx, cy, cr + 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 38px Arial'; ctx.textBaseline = 'middle';
  const avatarChar = isGuest ? (subtitle?.includes('thầu') ? '🏗' : '👤') : (name?.charAt(0) || '?');
  ctx.fillText(avatarChar, cx, cy);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 22px Arial';
  const dn = name?.length > 20 ? name.slice(0, 18) + '…' : (name || '');
  ctx.fillText(dn, W / 2, 198);

  ctx.fillStyle = accent; ctx.font = 'bold 13px Arial';
  ctx.fillText(code || '', W / 2, 222);

  ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.font = '12px Arial';
  ctx.fillText(subtitle || '', W / 2, 244);

  if (group) { ctx.fillStyle = 'rgba(255,255,255,0.40)'; ctx.font = '11px Arial'; ctx.fillText(group, W / 2, 264); }

  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(40, 278); ctx.lineTo(W - 40, 278); ctx.stroke();

  if (qrDataUrl) {
    const qs = 190, qx = (W - qs) / 2, qy = 292;
    ctx.fillStyle = '#ffffff'; _rrect(ctx, qx - 12, qy - 12, qs + 24, qs + 24, 16); ctx.fill();
    const img = new Image();
    await new Promise((r) => { img.onload = r; img.src = qrDataUrl; });
    ctx.drawImage(img, qx, qy, qs, qs);
  }

  ctx.fillStyle = accent; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center';
  ctx.fillText(isGuest ? 'QUÉT ĐỂ VÀO/RA CỔNG CMIT' : 'QUÉT ĐỂ ĐĂNG NHẬP HERO', W / 2, 512);

  ctx.fillStyle = 'rgba(255,255,255,0.30)'; ctx.font = '10px Arial';
  ctx.fillText('Cai Mep International Terminal', W / 2, 542);
  ctx.fillText(`Ngày in: ${new Date().toLocaleDateString('vi-VN')}`, W / 2, 560);

  ctx.fillStyle = accent;
  ctx.fillRect(0, H - 6, W, 6);

  const link = document.createElement('a');
  link.download = `CMIT-Card-${(code || name || 'card').replace(/\s/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

function _rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

export const QRCodeDisplay = ({
  value,
  size = 200,
  employeeName,
  employeeCode,
  cardSubtitle,
  cardGroup,
  isGuestCard = false,
  showDownloadBtn = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = React.useState(null);
  const [downloading, setDownloading] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 20;

  React.useEffect(() => {
    if (!value) return;
    let attempts = 0;
    let timer = null;

    const tryGenerate = () => {
      if (typeof window.qrcode !== 'undefined') {
        try {
          const qr = window.qrcode(0, 'M');
          qr.addData(value);
          qr.make();
          const cellSize = Math.max(2, Math.floor(size / qr.getModuleCount()));
          const url = qr.createDataURL(cellSize, 2);
          setQrDataUrl(url);
          return;
        } catch (e) {
          console.error('QR Gen Error:', e);
        }
      }

      attempts++;
      if (attempts < maxRetries) {
        timer = setTimeout(tryGenerate, 500);
        setRetryCount(attempts);
      }
    };

    if (!document.querySelector('script[src*=\"qrcode.min.js\"]')) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
      s.onload = () => tryGenerate();
      document.body.appendChild(s);
    } else {
      tryGenerate();
    }

    return () => { if (timer) clearTimeout(timer); };
  }, [value, size]);

  const handleDownload = async () => {
    if (!qrDataUrl) return;
    setDownloading(true);
    try {
      await downloadHeroCard({
        qrDataUrl,
        name: employeeName,
        code: employeeCode,
        subtitle: cardSubtitle,
        group: cardGroup,
        isGuest: isGuestCard,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  if (!value || !qrDataUrl) {
    return (
      <div style={{ width: size, height: size }} className="flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200 gap-2">
        <Loader2 className="animate-spin text-teal-500" size={28} />
        <p className="text-[10px] text-gray-400 font-medium">Đang tạo mã QR{retryCount > 0 ? ` (${retryCount})` : ''}...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="bg-white p-3 rounded-2xl shadow-lg border-2 border-teal-100 flex items-center justify-center">
        <img
          src={qrDataUrl}
          alt={`QR ${employeeName || 'User'}`}
          style={{ width: size, height: size, imageRendering: 'pixelated' }}
          className="rounded-lg object-contain"
        />
      </div>
      {employeeName && (
        <div className="text-center">
          <p className="font-black text-gray-800 text-sm">{employeeName}</p>
          <p className="text-xs text-gray-500 font-mono">{employeeCode}</p>
          <p className="text-[10px] text-gray-400 mt-1">{isGuestCard ? 'Thẻ vào cổng CMIT' : 'Quét mã để đăng nhập HERO'}</p>
        </div>
      )}
      {showDownloadBtn && (
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-sm font-black shadow-md transition active:scale-95 disabled:opacity-60"
        >
          {downloading ? (
            <>
              <Loader2 className="animate-spin" size={15} /> Đang tạo thẻ...
            </>
          ) : (
            <>
              <DownloadCloud size={15} /> Tải thẻ về máy
            </>
          )}
        </button>
      )}
    </div>
  );
};

