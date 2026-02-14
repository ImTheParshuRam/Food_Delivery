# 🔄 Complete Data Flow & Architecture Guide

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Complete Order Flow](#complete-order-flow)
3. [Kafka Event Flow](#kafka-event-flow)
4. [Authentication Flow](#authentication-flow)
5. [Database Schema](#database-schema)
6. [Service Communication](#service-communication)
7. [Critical Data Points](#critical-data-points)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                  React + Vite (Port 3000)                   │
│                                                              │
│  Components: Home, Restaurants, Cart, Login, Register       │
│  State: AuthContext, CartContext                            │
│  API: Axios with JWT interceptors                           │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP Requests
                       │ /api/v1/*
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY                              │
│              Spring Cloud Gateway (Port 8080)               │
│                                                              │
│  - Routes requests to microservices                         │
│  - JWT Authentication Filter                                │
│  - Load Balancing (via Eureka)                             │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ↓              ↓              ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Auth Service │ │ Restaurant   │ │ Order Service│
│              │ │ Service      │ │              │
│ - Register   │ │ - Restaurants│ │ - Orders     │
│ - Login      │ │ - Food Items │ │ - Status     │
│ - JWT Token  │ │ - Menu       │ │              │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       ↓                ↓                ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   MongoDB    │ │   MongoDB    │ │   MongoDB    │
│ auth-service │ │ restaurant-  │ │ order-service│
│              │ │ service      │ │              │
└──────────────┘ └──────────────┘ └──────────────┘

        ↓              ↓              ↓
┌─────────────────────────────────────────────────────────────┐
│                    KAFKA MESSAGE BROKER                      │
│                      (Port 9092)                             │
│                                                              │
│  Topics:                                                     │
│  - payment-notification-topic                               │
│  - order-rest-notification-topic                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  DISCOVERY SERVER (EUREKA)                   │
│                      (Port 8761)                             │
│                                                              │
│  All microservices register here for service discovery      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛒 Complete Order Flow

### Phase 1: User Registration & Login

```
1. User Registration
   ┌─────────┐
   │ Frontend│ POST /api/v1/auth/register
   │         │ {username, password, name, email, role, address}
   └────┬────┘
        │
        ↓
   ┌─────────────┐
   │ API Gateway │ Routes to Auth Service
   └─────┬───────┘
         │
         ↓
   ┌──────────────┐
   │ Auth Service │
   │              │ 1. Hash password (BCrypt)
   │              │ 2. Save to MongoDB (auth-service DB)
   │              │ 3. Create user in User Service
   └──────────────┘
   
   Response: "User registered successfully"

2. User Login
   ┌─────────┐
   │ Frontend│ POST /api/v1/auth/token
   │         │ {username, password}
   └────┬────┘
        │
        ↓
   ┌──────────────┐
   │ Auth Service │
   │              │ 1. Validate credentials
   │              │ 2. Generate JWT token
   │              │ 3. Token contains: username, roles, expiry
   └──────────────┘
   
   Response: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   
   Frontend: Stores token in localStorage
```

---

### Phase 2: Browse & Add to Cart

```
3. Browse Restaurants
   ┌─────────┐
   │ Frontend│ GET /api/v1/restaurant
   │         │ Headers: Authorization: Bearer <token>
   └────┬────┘
        │
        ↓
   ┌─────────────┐
   │ API Gateway │ 1. Validates JWT token
   │             │ 2. Extracts username
   │             │ 3. Adds loggedInUser header
   └─────┬───────┘
         │
         ↓
   ┌────────────────────┐
   │ Restaurant Service │
   │                    │ Query MongoDB for all restaurants
   └────────────────────┘
   
   Response: [
     {id, name, address, phone, rating, cuisine, imageUrl}
   ]

4. View Restaurant Menu
   ┌─────────┐
   │ Frontend│ GET /api/v1/fooditem/{restaurantId}
   └────┬────┘
        │
        ↓
   ┌────────────────────┐
   │ Restaurant Service │
   │                    │ Query MongoDB for food items
   └────────────────────┘
   
   Response: [
     {id, name, description, price, quantity, isVegetarian}
   ]

5. Add to Cart (Frontend Only)
   ┌─────────┐
   │ Frontend│ 
   │         │ 1. Check if item from same restaurant
   │         │ 2. Add to CartContext state
   │         │ 3. Save to localStorage
   │         │ 4. Update cart badge count
   └─────────┘
```

---

### Phase 3: Place Order

```
6. Place Order
   ┌─────────┐
   │ Frontend│ POST /api/v1/order
   │         │ {
   │         │   userId, 
   │         │   orderItems: [{foodItemId, name, price, qty}],
   │         │   address
   │         │ }
   └────┬────┘
        │
        ↓
   ┌──────────────┐
   │ Order Service│
   │              │ Step 1: Validate order
   │              │ - Check if food items exist
   │              │ - Calculate total amount
   │              │
   │              │ Step 2: Update food quantities
   │              │ ┌─────────────────────────────┐
   │              │ │ HTTP PUT to Restaurant Svc  │
   │              │ │ /api/v1/fooditem/quantity   │
   │              │ │ Params: foodItemIds, qtys   │
   │              │ └─────────────────────────────┘
   │              │
   │              │ Step 3: Save order to MongoDB
   │              │ - Status: PENDING
   │              │ - Generate order ID
   │              │ - Save timestamp
   │              │
   │              │ Step 4: Return order response
   └──────────────┘
   
   Response: {
     id: "order123",
     userId: "user456",
     orderItems: [...],
     totalAmount: 45.99,
     status: "PENDING",
     createdAt: "2024-02-14T03:00:00",
     address: {...}
   }
   
   Frontend: Stores orderId for payment
```

---

### Phase 4: Payment Processing

```
7. Process Payment
   ┌─────────┐
   │ Frontend│ POST /api/v1/payment
   │         │ {
   │         │   orderId: "order123",
   │         │   amount: 45.99,
   │         │   creditCardInfo: {cardNumber, cvv, expiryDate}
   │         │ }
   └────┬────┘
        │
        ↓
   ┌────────────────┐
   │ Payment Service│
   │                │ Step 1: Validate payment info
   │                │ - Check card number format
   │                │ - Verify CVV
   │                │ - Check expiry date
   │                │
   │                │ Step 2: Process payment (Mock)
   │                │ - In real app: Call payment gateway
   │                │ - Generate payment ID
   │                │
   │                │ Step 3: Save payment to MongoDB
   │                │ - Payment ID
   │                │ - Order ID
   │                │ - Amount
   │                │ - Status: SUCCESS
   │                │ - Timestamp
   │                │
   │                │ Step 4: Publish to Kafka
   │                │ ┌────────────────────────────┐
   │                │ │ Topic: payment-notification│
   │                │ │ Message: [                 │
   │                │ │   paymentId,               │
   │                │ │   orderId,                 │
   │                │ │   "SUCCESS"                │
   │                │ │ ]                          │
   │                │ └────────────────────────────┘
   └────────────────┘
   
   Response: "Payment processed successfully"
```

---

### Phase 5: Kafka Event Processing

```
8. Order Service Kafka Listener
   ┌──────────────┐
   │ Order Service│ @KafkaListener(topics = "payment-notification-topic")
   │              │
   │              │ Step 1: Receive payment notification
   │              │ Message: [paymentId, orderId, "SUCCESS"]
   │              │
   │              │ Step 2: Update order in MongoDB
   │              │ - Find order by orderId
   │              │ - Update status: PENDING → CONFIRMED
   │              │ - Add payment ID
   │              │ - Update timestamp
   │              │
   │              │ Step 3: Publish to Kafka
   │              │ ┌────────────────────────────────┐
   │              │ │ Topic: order-rest-notification │
   │              │ │ Message: {                     │
   │              │ │   orderId,                     │
   │              │ │   userId,                      │
   │              │ │   orderAddress,                │
   │              │ │   foodItemIds: [...],          │
   │              │ │   foodItemQuantities: [...]    │
   │              │ │ }                              │
   │              │ └────────────────────────────────┘
   └──────────────┘

9. Restaurant Service Kafka Listener
   ┌────────────────────┐
   │ Restaurant Service │ @KafkaListener(topics = "order-rest-notification")
   │                    │
   │                    │ Step 1: Receive order notification
   │                    │ Message: {orderId, userId, foodItemIds, qtys}
   │                    │
   │                    │ Step 2: Log notification
   │                    │ "Received notification for order: order123"
   │                    │
   │                    │ Step 3: Start food preparation
   │                    │ - In real app: Notify kitchen
   │                    │ - Update preparation status
   │                    │ - Estimate delivery time
   └────────────────────┘
```

---

### Phase 6: Order Status Updates

```
10. Update Order Status (Restaurant/Delivery)
    ┌─────────────────┐
    │ Restaurant/     │ PUT /api/v1/order/status
    │ Delivery Agent  │ Params: orderId
    │                 │ Body: "PREPARING"
    └────┬────────────┘
         │
         ↓
    ┌──────────────┐
    │ Order Service│
    │              │ Update order status in MongoDB
    │              │ CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
    └──────────────┘

Order Status Flow:
PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
   ↓
CANCELLED (if cancelled)
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    JWT Authentication                        │
└─────────────────────────────────────────────────────────────┘

1. Login Request
   Frontend → Auth Service
   POST /api/v1/auth/token {username, password}
   
2. Token Generation
   Auth Service:
   - Validates credentials against MongoDB
   - Generates JWT token with:
     * Header: {alg: "HS256", typ: "JWT"}
     * Payload: {username, roles, exp, iat}
     * Signature: HMACSHA256(header + payload, secret)
   
3. Token Storage
   Frontend:
   - Stores token in localStorage
   - Adds to Axios interceptor
   
4. Authenticated Requests
   Frontend → API Gateway
   Headers: Authorization: Bearer <token>
   
5. Token Validation
   API Gateway:
   - Extracts token from header
   - Validates signature
   - Checks expiration
   - Extracts username
   - Adds loggedInUser header
   
6. Service Access
   API Gateway → Microservice
   Headers: 
   - Authorization: Bearer <token>
   - loggedInUser: <username>
   
7. Token Expiry
   If token expired:
   - API Gateway returns 401
   - Frontend intercepts 401
   - Redirects to login
   - Clears localStorage
```

---

## 💾 Database Schema

### Auth Service Database (auth-service)

```javascript
// Collection: user_credentials
{
  _id: ObjectId,
  username: String (unique),
  password: String (BCrypt hashed),
  name: String,
  email: String,
  roles: [String], // ["CUSTOMER", "RESTAURANT_OWNER", "DELIVERY_AGENT", "ADMIN"]
  createdAt: Date
}
```

---

### Restaurant Service Database (restaurant-service)

```javascript
// Collection: restaurants
{
  _id: ObjectId,
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  phone: String,
  ownerId: String, // Reference to user
  rating: Number,
  cuisine: String,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}

// Collection: food_items
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  restaurantId: String, // Reference to restaurant
  quantity: Number, // Available quantity
  isVegetarian: Boolean,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

### Order Service Database (order-service)

```javascript
// Collection: orders
{
  _id: ObjectId,
  userId: String, // Reference to user
  orderItems: [
    {
      foodItemId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: Number,
  status: String, // PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  paymentId: String, // Added after payment
  createdAt: Date,
  updatedAt: Date
}
```

---

### Payment Service Database (payment-service)

```javascript
// Collection: payments
{
  _id: ObjectId,
  orderId: String, // Reference to order
  amount: Number,
  status: String, // SUCCESS, FAILED, PENDING
  creditCardInfo: {
    cardNumber: String (last 4 digits only),
    expiryDate: String
  },
  transactionId: String,
  createdAt: Date
}
```

---

## 🔄 Service Communication

### HTTP Communication

```
Frontend ←→ API Gateway ←→ Microservices

1. Synchronous REST calls
2. Request/Response pattern
3. Used for:
   - User registration/login
   - Fetching data (restaurants, menu)
   - Creating orders
   - Processing payments
```

---

### Kafka Communication (Asynchronous)

```
Payment Service → Kafka → Order Service
Order Service → Kafka → Restaurant Service

1. Event-driven architecture
2. Publish/Subscribe pattern
3. Used for:
   - Payment notifications
   - Order confirmations
   - Restaurant notifications

Topics:
- payment-notification-topic
  Producer: Payment Service
  Consumer: Order Service
  Message: [paymentId, orderId, status]

- order-rest-notification-topic
  Producer: Order Service
  Consumer: Restaurant Service
  Message: {orderId, userId, foodItemIds, quantities, address}
```

---

## ⚠️ Critical Data Points

### 1. JWT Token
- **Location:** Frontend localStorage (`authToken`)
- **Format:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Expiry:** Configured in Auth Service (default: 24 hours)
- **Usage:** All authenticated API calls
- **Security:** Never expose secret key, always use HTTPS in production

---

### 2. User Roles
```
CUSTOMER:
- Can browse restaurants
- Can place orders
- Can view order history

RESTAURANT_OWNER:
- Can create restaurants
- Can add/update menu items
- Can view orders for their restaurant
- Can update order status

DELIVERY_AGENT:
- Can view assigned deliveries
- Can update delivery status

ADMIN:
- Full system access
```

---

### 3. Order Status Lifecycle
```
PENDING (Initial)
   ↓ (After payment success)
CONFIRMED
   ↓ (Restaurant starts cooking)
PREPARING
   ↓ (Delivery agent picks up)
OUT_FOR_DELIVERY
   ↓ (Customer receives)
DELIVERED

Alternative:
PENDING/CONFIRMED → CANCELLED (if cancelled)
```

---

### 4. Food Item Quantity Management
```
Initial: quantity = 100

Order placed with quantity = 5
→ Restaurant Service updates: quantity = 95

Important:
- Quantity updated BEFORE order confirmation
- If quantity insufficient, order fails
- Prevents overselling
```

---

### 5. Kafka Message Formats

**Payment Notification:**
```java
List<String> paymentInfo = [
  "payment123",  // Payment ID
  "order456",    // Order ID
  "SUCCESS"      // Status
]
```

**Order Notification:**
```java
OrderPlacedNotification {
  orderId: "order456",
  userId: "user789",
  orderAddress: {...},
  foodItemIds: ["food1", "food2"],
  foodItemQuantities: [2, 3]
}
```

---

### 6. API Gateway Routing
```
/api/v1/auth/**       → auth-service (No auth required)
/api/v1/restaurant/** → restaurant-service (Auth required)
/api/v1/fooditem/**   → restaurant-service (Auth required)
/api/v1/order/**      → order-service (Auth required)
/api/v1/payment/**    → payment-service (Auth required)
/api/v1/user/**       → auth-service (Auth required)
```

---

### 7. Frontend State Management

**AuthContext:**
```javascript
{
  user: {id, username, name, email, role},
  loading: boolean,
  isAuthenticated: boolean,
  login: function,
  logout: function,
  register: function
}
```

**CartContext:**
```javascript
{
  cartItems: [
    {id, name, price, quantity, restaurant}
  ],
  restaurantId: string,
  addToCart: function,
  removeFromCart: function,
  updateQuantity: function,
  clearCart: function,
  getCartTotal: function,
  getCartCount: function
}
```

---

### 8. Error Handling

**Backend:**
```java
@ResponseStatus(HttpStatus.NOT_FOUND)
throw new ResourceNotFoundException("Restaurant not found");

Response:
{
  "timestamp": "2024-02-14T03:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Restaurant not found",
  "path": "/api/v1/restaurant/123"
}
```

**Frontend:**
```javascript
try {
  await api.get('/restaurant/123');
} catch (error) {
  if (error.response?.status === 404) {
    // Handle not found
  } else if (error.response?.status === 401) {
    // Redirect to login
  }
}
```

---

## 📊 Performance Considerations

### 1. Service Discovery
- Services register with Eureka every 30 seconds
- API Gateway caches service locations
- Load balancing across multiple instances

### 2. Database Indexing
```javascript
// Recommended indexes
restaurants: {name: 1, city: 1}
food_items: {restaurantId: 1}
orders: {userId: 1, status: 1}
payments: {orderId: 1}
```

### 3. Caching Strategy
- Frontend: Cache restaurant list for 5 minutes
- API Gateway: Cache service routes
- Backend: Cache frequently accessed data

---

## 🔒 Security Best Practices

1. **JWT Tokens:**
   - Use strong secret key
   - Set appropriate expiry
   - Validate on every request

2. **Passwords:**
   - BCrypt hashing with salt
   - Minimum 8 characters
   - Never log passwords

3. **API Gateway:**
   - Rate limiting
   - CORS configuration
   - Request validation

4. **Database:**
   - Use environment variables for credentials
   - Enable authentication
   - Regular backups

---

**This guide covers all critical data flows and architecture details!** 🚀
