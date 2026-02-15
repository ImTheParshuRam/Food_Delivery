package com.srishti.authservice.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Entity
@Table(name = "users")
public class UserCredential {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Full name is required")
    @JsonAlias({"name", "fullName"})
    private String fullName;
    
    @NotBlank(message = "Username is required")
    @Column(unique = true)
    private String username; //email
    
    @NotBlank(message = "Password is required")
    private String password;
    
    private Long phoneNumber;
    
    @Valid
    @Embedded
    private Address address;
    
    @NotNull(message = "User role is required")
    @Enumerated(EnumType.STRING)
    @JsonAlias({"role", "userRole"})
    private UserRole userRole;
}
