# Post-Migration Steps Guide

## Prerequisites
1. **Java 21** must be installed on your system
2. **MySQL Server** must be running on localhost:3306
3. **MySQL Workbench** (already installed as mentioned)
4. **Git** must be configured

## Step 1: Verify MySQL Configuration

### Update MySQL Credentials (if needed)
If your MySQL username/password is different from `root/root`, update the following files:

- `backend/auth-service/src/main/resources/application.properties`
- `backend/user-service/src/main/resources/application.properties`
- `backend/restaurant-service/src/main/resources/application.properties`
- `backend/order-service/src/main/resources/application.properties`
- `backend/payment-service/src/main/resources/application.properties`

Change these lines:
```properties
spring.datasource.username=root
spring.datasource.password=root
```

### Verify MySQL is Running
1. Open MySQL Workbench
2. Connect to your local MySQL instance
3. The application will automatically create the following databases on first run:
   - `food_delivery_auth`
   - `food_delivery_users`
   - `food_delivery_restaurants`
   - `food_delivery_orders`
   - `food_delivery_payments`

## Step 2: Test the Backend Services

### Build the Project
```bash
cd d:\SynProject\Food_Delivery_app\backend
mvn clean install
```

### Start Services (in order)
1. **Discovery Server** (port 8761):
   ```bash
   cd discovery-server
   mvn spring-boot:run
   ```

2. **Auth Service** (port 8081):
   ```bash
   cd auth-service
   mvn spring-boot:run
   ```

3. **User Service** (random port):
   ```bash
   cd user-service
   mvn spring-boot:run
   ```

4. **Restaurant Service** (random port):
   ```bash
   cd restaurant-service
   mvn spring-boot:run
   ```

5. **Order Service** (random port):
   ```bash
   cd order-service
   mvn spring-boot:run
   ```

6. **Payment Service** (random port):
   ```bash
   cd payment-service
   mvn spring-boot:run
   ```

7. **Delivery Service** (random port):
   ```bash
   cd delivery-service
   mvn spring-boot:run
   ```

8. **API Gateway** (port 8080):
   ```bash
   cd api-gateway
   mvn spring-boot:run
   ```

### Verify Database Tables
After starting each service, check MySQL Workbench to verify that tables have been created automatically in each database.

## Step 3: Push Changes to Git

### Option 1: Using the Batch Script
Simply double-click the `push_to_git.bat` file in the project root directory.

### Option 2: Manual Git Commands
Open Command Prompt or Git Bash in the project directory:

```bash
cd d:\SynProject\Food_Delivery_app

# Check status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Migrate backend from Java 17/18 to Java 21 and MongoDB to MySQL

- Updated all services to Java 21
- Replaced MongoDB with MySQL/JPA
- Updated all entity classes with JPA annotations
- Updated all repositories to use JpaRepository
- Configured MySQL datasources for all services
- Changed ID types from String to Long
- Added migration summary documentation"

# Push to remote repository
git push
```

### If You Need to Set Up Remote Repository
If you haven't set up a remote repository yet:

```bash
# Add remote repository (replace with your actual Git URL)
git remote add origin https://github.com/yourusername/Food_Delivery_app.git

# Push to remote
git push -u origin main
```

Or if using a different branch:
```bash
git push -u origin master
```

## Step 4: Verify the Migration

### Check Database Connections
1. Open MySQL Workbench
2. Verify all 5 databases are created
3. Check that tables exist in each database
4. Verify table structures match your entity classes

### Test API Endpoints
Use Postman or curl to test key endpoints:

```bash
# Health check
curl http://localhost:8080/actuator/health

# Test auth service
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"test123","fullName":"Test User"}'
```

## Troubleshooting

### Issue: MySQL Connection Refused
- Verify MySQL is running
- Check port 3306 is not blocked
- Verify credentials in application.properties

### Issue: Tables Not Created
- Check `spring.jpa.hibernate.ddl-auto=update` is set
- Check application logs for errors
- Verify entity classes have proper JPA annotations

### Issue: Build Failures
- Ensure Java 21 is installed: `java -version`
- Clear Maven cache: `mvn clean`
- Update Maven: `mvn -version`

### Issue: Git Push Fails
- Check if you have write access to the repository
- Verify remote URL: `git remote -v`
- Pull latest changes first: `git pull`
- Resolve any merge conflicts

## Important Notes

1. **Data Migration**: This migration does NOT automatically transfer data from MongoDB to MySQL. If you have existing data in MongoDB that needs to be preserved, you'll need to:
   - Export data from MongoDB
   - Transform the data (especially ID fields from String to Long)
   - Import into MySQL

2. **ID Changes**: All entity IDs changed from String (MongoDB ObjectId) to Long (MySQL auto-increment). This may affect:
   - Existing API contracts
   - Frontend code that references IDs
   - Any hardcoded ID values in tests

3. **Testing**: Thoroughly test all CRUD operations for each service to ensure data persistence works correctly with MySQL.

4. **Production Deployment**: Before deploying to production:
   - Update MySQL credentials to use secure passwords
   - Consider using environment variables for sensitive data
   - Set up proper database backups
   - Review and optimize JPA queries for performance

## Files Modified

### Configuration Files:
- All `pom.xml` files (Java version + dependencies)
- All `application.properties` files (database configuration)

### Java Files:
- All entity classes (MongoDB → JPA annotations)
- All repository interfaces (MongoRepository → JpaRepository)

### New Files:
- `MIGRATION_SUMMARY.md` - Detailed migration documentation
- `push_to_git.bat` - Git automation script
- `POST_MIGRATION_GUIDE.md` - This file

## Next Steps After Git Push

1. Share the repository URL with your team
2. Update project README with new setup instructions
3. Update API documentation if ID types changed
4. Consider setting up CI/CD pipeline for automated testing
5. Plan for data migration if needed

## Support

If you encounter any issues:
1. Check the `MIGRATION_SUMMARY.md` for detailed changes
2. Review application logs for specific errors
3. Verify MySQL connection in MySQL Workbench
4. Ensure Java 21 is properly installed and configured
