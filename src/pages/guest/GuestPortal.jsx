import React from 'react';
import {
  HardHat,
  X,
  BadgeCheck,
  UserPlus,
  Loader2,
  CheckCircle2,
  UserCheck,
  QrCode,
} from 'lucide-react';

import { QRCodeDisplay } from '../../components/QRCodeDisplay.jsx';
import {
  ensureAnonymousAuth,
  generateSmartGuestCode,
  addDoc,
  getCollection,
  query,
  where,
  getDocs,
} from '../../config/firebase.js';

const GuestPortal = ({ isOpen, onClose, showToast, onLoginSuccess, initialTab }) => {
  const [activeTab, setActiveTab] = React.useState(initialTab || 'login');

  React.useEffect(() => {
    if (isOpen) setActiveTab(initialTab || 'login');
  }, [isOpen, initialTab]);

  const [guestCode, setGuestCode] = React.useState('');
  const [loginPass, setLoginPass] = React.useState('');
  const [logging, setLogging] = React.useState(false);

  const handleLogin = async () => {
    if (!guestCode.trim() || !loginPass.trim()) return showToast('Vui lòng điền đầy đủ!', 'error');
    setLogging(true);
    try {
      await ensureAnonymousAuth();
      const q = query(getCollection('guests'), where('guestCode', '==', guestCode.trim().toUpperCase()));
      const snap = await getDocs(q);
      if (snap.empty) { showToast('Mã đăng ký không tồn tại!', 'error'); setLogging(false); return; }
      const guestData = { ...snap.docs[0].data(), id: snap.docs[0].id };
      if (guestData.status === 'pending') { showToast('Tài khoản đang chờ phê duyệt! Vui lòng liên hệ bảo vệ cổng.', 'warning'); setLogging(false); return; }
      if (guestData.status === 'rejected') { showToast('Tài khoản đã bị từ chối!', 'error'); setLogging(false); return; }
      if (guestData.status === 'banned') { showToast('Tài khoản đã bị khóa! Liên hệ bảo vệ cổng để được hỗ trợ.', 'error'); setLogging(false); return; }
      const storedPass = (guestData.tempPassword || '').trim();
      const fallbackPass = (guestData.idCard || '').replace(/\s/g, '').slice(-6);
      const expectedPass = storedPass || fallbackPass;
      if (loginPass.trim() !== expectedPass) { showToast('Mật khẩu không đúng! (6 số cuối CCCD)', 'error'); setLogging(false); return; }
      onLoginSuccess(guestData); onClose();
    } catch (e) {
      console.error(e);
      showToast('Lỗi đăng nhập! Vui lòng thử lại.', 'error');
    } finally {
      setLogging(false);
    }
  };

  const [form, setForm] = React.useState({
    name: '',
    type: 'guest',
    company: '',
    phone: '',
    idCard: '',
    purpose: '',
    safetyAgreed: false,
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [guestCodeResult, setGuestCodeResult] = React.useState('');
  const [autoDownloadData, setAutoDownloadData] = React.useState(null);

  const handleSubmit = async () => {
    if (!form.name.trim()) return showToast('Vui lòng nhập họ tên!', 'error');
    if (!form.phone.trim()) return showToast('Vui lòng nhập số điện thoại!', 'error');
    if (!form.idCard.trim()) return showToast('Vui lòng nhập số CCCD/Hộ chiếu!', 'error');
    if (!form.purpose.trim()) return showToast('Vui lòng nhập mục đích vào cổng!', 'error');
    if (!form.safetyAgreed) return showToast('Vui lòng đồng ý quy định an toàn!', 'error');
    setSubmitting(true);
    try {
      await ensureAnonymousAuth();
      const gCode = generateSmartGuestCode(form.name, form.company);
      const qrToken = `GUEST-QR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const tempPass = form.idCard.replace(/\s/g, '').slice(-6);
      await addDoc(getCollection('guests'), {
        name: form.name.trim(),
        type: form.type,
        company: form.company.trim(),
        phone: form.phone.trim(),
        idCard: form.idCard.trim(),
        purpose: form.purpose.trim(),
        safetyAgreed: true,
        guestCode: gCode,
        qrToken,
        tempPassword: tempPass,
        status: 'pending',
        registeredAt: Date.now(),
        registeredDate: new Date().toLocaleDateString('vi-VN'),
        approvedBy: null,
        approvedAt: null,
      });
      setGuestCodeResult(gCode);
      setSubmitted(true);
      setAutoDownloadData({ name: form.name.trim(), company: form.company.trim(), type: form.type, guestCode: gCode, qrToken });
    } catch (e) {
      console.error(e);
      showToast('Lỗi đăng ký. Vui lòng thử lại!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setForm({ name: '', type: 'guest', company: '', phone: '', idCard: '', purpose: '', safetyAgreed: false });
    setGuestCode('');
    setLoginPass('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[95vh] flex flex-col">
        <div className="bg-[#0f4c81] px-5 py-5 text-white flex justify-between items-start shrink-0">
          <div>
            <h2 className="font-black text-xl flex items-center gap-2"><HardHat size={20} />Khách & Nhà thầu</h2>
            <p className="text-blue-200 text-sm">Cảng Quốc tế Cái Mép — CMIT</p>
          </div>
          <button onClick={resetAndClose} className="text-white/70 hover:text-white bg-white/15 hover:bg-white/25 rounded-full p-2 transition"><X size={18} /></button>
        </div>

        <div className="flex border-b border-gray-100 shrink-0 bg-white">
          <button onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-black transition border-b-2 ${activeTab === 'login' ? 'text-[#0f4c81] border-[#0f4c81] bg-blue-50/50' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
            <span className="flex items-center justify-center gap-1.5"><BadgeCheck size={15} /> Đăng nhập</span>
          </button>
          <button onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-sm font-black transition border-b-2 ${activeTab === 'register' ? 'text-[#0f4c81] border-[#0f4c81] bg-blue-50/50' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
            <span className="flex items-center justify-center gap-1.5"><UserPlus size={15} /> Đăng ký mới</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'login' && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mã đăng ký</label>
                <input type="text" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 uppercase font-mono font-bold"
                  placeholder="GUEST-XXXXXXXX" value={guestCode} onChange={(e) => setGuestCode(e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mật khẩu</label>
                <input type="password" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="6 số cuối CCCD/Hộ chiếu" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                <p className="text-xs text-gray-400 mt-1">Mật khẩu mặc định = 6 số cuối CCCD</p>
              </div>
              <button onClick={handleLogin} disabled={logging} className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-black shadow hover:bg-teal-700 transition flex items-center justify-center gap-2">
                {logging ? <Loader2 className="animate-spin" size={16} /> : <BadgeCheck size={16} />} Đăng nhập
              </button>
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">Chưa có tài khoản? <button onClick={() => setActiveTab('register')} className="text-emerald-600 font-bold hover:underline">Đăng ký ngay</button></p>
              </div>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={40} className="text-green-600" /></div>
                  <h3 className="text-xl font-black text-gray-800 mb-2">Đăng ký thành công!</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left mb-4">
                    <p className="text-sm font-bold text-blue-800 mb-2">📌 Mã đăng ký của bạn:</p>
                    <p className="text-lg font-black font-mono text-blue-700 text-center py-2 bg-white rounded-lg border border-blue-200 select-all">{guestCodeResult}</p>
                    <p className="text-xs text-blue-600 mt-2 text-center">Lưu lại mã này để đăng nhập sau khi được duyệt</p>
                  </div>
                  {autoDownloadData && (
                    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-4 mb-4 flex flex-col items-center gap-3">
                      <p className="text-xs font-bold text-teal-700 uppercase flex items-center gap-1.5"><QrCode size={13} /> Thẻ QR của bạn</p>
                      <QRCodeDisplay
                        value={autoDownloadData.qrToken}
                        size={140}
                        employeeName={autoDownloadData.name}
                        employeeCode={autoDownloadData.guestCode}
                        cardSubtitle={autoDownloadData.type === 'contractor' ? 'Nhà thầu phụ' : 'Khách thăm quan'}
                        cardGroup={autoDownloadData.company || ''}
                        isGuestCard={true}
                        showDownloadBtn={true}
                      />
                      <p className="text-[10px] text-teal-500 text-center">Thẻ đã sẵn sàng. Nhấn nút để tải về máy.</p>
                    </div>
                  )}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left mb-4">
                    <p className="text-xs font-bold text-yellow-800 uppercase mb-1">⏳ Đang chờ phê duyệt</p>
                    <p className="text-sm text-yellow-700">Thông tin đã được gửi đến Quản trị viên. Mật khẩu đăng nhập = 6 số cuối CCCD.</p>
                  </div>
                  <button onClick={resetAndClose} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">Đóng lại</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bạn là</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ val: 'guest', icon: '👤', label: 'Khách thăm quan', desc: 'Đối tác, khách hàng' }, { val: 'contractor', icon: '🏗️', label: 'Nhà thầu phụ', desc: 'Đội thi công, dịch vụ' }].map((opt) => (
                        <button key={opt.val} onClick={() => setForm({ ...form, type: opt.val })}
                          className={`p-3 rounded-xl border-2 text-left transition ${form.type === opt.val ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="text-2xl mb-1">{opt.icon}</div>
                          <div className="font-bold text-sm text-gray-800">{opt.label}</div>
                          <div className="text-xs text-gray-500">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ và tên <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Nguyễn Văn A..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{form.type === 'contractor' ? 'Tên công ty / Đơn vị' : 'Công ty (nếu có)'}</label>
                    <input type="text" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Tên công ty..." value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Điện thoại <span className="text-red-500">*</span></label>
                      <input type="tel" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0901..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CCCD / Hộ chiếu <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="012345..." value={form.idCard} onChange={(e) => setForm({ ...form, idCard: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mục đích vào cổng <span className="text-red-500">*</span></label>
                    <textarea className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-20 resize-none" placeholder="Mô tả công việc/mục đích..." value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-red-700 uppercase mb-2">⚠️ Quy định An toàn Cảng CMIT</p>
                    <ul className="text-xs text-red-600 space-y-1 mb-3">
                      <li>• Bắt buộc đội mũ bảo hộ, mặc áo phản quang trong khu vực hoạt động</li>
                      <li>• Không tự ý vào cầu tàu, bãi container khi chưa có người hướng dẫn</li>
                      <li>• Tuân thủ hiệu lệnh của nhân viên an toàn CMIT</li>
                      <li>• Nghiêm cấm dùng điện thoại khi di chuyển trong khu vực hoạt động</li>
                    </ul>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.safetyAgreed} onChange={(e) => setForm({ ...form, safetyAgreed: e.target.checked })} className="mt-0.5 w-4 h-4 text-emerald-600 rounded" />
                      <span className="text-xs font-bold text-gray-700">Tôi đã đọc và đồng ý tuân thủ tất cả quy định an toàn của Cảng CMIT</span>
                    </label>
                  </div>
                  <button onClick={handleSubmit} disabled={submitting || !form.safetyAgreed}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-base shadow-lg hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <UserCheck size={18} />}
                    {submitting ? 'Đang gửi...' : 'Gửi đăng ký'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestPortal;

