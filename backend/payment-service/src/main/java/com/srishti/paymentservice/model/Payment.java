package com.srishti.paymentservice.model;

import com.srishti.paymentservice.model.CreditCardInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long timestamp;
    private Double amount;
    @Embedded
    private CreditCardInfo creditCardInfo;
    private Long orderId;
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

}
