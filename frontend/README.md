# FoodHub - Food Delivery Frontend

A beautiful, modern React frontend for the Food Delivery Microservices application.

## 🚀 Features

- **Beautiful UI/UX**: Modern, responsive design with vibrant colors and smooth animations
- **Restaurant Discovery**: Browse and search restaurants with detailed menus
- **Shopping Cart**: Add items to cart with quantity management
- **User Authentication**: Login and registration with role-based access (Customer, Restaurant Owner, Delivery Agent)
- **Order Management**: Place orders and track order history
- **Payment Integration**: Integrated payment processing
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **Vite** - Build tool and dev server

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔧 Configuration

The frontend is configured to proxy API requests to the backend API Gateway running on `http://localhost:8080`.

You can modify this in `vite.config.js`:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Restaurants.jsx
│   │   ├── RestaurantDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design System

The app uses a comprehensive design system with:

- **Color Palette**: Vibrant food-themed colors (Primary: #FF6B35, Secondary: #4ECDC4)
- **Typography**: Inter for body text, Playfair Display for headings
- **Spacing**: Consistent spacing scale
- **Components**: Reusable button, card, form, and utility classes
- **Animations**: Smooth transitions and micro-animations

## 🔐 Authentication

The app supports JWT-based authentication with the following user roles:

- **CUSTOMER**: Can browse restaurants, order food, and track orders
- **RESTAURANT_OWNER**: Can manage restaurants and menu items
- **DELIVERY_AGENT**: Can view and manage deliveries
- **ADMIN**: Full system access

## 📱 API Integration

The frontend integrates with the following backend microservices:

- **Auth Service**: User registration and authentication
- **Restaurant Service**: Restaurant and menu management
- **Order Service**: Order creation and management
- **Payment Service**: Payment processing
- **User Service**: User profile management

## 🚀 Build for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

## 🎯 Key Features Implementation

### Shopping Cart
- Persistent cart using localStorage
- Restaurant validation (can't mix items from different restaurants)
- Quantity management
- Real-time total calculation

### Order Flow
1. Browse restaurants and menu items
2. Add items to cart
3. Review cart and proceed to checkout
4. Login (if not authenticated)
5. Place order
6. Process payment
7. Order confirmation

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 768px, 968px
- Touch-friendly interactions
- Optimized images and assets

## 🎨 Customization

You can customize the design by modifying CSS variables in `src/index.css`:

```css
:root {
  --primary: #FF6B35;
  --secondary: #4ECDC4;
  --accent: #FFD93D;
  /* ... more variables */
}
```

## 📄 License

This project is part of the Food Delivery Microservices application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
