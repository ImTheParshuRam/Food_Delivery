# Backend Migration Summary

## Date: 2026-02-15

## Changes Made

### 1. Java Version Update
- **From:** Java 17/18
- **To:** Java 21
- **Files Updated:**
  - All pom.xml files in backend services
  - Parent pom.xml
  - All microservices (auth-service, user-service, restaurant-service, order-service, payment-service, delivery-service, api-gateway, discovery-server)

### 2. Database Migration
- **From:** MongoDB
- **To:** MySQL
- **Services Migrated:**
  - auth-service
  - user-service
  - restaurant-service
  - order-service
  - payment-service

### 3. Dependency Changes

#### Removed Dependencies:
- `spring-boot-starter-data-mongodb`
- MongoDB-specific imports and annotations

#### Added Dependencies:
- `spring-boot-starter-data-jpa`
- `mysql-connector-j` (runtime scope)

### 4. Code Changes

#### Entity Classes:
- Replaced `@Document` with `@Entity` and `@Table`
- Replaced `@Id` from `org.springframework.data.annotation.Id` with `jakarta.persistence.Id`
- Added `@GeneratedValue(strategy = GenerationType.IDENTITY)` for auto-increment IDs
- Changed ID types from `String` to `Long`
- Added `@Embedded` for embedded objects
- Added `@Embeddable` for embeddable classes
- Added `@Enumerated(EnumType.STRING)` for enum fields
- Added `@ElementCollection` for collections
- Added `@OneToMany` relationships where appropriate
- Replaced MongoDB's `Binary` type with JPA's `@Lob byte[]` for binary data

#### Repository Interfaces:
- Replaced `MongoRepository` with `JpaRepository`
- Updated generic type parameters from `<Entity, String>` to `<Entity, Long>`
- Updated method parameter types from `String` to `Long` where applicable

#### Configuration Files (application.properties):
- Removed MongoDB configuration:
  - `spring.data.mongodb.host`
  - `spring.data.mongodb.port`
  - `spring.data.mongodb.database`
  
- Added MySQL configuration:
  - `spring.datasource.url=jdbc:mysql://localhost:3306/<database_name>?createDatabaseIfNotExist=true`
  - `spring.datasource.username=root`
  - `spring.datasource.password=root`
  - `spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver`
  - `spring.jpa.hibernate.ddl-auto=update`
  - `spring.jpa.show-sql=true`
  - `spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect`
  - `spring.jpa.properties.hibernate.format_sql=true`

### 5. Database Schema

#### MySQL Databases Created (auto-created on first run):
- `food_delivery_auth` - for auth-service
- `food_delivery_users` - for user-service
- `food_delivery_restaurants` - for restaurant-service
- `food_delivery_orders` - for order-service
- `food_delivery_payments` - for payment-service

### 6. Important Notes

1. **MySQL Workbench**: The application is now configured to work with MySQL. Ensure MySQL server is running on localhost:3306
2. **Database Credentials**: Default credentials are set to `root/root`. Update in application.properties files if your MySQL has different credentials
3. **Auto DDL**: `spring.jpa.hibernate.ddl-auto=update` will automatically create/update tables based on entity classes
4. **Data Migration**: Existing MongoDB data will NOT be automatically migrated. You'll need to manually migrate data if required
5. **ID Changes**: All entity IDs changed from String (MongoDB ObjectId) to Long (MySQL auto-increment)

### 7. Testing Requirements

Before deploying, ensure:
1. MySQL server is running
2. MySQL credentials in application.properties match your setup
3. All services can connect to their respective databases
4. Run integration tests to verify functionality
5. Test API endpoints to ensure data persistence works correctly

### 8. Next Steps

1. ✅ Update Java version to 21
2. ✅ Migrate from MongoDB to MySQL
3. ⏳ Push changes to Git
4. ⏳ Test all services with MySQL
5. ⏳ Update documentation if needed
