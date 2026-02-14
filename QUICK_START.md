# 🚀 Quick Start Guide - FoodHub Frontend

## ⚡ Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

---

## 🎯 What You'll See

### First Time Setup

1. **Home Page** - Beautiful hero section with floating food cards
2. **Browse Restaurants** - Click "Explore Restaurants" or navigate to /restaurants
3. **Register** - Create an account (Customer, Restaurant Owner, or Delivery Agent)
4. **Login** - Sign in with your credentials
5. **Order Food** - Browse menus, add to cart, checkout!

---

## 📋 Prerequisites

### Required
- ✅ **Node.js 16+** - [Download](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)

### Backend Services (Must be running)
- ✅ **API Gateway** on `localhost:8080`
- ✅ **MongoDB** on `localhost:27017`
- ✅ **Kafka** on `localhost:9092`
- ✅ **All Microservices** registered with Eureka

---

## 🔧 Configuration

The frontend is pre-configured to work with the backend. No changes needed!

**Default Settings:**
- Frontend Port: `3000`
- API Gateway: `http://localhost:8080`
- Proxy: Configured in `vite.config.js`

---

## 🎨 Test Accounts

You can create test accounts with different roles:

### Customer Account
```
Role: CUSTOMER
Username: customer1
Password: password123
```

### Restaurant Owner Account
```
Role: RESTAURANT_OWNER
Username: owner1
Password: password123
```

### Delivery Agent Account
```
Role: DELIVERY_AGENT
Username: driver1
Password: password123
```

---

## 📱 Features to Try

### 1. Browse Restaurants
- Go to "Restaurants" page
- Use search to filter
- Click on a restaurant to view menu

### 2. Add to Cart
- Select items from menu
- Adjust quantities with +/- buttons
- Click "Add to Cart"

### 3. Checkout
- View cart (cart icon in navbar)
- Review items
- Click "Proceed to Checkout"
- Login if not authenticated
- Complete payment

### 4. View Orders
- Navigate to "My Orders"
- See order history
- Track order status

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- --port 3001
```

### API Connection Failed
- Verify API Gateway is running: `http://localhost:8080`
- Check backend services in Eureka: `http://localhost:8761`
- Ensure MongoDB is running

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Verify proxy configuration in `vite.config.js`
- Ensure API Gateway allows CORS

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components (Navbar, etc.)
│   ├── pages/           # Page components (Home, Cart, etc.)
│   ├── context/         # State management (Auth, Cart)
│   ├── services/        # API integration
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

---

## 🎯 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🌟 Key Features

✨ **Beautiful UI** - Modern, vibrant design with smooth animations
🛒 **Shopping Cart** - Persistent cart with quantity management
🔐 **Authentication** - JWT-based login with role support
📱 **Responsive** - Works on mobile, tablet, and desktop
⚡ **Fast** - Built with Vite for lightning-fast development
🎨 **Premium Design** - Gradients, shadows, micro-animations

---

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Setup Guide**: See `SETUP_GUIDE.md`
- **Design Preview**: See `DESIGN_PREVIEW.md`
- **Project Summary**: See `PROJECT_SUMMARY.md`

---

## 🎉 You're All Set!

The frontend is ready to use. Just run:

```bash
npm run dev
```

And start building amazing food delivery experiences! 🍕🍔🍣

---

## 💡 Tips

1. **Hot Reload**: Changes auto-refresh in the browser
2. **DevTools**: Use React DevTools for debugging
3. **Network Tab**: Monitor API calls in browser DevTools
4. **Console**: Check for errors in browser console

---

## 🤝 Need Help?

- Check the documentation files
- Review the code comments
- Inspect the browser console
- Verify backend services are running

**Happy Coding!** 🚀
