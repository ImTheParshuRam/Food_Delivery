package com.srishti.restaurantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodItemDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private byte[] icon;
    private Integer quantity;
    private Long restaurantId;
}
