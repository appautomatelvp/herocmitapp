import React from 'react';
import { AlertTriangle, CheckCircle2, FileText, Loader2, ShieldAlert, UserCheck, X } from 'lucide-react';
import { auth, signInWithEmailAndPassword } from '../../config/firebase.js';

const QRLoginFlow = ({ scannedEmployee, employees, onLogin, onCancel, showToast }) => {
  const [password, setPassword] = React.useState('');
  const [logging, setLogging] = React.useState(false);
  const [adminUser, setAdminUser] = React.useState('');
  const [adminPass, setAdminPass] = React.useState('');
  const [showAdminSuggest, setShowAdminSuggest] = React.useState(false);

  const adminSuggestions = React.useMemo(() => {
    if (!adminUser.trim() || !employees) return [];
    const term = adminUser.toLowerCase();
    return employees
      .filter((e) => {
        const isManager = ['CMIT SM', 'CMIT TSV', 'CMIT Controller'].includes(e.group);
        return isManager && (e.name.toLowerCase().includes(term) || e.code.toLowerCase().includes(term));
      })
      .slice(0, 5);
  }, [adminUser, employees]);

  const handleLogin = async () => {
    if (!password.trim()) return showToast('Vui lòng nhập mật khẩu!', 'error');
    if (scannedEmployee.isBanned) return showToast('Tài khoản này đã bị khóa bởi Quản lý!', 'error');
    setLogging(true);
    try {
      const email = scannedEmployee.email || `${scannedEmployee.code.toLowerCase().trim()}@hero.local`;
      await signInWithEmailAndPassword(auth, email, password);
      onLogin({ type: 'employee', employee: scannedEmployee, password });
    } catch (e) {
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password') showToast('Mật khẩu không đúng!', 'error');
      else showToast('Lỗi đăng nhập: ' + e.message, 'error');
    } finally {
      setLogging(false);
      setPassword('');
    }
  };

  const handleManagerLogin = async () => {
    if (!adminUser.trim() || !adminPass.trim()) return showToast('Vui lòng nhập đầy đủ thông tin Quản lý!', 'warning');
    setLogging(true);
    try {
      onLogin({ type: 'manager', adminUser, adminPass, targetEmployeeId: scannedEmployee.id });
    } catch (e) {
      console.error(e);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {scannedEmployee.isBanned ? (
          <div className="bg-gradient-to-br from-red-700 to-red-900 px-6 py-6 text-center text-white shrink-0 relative">
            <button onClick={onCancel} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-1.5 transition"><X size={18} /></button>
            <div className="w-20 h-20 rounded-full bg-red-500/40 flex items-center justify-center text-5xl border-4 border-red-400/60 overflow-hidden mx-auto mb-3 shadow-lg">🚫</div>
            <h2 className="font-black text-xl">{scannedEmployee.name}</h2>
            <p className="text-red-300 font-mono text-sm font-bold">{scannedEmployee.code}</p>
            <div className="mt-3 bg-red-500/30 border border-red-400/50 rounded-xl px-4 py-3 text-left">
              <p className="text-[11px] font-black text-red-200 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <AlertTriangle size={13} /> TÀI KHOẢN BỊ KHÓA
              </p>
              <p className="text-sm font-bold text-white leading-snug">{scannedEmployee.banReason || 'Không được phép truy cập hệ thống.'}</p>
              {scannedEmployee.bannedAt && (
                <p className="text-xs text-red-300 mt-1.5">Ngày khóa: {new Date(scannedEmployee.bannedAt).toLocaleDateString('vi-VN')}</p>
              )}
              {scannedEmployee.bannedBy && (
                <p className="text-xs text-red-300">Quản lý: {scannedEmployee.bannedBy}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#1a3673] to-[#1e3a8a] px-6 py-6 text-center text-white shrink-0 relative">
            <button onClick={onCancel} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-1.5 transition"><X size={18} /></button>
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black border-4 border-white/30 overflow-hidden mx-auto mb-3 shadow-lg">
              {scannedEmployee.avatar ? <img src={scannedEmployee.avatar} alt={scannedEmployee.name} className="w-full h-full object-cover" /> : scannedEmployee.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-black text-xl">{scannedEmployee.name}</h2>
            <p className="text-blue-200 font-mono text-sm font-bold">{scannedEmployee.code}</p>
            <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
              <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wide border border-white/10">{scannedEmployee.position}</span>
              <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wide border border-white/10">{scannedEmployee.group}</span>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-grow bg-gray-50">
          {scannedEmployee.isBanned ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-red-700">Nhân viên này không thể đăng nhập.</p>
                <p className="text-xs text-red-500 mt-1">Chỉ Quản lý mới có thể truy cập hồ sơ.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert size={16} className="text-indigo-700" />
                  <span className="text-xs font-black text-indigo-900 uppercase tracking-wide">Quản lý Xem Hồ sơ</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm bg-white"
                    placeholder="Username (Tên / Mã Quản lý)"
                    value={adminUser}
                    onChange={(e) => { setAdminUser(e.target.value); setShowAdminSuggest(true); }}
                    onFocus={() => setShowAdminSuggest(true)}
                  />
                  {showAdminSuggest && adminSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 max-h-36 overflow-y-auto z-50">
                      {adminSuggestions.map((emp) => (
                        <div
                          key={emp.id}
                          className="p-2.5 hover:bg-indigo-50 cursor-pointer text-sm border-b last:border-0 transition"
                          onClick={() => { setAdminUser(emp.name); setShowAdminSuggest(false); }}
                        >
                          <div className="font-bold text-indigo-800">{emp.name}</div>
                          <div className="text-xs text-gray-400">{emp.code} • {emp.group}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="password"
                  className="w-full p-3 border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm tracking-widest bg-white"
                  placeholder="Mật khẩu Quản lý"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManagerLogin()}
                />
                <button
                  onClick={handleManagerLogin}
                  disabled={logging}
                  className="w-full py-3 mt-1 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition flex items-center justify-center gap-2"
                >
                  {logging ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />} Xem Hồ Sơ Nhân Viên
                </button>
              </div>
              <button onClick={onCancel} className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition text-sm">Đóng</button>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck size={16} className="text-[#1e3a8a]" />
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wide">Nhân viên Đăng nhập</span>
                </div>
                <div>
                  <input
                    type="password"
                    autoFocus
                    className="w-full p-3.5 border-2 rounded-xl focus:border-[#1e3a8a] outline-none font-bold text-gray-800 text-center tracking-widest transition bg-gray-50 focus:bg-white"
                    placeholder="Nhập mật khẩu của bạn..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                <button
                  onClick={handleLogin}
                  disabled={logging}
                  className="w-full py-3 bg-[#1e3a8a] text-white rounded-xl font-bold hover:bg-[#172554] shadow-md transition flex items-center justify-center gap-2"
                >
                  {logging ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />} Đăng nhập ngay
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 font-bold tracking-wider uppercase text-[10px]">HOẶC</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert size={16} className="text-indigo-700" />
                  <span className="text-xs font-black text-indigo-900 uppercase tracking-wide">Quản lý Đăng nhập</span>
                </div>
                <p className="text-[10px] text-indigo-600 mb-2 font-medium">Đăng nhập bằng tài khoản Quản lý để xem ngay Hồ sơ năng lực của nhân viên này.</p>

                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm bg-white"
                    placeholder="Username (Tên / Mã Quản lý)"
                    value={adminUser}
                    onChange={(e) => { setAdminUser(e.target.value); setShowAdminSuggest(true); }}
                    onFocus={() => setShowAdminSuggest(true)}
                  />
                  {showAdminSuggest && adminSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 max-h-36 overflow-y-auto z-50">
                      {adminSuggestions.map((emp) => (
                        <div
                          key={emp.id}
                          className="p-2.5 hover:bg-indigo-50 cursor-pointer text-sm border-b last:border-0 transition"
                          onClick={() => { setAdminUser(emp.name); setShowAdminSuggest(false); }}
                        >
                          <div className="font-bold text-indigo-800">{emp.name}</div>
                          <div className="text-xs text-gray-400">{emp.code} • {emp.group}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="password"
                  className="w-full p-3 border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm tracking-widest bg-white"
                  placeholder="Mật khẩu Quản lý"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManagerLogin()}
                />
                <button
                  onClick={handleManagerLogin}
                  disabled={logging}
                  className="w-full py-3 mt-1 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition flex items-center justify-center gap-2"
                >
                  {logging ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />} Mở Hồ Sơ Nhân Viên
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRLoginFlow;

