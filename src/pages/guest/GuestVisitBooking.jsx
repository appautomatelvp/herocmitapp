import React from 'react';
import { CalendarDays, CheckCircle2, Loader2, Send, X } from 'lucide-react';
import { addDoc, ensureAnonymousAuth, getCollection } from '../../config/firebase.js';

const GuestVisitBooking = ({ currentGuest, showToast, onClose }) => {
  const [form, setForm] = React.useState({
    purpose: '',
    visitDate: '',
    timeStart: '',
    timeEnd: '',
    notes: '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async () => {
    if (!form.purpose.trim()) return showToast('Vui lòng nhập mục đích!', 'error');
    if (!form.visitDate) return showToast('Vui lòng chọn ngày!', 'error');
    if (!form.timeStart) return showToast('Vui lòng chọn giờ vào!', 'error');
    setSubmitting(true);
    try {
      await ensureAnonymousAuth();
      await addDoc(getCollection('guest_visits'), {
        guestId: currentGuest.id,
        guestName: currentGuest.name,
        guestCode: currentGuest.guestCode,
        guestType: currentGuest.type,
        company: currentGuest.company || '',
        purpose: form.purpose.trim(),
        visitDate: form.visitDate,
        timeStart: form.timeStart,
        timeEnd: form.timeEnd || '',
        notes: form.notes.trim(),
        status: 'pending',
        requestedAt: Date.now(),
        requestedDate: new Date().toLocaleDateString('vi-VN'),
        checkinAt: null,
        checkoutAt: null,
        type: 'booking',
      });
      setSubmitted(true);
      showToast('✅ Đã gửi yêu cầu đặt lịch!');
    } catch (e) {
      console.error(e);
      showToast('Lỗi gửi yêu cầu!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>
        <h3 className="text-xl font-black text-gray-800 mb-2">Đã gửi yêu cầu!</h3>
        <p className="text-sm text-gray-500 mb-2">
          Lịch vào cảng <b>{form.visitDate}</b> lúc <b>{form.timeStart}</b> đang chờ Quản lý phê duyệt.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5">
          <p className="text-xs text-yellow-700 font-bold">⏳ Trạng thái: Chờ duyệt</p>
          <p className="text-xs text-yellow-600 mt-1">Bạn sẽ thấy kết quả trong tab Lịch sử sau khi Quản lý xử lý.</p>
        </div>
        <button onClick={onClose} className="w-full py-3 bg-teal-600 text-white rounded-xl font-black hover:bg-teal-700 transition">
          Đóng
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0f4c81] px-5 py-5 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-black text-lg flex items-center gap-2"><CalendarDays size={20} />Đặt lịch vào cảng</h2>
            <p className="text-blue-200 text-xs mt-0.5">Gửi yêu cầu cho lần vào cảng tiếp theo</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white bg-white/15 hover:bg-white/25 rounded-full p-2 transition">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs text-teal-700">
            <b>📋 Lưu ý:</b> Yêu cầu sẽ được gửi đến Quản lý và cần được phê duyệt trước khi vào cổng.
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày vào cảng <span className="text-red-500">*</span></label>
            <input
              type="date"
              min={today}
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              value={form.visitDate}
              onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giờ vào <span className="text-red-500">*</span></label>
              <input
                type="time"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                value={form.timeStart}
                onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giờ ra (dự kiến)</label>
              <input
                type="time"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                value={form.timeEnd}
                onChange={(e) => setForm({ ...form, timeEnd: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mục đích <span className="text-red-500">*</span></label>
            <textarea
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 h-24 resize-none text-sm"
              placeholder="Mô tả công việc / mục đích vào cảng lần này..."
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ghi chú thêm</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              placeholder="Số người, thiết bị mang theo..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 bg-teal-600 text-white rounded-xl font-black text-base shadow hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 className="animate-spin" size={18} />Đang gửi...</> : <><Send size={18} />Gửi yêu cầu đặt lịch</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestVisitBooking;

