# Client - Frontend Application

## React + Vite + Material-UI + Ant Design

Ứng dụng frontend cho hệ thống thương mại điện tử trang sức.

## Công nghệ

- **React 19** với Hooks
- **Vite** - Fast build tool
- **Material-UI** - Component library
- **Ant Design** - UI components
- **React Router** - Routing
- **Redux** - State management
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **Firebase** - Authentication

## Cấu trúc thư mục

### `/src/api`

Chứa các API calls và axios configuration

- `axiosConfig.js` - Cấu hình axios instance
- `endpoints.js` - Định nghĩa API endpoints
- Service files cho từng module (productService.js, userService.js, ...)

### `/src/components`

Reusable React components

- Common components: Button, Input, Card, Modal, ...
- Form components
- UI components

### `/src/pages`

Page components cho từng route

- Home
- Products
- ProductDetail
- Cart
- Checkout
- Profile
- Admin Dashboard

### `/src/context`

React Context cho state management

- AuthContext
- CartContext
- ThemeContext

### `/src/services`

Business logic và helper functions

### `/src/utils`

Utility functions

- formatters
- validators
- constants

## Cài đặt

```bash
npm install
```

## Chạy development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## Build production

```bash
npm run build
```

## Quy ước đặt tên

- Components: PascalCase (VD: `ProductCard.jsx`)
- Files khác: camelCase (VD: `useAuth.js`)
- CSS Modules: `ComponentName.module.css`

## Best Practices

1. Sử dụng functional components với hooks
2. Tách logic ra custom hooks
3. Prop validation với PropTypes
4. Lazy loading cho pages
5. Memoization khi cần thiết (useMemo, useCallback)
6. Code splitting
