# Home Service Admin Server

Hệ thống quản lý dịch vụ gia đình với backend API và admin web interface.

## 🚀 Tính năng chính

### Backend API
- **Authentication**: Đăng ký, đăng nhập với JWT
- **User Management**: Quản lý customers, workers, admins
- **Service Management**: Quản lý categories và services
- **Worker Applications**: Xử lý đơn đăng ký thợ
- **Admin Panel**: Quản trị viên toàn quyền

### Admin Web Interface
- **Dashboard**: Thống kê tổng quan
- **User Management**: Quản lý người dùng
- **Service Management**: Quản lý dịch vụ
- **Worker Applications**: Duyệt đơn đăng ký thợ

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js**
- **Sequelize ORM** + **MySQL**
- **TiDB Cloud** (Database)
- **JWT Authentication**
- **Multer** (File upload)
- **bcryptjs** (Password hashing)

### Frontend (Admin Web)
- **React.js** + **Vite**
- **Material-UI** / **Ant Design**
- **Axios** (API calls)
- **React Router** (Navigation)

## 📦 Cài đặt

### 1. Clone repository
```bash
git clone https://github.com/hiepnguyen05/server-admin_home_service.git
cd server-admin_home_service
```

### 2. Cài đặt Backend
```bash
cd back_end
npm install
```

### 3. Cài đặt Frontend
```bash
cd admin_web
npm install
```

### 4. Cấu hình Database
```bash
cd back_end
cp .env.example .env
# Chỉnh sửa thông tin database trong .env
```

### 5. Thiết lập Database
```bash
# Tạo database và dữ liệu mẫu
npm run db:setup

# Hoặc chạy từng bước:
npm run db:create    # Tạo database
npm run db:sync      # Tạo bảng
npm run db:seed      # Thêm dữ liệu mẫu
```

## 🚀 Chạy ứng dụng

### Development
```bash
# Backend (Terminal 1)
cd back_end
npm run dev

# Frontend (Terminal 2)  
cd admin_web
npm run dev
```

### Production
```bash
# Backend
cd back_end
npm start

# Frontend
cd admin_web
npm run build
npm run preview
```

## 📊 Database Schema

### Bảng chính
- **users** - Người dùng (customer, worker, admin)
- **categories** - Danh mục dịch vụ
- **services** - Dịch vụ cụ thể
- **bookings** - Đơn đặt dịch vụ
- **user_addresses** - Địa chỉ người dùng
- **wallets** - Ví điện tử
- **worker_profiles** - Hồ sơ thợ
- **worker_applications** - Đơn đăng ký thợ
- **payments** - Thanh toán
- **reviews** - Đánh giá

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Public APIs
- `GET /api/categories` - Danh sách categories
- `GET /api/services` - Danh sách services
- `GET /api/services/:id` - Chi tiết service

### Protected APIs
- `GET /api/users/profile` - Thông tin user
- `POST /api/users/logout` - Đăng xuất

### Admin APIs
- `GET /api/admin/users` - Quản lý users
- `POST /api/admin/categories` - Tạo category
- `POST /api/admin/services` - Tạo service
- `GET /api/admin/stats` - Thống kê

### Worker APIs
- `POST /api/worker-applications/apply` - Đăng ký thợ
- `GET /api/worker-applications/my-application` - Đơn của tôi

## 👥 Tài khoản test

```
Admin:
- Email: admin@homeservice.com
- Password: admin123

Customer:
- Email: customer1@example.com
- Password: 123456

Worker:
- Email: worker1@example.com
- Password: 123456
```

## 📱 Postman Collection

Import file `postman_collection.json` để test APIs hoặc xem [API Documentation](./API_DOCS.md)

## 🗄️ Database

### TiDB Cloud Configuration
```env
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_NAME=home_service
DB_USER=3EGyavuyGP3MRQZ.root
```

### Scripts hữu ích
```bash
npm run db:check     # Kiểm tra dữ liệu
npm run db:reset     # Reset database
npm run db:seed      # Thêm dữ liệu mẫu
```

## 📁 Cấu trúc project

```
server-admin_home_service/
├── back_end/                 # Backend API
│   ├── src/
│   │   ├── controllers/      # API controllers
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Middlewares
│   │   ├── validators/      # Input validation
│   │   └── utils/           # Utilities
│   ├── uploads/             # File uploads
│   └── package.json
├── admin_web/               # Admin frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utilities
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

- **Author**: Hiep Nguyen
- **Email**: hiepnguyen05@example.com
- **GitHub**: [@hiepnguyen05](https://github.com/hiepnguyen05)
- **Project Link**: [https://github.com/hiepnguyen05/server-admin_home_service](https://github.com/hiepnguyen05/server-admin_home_service)

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [React.js](https://reactjs.org/)
- [Sequelize](https://sequelize.org/)
- [TiDB Cloud](https://tidbcloud.com/)
- [Material-UI](https://mui.com/)