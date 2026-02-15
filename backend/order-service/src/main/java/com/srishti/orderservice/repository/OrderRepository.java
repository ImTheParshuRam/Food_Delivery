package com.srishti.orderservice.repository;

import com.srishti.orderservice.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    java.util.List<Order> findByUserId(Long userId);
    java.util.List<Order> findByRestaurantId(Long restaurantId);
}
