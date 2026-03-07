# Server - Backend Application

## Cấu trúc thư mục

### `/config`

Cấu hình ứng dụng

- `database.js` - MySQL connection pool
- `firebase.js` - Firebase Admin SDK
- `cloudinary.js` - Cloudinary config

### `/controllers`

Route controllers - xử lý request/response

- Mỗi resource có 1 controller
- Validation input
- Gọi services để xử lý business logic

### `/models`

Database models và queries

- SQL queries
- Data access layer

### `/routes`

API routes definition

- RESTful API structure
- Route protection với middlewares

### `/middlewares`

Express middlewares

- `auth.js` - Authentication & Authorization
- `validate.js` - Input validation
- `errorHandler.js` - Error handling
- `upload.js` - File upload

### `/services`

Business logic layer

- Xử lý nghiệp vụ phức tạp
- Tương tác với models
- External API calls

### `/validators`

Input validation schemas (Joi)

### `/utils`

Helper functions

- JWT utils
- Email utils
- Image processing

## API Structure

```
/api
  /auth
    POST /register
    POST /login
    POST /logout
    GET /profile
  /products
    GET /
    GET /:id
    POST /
    PUT /:id
    DELETE /:id
  /orders
  /users
  /categories
  /reviews
  /cart
  /payment
```

## Error Handling

Sử dụng try-catch và custom error classes

```javascript
try {
  // logic
} catch (error) {
  next(error);
}
```

## Security

- JWT authentication
- Input validation
- SQL injection prevention (prepared statements)
- XSS protection
- CORS configuration
- Rate limiting
