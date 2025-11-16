# Admin Setup Guide

## 🔐 Admin User बनाने के लिए

### Method 1: Script का उपयोग करें (Recommended)

1. **Environment Variables सेट करें** (`.env` file में):
```env
ADMIN_EMAIL=admin@tryon.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User
```

2. **Script चलाएं**:
```bash
cd server
npm run create-admin
```

यह script:
- Admin user बनाएगा (अगर पहले से नहीं है)
- या existing user को admin बना देगा
- Password को hash करेगा

### Method 2: MongoDB में Direct Create करें

MongoDB Compass या mongo shell में:

```javascript
// MongoDB Shell में
use tryon

// Password hash करें (Node.js में)
// const bcrypt = require('bcryptjs');
// const hash = await bcrypt.hash('admin123', 10);

// Admin user create करें
db.users.insertOne({
  name: "Admin User",
  email: "admin@tryon.com",
  password: "$2a$10$YourHashedPasswordHere", // bcrypt hash
  isAdmin: true,
  isBlocked: false,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Method 3: API के through Create करें

पहले एक normal user बनाएं, फिर MongoDB में update करें:

```javascript
db.users.updateOne(
  { email: "admin@tryon.com" },
  { 
    $set: { 
      isAdmin: true,
      isBlocked: false,
      isActive: true
    } 
  }
)
```

## 🚀 Login करने के लिए

1. **Frontend पर जाएं**: `http://localhost:5173/admin/login`

2. **Credentials डालें**:
   - Email: `admin@tryon.com` (या जो भी आपने set किया)
   - Password: `admin123` (या जो भी आपने set किया)

3. **Login करें** - आपको dashboard पर redirect हो जाएगा

## 🔧 Default Credentials

अगर आपने environment variables set नहीं किए हैं:

- **Email**: `admin@tryon.com`
- **Password**: `admin123`

⚠️ **Important**: Production में इन्हें जरूर change करें!

## 📝 Environment Variables

`.env` file में ये variables add करें:

```env
# Admin Credentials
ADMIN_EMAIL=admin@tryon.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User

# JWT Secret (Important for security)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# MongoDB
MONGODB_URI=your-mongodb-connection-string
```

## 🛡️ Security Notes

1. **Production में**:
   - Strong password use करें
   - JWT_SECRET को change करें
   - ADMIN_PASSWORD को environment variable में store करें

2. **Multiple Admins**:
   - किसी भी user को admin बनाने के लिए:
   ```javascript
   db.users.updateOne(
     { email: "user@example.com" },
     { $set: { isAdmin: true } }
   )
   ```

## 🐛 Troubleshooting

**Login नहीं हो रहा?**
- Check करें MongoDB में user exists करता है
- Check करें `isAdmin: true` है
- Check करें `isBlocked: false` है
- Check करें `isActive: true` है
- Check करें password correct है

**Script error दे रहा है?**
- Check करें `.env` file में MONGODB_URI set है
- Check करें MongoDB connection working है

---

**Happy Admin-ing! 🎉**



