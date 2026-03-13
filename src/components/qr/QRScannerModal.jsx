import React from 'react';
import { QrCode, X, Camera, ImagePlus } from 'lucide-react';

const QRScannerModal = ({ isOpen, onClose, employees, guests, onScanSuccess, showToast }) => {
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const animFrameRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const [scanning, setScanning] = React.useState(false);
  const [scanStatus, setScanStatus] = React.useState('Đang khởi động camera...');
  const [camError, setCamError] = React.useState('');

  const stopCamera = React.useCallback(() => {
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
  }, []);

  const scanFrame = React.useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !window.jsQR) { animFrameRef.current = requestAnimationFrame(scanFrame); return; }
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight; canvas.width = video.videoWidth;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = window.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
      if (code) {
        const qrData = code.data;
        if (qrData.startsWith('HERO-')) {
          const emp = employees.find((e) => e.qrToken === qrData);
          if (emp) { stopCamera(); setScanning(false); onScanSuccess({ type: 'employee', data: emp }); onClose(); return; }
          setScanStatus('⚠️ Mã hợp lệ nhưng không tìm thấy nhân viên...');
        } else if (qrData.startsWith('GUEST-')) {
          const guest = (guests || []).find((g) => g.qrToken === qrData || g.guestCode === qrData);
          if (guest) { stopCamera(); setScanning(false); onScanSuccess({ type: 'guest', data: guest }); onClose(); return; }
          setScanStatus('⚠️ Mã Khách hợp lệ nhưng không tìm thấy hồ sơ...');
        } else {
          setScanStatus('⚠️ Mã QR không phải của HERO System...');
        }
      }
    }
    animFrameRef.current = requestAnimationFrame(scanFrame);
  }, [employees, guests, onClose, onScanSuccess, stopCamera]);

  const startScanning = React.useCallback(async () => {
    try {
      setCamError(''); setScanStatus('Đang khởi động camera...');
      if (typeof window.jsQR === 'undefined') {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
          s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
        });
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);
        setScanStatus('Đưa QR Code Nhân viên hoặc Khách vào khung hình...');
        scanFrame();
      }
    } catch (err) {
      setCamError('Không thể truy cập camera. Vui lòng cấp quyền và thử lại.');
    }
  }, [scanFrame]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanStatus('Đang phân tích hình ảnh...');

    if (typeof window.jsQR === 'undefined') {
      await new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
        s.onload = resolve; document.head.appendChild(s);
      });
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = window.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });

        if (code && code.data.startsWith('HERO-')) {
          const emp = employees.find((emp) => emp.qrToken === code.data);
          if (emp) {
            stopCamera(); setScanning(false); onScanSuccess({ type: 'employee', data: emp }); onClose();
          } else {
            showToast('Mã hợp lệ nhưng không tìm thấy dữ liệu nhân viên.', 'warning');
            setScanStatus('Đưa QR Code vào khung hình...');
          }
        } else if (code && code.data.startsWith('GUEST-')) {
          const guest = (guests || []).find((g) => g.qrToken === code.data || g.guestCode === code.data);
          if (guest) {
            stopCamera(); setScanning(false); onScanSuccess({ type: 'guest', data: guest }); onClose();
          } else {
            showToast('Mã Khách hợp lệ nhưng không tìm thấy hồ sơ.', 'warning');
            setScanStatus('Đưa QR Code vào khung hình...');
          }
        } else {
          showToast('Không tìm thấy mã QR HERO hợp lệ trong hình ảnh.', 'error');
          setScanStatus('Đưa QR Code vào khung hình...');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  React.useEffect(() => {
    if (isOpen) startScanning();
    else { stopCamera(); setScanning(false); setCamError(''); }
    return () => stopCamera();
  }, [isOpen, startScanning, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col">
      <div className="bg-gray-900/90 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center"><QrCode size={20} className="text-white" /></div>
          <div><h2 className="text-white font-black text-sm">Quét QR Đa năng</h2><p className="text-gray-400 text-xs">Nhân viên & Khách • HERO System</p></div>
        </div>
        <button onClick={() => { stopCamera(); onClose(); }} className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition"><X size={18} /></button>
      </div>
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        {camError ? (
          <div className="text-center p-8">
            <Camera size={60} className="text-gray-500 mx-auto mb-4" />
            <p className="text-white font-bold mb-2">Lỗi Camera</p>
            <p className="text-gray-400 text-sm mb-6">{camError}</p>
            <button onClick={startScanning} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold mb-4 w-full">Thử lại Camera</button>
            <div className="text-gray-500 text-xs my-2">HOẶC</div>
            <label className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border border-gray-700 hover:bg-gray-700 transition">
              <ImagePlus size={18} /> Chọn ảnh từ thư viện
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        ) : (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="relative w-56 h-56 border-2 border-white/30 rounded-2xl mb-8">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-400 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-400 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-400 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-400 rounded-br-xl"></div>
                {scanning && <div className="absolute left-0 right-0 h-0.5 bg-blue-400 opacity-90" style={{ animation: 'scanLine 2s ease-in-out infinite', top: '50%' }}></div>}
              </div>
            </div>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10 px-4">
              <label className="bg-gray-900/80 backdrop-blur-md text-white px-6 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 cursor-pointer border border-white/20 shadow-xl hover:bg-gray-800 transition active:scale-95 pointer-events-auto">
                <ImagePlus size={18} /> Chọn ảnh từ thư viện
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </>
        )}
      </div>
      <div className="bg-gray-900/95 px-4 py-4 text-center">
        <div className={`text-sm font-bold ${scanning ? 'text-blue-300' : 'text-gray-400'}`}>
          {scanning ? <span className="flex items-center justify-center gap-2"><span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-ping"></span>{scanStatus}</span> : scanStatus}
        </div>
        <p className="text-gray-600 text-xs mt-1">Đưa mã vào khung hoặc tải ảnh lên để nhận diện</p>
      </div>
      <style>{`
        @keyframes scanLine{0%,100%{transform:translateY(-80px);opacity:.8}50%{transform:translateY(80px);opacity:1}}
        .custom-scrollbar::-webkit-scrollbar{width:4px;height:4px}
        .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
        .custom-scrollbar::-webkit-scrollbar-thumb:hover{background:#94a3b8}
        * { -webkit-tap-highlight-color: transparent; }
        input, textarea, select { font-size: 16px !important; }
        @media (max-width: 640px) {
          .mobile-text-xs { font-size: 11px !important; }
          .mobile-compact { padding: 8px !important; }
        }
      `}</style>
    </div>
  );
};

export default QRScannerModal;

