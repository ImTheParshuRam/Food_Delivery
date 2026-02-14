# 🔌 Complete API Endpoints Guide

## 📋 Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Restaurant Endpoints](#restaurant-endpoints)
3. [Food Item Endpoints](#food-item-endpoints)
4. [Order Endpoints](#order-endpoints)
5. [Payment Endpoints](#payment-endpoints)
6. [User Endpoints](#user-endpoints)
7. [API Gateway Routes](#api-gateway-routes)
8. [Frontend Integration](#frontend-integration)

---

## 🔐 Authentication Endpoints

### Base URL: `http://localhost:8080/api/v1/auth`

#### 1. Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

Request Body:
{
  "username": "string",
  "password": "string",
  "name": "string",
  "email": "string",
  "roles": ["CUSTOMER" | "RESTAURANT_OWNER" | "DELIVERY_AGENT" | "ADMIN"]
}

Response: 
"User registered successfully"
```

**Frontend Integration:** `src/services/api.js` → `authService.register()`

---

#### 2. Get Token (Login)
```http
POST /api/v1/auth/token
Content-Type: application/json

Request Body:
{
  "username": "string",
  "password": "string"
}

Response: 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." (JWT Token)
```

**Frontend Integration:** `src/services/api.js` → `authService.login()`

**Important:** Store this token in localStorage and include in all subsequent requests as:
```
Authorization: Bearer <token>
```

---

#### 3. Validate Token
```http
GET /api/v1/auth/validate?token=<jwt_token>

Response:
"Token is valid"
```

**Frontend Integration:** Used in API interceptors for token validation

---

## 🍽️ Restaurant Endpoints

### Base URL: `http://localhost:8080/api/v1/restaurant`
**🔒 Requires Authentication**

#### 1. Get All Restaurants
```http
GET /api/v1/restaurant
Authorization: Bearer <token>

Response:
[
  {
    "id": "string",
    "name": "string",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string"
    },
    "phone": "string",
    "rating": 4.5,
    "imageUrl": "string",
    "cuisine": "string"
  }
]
```

**Frontend Integration:** `src/pages/Restaurants.jsx` → Uses `restaurantService.getAllRestaurants()`

---

#### 2. Get Restaurant by ID
```http
GET /api/v1/restaurant/{id}
Authorization: Bearer <token>

Response:
{
  "id": "string",
  "name": "string",
  "address": {...},
  "phone": "string",
  "rating": 4.5,
  "ownerId": "string",
  "foodItems": [...]
}
```

**Frontend Integration:** `src/pages/RestaurantDetail.jsx` → Uses `restaurantService.getRestaurantById(id)`

---

#### 3. Add Restaurant (Owner Only)
```http
POST /api/v1/restaurant
Authorization: Bearer <token>
loggedInUser: <username> (Header)
Content-Type: application/json

Request Body:
{
  "name": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  },
  "phone": "string",
  "cuisine": "string"
}

Response:
"Restaurant added successfully"
```

**Frontend Integration:** `src/services/api.js` → `restaurantService.createRestaurant()`

---

## 🍕 Food Item Endpoints

### Base URL: `http://localhost:8080/api/v1/fooditem`
**🔒 Requires Authentication**

#### 1. Get Food Items by Restaurant
```http
GET /api/v1/fooditem/{restaurantId}
Authorization: Bearer <token>

Response:
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": 12.99,
    "restaurantId": "string",
    "imageUrl": "string",
    "isVegetarian": true,
    "quantity": 100
  }
]
```

**Frontend Integration:** `src/pages/RestaurantDetail.jsx` → Uses `foodItemService.getFoodItemsByRestaurant(restaurantId)`

---

#### 2. Add Food Item (Owner Only)
```http
POST /api/v1/fooditem
Authorization: Bearer <token>
loggedInUser: <username> (Header)
Content-Type: application/json

Request Body:
{
  "name": "string",
  "description": "string",
  "price": 12.99,
  "restaurantId": "string",
  "isVegetarian": true,
  "quantity": 100
}

Response:
"Food item added successfully"
```

**Frontend Integration:** `src/services/api.js` → `foodItemService.createFoodItem()`

---

#### 3. Update Food Item (Owner Only)
```http
PUT /api/v1/fooditem
Authorization: Bearer <token>
loggedInUser: <username> (Header)
Content-Type: application/json

Request Body:
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 14.99,
  "quantity": 50
}

Response:
"Food item updated successfully"
```

**Frontend Integration:** `src/services/api.js` → `foodItemService.updateFoodItem()`

---

#### 4. Update Food Item Quantity (Internal)
```http
PUT /api/v1/fooditem/quantity?foodItemIds=id1,id2&orderQuantities=2,3
Authorization: Bearer <token>

Response: void
```

**Usage:** Called internally by Order Service when order is placed

---

## 📦 Order Endpoints

### Base URL: `http://localhost:8080/api/v1/order`
**🔒 Requires Authentication**

#### 1. Place Order
```http
POST /api/v1/order
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "userId": "string",
  "orderItems": [
    {
      "foodItemId": "string",
      "name": "string",
      "price": 12.99,
      "quantity": 2
    }
  ],
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  }
}

Response:
{
  "id": "string",
  "userId": "string",
  "orderItems": [...],
  "totalAmount": 25.98,
  "status": "PENDING",
  "createdAt": "2024-02-14T03:00:00",
  "address": {...}
}
```

**Frontend Integration:** `src/pages/Cart.jsx` → Uses `orderService.createOrder()`

**Flow:**
1. Frontend sends order to Order Service
2. Order Service updates food item quantities (calls Restaurant Service)
3. Order Service saves order with status "PENDING"
4. Returns order response to frontend
5. Frontend proceeds to payment

---

#### 2. Update Order Status
```http
PUT /api/v1/order/status?orderId=<orderId>
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
"CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED"

Response: void
```

**Usage:** Called by Restaurant/Delivery services to update order status

---

## 💳 Payment Endpoints

### Base URL: `http://localhost:8080/api/v1/payment`
**🔒 Requires Authentication**

#### 1. Process Payment
```http
POST /api/v1/payment
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "orderId": "string",
  "amount": 25.98,
  "creditCardInfo": {
    "cardNumber": "string",
    "cvv": "string",
    "expiryDate": "string"
  }
}

Response:
"Payment processed successfully"
```

**Frontend Integration:** `src/pages/Cart.jsx` → Uses `paymentService.processPayment()`

**Flow:**
1. Frontend sends payment request
2. Payment Service processes payment
3. Payment Service publishes event to Kafka (`payment-notification-topic`)
4. Order Service listens to Kafka and updates order status
5. Order Service publishes event to Kafka (`order-rest-notification-topic`)
6. Restaurant Service listens and starts food preparation

---

## 👤 User Endpoints

### Base URL: `http://localhost:8080/api/v1/user`
**🔒 Requires Authentication**

#### 1. Create User
```http
POST /api/v1/user
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "username": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  },
  "role": "CUSTOMER"
}

Response:
"User created successfully"
```

---

#### 2. Get User by ID
```http
GET /api/v1/user/{id}
Authorization: Bearer <token>

Response:
{
  "id": "string",
  "username": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": {...},
  "role": "CUSTOMER"
}
```

**Frontend Integration:** `src/services/api.js` → `userService.getUserProfile()`

---

#### 3. Update User
```http
PUT /api/v1/user
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": {...}
}

Response:
{
  "id": "string",
  "name": "string",
  "email": "string",
  ...
}
```

**Frontend Integration:** `src/services/api.js` → `userService.updateUserProfile()`

---

## 🌐 API Gateway Routes

The API Gateway (`localhost:8080`) routes requests to microservices:

| Path | Service | Authentication Required |
|------|---------|------------------------|
| `/api/v1/auth/**` | auth-service | ❌ No |
| `/api/v1/restaurant/**` | restaurant-service | ✅ Yes |
| `/api/v1/fooditem/**` | restaurant-service | ✅ Yes |
| `/api/v1/order/**` | order-service | ✅ Yes |
| `/api/v1/payment/**` | payment-service | ✅ Yes |
| `/api/v1/user/**` | auth-service | ✅ Yes |
| `/eureka/**` | discovery-server | ❌ No |

**Authentication Filter:** 
- Validates JWT token
- Extracts username and adds as `loggedInUser` header
- Rejects invalid/expired tokens

---

## 🔗 Frontend Integration

### API Service Configuration
**File:** `src/services/api.js`

```javascript
const API_BASE_URL = '/api';

// Axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Vite Proxy Configuration
**File:** `vite.config.js`

```javascript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

**How it works:**
1. Frontend makes request to `/api/v1/restaurant`
2. Vite proxy forwards to `http://localhost:8080/api/v1/restaurant`
3. API Gateway routes to appropriate microservice
4. Response returns to frontend

---

## 🔄 Complete Order Flow

```
1. User browses restaurants
   GET /api/v1/restaurant
   
2. User views menu
   GET /api/v1/fooditem/{restaurantId}
   
3. User adds items to cart (frontend only)
   
4. User places order
   POST /api/v1/order
   ↓
   Order Service:
   - Validates order
   - Updates food quantities (PUT /api/v1/fooditem/quantity)
   - Saves order with status "PENDING"
   - Returns order response
   
5. User makes payment
   POST /api/v1/payment
   ↓
   Payment Service:
   - Processes payment
   - Publishes to Kafka: payment-notification-topic
   
6. Order Service (Kafka Listener):
   - Receives payment notification
   - Updates order status to "CONFIRMED"
   - Publishes to Kafka: order-rest-notification-topic
   
7. Restaurant Service (Kafka Listener):
   - Receives order notification
   - Starts food preparation
   
8. Order status updates:
   PUT /api/v1/order/status
   - PREPARING → OUT_FOR_DELIVERY → DELIVERED
```

---

## 🚨 Important Notes

### Authentication
- **All endpoints except `/api/v1/auth/**` require JWT token**
- Token must be in `Authorization: Bearer <token>` header
- Token is obtained from `/api/v1/auth/token` endpoint
- Frontend stores token in localStorage
- Token is automatically added by Axios interceptor

### Headers
- `Content-Type: application/json` for all POST/PUT requests
- `Authorization: Bearer <token>` for authenticated requests
- `loggedInUser: <username>` added automatically by API Gateway

### Error Responses
```json
{
  "timestamp": "2024-02-14T03:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid token",
  "path": "/api/v1/restaurant"
}
```

### CORS
- API Gateway handles CORS
- Frontend proxy handles development CORS issues

---

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| API Gateway | 8080 | http://localhost:8080 |
| Discovery Server | 8761 | http://localhost:8761 |
| Auth Service | Dynamic | Registered with Eureka |
| Restaurant Service | Dynamic | Registered with Eureka |
| Order Service | Dynamic | Registered with Eureka |
| Payment Service | Dynamic | Registered with Eureka |
| User Service | Dynamic | Registered with Eureka |

---

**This guide covers all API endpoints and their integration with the frontend!** 🚀
