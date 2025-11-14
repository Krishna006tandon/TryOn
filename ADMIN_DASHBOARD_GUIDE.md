# Admin Dashboard - Complete Implementation Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Features](#features)
6. [API Documentation](#api-documentation)
7. [Database Schemas](#database-schemas)
8. [Deployment](#deployment)

---

## 🎯 Overview

This is a complete Admin Dashboard for an Online Clothing Store built with:
- **Frontend**: React.js + TailwindCSS + Framer Motion + Recharts
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Storage**: Cloudinary (for images)
- **AI**: Gemini API (optional for analytics)

---

## 🏗️ Architecture

### Folder Structure

```
TryOn/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── gemini.js
│   │   ├── controllers/
│   │   │   ├── adminUserController.js
│   │   │   ├── adminProductController.js
│   │   │   ├── adminCategoryController.js
│   │   │   ├── adminOrderController.js
│   │   │   ├── adminAnalyticsController.js
│   │   │   ├── adminCouponController.js
│   │   │   ├── adminNotificationController.js
│   │   │   ├── adminDashboardController.js
│   │   │   └── adminUploadController.js
│   │   ├── middleware/
│   │   │   └── adminAuth.js
│   │   ├── models/
│   │   │   ├── User.js (updated)
│   │   │   ├── Product.js (updated)
│   │   │   ├── Order.js (updated)
│   │   │   ├── Category.js (new)
│   │   │   ├── Coupon.js (new)
│   │   │   └── Notification.js (new)
│   │   ├── routes/
│   │   │   └── adminRoutes.js
│   │   └── index.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   └── admin/
    │   │       ├── Sidebar.jsx
    │   │       ├── Header.jsx
    │   │       └── StatCard.jsx
    │   ├── pages/
    │   │   └── admin/
    │   │       ├── Login.jsx
    │   │       ├── AdminLayout.jsx
    │   │       ├── Dashboard.jsx
    │   │       ├── Users.jsx
    │   │       ├── Products.jsx
    │   │       ├── Categories.jsx
    │   │       ├── Orders.jsx
    │   │       ├── Analytics.jsx
    │   │       ├── Coupons.jsx
    │   │       └── Notifications.jsx
    │   ├── contexts/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   └── api.js
    │   └── App.jsx
    ├── tailwind.config.js
    └── package.json
```

---

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install cloudinary multer-storage-cloudinary
```

### 2. Environment Variables (.env)

Create a `.env` file in the `server` directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tryon

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Admin Email (for initial admin access)
ADMIN_EMAIL=admin@tryon.com

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Gemini AI (optional)
GEMINI_API_KEY=your-gemini-api-key

# Server
PORT=4000
```

### 3. Update server/src/index.js

The admin routes are already added:
```javascript
app.use('/api/admin', adminRoutes);
```

### 4. Create Admin User

You can create an admin user via MongoDB or add this to a seed script:

```javascript
// In MongoDB shell or seed script
db.users.updateOne(
  { email: "admin@tryon.com" },
  { $set: { isAdmin: true, isBlocked: false } },
  { upsert: true }
);
```

---

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd client
npm install recharts
npm install -D tailwindcss postcss autoprefixer
```

### 2. Update App.jsx

Add admin routes to your `App.jsx`:

```javascript
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
// ... other imports

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Home ... />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* Add other admin routes */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}
```

### 3. TailwindCSS Configuration

The `tailwind.config.js` and `postcss.config.js` files are already created.

---

## ✨ Features

### 1. User Management
- ✅ View all users with pagination
- ✅ Search and filter users
- ✅ Edit user details
- ✅ Block/Unblock accounts
- ✅ View user statistics

**API Endpoints:**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `PATCH /api/admin/users/:id/block` - Toggle block status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/users/stats` - Get user statistics

### 2. Product Management
- ✅ Add/Edit/Delete products
- ✅ Multiple image upload
- ✅ Category assignment
- ✅ Stock management
- ✅ Price and discount management

**API Endpoints:**
- `GET /api/admin/products` - Get all products
- `GET /api/admin/products/:id` - Get product by ID
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/products/stats` - Get product statistics

### 3. Category Management
- ✅ Add/Edit/Delete categories
- ✅ Hierarchical categories (parent-child)
- ✅ Category images
- ✅ Display order management

**API Endpoints:**
- `GET /api/admin/categories` - Get all categories
- `GET /api/admin/categories/:id` - Get category by ID
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

### 4. Order Management
- ✅ View all orders
- ✅ Update order status (Pending, Shipped, Delivered, Cancelled)
- ✅ Update payment status
- ✅ View full order details
- ✅ Order statistics

**API Endpoints:**
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get order by ID
- `PATCH /api/admin/orders/:id/status` - Update order status
- `PATCH /api/admin/orders/:id/payment-status` - Update payment status
- `GET /api/admin/orders/stats` - Get order statistics

### 5. Sales Analytics
- ✅ Monthly sales graph
- ✅ Top-selling products chart
- ✅ Revenue, orders, users statistics
- ✅ AI-powered insights (optional)

**API Endpoints:**
- `GET /api/admin/analytics/sales` - Get sales analytics
- `GET /api/admin/analytics/ai-insights` - Get AI insights

### 6. Image Upload
- ✅ Cloudinary integration
- ✅ Single and multiple image upload
- ✅ Automatic image optimization

**API Endpoints:**
- `POST /api/admin/upload/image` - Upload single image
- `POST /api/admin/upload/images` - Upload multiple images

### 7. Coupon/Discount System
- ✅ Create discount codes
- ✅ Percentage or fixed amount discounts
- ✅ Usage limits
- ✅ Expiry dates
- ✅ Category-specific coupons

**API Endpoints:**
- `GET /api/admin/coupons` - Get all coupons
- `GET /api/admin/coupons/:id` - Get coupon by ID
- `POST /api/admin/coupons` - Create coupon
- `PUT /api/admin/coupons/:id` - Update coupon
- `DELETE /api/admin/coupons/:id` - Delete coupon
- `POST /api/admin/coupons/validate` - Validate coupon

### 8. Notifications
- ✅ Create notifications
- ✅ Target all users or specific users/categories
- ✅ Scheduled notifications
- ✅ Notification statistics

**API Endpoints:**
- `GET /api/admin/notifications` - Get all notifications
- `GET /api/admin/notifications/:id` - Get notification by ID
- `POST /api/admin/notifications` - Create notification
- `PUT /api/admin/notifications/:id` - Update notification
- `DELETE /api/admin/notifications/:id` - Delete notification
- `GET /api/admin/notifications/stats` - Get notification statistics

### 9. Dashboard Overview
- ✅ Total users, products, orders, revenue
- ✅ Recent orders
- ✅ Trending products
- ✅ Sales trend charts

**API Endpoints:**
- `GET /api/admin/dashboard/overview` - Get dashboard overview

---

## 📊 Database Schemas

### User Schema (Updated)
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  phone: String,
  address: Object,
  isAdmin: Boolean (default: false),
  isBlocked: Boolean (default: false),
  isActive: Boolean (default: true),
  // ... other fields
}
```

### Product Schema (Updated)
```javascript
{
  name: String,
  description: String,
  category: ObjectId (ref: Category),
  categoryName: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  images: [Object],
  sizes: [String],
  colors: [String],
  stock: Number,
  isActive: Boolean,
  // ... other fields
}
```

### Category Schema (New)
```javascript
{
  name: String (unique),
  slug: String (unique),
  description: String,
  image: Object,
  parentCategory: ObjectId (ref: Category, nullable),
  isActive: Boolean,
  displayOrder: Number,
}
```

### Order Schema (Updated)
```javascript
{
  orderNumber: String (unique),
  userId: ObjectId (ref: User),
  items: [Object],
  subtotal: Number,
  discount: Number,
  couponCode: String,
  couponId: ObjectId (ref: Coupon),
  total: Number,
  status: String (enum),
  paymentStatus: String (enum),
  // ... other fields
}
```

### Coupon Schema (New)
```javascript
{
  code: String (unique, uppercase),
  description: String,
  discountType: String (enum: 'percentage', 'fixed'),
  discountValue: Number,
  minPurchaseAmount: Number,
  maxDiscountAmount: Number,
  validFrom: Date,
  validUntil: Date,
  usageLimit: Number (nullable),
  usedCount: Number,
  usageLimitPerUser: Number,
  applicableCategories: [ObjectId],
  isActive: Boolean,
}
```

### Notification Schema (New)
```javascript
{
  title: String,
  message: String,
  type: String (enum),
  targetAudience: String (enum: 'all', 'specific_users', 'category_based'),
  targetUsers: [ObjectId],
  targetCategories: [ObjectId],
  link: String,
  image: Object,
  scheduledAt: Date,
  expiresAt: Date,
  isActive: Boolean,
}
```

---

## 🔐 Authentication

### Admin Authentication Middleware

All admin routes are protected by the `adminAuth` middleware:

```javascript
// server/src/middleware/adminAuth.js
export const adminAuth = async (req, res, next) => {
  // Verifies JWT token
  // Checks if user is admin
  // Attaches user to req.user
}
```

### Frontend Authentication

- Token stored in `localStorage` as `adminToken`
- Axios interceptor adds token to all requests
- Auto-redirect to login on 401 errors

---

## 📝 Example API Usage

### Create Product
```javascript
POST /api/admin/products
Headers: { Authorization: 'Bearer <token>' }
Body: {
  name: "Cotton T-Shirt",
  description: "Comfortable cotton t-shirt",
  category: "<categoryId>",
  categoryName: "Men",
  price: 29.99,
  stock: 100,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black", "White", "Blue"],
  images: [
    { url: "https://...", alt: "Front view" }
  ]
}
```

### Update Order Status
```javascript
PATCH /api/admin/orders/:orderId/status
Headers: { Authorization: 'Bearer <token>' }
Body: {
  status: "shipped",
  notes: "Shipped via FedEx"
}
```

### Create Coupon
```javascript
POST /api/admin/coupons
Headers: { Authorization: 'Bearer <token>' }
Body: {
  code: "SUMMER2024",
  discountType: "percentage",
  discountValue: 20,
  minPurchaseAmount: 50,
  validFrom: "2024-06-01",
  validUntil: "2024-08-31",
  usageLimit: 1000
}
```

---

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is correct
3. Deploy to Heroku, Railway, or similar

### Frontend Deployment

1. Build the React app: `npm run build`
2. Deploy `dist` folder to Vercel, Netlify, or similar
3. Update API base URL in environment variables

---

## 🎯 Next Steps

1. **Complete Frontend Pages**: Create full implementations for:
   - Users.jsx (with table, search, filters)
   - Products.jsx (with CRUD forms)
   - Categories.jsx
   - Orders.jsx
   - Analytics.jsx (with charts)
   - Coupons.jsx
   - Notifications.jsx

2. **Add Real Authentication**: Implement proper login API endpoint

3. **Add Form Validation**: Use libraries like Formik + Yup

4. **Add Error Handling**: Comprehensive error boundaries and toast notifications

5. **Add Loading States**: Skeleton loaders and spinners

6. **Optimize Performance**: 
   - Implement pagination
   - Add caching
   - Optimize images

---

## 📚 Additional Resources

- [MongoDB Indexing Best Practices](https://docs.mongodb.com/manual/indexes/)
- [Recharts Documentation](https://recharts.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is enabled in Express
2. **Image Upload Fails**: Check Cloudinary credentials
3. **Authentication Fails**: Verify JWT_SECRET matches
4. **MongoDB Connection**: Check connection string and network access

---

## 📄 License

This project is part of the TryOn e-commerce platform.

---

**Created with ❤️ for TryOn Store**

