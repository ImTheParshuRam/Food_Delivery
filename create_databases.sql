-- Create all Food Delivery databases
-- Run these commands in MySQL Workbench to create all databases for the project

CREATE DATABASE IF NOT EXISTS food_delivery_auth;
CREATE DATABASE IF NOT EXISTS food_delivery_users;
CREATE DATABASE IF NOT EXISTS food_delivery_restaurants;
CREATE DATABASE IF NOT EXISTS food_delivery_orders;
CREATE DATABASE IF NOT EXISTS food_delivery_payments;
CREATE DATABASE IF NOT EXISTS food_delivery_delivery;

-- Verify databases were created
SHOW DATABASES LIKE 'food_delivery%';

-- Grant all privileges to root user
GRANT ALL PRIVILEGES ON food_delivery_auth.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON food_delivery_users.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON food_delivery_restaurants.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON food_delivery_orders.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON food_delivery_payments.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON food_delivery_delivery.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
