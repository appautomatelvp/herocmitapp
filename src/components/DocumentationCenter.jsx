import React, { useState } from 'react';
import { X, ChevronLeft, BookOpen, ChevronRight, List } from 'lucide-react';

const DocumentationCenter = ({ isOpen, onClose }) => {
  const [activeChapter, setActiveChapter] = useState(null);

  const chapters = [
    {
      id: 'employee',
      icon: '👷',
      title: 'Dành cho Nhân viên',
      color: 'from-blue-500 to-blue-700',
      lightColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      sections: [
        {
          title: '1. Đăng nhập Hệ thống',
          content: [
            '📌 Tìm tên hoặc mã NV (VD: CMP0474) trong ô tìm kiếm trên màn hình chờ.',
            '🔑 Lần đầu đăng nhập: Hệ thống yêu cầu tạo mật khẩu cá nhân (tối thiểu 6 ký tự).',
            '🔒 Lần tiếp theo: Nhập mật khẩu đã tạo để đăng nhập.',
            '❓ Quên mật khẩu: Nhấn "Quên mật khẩu" → Hệ thống sẽ báo Quản lý và cung cấp số hotline hỗ trợ.',
          ]
        },
        {
          title: '2. Tab Bảng tin (News)',
          content: [
            '📢 Xem các thông báo nội bộ, thông tin quan trọng từ Ban Quản lý.',
            '🏆 Bảng vàng thành tích: Xem Top nhân viên xuất sắc được ghi nhận.',
            '💬 Nhấn vào tin để xem chi tiết, hình ảnh và bình luận.',
          ]
        },
        {
          title: '3. Tab Điểm danh (Công)',
          content: [
            '✅ Nhấn nút "Điểm danh" để ghi nhận có mặt khi bắt đầu ca làm việc.',
            '📅 Hệ thống tự động ghi ngày, giờ và ca làm việc hiện tại.',
            '📊 Lịch sử điểm danh hiển thị các lần chấm công trước đó.',
          ]
        },
        {
          title: '4. Tab Checklist Thiết bị',
          content: [
            '🚛 Chọn loại thiết bị (RTG, QC, Xe đầu kéo, Xe nâng...) và mã số thiết bị.',
            '✍️ Điền đánh giá từng hạng mục: OK / Cảnh báo / Nguy hiểm.',
            '⛽ Tab "Cập nhật Đổ dầu": Ghi nhận mức nhiên liệu sau khi đổ.',
            '⚠️ Nếu có hạng mục NGUY HIỂM: Hệ thống sẽ hiển thị cảnh báo Dừng hoạt động thiết bị.',
          ]
        },
        {
          title: '5. Tab Báo cáo An toàn',
          content: [
            '🦺 Ghi nhận sự cố, nguy cơ mất an toàn trong ca làm việc.',
            '📸 Có thể đính kèm hình ảnh bằng chứng.',
            '⚡ Nhấn "Trợ lý 5W" để hệ thống hướng dẫn nhập thông tin theo từng bước.',
            '⏳ Báo cáo sẽ vào trạng thái "Chờ duyệt" cho đến khi Quản lý xử lý.',
          ]
        },
        {
          title: '6. Tab Sáng kiến (Kaizen)',
          content: [
            '💡 Đề xuất cải tiến quy trình, an toàn hoặc hiệu quả công việc.',
            '📸 Đính kèm hình ảnh minh họa nếu có.',
            '⚡ Nhấn "Trợ lý 5W1H" để nhập ý tưởng theo hướng dẫn từng bước.',
            '⭐ Sáng kiến được duyệt sẽ tính điểm thành tích cá nhân.',
          ]
        },
        {
          title: '7. Tab Hồ sơ Cá nhân',
          content: [
            '📷 Cập nhật ảnh đại diện bằng cách nhấn vào icon camera trên avatar.',
            '📱 Cập nhật số điện thoại, email, địa chỉ cư trú.',
            '🔑 Đổi mật khẩu: Nhấn "Đổi mật khẩu" và làm theo hướng dẫn.',
            '📈 Xem lịch sử ghi nhận, điểm thành tích và các hoạt động cá nhân.',
          ]
        },
      ]
    },
    {
      id: 'manager',
      icon: '👔',
      title: 'Dành cho Quản lý',
      color: 'from-indigo-500 to-indigo-800',
      lightColor: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-700',
      sections: [
        {
          title: '1. Đăng nhập Quản lý',
          content: [
            '🔐 Nhấn nút "Admin Dashboard" trên màn hình chờ.',
            '👤 Nhập tên hoặc mã nhân viên của bạn (Supervisor/SM/TSV/Controller).',
            '🔑 Nhập mật khẩu cá nhân → Đăng nhập thành công vào trang Quản lý.',
            '⚠️ Nếu quên mật khẩu: Nhấn "Quên mật khẩu?" để gửi yêu cầu reset.',
          ]
        },
        {
          title: '2. Tổng quan (Overview)',
          content: [
            '📊 Xem nhanh: Tổng nhân sự, điểm danh hôm nay, checklist, báo cáo chờ duyệt.',
            '🔔 Thẻ màu đỏ nhấp nháy = Có vấn đề cần xử lý ngay.',
            '📈 Biểu đồ xu hướng an toàn và chất lượng theo tháng.',
          ]
        },
        {
          title: '3. Duyệt Báo cáo Nhân viên',
          content: [
            '📋 Tab "Báo cáo NV": Danh sách báo cáo an toàn và sáng kiến chờ duyệt.',
            '✅ Nhấn "Duyệt" để chấp thuận → Tin tự động đăng lên Bảng tin.',
            '❌ Nhấn "Từ chối" và nhập phản hồi để giải thích lý do.',
            '⭐ Báo cáo được duyệt sẽ tự động tính điểm thành tích cho nhân viên.',
          ]
        },
        {
          title: '4. Ghi nhận Nhân viên (KPI)',
          content: [
            '📝 Tab "Ghi nhận NV": Tìm kiếm nhân viên cần ghi nhận.',
            '⭐ Chọn số sao (1-5) và danh mục: An toàn / Chất lượng / Thái độ / Chuyên cần.',
            '🤖 Nhấn "AI Hỗ trợ" để hệ thống tự tạo nội dung ghi nhận chuyên nghiệp.',
            '💡 Nhấn "Trợ lý 5W1H" để nhập ghi nhận theo từng bước có hướng dẫn.',
          ]
        },
        {
          title: '5. Quản lý Nhân sự',
          content: [
            '👥 Tab "Nhân sự": Xem danh sách, tìm kiếm và quản lý hồ sơ nhân viên.',
            '➕ Thêm nhân viên mới: Điền thông tin và nhấn "Thêm".',
            '🔄 Chuyển đổi bộ phận: Chọn nhân viên → "Chuyển Bộ phận/Vị trí".',
            '🔑 Reset mật khẩu: Nhấn vào thông báo yêu cầu reset và xác nhận.',
          ]
        },
        {
          title: '6. Báo cáo Hiện trường (Quản lý)',
          content: [
            '📋 Tab "Báo cáo" (dành riêng cho Quản lý): Ghi nhận 6 loại hoạt động hiện trường.',
            '🔍 Các loại báo cáo: Pre-shift Toolbox Talk, Leader Led Safety Gemba, CCA, SQDC...',
            '📸 Đính kèm tối đa 5 hình ảnh có CHÚ THÍCH bắt buộc cho báo cáo GEMBA.',
            '📊 Dữ liệu tự động tổng hợp vào báo cáo KPI tháng/quý/năm.',
          ]
        },
        {
          title: '7. Giám sát Thiết bị',
          content: [
            '🏗️ Tab "Giám sát TB": Bản đồ trạng thái thiết bị toàn bộ cảng.',
            '🔴 Màu đỏ = Nguy hiểm, 🟡 Vàng = Cảnh báo, 🟢 Xanh = Bình thường.',
            '⛽ Bảng theo dõi mức nhiên liệu, cảnh báo dưới 55%.',
            '📜 Lịch sử checklist: Xem chi tiết từng lần kiểm tra của mọi thiết bị.',
          ]
        },
        {
          title: '8. Ngôi sao An toàn',
          content: [
            '⭐ Tính năng bầu chọn nhân viên xuất sắc hàng tháng/quý.',
            '🗳️ Mỗi Quản lý được bình chọn tối đa 2 ứng viên và ghi lý do.',
            '🏆 Ban Giám đốc (SM) công bố kết quả → Tự động đăng tin vinh danh.',
            '📊 Tab "Thành tích NV": Xem tổng hợp điểm, xuất file Excel báo cáo.',
          ]
        },
      ]
    },
    {
      id: 'features',
      icon: '⚙️',
      title: 'Tính năng Hệ thống',
      color: 'from-emerald-500 to-emerald-700',
      lightColor: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-700',
      sections: [
        {
          title: '1. Hệ thống Điểm thành tích',
          content: [
            '📊 Điểm được tính tự động từ 4 trụ cột: An toàn, Chất lượng, Thái độ, Chuyên cần.',
            '⭐ Thang điểm 1-5 sao: Điểm cơ bản là 3. +1 khi được ghi nhận tốt, -1 khi bị đánh giá thấp.',
            '🏅 Xếp loại: CẦN CẢI THIỆN / THÀNH CÔNG / NỔI TRỘI.',
            '📈 Dữ liệu cập nhật theo thời gian thực, xem được theo Tháng/Quý/Năm.',
          ]
        },
        {
          title: '2. Trợ lý AI (Gemini)',
          content: [
            '🤖 Tích hợp AI Google Gemini để hỗ trợ viết báo cáo và ghi nhận.',
            '✨ "AI Hỗ trợ" trong Ghi nhận NV: Tự động tạo nội dung chuyên nghiệp theo số sao.',
            '📊 "AI Nhận xét" trong Thành tích: Phân tích và đưa ra nhận xét đánh giá KPI.',
            '⚠️ AI đang trong giai đoạn thử nghiệm, kết quả cần Quản lý xem xét trước khi lưu.',
          ]
        },
        {
          title: '3. Xuất báo cáo (Excel/PDF)',
          content: [
            '📊 Xuất Excel: Báo cáo KPI nhân viên, thiết bị theo tháng/quý/năm.',
            '📄 Xuất PDF: Báo cáo hiện trường dạng báo in chuyên nghiệp.',
            '💾 File tự động tải về máy sau khi xuất xong.',
            '📋 Báo cáo Excel chia 3 Sheet: Nhân sự CMIT, ADHOC và Quản lý.',
          ]
        },
        {
          title: '4. Sao lưu & Khôi phục dữ liệu',
          content: [
            '💾 Admin có thể sao lưu toàn bộ dữ liệu hệ thống ra file JSON.',
            '🔄 Khôi phục: Upload file backup để phục hồi dữ liệu khi cần.',
            '🛡️ Dữ liệu thủ công (mật khẩu, avatar, SĐT) được bảo vệ khi restore.',
            '📅 Nên sao lưu định kỳ hàng tháng để đảm bảo an toàn dữ liệu.',
          ]
        },
        {
          title: '5. Bảng tin & Truyền thông',
          content: [
            '📢 Quản lý tạo và đăng bảng tin nội bộ với 3 mức độ: Thông báo / Chú ý / Khẩn cấp.',
            '📸 Hỗ trợ đính kèm nhiều hình ảnh với chú thích cho mỗi bảng tin.',
            '💬 Nhân viên có thể bình luận và tương tác với bảng tin.',
            '🗑️ Quản lý có quyền xóa bảng tin và kiểm duyệt bình luận.',
          ]
        },
        {
          title: '6. Lưu ý Bảo mật',
          content: [
            '🔐 Mật khẩu được mã hóa và lưu trữ an toàn trên Firebase.',
            '👁️ Quản lý không thể xem mật khẩu của nhân viên, chỉ có thể reset.',
            '📱 Nên sử dụng mật khẩu cá nhân, không chia sẻ với người khác.',
            '🚪 Luôn nhấn "Thoát/Đăng xuất" sau khi xong việc trên thiết bị công cộng.',
          ]
        },
      ]
    },
    {
      id: 'faq',
      icon: '❓',
      title: 'Câu hỏi thường gặp',
      color: 'from-amber-500 to-orange-600',
      lightColor: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
      sections: [
        {
          title: 'Tôi không tìm thấy tên mình trong danh sách?',
          content: [
            '🔍 Thử tìm bằng Mã NV thay vì tên (VD: CMP0474).',
            '📞 Nếu vẫn không thấy, liên hệ Quản lý trực tiếp để được thêm vào hệ thống.',
            '⚠️ Danh sách nhân viên do Admin quản lý và cập nhật.',
          ]
        },
        {
          title: 'Làm sao để reset mật khẩu?',
          content: [
            '📱 Nhấn "Quên mật khẩu / Cần hỗ trợ?" trên màn hình nhập mật khẩu.',
            '📩 Hệ thống tự động gửi thông báo đến Quản lý.',
            '☎️ Gọi HOTLINE YARDSUP: 0989.715.843 (Trực ban 24/7) để được cấp lại ngay.',
          ]
        },
        {
          title: 'Báo cáo của tôi bị "Từ chối" là sao?',
          content: [
            '📋 Xem phần "Phản hồi từ Quản lý" trong chi tiết báo cáo để biết lý do.',
            '✏️ Gửi lại báo cáo mới với nội dung được bổ sung/chỉnh sửa theo phản hồi.',
            '💬 Liên hệ trực tiếp Quản lý nếu cần giải thích thêm.',
          ]
        },
        {
          title: 'Checklist thiết bị có bắt buộc không?',
          content: [
            '✅ CÓ - Mỗi nhân viên phải điền checklist trước khi bàn giao/tiếp nhận thiết bị.',
            '⚠️ Thiết bị có lỗi NGUY HIỂM phải báo cáo Quản lý ngay và không vận hành tiếp.',
            '📊 Dữ liệu checklist được Quản lý giám sát liên tục để phát hiện vấn đề sớm.',
          ]
        },
        {
          title: 'Điểm thành tích tính như thế nào?',
          content: [
            '📊 Điểm cơ sở: 3/5 cho tất cả mọi người.',
            '⬆️ Tăng điểm: Được Quản lý ghi nhận tốt (+1), Báo cáo an toàn được duyệt (+1), Sáng kiến được duyệt (+1).',
            '⬇️ Giảm điểm: Bị ghi nhận tiêu cực (-1 mỗi lần).',
            '📈 Điểm tối đa 5/5, tối thiểu 1/5. Xem được theo tháng/quý/năm.',
          ]
        },
        {
          title: 'Ai được dùng tính năng Admin Dashboard?',
          content: [
            '👔 Dành cho: Supervisor (TSV), Safety Manager (SM), Controller.',
            '🔐 Cần đăng nhập riêng bằng nút "Admin Dashboard" trên màn hình chờ.',
            '🛡️ SUPER_ADMIN có toàn quyền hệ thống (chỉ dành cho IT/Quản trị viên).',
          ]
        },
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-md flex flex-col animate-fadeIn">
      <div className="bg-gradient-to-r from-[#1a3673] to-[#1e3a8a] px-4 md:px-8 py-4 flex items-center justify-between shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          {activeChapter && (
            <button
              onClick={() => setActiveChapter(null)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition mr-1"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <BookOpen size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-lg tracking-wide">
              {activeChapter ? chapters.find((c) => c.id === activeChapter)?.title : 'Trung Tâm Tài Liệu'}
            </h1>
            <p className="text-blue-200 text-xs">HERO CMIT • Hướng dẫn sử dụng</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!activeChapter ? (
          <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-4">
            <div className="text-center mb-8 mt-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-900/50">
                <BookOpen size={40} className="text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Chào mừng đến với H.E.R.O</h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                Chọn chương mục bên dưới để xem hướng dẫn chi tiết phù hợp với vai trò của bạn.
              </p>
            </div>

            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => setActiveChapter(chapter.id)}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-2xl p-5 flex items-center gap-4 transition-all active:scale-98 group shadow-lg"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${chapter.color} flex items-center justify-center text-2xl shrink-0 shadow-lg group-hover:scale-105 transition-transform`}
                >
                  {chapter.icon}
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-white font-bold text-base">{chapter.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{chapter.sections.length} chủ đề</p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all"
                />
              </button>
            ))}

            <div className="mt-8 bg-slate-800/60 border border-slate-700 rounded-2xl p-5 text-center">
              <p className="text-slate-400 text-sm">📞 Cần hỗ trợ khẩn cấp?</p>
              <a
                href="tel:0989715843"
                className="text-2xl font-black text-blue-400 hover:text-blue-300 block mt-1 transition"
              >
                0989.715.843
              </a>
              <p className="text-slate-500 text-xs mt-1">Hotline Yardsup • Trực ban Khai thác 24/7</p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-4 md:p-8">
            {(() => {
              const chapter = chapters.find((c) => c.id === activeChapter);
              if (!chapter) return null;
              return (
                <div className="space-y-4">
                  <div className={`bg-gradient-to-br ${chapter.color} rounded-2xl p-6 text-white mb-6 shadow-xl`}>
                    <div className="text-4xl mb-2">{chapter.icon}</div>
                    <h2 className="text-2xl font-black">{chapter.title}</h2>
                    <p className="text-white/70 text-sm mt-1">{chapter.sections.length} chủ đề hướng dẫn</p>
                  </div>
                  {chapter.sections.map((section, idx) => (
                    <div key={idx} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-md">
                      <div className="px-5 py-3.5 border-b border-slate-700 flex items-center gap-2">
                        <List size={15} className="text-slate-400 shrink-0" />
                        <h3 className="text-white font-bold text-sm">{section.title}</h3>
                      </div>
                      <div className="p-4 space-y-2.5">
                        {section.content.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed"
                          >
                            <span className="shrink-0 text-base mt-0.5">{item.substring(0, 2)}</span>
                            <span>{item.substring(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationCenter;

