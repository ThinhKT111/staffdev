# StaffDev - Hệ thống Quản lý và Phát triển Nhân viên

## Giới thiệu
StaffDev là một ứng dụng web được xây dựng bằng Angular dành cho quản lý và phát triển nhân viên trong doanh nghiệp. Hệ thống cung cấp các tính năng quản lý nhân viên, đào tạo, tài liệu, điểm danh và diễn đàn thảo luận.

## Các tính năng chính

1. **Quản lý người dùng và phòng ban**
   - Quản lý thông tin nhân viên
   - Quản lý hồ sơ cá nhân
   - Quản lý phòng ban

2. **Đào tạo và phát triển nhân viên**
   - Quản lý lộ trình đào tạo
   - Quản lý khóa học và bài học
   - Quản lý tài liệu đào tạo

3. **Quản lý nhiệm vụ**
   - Giao nhiệm vụ
   - Theo dõi tiến độ
   - Đánh giá nhiệm vụ

4. **Điểm danh và nghỉ phép**
   - Chấm công hàng ngày
   - Quản lý nghỉ phép
   - Thống kê giờ làm việc

5. **Diễn đàn thảo luận**
   - Tạo và tham gia các bài viết
   - Bình luận và trao đổi
   - Chia sẻ kiến thức

## Cấu trúc thư mục

```
src/
├── app/
│   ├── auth/                  # Module xác thực
│   ├── communication/         # Module giao tiếp (Diễn đàn, Thông báo)
│   ├── core/                  # Services, Models, Guards
│   ├── dashboard/             # Module dashboard
│   ├── shared/                # Components dùng chung
│   ├── task-management/       # Module quản lý nhiệm vụ
│   ├── training/              # Module đào tạo
│   └── user-management/       # Module quản lý người dùng
```

## Cấu trúc cơ sở dữ liệu

### Bảng dữ liệu chính:
- **Users**: Thông tin người dùng
- **Departments**: Phòng ban
- **Profiles**: Hồ sơ nhân viên
- **Attendance**: Điểm danh
- **TrainingPaths**: Lộ trình đào tạo
- **TrainingCourses**: Khóa học
- **UserCourses**: Khóa học của người dùng
- **Tasks**: Nhiệm vụ
- **Documents**: Tài liệu
- **ForumPosts**: Bài đăng diễn đàn
- **ForumComments**: Bình luận diễn đàn

## Các tính năng đã triển khai

### Quản lý người dùng
- [x] Danh sách người dùng và bộ lọc
- [x] Thêm, sửa, xóa người dùng
- [x] Hồ sơ chi tiết nhân viên
- [x] Quản lý phòng ban

### Đào tạo
- [x] Quản lý lộ trình đào tạo
- [x] Quản lý khóa học
- [x] Quản lý bài học
- [x] Quản lý tài liệu đào tạo

### Nhiệm vụ
- [x] Giao nhiệm vụ và theo dõi tiến độ
- [x] Cập nhật trạng thái nhiệm vụ
- [x] Đánh giá và phản hồi

### Điểm danh
- [x] Điểm danh vào/ra ca
- [x] Yêu cầu nghỉ phép
- [x] Thống kê giờ làm việc
- [x] Duyệt nghỉ phép

### Diễn đàn
- [x] Danh sách bài viết và tìm kiếm
- [x] Tạo và chỉnh sửa bài viết
- [x] Bình luận bài viết
- [x] Xóa bài viết và bình luận

## Các tính năng cần phát triển thêm

### Thông báo
- [ ] Hiển thị thông báo
- [ ] Đánh dấu đã đọc
- [ ] Thông báo thời gian thực

### Thống kê và báo cáo
- [ ] Thống kê đào tạo
- [ ] Báo cáo nhiệm vụ
- [ ] Thống kê chấm công
- [ ] Biểu đồ tổng quan

### Tích hợp
- [ ] Tích hợp API thực
- [ ] Upload file/hình ảnh
- [ ] Xuất báo cáo (PDF, Excel)

## Môi trường phát triển

- Node.js 18+
- Angular 19+
- Angular Material

## Hướng dẫn cài đặt

1. Clone dự án
   ```bash
   git clone [repository-url]
   ```

2. Cài đặt các thư viện
   ```bash
   npm install
   ```

3. Chạy ứng dụng
   ```bash
   ng serve
   ```

4. Mở trình duyệt và truy cập
   ```
   http://localhost:4200
   ```

## Thông tin đăng nhập mẫu
- **Admin**: cccd=034095000123, password=password
- **Nhân viên**: cccd=034095000124, password=password