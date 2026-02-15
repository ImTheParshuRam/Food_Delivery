package com.srishti.restaurantservice.repository;

import com.srishti.restaurantservice.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    java.util.Optional<Restaurant> findByOwnerUsername(String username);
}
