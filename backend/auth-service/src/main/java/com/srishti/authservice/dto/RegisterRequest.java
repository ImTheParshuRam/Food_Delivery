package com.srishti.authservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.srishti.authservice.model.Address;
import com.srishti.authservice.model.UserRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String name;
    private String email;
    private String phone;
    private UserRole role;
    @JsonProperty("address")
    private Address address;
}
