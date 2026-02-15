package com.srishti.orderservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderNumber;
    private Long restaurantId;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;
    private BigDecimal totalAmount;
    private Long orderTime;
    @Embedded
    private Address address;
    private Long deliveryTime;
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;
    private Long paymentId;
    private Long userId;
}
