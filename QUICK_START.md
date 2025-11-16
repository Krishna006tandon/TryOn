# Admin Dashboard - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Cloudinary account (for image uploads - optional)

### Step 1: Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@tryon.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=4000
```

Start backend:
```bash
npm run dev
```

### Step 2: Frontend Setup

```bash
cd client
npm install
```

Start frontend:
```bash
npm run dev
```

### Step 3: Access Admin Dashboard

1. Open browser: `http://localhost:5173/admin/login`
2. Login with any credentials (demo mode)
3. You'll be redirected to the dashboard

## 📁 Key Files

### Backend API Endpoints
All endpoints are prefixed with `/api/admin` and require authentication:

- **Users**: `/api/admin/users`
- **Products**: `/api/admin/products`
- **Categories**: `/api/admin/categories`
- **Orders**: `/api/admin/orders`
- **Analytics**: `/api/admin/analytics/sales`
- **Coupons**: `/api/admin/coupons`
- **Notifications**: `/api/admin/notifications`
- **Dashboard**: `/api/admin/dashboard/overview`
- **Upload**: `/api/admin/upload/image`

### Frontend Routes
- `/admin/login` - Login page
- `/admin/dashboard` - Main dashboard
- `/admin/users` - User management (to be implemented)
- `/admin/products` - Product management (to be implemented)
- `/admin/categories` - Category management (to be implemented)
- `/admin/orders` - Order management (to be implemented)
- `/admin/analytics` - Analytics page (to be implemented)
- `/admin/coupons` - Coupon management (to be implemented)
- `/admin/notifications` - Notification management (to be implemented)

## 🔑 Authentication

Currently in demo mode. To implement real authentication:

1. Create login API endpoint in backend
2. Update `AuthContext.jsx` to call the real API
3. Store JWT token in localStorage
4. Token is automatically added to all API requests via axios interceptor

## 📊 Features Implemented

✅ Complete backend API with all CRUD operations
✅ MongoDB schemas for all entities
✅ Admin authentication middleware
✅ Image upload with Cloudinary
✅ Dashboard with charts and statistics
✅ Responsive sidebar and header
✅ Admin layout with routing

## 🎨 UI Components

- **Sidebar**: Responsive navigation with menu items
- **Header**: Search bar, notifications, user profile
- **StatCard**: Reusable statistics card component
- **Dashboard**: Overview with charts and recent data

## 📝 Next Steps

1. Implement remaining admin pages (Users, Products, etc.)
2. Add form validation
3. Add toast notifications
4. Implement real authentication
5. Add error handling
6. Add loading states

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Verify all environment variables are set
- Check if port 4000 is available

**Frontend won't start:**
- Run `npm install` again
- Check if port 5173 is available
- Clear node_modules and reinstall

**API calls failing:**
- Check backend is running on port 4000
- Verify CORS is enabled
- Check authentication token in localStorage

**Images not uploading:**
- Verify Cloudinary credentials
- Check file size limits (5MB)
- Verify file types (jpg, png, gif, webp)

## 📚 Documentation

- See `ADMIN_DASHBOARD_GUIDE.md` for complete documentation
- See `IMPLEMENTATION_SUMMARY.md` for implementation details

---

**Happy Coding! 🎉**



