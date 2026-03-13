import React from 'react';
import { CheckCircle2, Loader2, ShieldAlert, X } from 'lucide-react';

const GuestQRLoginFlow = ({ scannedGuest, onLoginSuccess, onManagerView, onCancel, showToast, employees = [] }) => {
  const [password, setPassword] = React.useState('');
  const [logging, setLogging] = React.useState(false);
  const [adminUser, setAdminUser] = React.useState('');
  const [adminPass, setAdminPass] = React.useState('');
  const [showAdminSuggest, setShowAdminSuggest] = React.useState(false);

  const adminSuggestions = React.useMemo(() => {
    if (!adminUser.trim() || !employees?.length) return [];
    const term = adminUser.toLowerCase();
    return employees
      .filter((e) => {
        const isManager = ['CMIT SM', 'CMIT TSV', 'CMIT Controller'].includes(e.group);
        return isManager && (e.name.toLowerCase().includes(term) || (e.code || '').toLowerCase().includes(term));
      })
      .slice(0, 5);
  }, [adminUser, employees]);

  const isPending = scannedGuest.status === 'pending';
  const isBanned = scannedGuest.status === 'banned';
  const isRejected = scannedGuest.status === 'rejected';

  const handleLogin = async () => {
    if (isPending) { showToast('Tài khoản đang chờ phê duyệt! Quản lý vui lòng đăng nhập bên dưới.', 'warning'); return; }
    if (isBanned) { showToast('Tài khoản đã bị khóa!', 'error'); return; }
    if (isRejected) { showToast('Tài khoản đã bị từ chối!', 'error'); return; }
    if (!password.trim()) return showToast('Vui lòng nhập mật khẩu!', 'error');
    setLogging(true);
    try {
      const storedPass = (scannedGuest.tempPassword || '').trim();
      const fallbackPass = (scannedGuest.idCard || '').replace(/\s/g, '').slice(-6);
      const expectedPass = storedPass || fallbackPass;
      if (password.trim() !== expectedPass) { showToast('Mật khẩu không đúng!', 'error'); setLogging(false); return; }
      onLoginSuccess(scannedGuest);
    } catch (e) {
      showToast('Lỗi đăng nhập: ' + e.message, 'error');
    } finally {
      setLogging(false);
      setPassword('');
    }
  };

  const handleManagerView = () => {
    if (!adminUser.trim() || !adminPass.trim()) return showToast('Vui lòng nhập đầy đủ thông tin Quản lý!', 'warning');
    onManagerView({ adminUser, adminPass, targetGuestId: scannedGuest.id });
  };

  const headerGradient = isPending
    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
    : isBanned || isRejected
      ? 'bg-gradient-to-br from-red-600 to-rose-700'
      : 'bg-gradient-to-br from-teal-600 to-emerald-700';

  const [flowTab, setFlowTab] = React.useState(isPending || isBanned || isRejected ? 'manager' : 'guest');

  return (
    <div className="fixed inset-0 bg-black/80 z-[150] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-fadeInUp flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className={`${headerGradient} px-5 py-5 text-white shrink-0 relative`}>
          <button onClick={onCancel} className="absolute top-4 right-4 bg-white/15 hover:bg-white/25 rounded-full p-1.5 transition"><X size={16} /></button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border-2 border-white/25 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {scannedGuest.type === 'contractor' ? '🏗️' : '👤'}
            </div>
            <div className="min-w-0">
              <h2 className="font-black text-lg leading-tight truncate">{scannedGuest.name}</h2>
              <p className="font-mono text-white/60 text-xs mt-0.5">{scannedGuest.guestCode}</p>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold border border-white/10">
                  {scannedGuest.type === 'contractor' ? 'Nhà thầu' : 'Khách'}
                </span>
                {scannedGuest.company && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold border border-white/10 truncate max-w-[120px]">{scannedGuest.company}</span>}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border border-white/20 ${isPending ? 'bg-amber-400/30 text-amber-100' : isBanned || isRejected ? 'bg-red-400/30 text-red-100' : 'bg-emerald-400/30 text-emerald-100'}`}>
                  {isPending ? '⏳ Chờ duyệt' : isBanned ? '🚫 Đã khóa' : isRejected ? '❌ Từ chối' : '✅ Đã duyệt'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-100 shrink-0">
          {(!isBanned && !isRejected) && (
            <button
              onClick={() => setFlowTab('guest')}
              className={`flex-1 py-3 text-sm font-bold transition border-b-2 ${flowTab === 'guest' ? 'text-teal-700 border-teal-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              🔑 Vào hệ thống
            </button>
          )}
          <button
            onClick={() => setFlowTab('manager')}
            className={`flex-1 py-3 text-sm font-bold transition border-b-2 ${flowTab === 'manager' ? 'text-[#0f4c81] border-[#0f4c81]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
          >
            👮 Quản lý
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-grow" style={{ background: '#f8fafc' }}>
          {flowTab === 'guest' && (
            <div className="space-y-4 animate-fadeIn">
              {isPending && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">⏳</div>
                  <p className="font-black text-amber-800 text-sm">Chờ Quản lý phê duyệt</p>
                  <p className="text-xs text-amber-600 mt-1">Chuyển sang tab Quản lý để phê duyệt ngay.</p>
                </div>
              )}
              {!isPending && (
                <>
                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-xs text-teal-700 text-center">
                    Nhập <b>6 số cuối CCCD</b> để đăng nhập
                  </div>
                  <input
                    type="password"
                    autoFocus
                    className="w-full px-4 py-4 border-2 rounded-2xl outline-none focus:border-teal-600 font-bold text-gray-800 text-center tracking-[.4em] text-xl bg-white transition"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    onClick={handleLogin}
                    disabled={logging}
                    className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-base shadow transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                  >
                    {logging ? <><Loader2 className="animate-spin" size={18} />Đang vào...</> : <><CheckCircle2 size={18} />Vào hệ thống</>}
                  </button>
                </>
              )}
            </div>
          )}

          {flowTab === 'manager' && (
            <div className="space-y-3 animate-fadeIn">
              {(isBanned || isRejected) && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center mb-3">
                  <p className="font-black text-red-800 text-sm">{isBanned ? '🚫 Tài khoản đã bị khóa' : '❌ Tài khoản bị từ chối'}</p>
                  <p className="text-xs text-red-500 mt-1">Quản lý có thể mở lại bên dưới.</p>
                </div>
              )}
              {isPending && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center text-xs text-amber-700 font-bold mb-1">
                  ⚡ Đăng nhập để phê duyệt hồ sơ này ngay
                </div>
              )}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
                <div className="relative">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wide block mb-1.5">Username Quản lý</label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="w-full p-3 border-2 rounded-xl outline-none focus:border-[#0f4c81] font-bold text-sm bg-gray-50 focus:bg-white transition"
                    placeholder="Nhập tên hoặc mã NV..."
                    value={adminUser}
                    onChange={(e) => { setAdminUser(e.target.value); setShowAdminSuggest(true); }}
                    onFocus={() => setShowAdminSuggest(true)}
                  />
                  {showAdminSuggest && adminSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 max-h-40 overflow-y-auto z-50">
                      {adminSuggestions.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => { setAdminUser(emp.name); setShowAdminSuggest(false); }}
                          className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 transition"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">{(emp.name || '?').charAt(0)}</div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{emp.name}</p>
                            <p className="text-xs text-gray-400">{emp.code} • {emp.group}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wide block mb-1.5">Mật khẩu</label>
                  <input
                    type="password"
                    className="w-full p-3 border-2 rounded-xl outline-none focus:border-[#0f4c81] font-bold text-sm tracking-widest bg-gray-50 focus:bg-white transition"
                    placeholder="••••••••"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManagerView()}
                  />
                </div>
                <button
                  onClick={handleManagerView}
                  disabled={logging}
                  className="w-full py-3.5 bg-[#0f4c81] hover:bg-[#1a6fc4] text-white rounded-xl font-black text-sm shadow transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                >
                  {logging
                    ? <><Loader2 className="animate-spin" size={16} />...</>
                    : isPending
                      ? <><CheckCircle2 size={16} />Đăng nhập & Phê duyệt</>
                      : <><ShieldAlert size={16} />Mở hồ sơ khách</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestQRLoginFlow;

