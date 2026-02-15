package com.srishti.authservice.controller;

import com.srishti.authservice.dto.AuthRequest;
import com.srishti.authservice.dto.RegisterRequest;
import com.srishti.authservice.dto.UserResponse;
import com.srishti.authservice.model.UserCredential;
import com.srishti.authservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<String> createUser(@RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("=== REGISTRATION REQUEST RECEIVED ===");
            System.out.println("Username: " + registerRequest.getUsername());
            System.out.println("Name: " + registerRequest.getName());
            System.out.println("Email: " + registerRequest.getEmail());
            System.out.println("Phone: " + registerRequest.getPhone());
            System.out.println("Role: " + registerRequest.getRole());
            System.out.println("Address: " + registerRequest.getAddress());
            System.out.println("====================================");
            
            String result = authService.saveUser(registerRequest);
            System.out.println("Result: " + result);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            System.err.println("=== ERROR IN REGISTRATION ===");
            System.err.println("Error Type: " + e.getClass().getName());
            System.err.println("Error Message: " + e.getMessage());
            e.printStackTrace();
            System.err.println("===============================");
            throw e;
        }
    }

    @PostMapping("/token")
    public String getToken(@RequestBody AuthRequest authRequest) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        if(authenticate.isAuthenticated()) {
            return authService.generateToken(authRequest.getUsername());
        }
        else {
            return "Invalid access";
        }
    }

    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        authService.validateToken(token);
        return "Token is valid";
    }

}
