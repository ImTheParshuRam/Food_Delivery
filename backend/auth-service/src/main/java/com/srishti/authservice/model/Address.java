package com.srishti.authservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Embeddable;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
@Embeddable
public class Address {
    private String street;
    private String city;
    private String state;
    private Integer zipCode;
}
