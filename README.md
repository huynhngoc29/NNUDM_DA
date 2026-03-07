# Hệ Thống Thương Mại Điện Tử Thông Minh Ngành Trang Sức

## Jewelry E-Commerce System

Hệ thống thương mại điện tử chuyên nghiệp cho ngành trang sức với đầy đủ tính năng quản lý sản phẩm, đơn hàng, thanh toán và khách hàng.

## 🚀 Công nghệ sử dụng

### Frontend (Client)

- **React 19** - UI Framework
- **Vite** - Build Tool
- **Material-UI** - Component Library
- **Ant Design** - UI Components
- **React Router** - Routing
- **Firebase Authentication** - Xác thực người dùng
- **Axios** - HTTP Client
- **Redux** - State Management
- **Tailwind CSS** - Styling
- **Three.js** - 3D Visualization

### Backend (Server)

- **Node.js + Express** - Backend Framework
- **MySQL** - Database
- **JWT** - Authentication
- **Cloudinary** - Image Upload & Management
- **SendGrid/Nodemailer** - Email Service
- **VNPay** - Payment Gateway
- **Firebase Admin** - Admin SDK
- **Bcrypt** - Password Hashing

## 📁 Cấu trúc dự án

```
NNUDM_DA/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── api/           # API calls
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context
│   │   ├── icons/         # Custom icons
│   │   ├── layout/        # Layout components
│   │   ├── pages/         # Page components
│   │   ├── reducers/      # Redux reducers
│   │   ├── services/      # Business logic
│   │   ├── theme/         # Theme configuration
│   │   ├── utils/         # Utility functions
│   │   └── firebase.js    # Firebase config
│   ├── public/            # Static files
│   └── package.json
│
├── server/                # Backend Node.js Application
│   ├── cloudinary/        # Cloudinary configuration
│   ├── config/            # Server configuration
│   ├── controllers/       # Route controllers
│   ├── jobs/              # Cron jobs
│   ├── middlewares/       # Express middlewares
│   ├── migrations/        # Database migrations
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── seeders/           # Database seeders
│   ├── services/          # Business logic
│   ├── sql/               # SQL scripts
│   ├── tests/             # Unit tests
│   ├── utils/             # Utility functions
│   ├── validators/        # Input validation
│   ├── vnpay/             # VNPay integration
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

## 🛠️ Cài đặt

### Yêu cầu hệ thống

- Node.js >= 18.x
- MySQL >= 8.x
- npm hoặc yarn

### Cài đặt dependencies

#### 1. Cài đặt Client

```bash
cd client
npm install
```

#### 2. Cài đặt Server

```bash
cd server
npm install
```

### Cấu hình môi trường

#### Client (.env)

```bash
cd client
cp .env.example .env
# Chỉnh sửa file .env với thông tin Firebase của bạn
```

#### Server (.env)

```bash
cd server
cp .env.example .env
# Chỉnh sửa file .env với thông tin database, API keys...
```

### Cấu hình Database

```bash
# Tạo database
mysql -u root -p
CREATE DATABASE jewelry_ecommerce;

# Import schema (nếu có)
mysql -u root -p jewelry_ecommerce < server/sql/schema.sql
```

## 🚀 Chạy dự án

### Development Mode

#### Chạy Client (Terminal 1)

```bash
cd client
npm run dev
```

Client sẽ chạy tại: http://localhost:3000

#### Chạy Server (Terminal 2)

```bash
cd server
npm run dev
```

Server sẽ chạy tại: http://localhost:5000

### Production Build

#### Build Client

```bash
cd client
npm run build
```

#### Run Server

```bash
cd server
npm start
```

## 📖 API Documentation

API endpoint: `http://localhost:5000/api`

### Health Check

- GET `/` - Server health check
- GET `/api/health` - API health check

### Authentication

- POST `/api/auth/register` - Đăng ký tài khoản
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/logout` - Đăng xuất
- GET `/api/auth/profile` - Lấy thông tin user

## 🧪 Testing

```bash
# Client
cd client
npm test

# Server
cd server
npm test
```

## 📦 Scripts

### Client

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

### Server

- `npm run dev` - Chạy với nodemon
- `npm start` - Chạy production
- `npm test` - Chạy tests

## 🤝 Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

ISC License

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Material-UI
- Ant Design
- React Community
- Express.js Community
