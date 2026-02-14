# 🚀 Complete Project Run Guide

## 📋 Prerequisites Checklist

Before running the project, ensure you have:

- ✅ **Java 17 or 18** - `java -version`
- ✅ **Maven 3.6+** - `mvn -version`
- ✅ **Node.js 16+** - `node -version`
- ✅ **npm** - `npm -version`
- ✅ **MongoDB** - Running on `localhost:27017`
- ✅ **Docker** - For Kafka and Zookeeper
- ✅ **Git** - For cloning repositories

---

## 🎯 Step-by-Step Run Guide

### STEP 1: Start Infrastructure Services

#### 1.1 Start MongoDB
```bash
# Windows
mongod

# Or if MongoDB is installed as a service
net start MongoDB
```

**Verify:** Open MongoDB Compass or run `mongo` in terminal

---

#### 1.2 Start Kafka & Zookeeper
```bash
cd d:\SynProject\Food_Delivery_app\backend
docker-compose up -d
```

**What this does:**
- Starts Zookeeper on port `2181`
- Starts Kafka on port `9092`

**Verify:**
```bash
docker ps
```
You should see 2 containers running: `zookeeper` and `kafka`

---

### STEP 2: Start Backend Microservices

**⚠️ IMPORTANT:** Start services in this exact order!

#### 2.1 Start Discovery Server (Eureka)
```bash
cd d:\SynProject\Food_Delivery_app\backend\discovery-server
mvn spring-boot:run
```

**Wait for:** `Started DiscoveryServerApplication`

**Verify:** Open http://localhost:8761
- You should see Eureka Dashboard

**Keep this terminal open!**

---

#### 2.2 Start API Gateway
**Open a NEW terminal:**
```bash
cd d:\SynProject\Food_Delivery_app\backend\api-gateway
mvn spring-boot:run
```

**Wait for:** `Started ApiGatewayApplication`

**Verify:** Check Eureka Dashboard - you should see `API-GATEWAY` registered

**Keep this terminal open!**

---

#### 2.3 Start Auth Service
**Open a NEW terminal:**
```bash
cd d:\SynProject\Food_Delivery_app\backend\auth-service
mvn spring-boot:run
```

**Wait for:** `Started AuthServiceApplication`

**Verify:** Check Eureka - you should see `AUTH-SERVICE` registered

**Keep this terminal open!**

---

#### 2.4 Start User Service
**Open a NEW terminal:**
```bash
cd d:\SynProject\Food_Delivery_app\backend\user-service
mvn spring-boot:run
```

**Wait for:** `Started UserServiceApplication`

**Keep this terminal open!**

---

#### 2.5 Start Restaurant Service
**Open a NEW terminal:**
```bash
cd d:\SynProject\Food_Delivery_app\backend\restaurant-service
mvn spring-boot:run
```

**Wait for:** `Started RestaurantServiceApplication`

**Verify:** Check Eureka - you should see `RESTAURANT-SERVICE` registered

**Keep this terminal open!**

---

#### 2.6 Start Order Service
**Open a NEW terminal:**
```bash
cd d:\SynProject\Food_Delivery_app\backend\order-service
mvn spring-boot:run
```

**Wait for:** `Started OrderServiceApplication`

**Verify:** Check Eureka - you should see `ORDER-SERVICE` registered

**Keep this terminal open!**

---

#### 2.7 Start Payment Service
**Open a NEW terminal:**
```bash
cd d:\SynProject\Food_Delivery_app\backend\payment-service
mvn spring-boot:run
```

**Wait for:** `Started PaymentServiceApplication`

**Verify:** Check Eureka - you should see `PAYMENT-SERVICE` registered

**Keep this terminal open!**

---

#### 2.8 Start Delivery Service (Optional)
**Open a NEW terminal:**
```bash
cd d:\SynProject\Food_Delivery_app\backend\delivery-service
mvn spring-boot:run
```

**Wait for:** `Started DeliveryServiceApplication`

**Keep this terminal open!**

---

### STEP 3: Verify All Backend Services

#### 3.1 Check Eureka Dashboard
Open: http://localhost:8761

You should see all services registered:
- API-GATEWAY
- AUTH-SERVICE
- RESTAURANT-SERVICE
- ORDER-SERVICE
- PAYMENT-SERVICE
- DELIVERY-SERVICE (if started)

#### 3.2 Test API Gateway
```bash
curl http://localhost:8080/api/v1/auth/register
```

Should return an error (because no body), but confirms API Gateway is working.

---

### STEP 4: Start Frontend

#### 4.1 Install Dependencies (First time only)
**Open a NEW terminal:**
```bash
cd d:\SynProject\Food_Delivery_app\frontend
npm install
```

**Wait for:** Installation to complete

---

#### 4.2 Start Development Server
```bash
npm run dev
```

**Wait for:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Keep this terminal open!**

---

### STEP 5: Access the Application

Open your browser and navigate to:
**http://localhost:3000**

You should see the beautiful FoodHub homepage! 🎉

---

## 🧪 Testing the Application

### Test 1: Register a User

1. Click **"Sign Up"** or navigate to http://localhost:3000/register
2. Fill in the form:
   - Full Name: `Test User`
   - Username: `testuser`
   - Email: `test@example.com`
   - Phone: `+1234567890`
   - Password: `password123`
   - Role: `CUSTOMER`
   - Address: Fill in all fields
3. Click **"Create Account"**
4. You should be redirected to login page

---

### Test 2: Login

1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Username: `testuser`
   - Password: `password123`
3. Click **"Login"**
4. You should be redirected to homepage
5. Check navbar - you should see your username

---

### Test 3: Browse Restaurants

1. Click **"Explore Restaurants"** or navigate to http://localhost:3000/restaurants
2. You should see a list of restaurants (if any exist in database)
3. Use search to filter restaurants

---

### Test 4: Create a Restaurant (Restaurant Owner)

1. Register a new user with role `RESTAURANT_OWNER`
2. Login with that account
3. Navigate to "My Restaurant"
4. Create a new restaurant with menu items

---

### Test 5: Place an Order

1. Login as `CUSTOMER`
2. Browse restaurants
3. Click on a restaurant
4. Add items to cart
5. Go to cart (cart icon in navbar)
6. Click **"Proceed to Checkout"**
7. Complete payment
8. Order should be placed successfully!

---

## 📊 Service Status Summary

After starting everything, you should have:

| Service | Status | URL | Terminal |
|---------|--------|-----|----------|
| MongoDB | ✅ Running | localhost:27017 | Background |
| Zookeeper | ✅ Running | localhost:2181 | Docker |
| Kafka | ✅ Running | localhost:9092 | Docker |
| Discovery Server | ✅ Running | http://localhost:8761 | Terminal 1 |
| API Gateway | ✅ Running | http://localhost:8080 | Terminal 2 |
| Auth Service | ✅ Running | Dynamic Port | Terminal 3 |
| User Service | ✅ Running | Dynamic Port | Terminal 4 |
| Restaurant Service | ✅ Running | Dynamic Port | Terminal 5 |
| Order Service | ✅ Running | Dynamic Port | Terminal 6 |
| Payment Service | ✅ Running | Dynamic Port | Terminal 7 |
| Delivery Service | ✅ Running | Dynamic Port | Terminal 8 |
| Frontend | ✅ Running | http://localhost:3000 | Terminal 9 |

**Total Terminals:** 9 (8 backend + 1 frontend)

---

## 🛑 Stopping the Application

### Stop Frontend
In the frontend terminal, press: `Ctrl + C`

### Stop Backend Services
In each backend service terminal, press: `Ctrl + C`

### Stop Docker Services
```bash
cd d:\SynProject\Food_Delivery_app\backend
docker-compose down
```

### Stop MongoDB
```bash
# If running in terminal
Ctrl + C

# If running as service
net stop MongoDB
```

---

## 🔄 Restart Guide

If you need to restart:

1. **Quick Restart (Services already built):**
   - Follow STEP 1 (Infrastructure)
   - Follow STEP 2 (Backend Services)
   - Follow STEP 4.2 (Frontend - skip npm install)

2. **Full Restart (Clean start):**
   - Stop all services
   - Clear MongoDB data (optional)
   - Follow all steps from beginning

---

## 🐛 Troubleshooting

### Issue: Service won't start

**Solution:**
```bash
# Check if port is already in use
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <process_id> /F
```

---

### Issue: Eureka shows service as DOWN

**Solution:**
1. Wait 30 seconds (services register every 30s)
2. Check service logs for errors
3. Restart the service

---

### Issue: Frontend can't connect to backend

**Solution:**
1. Verify API Gateway is running on port 8080
2. Check browser console for errors
3. Verify proxy configuration in `vite.config.js`
4. Check if services are registered in Eureka

---

### Issue: MongoDB connection error

**Solution:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod

# Or as service
net start MongoDB
```

---

### Issue: Kafka connection error

**Solution:**
```bash
# Check Docker containers
docker ps

# Restart Kafka
cd backend
docker-compose down
docker-compose up -d

# Check logs
docker logs <container_id>
```

---

### Issue: npm install fails

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📝 Quick Commands Reference

### Start All Backend Services (Windows PowerShell)
```powershell
# Start each in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\SynProject\Food_Delivery_app\backend\discovery-server; mvn spring-boot:run"
Start-Sleep -Seconds 30
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\SynProject\Food_Delivery_app\backend\api-gateway; mvn spring-boot:run"
Start-Sleep -Seconds 20
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\SynProject\Food_Delivery_app\backend\auth-service; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\SynProject\Food_Delivery_app\backend\restaurant-service; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\SynProject\Food_Delivery_app\backend\order-service; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\SynProject\Food_Delivery_app\backend\payment-service; mvn spring-boot:run"
```

### Check All Services Status
```bash
# Check Eureka
curl http://localhost:8761

# Check API Gateway
curl http://localhost:8080/api/v1/auth/register

# Check Frontend
curl http://localhost:3000
```

---

## ✅ Success Checklist

Before testing, verify:

- [ ] MongoDB is running
- [ ] Docker containers (Kafka, Zookeeper) are running
- [ ] Eureka Dashboard shows all services as UP
- [ ] API Gateway is accessible at localhost:8080
- [ ] Frontend is accessible at localhost:3000
- [ ] No errors in any terminal
- [ ] Browser console shows no errors

---

## 🎉 You're Ready!

If all services are running and the checklist is complete, you're ready to use the application!

**Start by:**
1. Registering a new user
2. Logging in
3. Browsing restaurants
4. Placing an order

**Enjoy your Food Delivery Application!** 🍕🍔🍣

---

## 📚 Additional Resources

- **API Endpoints:** See `API_ENDPOINTS_GUIDE.md`
- **Data Flow:** See `DATA_FLOW_GUIDE.md` (next file)
- **Frontend Guide:** See `frontend/README.md`
- **Design Preview:** See `DESIGN_PREVIEW.md`

---

**Need help? Check the troubleshooting section or review the logs in each terminal!**
