# Food Delivery Application - Complete Setup Guide

## 🎯 Project Overview

This is a full-stack food delivery application with:
- **Backend**: Spring Boot Microservices (Java)
- **Frontend**: React with Vite
- **Architecture**: Event-driven microservices with Kafka
- **Database**: MongoDB
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway

## 📁 Project Structure

```
Food_Delivery_app/
├── backend/                    # Spring Boot Microservices
│   ├── api-gateway/           # API Gateway (Port 8080)
│   ├── discovery-server/      # Eureka Server (Port 8761)
│   ├── auth-service/          # Authentication Service
│   ├── user-service/          # User Management
│   ├── restaurant-service/    # Restaurant & Menu Management
│   ├── order-service/         # Order Processing
│   ├── payment-service/       # Payment Processing
│   └── delivery-service/      # Delivery Management
└── frontend/                   # React Frontend (Port 3000)
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── services/
    └── package.json
```

## 🚀 Backend Setup

### Prerequisites
- Java 18 or higher
- Maven 3.6+
- MongoDB (running on localhost:27017)
- Docker (for Kafka and Zookeeper)

### Step 1: Start Infrastructure Services

```bash
# Navigate to backend directory
cd backend

# Start Kafka and Zookeeper using Docker Compose
docker-compose up -d
```

This will start:
- Zookeeper on port 2181
- Kafka on port 9092

### Step 2: Start Microservices

Start services in this order:

```bash
# 1. Discovery Server (Eureka)
cd discovery-server
mvn spring-boot:run

# 2. API Gateway
cd ../api-gateway
mvn spring-boot:run

# 3. Auth Service
cd ../auth-service
mvn spring-boot:run

# 4. User Service
cd ../user-service
mvn spring-boot:run

# 5. Restaurant Service
cd ../restaurant-service
mvn spring-boot:run

# 6. Order Service
cd ../order-service
mvn spring-boot:run

# 7. Payment Service
cd ../payment-service
mvn spring-boot:run

# 8. Delivery Service (Optional)
cd ../delivery-service
mvn spring-boot:run
```

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Discovery Server | 8761 | Eureka Dashboard |
| API Gateway | 8080 | Main entry point |
| Auth Service | Dynamic | Registered with Eureka |
| User Service | Dynamic | Registered with Eureka |
| Restaurant Service | Dynamic | Registered with Eureka |
| Order Service | Dynamic | Registered with Eureka |
| Payment Service | Dynamic | Registered with Eureka |
| Delivery Service | Dynamic | Registered with Eureka |

## 🎨 Frontend Setup

### Prerequisites
- Node.js 16+ and npm

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration

Each microservice has an `application.properties` file. Key configurations:

**API Gateway** (`api-gateway/src/main/resources/application.properties`):
```properties
server.port=8080
eureka.client.serviceUrl.defaultZone=http://localhost:8761/eureka
```

**Kafka Configuration** (in services using Kafka):
```properties
spring.kafka.bootstrap-servers=localhost:9092
```

**MongoDB Configuration**:
```properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=<service-name>
```

### Frontend Configuration

**Vite Config** (`frontend/vite.config.js`):
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

## 📊 Database Setup

MongoDB databases will be created automatically:
- `auth-service`
- `user-service`
- `restaurant-service`
- `order-service`
- `payment-service`

## 🧪 Testing the Application

### 1. Check Service Health

- Eureka Dashboard: `http://localhost:8761`
- Verify all services are registered

### 2. Test API Endpoints

```bash
# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 3. Test Frontend

1. Open `http://localhost:3000`
2. Register a new account
3. Browse restaurants
4. Add items to cart
5. Complete checkout

## 🎯 User Roles

The application supports 4 user roles:

1. **CUSTOMER**
   - Browse restaurants
   - Order food
   - Track orders
   - Make payments

2. **RESTAURANT_OWNER**
   - Manage restaurants
   - Add/update menu items
   - View orders
   - Update order status

3. **DELIVERY_AGENT**
   - View assigned deliveries
   - Update delivery status

4. **ADMIN**
   - Full system access
   - User management

## 🔄 Event Flow (Kafka)

### Order Placement Flow

```
1. Customer places order → Order Service
2. Order Service updates inventory → Restaurant Service (HTTP)
3. Customer makes payment → Payment Service
4. Payment Service publishes event → Kafka (payment-notification-topic)
5. Order Service consumes event → Updates order status
6. Order Service publishes event → Kafka (order-rest-notification-topic)
7. Restaurant Service consumes event → Prepares food
```

## 🐛 Troubleshooting

### Backend Issues

**Services not registering with Eureka:**
- Ensure Discovery Server is running first
- Check `eureka.client.serviceUrl.defaultZone` in application.properties

**Kafka connection errors:**
- Verify Docker containers are running: `docker ps`
- Restart Kafka: `docker-compose restart`

**MongoDB connection errors:**
- Ensure MongoDB is running: `mongod --version`
- Check connection string in application.properties

### Frontend Issues

**API calls failing:**
- Verify API Gateway is running on port 8080
- Check browser console for CORS errors
- Verify proxy configuration in vite.config.js

**Build errors:**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Restaurant Endpoints

- `GET /api/restaurant` - Get all restaurants
- `GET /api/restaurant/{id}` - Get restaurant by ID
- `POST /api/restaurant` - Create restaurant (Owner only)

### Food Item Endpoints

- `GET /api/fooditem` - Get all food items
- `GET /api/fooditem/restaurant/{id}` - Get items by restaurant
- `POST /api/fooditem` - Create food item (Owner only)
- `PUT /api/fooditem/{id}` - Update food item (Owner only)

### Order Endpoints

- `POST /api/order` - Create order
- `GET /api/order/{id}` - Get order by ID
- `GET /api/order/user/{userId}` - Get user orders

### Payment Endpoints

- `POST /api/payment` - Process payment
- `GET /api/payment/{id}` - Get payment details

## 🚀 Production Deployment

### Backend

```bash
# Build all services
mvn clean package -DskipTests

# Run with production profile
java -jar target/service-name.jar --spring.profiles.active=prod
```

### Frontend

```bash
# Build for production
npm run build

# Serve with a static file server
npx serve -s dist
```

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues and questions, please create an issue in the repository.
