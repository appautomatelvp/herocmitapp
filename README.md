# CMIT HERO - Hệ thống Quản lý Nhân sự & An toàn

Ứng dụng web quản lý nhân sự, điểm danh, checklist thiết bị, báo cáo an toàn và sáng kiến Kaizen cho Cai Mep International Terminal.

## Công nghệ

- **React 18** + **Vite 5**
- **Firebase** (Auth, Firestore)
- **Tailwind CSS**
- **Lucide React** (icons)

## Yêu cầu

- Node.js 18+
- npm hoặc yarn

## Cài đặt

```bash
# Clone repo
git clone <url-repo>
cd herocmitapp

# Cài đặt phụ thuộc
npm install

# Chạy development
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173).

## Build & Deploy

```bash
# Build production
npm run build

# Xem bản preview
npm run preview
```

### Deploy lên Vercel

1. Đẩy code lên GitHub.
2. Vào [vercel.com](https://vercel.com) → Import project từ GitHub.
3. Root Directory: `herocmitapp` (hoặc để trống nếu repo là root).
4. Build Command: `npm run build`, Output: `dist`.
5. (Tùy chọn) Thêm biến môi trường Firebase trong Vercel Dashboard nếu dùng `.env`.

## Cấu trúc dự án (sau tái cấu trúc)

```
herocmitapp/
├── src/
│   ├── config/
│   │   ├── firebase.js   # Firebase init, getCollection, getDocRef, auth, ensureAnonymousAuth, ...
│   │   └── constants.js  # GROUP_ORDER, CHECKLIST_SCHEMA, EQUIPMENT_TYPES, ...
│   ├── lib/
│   │   ├── designSystem.js  # CSS variables & animations (inject once)
│   │   ├── utils.js         # getThemeColors, getCurrentDate, sortEmployees, resizeImage, ...
│   │   └── audit.js         # createAuditLog
│   ├── components/
│   │   └── ui.jsx        # Card, Modal, GroupBadge, Avatar
│   ├── App.jsx           # Component chính + các view (Login, Dashboards)
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json
└── README.md
```

- **config**: Cấu hình Firebase và hằng số nghiệp vụ (checklist, thiết bị, nhóm).
- **lib**: Design system, utils dùng chung, audit log.
- **components**: UI tái sử dụng (có thể tách thêm DocumentationCenter, QR*, Guest*, ... từ App.jsx).

## Firebase

Dự án dùng Firebase Auth và Firestore. Cấu hình hiện nằm trong `src/App.jsx`. Để bảo mật khi public repo, nên chuyển sang biến môi trường (xem `.env.example`).

## Bản quyền

Nội bộ CMIT.
