Routes trong Dự Án StaffDev
Cấu Trúc Route Chính
Dự án sử dụng Angular Router với các nhóm route chính được định nghĩa trong src/app/app.routes.ts:
1. Nhóm Route Xác Thực (Auth)
File: src/app/auth/auth.routes.ts
typescript/auth/login           // Trang đăng nhập
/auth/register        // Trang đăng ký
/auth/forgot-password // Trang quên mật khẩu
/auth/reset-password  // Trang đặt lại mật khẩu
2. Route Dashboard
File: src/app/dashboard/dashboard.routes.ts
typescript/dashboard            // Trang chủ dashboard
3. Quản Lý Nhân Viên
File: src/app/user-management/user-management.routes.ts
typescript/users/list           // Danh sách nhân viên
/users/create         // Tạo nhân viên mới
/users/edit/:id       // Chỉnh sửa nhân viên
/users/detail/:id     // Chi tiết nhân viên
/users/departments    // Quản lý phòng ban
/users/roles          // Quản lý vai trò
/users/timesheet      // Chấm công
4. Quản Lý Đào Tạo
File: src/app/training/training.routes.ts
typescript/training/paths                 // Danh sách lộ trình đào tạo
/training/paths/create          // Tạo lộ trình mới
/training/paths/edit/:id        // Chỉnh sửa lộ trình

/training/courses               // Danh sách khóa học
/training/courses/create        // Tạo khóa học mới
/training/courses/edit/:id      // Chỉnh sửa khóa học
/training/courses/:id           // Chi tiết khóa học

/training/assignments           // Bài tập và nhiệm vụ
/training/documents             // Tài liệu
5. Giao Tiếp
File: src/app/communication/communication.routes.ts
typescript/communication/notifications    // Thông báo
/communication/forum            // Diễn đàn
Điều Hướng Mặc Định
Trong src/app/app.routes.ts, các route được cấu hình như sau:

Mặc định sẽ chuyển hướng đến /dashboard
Nếu route không tồn tại sẽ chuyển hướng về /dashboard

Cấu Trúc Routing Chi Tiết
Lazy Loading
Các module được sử dụng kỹ thuật Lazy Loading để tối ưu hiệu năng:
typescript{
  path: 'auth',
  loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
},
{
  path: 'dashboard',
  loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
},
// Tương tự cho các module khác
Lưu Ý

Tất cả các route đều sử dụng standalone components
Dữ liệu hiện tại là mock data
Chưa có kết nối backend thực

Hướng Phát Triển

Tích hợp authentication guard
Xây dựng hệ thống phân quyền chi tiết
Kết nối backend thực

Kiểm Tra Routes
Để kiểm tra các route:

Chạy ng serve
Truy cập http://localhost:4200
Sử dụng trình duyệt để điều hướng

Bảo Mật
⚠️ Hiện tại:

Chưa có hệ thống xác thực mạnh
Đang sử dụng mock login
Chưa có phân quyền chi tiết

Yêu Cầu

Node.js 18+
Angular CLI 19+
Trình duyệt hiện đại

Hỗ Trợ
Liên hệ quản trị viên để được hỗ trợ chi tiết về hệ thống routes.