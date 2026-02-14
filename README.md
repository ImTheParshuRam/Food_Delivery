# Food Delivery Application

A full-stack food delivery application built with Spring Boot microservices backend and React frontend.

## 🚀 Features

- **Microservices Architecture** - 8 independent services with service discovery
- **Event-Driven** - Kafka integration for real-time order processing
- **Modern Frontend** - Beautiful React UI with responsive design
- **JWT Authentication** - Secure user authentication and authorization
- **Complete Order Flow** - From browsing to payment and delivery tracking

## 📁 Project Structure

```
Food_Delivery_app/
├── backend/              # Spring Boot Microservices
│   ├── api-gateway/      # API Gateway (Port 8080)
│   ├── discovery-server/ # Eureka Server (Port 8761)
│   ├── auth-service/     # Authentication Service
│   ├── restaurant-service/
│   ├── order-service/
│   ├── payment-service/
│   └── delivery-service/
├── frontend/             # React Frontend (Port 3000)
└── Documentation/        # Comprehensive guides

## 🛠️ Tech Stack

### Backend
- Java 17/18
- Spring Boot
- Spring Cloud (Gateway, Eureka)
- MongoDB
- Apache Kafka
- JWT Authentication

### Frontend
- React 18
- Vite
- React Router
- Axios
- Context API

## 📚 Documentation

- **[Complete Run Guide](COMPLETE_RUN_GUIDE.md)** - Step-by-step instructions to run the project
- **[API Endpoints Guide](API_ENDPOINTS_GUIDE.md)** - All API endpoints with examples
- **[Data Flow Guide](DATA_FLOW_GUIDE.md)** - Complete data flow and architecture
- **[Integration Status](INTEGRATION_STATUS.md)** - Integration verification
- **[Quick Start](QUICK_START.md)** - Get started in 3 steps

## 🚀 Quick Start

### Prerequisites
- Java 17/18
- Maven 3.6+
- Node.js 16+
- MongoDB
- Docker

### Running the Application

1. **Start Infrastructure**
```bash
# Start MongoDB
mongod

# Start Kafka & Zookeeper
cd backend
docker-compose up -d
```

2. **Start Backend Services**
```bash
# Start Discovery Server
cd backend/discovery-server
mvn spring-boot:run

# Start API Gateway (in new terminal)
cd backend/api-gateway
mvn spring-boot:run

# Start other services (auth, restaurant, order, payment)
# See COMPLETE_RUN_GUIDE.md for detailed instructions
```

3. **Start Frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:3000
- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080

## 🎯 User Roles

- **CUSTOMER** - Browse restaurants, place orders, track deliveries
- **RESTAURANT_OWNER** - Manage restaurants and menu items
- **DELIVERY_AGENT** - Manage deliveries
- **ADMIN** - Full system access

## 📸 Screenshots

See [DESIGN_PREVIEW.md](DESIGN_PREVIEW.md) for visual design specifications.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is for educational purposes.

## 📧 Support

For detailed instructions and troubleshooting, see the documentation files in the root directory.
