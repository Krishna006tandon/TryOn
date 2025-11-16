import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';

// Controllers
import * as authController from '../controllers/adminAuthController.js';
import * as userController from '../controllers/adminUserController.js';
import * as productController from '../controllers/adminProductController.js';
import * as categoryController from '../controllers/adminCategoryController.js';
import * as orderController from '../controllers/adminOrderController.js';
import * as analyticsController from '../controllers/adminAnalyticsController.js';
import * as couponController from '../controllers/adminCouponController.js';
import * as notificationController from '../controllers/adminNotificationController.js';
import * as dashboardController from '../controllers/adminDashboardController.js';
import * as uploadController from '../controllers/adminUploadController.js';

const router = express.Router();

// Public admin routes (no authentication required)
router.post('/login', authController.adminLogin);
router.get('/me', adminAuth, authController.getCurrentAdmin);

// All other admin routes require authentication
router.use(adminAuth);

// Dashboard
router.get('/dashboard/overview', dashboardController.getDashboardOverview);

// User Management
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/stats', userController.getUserStats);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.patch('/users/:id/block', userController.toggleBlockUser);
router.delete('/users/:id', userController.deleteUser);

// Product Management
router.get('/products', productController.getAllProducts);
router.get('/products/stats', productController.getProductStats);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Category Management
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Order Management
router.get('/orders', orderController.getAllOrders);
router.get('/orders/by-users', orderController.getOrdersByUsers);
router.get('/orders/stats', orderController.getOrderStats);
router.get('/orders/:id', orderController.getOrderById);
router.patch('/orders/:id/status', orderController.updateOrderStatus);
router.patch('/orders/:id/payment-status', orderController.updatePaymentStatus);
router.patch('/orders/:orderId/products/:productId/status', orderController.updateProductDeliveryStatus);

// Analytics
router.get('/analytics/sales', analyticsController.getSalesAnalytics);
router.get('/analytics/ai-insights', analyticsController.getAIInsights);

// Coupon Management
router.get('/coupons', couponController.getAllCoupons);
router.get('/coupons/:id', couponController.getCouponById);
router.post('/coupons', couponController.createCoupon);
router.put('/coupons/:id', couponController.updateCoupon);
router.delete('/coupons/:id', couponController.deleteCoupon);
router.post('/coupons/validate', couponController.validateCoupon);

// Notification Management
router.get('/notifications', notificationController.getAllNotifications);
router.get('/notifications/stats', notificationController.getNotificationStats);
router.get('/notifications/:id', notificationController.getNotificationById);
router.post('/notifications', notificationController.createNotification);
router.put('/notifications/:id', notificationController.updateNotification);
router.delete('/notifications/:id', notificationController.deleteNotification);

// Image Upload
router.post('/upload/image', uploadController.uploadImage);
router.post('/upload/images', uploadController.uploadMultipleImages);

export default router;

