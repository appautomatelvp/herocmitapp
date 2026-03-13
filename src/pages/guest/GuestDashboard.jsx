import React from 'react';
import { BadgeCheck, CalendarDays, CheckCircle2, LogOut } from 'lucide-react';
import { getCollection, onSnapshot, orderBy, query, where } from '../../config/firebase.js';
import { QRCodeDisplay } from '../../components/QRCodeDisplay.jsx';
import GuestVisitBooking from './GuestVisitBooking.jsx';

const GuestDashboard = ({ currentGuest, showToast, handleLogout }) => {
  const [activeTab, setActiveTab] = React.useState('safety');
  const [guestNotes, setGuestNotes] = React.useState([]);
  const [guestVisits, setGuestVisits] = React.useState([]);
  const [showBooking, setShowBooking] = React.useState(false);

  React.useEffect(() => {
    if (!currentGuest?.id) return;
    const q = query(getCollection('guest_notes'), where('guestId', '==', currentGuest.id), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => setGuestNotes(snap.docs.map((d) => ({ ...d.data(), id: d.id }))),
      (err) => console.warn(err),
    );
    return () => unsub();
  }, [currentGuest?.id]);

  React.useEffect(() => {
    if (!currentGuest?.id) return;
    // NOTE: giữ nguyên logic hiện tại (orderBy('timestamp','desc'))
    const q = query(getCollection('guest_visits'), where('guestId', '==', currentGuest.id), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => setGuestVisits(snap.docs.map((d) => ({ ...d.data(), id: d.id }))),
      (err) => console.warn(err),
    );
    return () => unsub();
  }, [currentGuest?.id]);

  const SAFETY_RULES = [
    { icon: '🦺', title: 'Trang bị Bảo hộ Cá nhân', rules: ['Bắt buộc đội mũ bảo hộ (màu theo quy định) khi vào khu vực hoạt động', 'Mặc áo phản quang đúng tiêu chuẩn EN 471', 'Mang giày bảo hộ mũi sắt trong toàn bộ khu vực cảng', 'Dây an toàn khi làm việc trên cao (>2m)'] },
    { icon: '🚧', title: 'Quy tắc Giao thông Cảng', rules: ['Tuyệt đối không đi bộ trong làn đường dành cho xe nâng và xe đầu kéo', 'Sử dụng đường đi bộ có kẻ vạch và vỉa hè được chỉ định', 'Nhường đường cho thiết bị nâng hạ và phương tiện cảng', 'Tốc độ xe tối đa trong cảng: 15 km/h'] },
    { icon: '⚡', title: 'An toàn Điện & Hóa chất', rules: ['Không tự ý chạm vào tủ điện, thiết bị điện khi chưa có phép', 'Báo cáo ngay nếu phát hiện hóa chất rò rỉ', 'Không hút thuốc trong khu vực cảng (trừ nơi cho phép)', 'Giữ tối thiểu 3m khỏi container đang được cẩu'] },
    { icon: '🆘', title: 'Ứng phó Khẩn cấp', rules: ['Hotline khẩn cấp: 0989.715.843 (Trực ban 24/7)', 'Thoát hiểm theo biển chỉ dẫn màu xanh lá', 'Điểm tập kết: Trước cổng chính (Cổng 1)', 'Báo cáo TAI NẠN ngay lập tức dù nhỏ hay lớn'] },
    { icon: '📋', title: 'Quy định Hành chính', rules: ['Luôn đeo thẻ ra vào/thẻ khách ở nơi dễ nhìn thấy', 'Không chụp ảnh, quay phim khi chưa được phép', 'Không tự ý lấy hoặc di chuyển tài sản của cảng', 'Xuất trình thẻ khi được nhân viên an ninh yêu cầu'] },
  ];

  const isApproved = currentGuest.status === 'approved';
  const statusColor = isApproved ? 'from-[#0f4c81] to-[#1a6fc4]' : 'from-amber-600 to-orange-600';

  return (
    <>
      <div className="min-h-screen" style={{ background: 'var(--c-bg)' }}>
        <div className={`bg-gradient-to-br ${statusColor} px-4 pt-5 pb-0 text-white sticky top-0 z-50 shadow-lg`}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center text-2xl border border-white/20 shadow-inner">
                {currentGuest.type === 'contractor' ? '🏗️' : '👤'}
              </div>
              <div>
                <h1 className="font-black text-lg leading-tight">{currentGuest.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-white/60 text-xs font-mono">{currentGuest.guestCode}</span>
                  {currentGuest.company && <><span className="text-white/30">•</span><span className="text-white/70 text-xs">{currentGuest.company}</span></>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBooking(true)}
                className="bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl px-3 py-2 text-xs font-bold transition flex items-center gap-1.5"
              >
                <CalendarDays size={13} />Đặt lịch
              </button>
              <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 rounded-xl p-2 transition">
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <div className="bg-white/10 rounded-t-xl px-3 py-2 flex items-center gap-2 border-b-0">
            <BadgeCheck size={14} className="text-emerald-300 shrink-0" />
            <span className="text-xs font-bold text-emerald-200">Đã phê duyệt bởi CMIT</span>
            {currentGuest.approvedDate && <span className="text-white/40 text-xs ml-auto">{currentGuest.approvedDate}</span>}
          </div>
        </div>

        <div className="bg-white shadow-sm sticky top-[114px] z-40 border-b border-gray-100">
          <div className="flex overflow-x-auto hide-scrollbar">
            {[
              { id: 'safety', label: 'An toàn', icon: '🦺' },
              { id: 'qr', label: 'Thẻ QR', icon: '🪪' },
              { id: 'history', label: 'Lịch', icon: '📅', count: 0 },
              { id: 'info', label: 'Hồ sơ', icon: '📋' },
              { id: 'notes', label: 'Ghi chú', icon: '📝', count: guestNotes.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap transition flex-shrink-0
                  ${activeTab === tab.id ? 'text-[#0f4c81] border-b-2 border-[#0f4c81]' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
              >
                <span className="text-sm">{tab.icon}</span>{tab.label}
                {tab.count > 0 && <span className="bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 max-w-2xl mx-auto pb-8">
          {activeTab === 'safety' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                <h2 className="font-black text-red-700 text-lg mb-1">⚠️ Quy định An toàn Bắt buộc</h2>
                <p className="text-red-600 text-sm">Vui lòng đọc kỹ và tuân thủ nghiêm ngặt trong suốt thời gian ở lại cảng CMIT.</p>
              </div>
              {SAFETY_RULES.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <h3 className="font-black text-gray-800 flex items-center gap-2"><span className="text-xl">{s.icon}</span>{s.title}</h3>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2.5">
                      {s.rules.map((r, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-gray-700">
                          <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 size={12} className="text-teal-600" />
                          </div>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="bg-red-600 rounded-2xl p-5 text-white text-center">
                <div className="text-4xl mb-2">🆘</div>
                <h3 className="font-black text-xl mb-1">Khẩn cấp</h3>
                <a href="tel:0989715843" className="text-3xl font-black block py-2 bg-white/20 rounded-xl mt-2 hover:bg-white/30 transition">0989.715.843</a>
                <p className="text-red-200 text-xs mt-2">Hotline Trực ban 24/7 • CMIT</p>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-teal-50 px-4 py-3 border-b border-teal-100"><h3 className="font-bold text-teal-700">Thông tin Đăng ký</h3></div>
                <div className="p-4 space-y-3">
                  {[
                    { l: 'Họ và tên', v: currentGuest.name },
                    { l: 'Loại', v: currentGuest.type === 'contractor' ? '🏗️ Nhà thầu phụ' : '👤 Khách' },
                    { l: 'Công ty', v: currentGuest.company || 'Không có' },
                    { l: 'Điện thoại', v: currentGuest.phone },
                    { l: 'Mã đăng ký', v: currentGuest.guestCode, mono: true },
                    { l: 'Mục đích', v: currentGuest.purpose },
                    { l: 'Ngày đăng ký', v: currentGuest.registeredDate },
                    { l: 'Trạng thái', v: '✅ Đã được phê duyệt' },
                  ].filter((i) => i.l !== 'Phê duyệt bởi').map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-xs font-bold text-gray-400 uppercase w-24 shrink-0 pt-0.5">{item.l}</span>
                      <span className={`text-sm font-medium text-gray-800 flex-1 ${item.mono ? 'font-mono' : ''}`}>{item.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-bold text-yellow-800 mb-1">📌 Lưu ý</p>
                <p className="text-xs text-yellow-700">Thẻ vào cổng chỉ có giá trị trong ngày phê duyệt. Liên hệ bảo vệ cổng nếu cần gia hạn.</p>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-[#0f4c81] to-[#1a6fc4] rounded-2xl p-5 text-white text-center shadow-lg">
                <div className="text-3xl mb-1">🪪</div>
                <h2 className="font-black text-xl">Thẻ vào cổng CMIT</h2>
                <p className="text-blue-200 text-xs mt-1">Xuất trình khi vào/ra cổng — Quét bởi bảo vệ</p>
              </div>
              {currentGuest.qrToken ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center gap-2">
                  <QRCodeDisplay
                    value={currentGuest.qrToken}
                    size={200}
                    employeeName={currentGuest.name}
                    employeeCode={currentGuest.guestCode}
                    cardSubtitle={currentGuest.type === 'contractor' ? 'Nhà thầu phụ' : 'Khách thăm quan'}
                    cardGroup={currentGuest.company || ''}
                    isGuestCard={true}
                    showDownloadBtn={true}
                  />
                  <div className="w-full bg-teal-50 rounded-xl p-3 border border-teal-100 mt-2">
                    <p className="text-[10px] text-teal-500 font-bold uppercase text-center mb-1">Mã token QR</p>
                    <p className="text-[10px] font-mono text-teal-700 text-center break-all">{currentGuest.qrToken}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-8 text-center text-gray-400">
                  <div className="text-5xl mb-3">🔳</div>
                  <p className="font-medium">Tài khoản này chưa có mã QR</p>
                  <p className="text-sm mt-1">Vui lòng liên hệ bảo vệ cổng để được cấp mã</p>
                </div>
              )}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-bold text-amber-800 mb-1">📌 Hướng dẫn sử dụng</p>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• Nhấn <b>"Tải thẻ đăng nhập"</b> để lưu thẻ về điện thoại</li>
                  <li>• Xuất trình thẻ (hoặc màn hình QR) khi vào/ra cổng CMIT</li>
                  <li>• Thẻ có giá trị theo phê duyệt của Quản lý</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-teal-50 px-4 py-3 border-b border-teal-100 flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <h3 className="font-bold text-teal-700">Lần đăng ký hiện tại</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase w-28 shrink-0 pt-0.5">Mục đích</span>
                    <span className="text-sm font-medium text-gray-800 flex-1">{currentGuest.purpose || '—'}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase w-28 shrink-0 pt-0.5">Ngày đăng ký</span>
                    <span className="text-sm font-medium text-gray-800">{currentGuest.registeredDate || new Date(currentGuest.registeredAt).toLocaleDateString('vi-VN') || '—'}</span>
                  </div>
                  {currentGuest.approvedAt && (
                    <div className="flex gap-3">
                      <span className="text-xs font-bold text-gray-400 uppercase w-28 shrink-0 pt-0.5">Ngày duyệt</span>
                      <span className="text-sm font-medium text-gray-800">{new Date(currentGuest.approvedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase w-28 shrink-0 pt-0.5">Trạng thái</span>
                    <span className="text-sm font-bold text-green-700">✅ Đã phê duyệt</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center gap-2">
                  <span className="text-lg">🗓️</span>
                  <h3 className="font-bold text-blue-700">Lịch sử & Lịch đặt vào cảng</h3>
                  {guestVisits.length > 0 && <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-black px-2 py-0.5 rounded-full">{guestVisits.length} mục</span>}
                </div>
                <div className="p-3 border-b border-gray-100">
                  <button
                    onClick={() => setShowBooking(true)}
                    className="w-full py-3 bg-teal-600 text-white rounded-xl font-black text-sm hover:bg-teal-700 transition flex items-center justify-center gap-2"
                  >
                    <CalendarDays size={15} /> + Đặt lịch vào cảng lần tiếp theo
                  </button>
                </div>
                {guestVisits.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <div className="text-4xl mb-2">🗓️</div>
                    <p className="font-medium text-sm">Chưa có lịch vào cảng nào</p>
                    <p className="text-xs mt-1">Nhấn nút trên để đặt lịch lần tiếp theo</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {guestVisits.map((visit) => {
                      const isPend = visit.status === 'pending';
                      const isApproved = visit.status === 'approved';
                      const isDone = visit.checkinAt && visit.checkoutAt;
                      const isCheckedIn = visit.checkinAt && !visit.checkoutAt;
                      let duration = '';
                      if (visit.checkinAt && visit.checkoutAt) {
                        const mins = Math.round((visit.checkoutAt - visit.checkinAt) / 60000);
                        duration = mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60 > 0 ? ` ${mins % 60}p` : ''}` : `${mins} phút`;
                      }
                      return (
                        <div key={visit.id} className="p-4 hover:bg-gray-50 transition">
                          <div className="flex justify-between items-start mb-1.5">
                            <span className="text-sm font-bold text-gray-800">
                              {visit.visitDate || visit.date || (visit.timestamp ? new Date(visit.timestamp).toLocaleDateString('vi-VN') : '—')}
                              {visit.timeStart && <span className="text-gray-500 font-normal ml-1">• {visit.timeStart}{visit.timeEnd ? ` – ${visit.timeEnd}` : ''}</span>}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-1 rounded-full ${isDone ? 'bg-gray-100 text-gray-600' : isCheckedIn ? 'bg-green-100 text-green-700' : isApproved ? 'bg-blue-100 text-blue-700' : isPend ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}
                            >
                              {isDone ? '✅ Hoàn thành' : isCheckedIn ? '🏢 Đang trong cảng' : isApproved ? '✅ Đã duyệt' : isPend ? '⏳ Chờ duyệt' : '❌ Từ chối'}
                            </span>
                          </div>
                          {visit.purpose && <p className="text-xs text-gray-600 mb-1">📋 {visit.purpose}</p>}
                          {duration && <p className="text-xs font-bold text-teal-600">⏱ Thời gian trong cảng: {duration}</p>}
                          {visit.checkinAt && <p className="text-xs text-gray-400">Vào: {new Date(visit.checkinAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>}
                          {visit.checkoutAt && <p className="text-xs text-gray-400">Ra: {new Date(visit.checkoutAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>}
                          {visit.notes && <p className="text-xs text-blue-500 italic mt-1">"{visit.notes}"</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {guestNotes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-amber-50 px-4 py-3 border-b border-amber-100 flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    <h3 className="font-bold text-amber-700">Ghi nhận gần nhất từ Quản lý</h3>
                  </div>
                  <div className="p-4 space-y-2">
                    {guestNotes.slice(0, 3).map((note) => (
                      <div key={note.id} className={`rounded-xl p-3 border-l-4 text-sm ${note.type === 'warning' ? 'bg-red-50 border-l-red-400' : 'bg-blue-50 border-l-blue-400'}`}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-xs font-bold ${note.type === 'warning' ? 'text-red-600' : 'text-blue-600'}`}>{note.type === 'warning' ? '⚠️ Cảnh báo' : '📋 Thông tin'}</span>
                          <span className="text-xs text-gray-400">{note.date}</span>
                        </div>
                        <p className="text-gray-700">{note.content}</p>
                      </div>
                    ))}
                    {guestNotes.length > 3 && (
                      <button onClick={() => setActiveTab('notes')} className="w-full text-center text-xs text-teal-600 font-bold py-2 hover:underline">
                        Xem tất cả {guestNotes.length} ghi nhận →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-bold text-gray-700 mb-1">Ghi nhận từ Quản lý</h3>
                <p className="text-xs text-gray-500">Các nội dung Quản lý ghi nhận về bạn trong quá trình vào cảng.</p>
              </div>
              {guestNotes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-3">📋</div>
                  <p className="font-medium">Chưa có ghi nhận nào</p>
                  <p className="text-sm mt-1">Quản lý sẽ ghi nhận nếu có sự cố hoặc nội dung liên quan</p>
                </div>
              ) : (
                guestNotes.map((note) => (
                  <div key={note.id} className={`bg-white rounded-2xl shadow-sm border-l-4 p-4 ${note.type === 'warning' ? 'border-l-red-500 border border-red-100' : 'border-l-blue-500 border border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${note.type === 'warning' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {note.type === 'warning' ? '⚠️ Cảnh báo' : '📋 Thông tin'}
                      </span>
                      <span className="text-xs text-gray-400">{note.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{note.content}</p>
                    {note.authorName && <p className="text-xs text-gray-400 mt-2">Ghi bởi: {note.authorName}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showBooking && (
        <GuestVisitBooking
          currentGuest={currentGuest}
          showToast={showToast}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
};

export default GuestDashboard;

