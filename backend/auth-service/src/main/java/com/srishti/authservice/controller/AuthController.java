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
        System.out.println(">>> [AuthController] Received registration request");
        System.out.println(">>> [AuthController] Payload: " + registerRequest);
        try {
            System.out.println(">>> [AuthController] Calling AuthService.saveUser...");
            String result = authService.saveUser(registerRequest);
            System.out.println(">>> [AuthController] AuthService returned success: " + result);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            System.err.println(">>> [AuthController] ERROR: DataIntegrityViolationException (Duplicate Entry)");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"message\": \"User already exists with this username or phone number\"}");
        } catch (IllegalArgumentException e) {
            System.err.println(">>> [AuthController] ERROR: IllegalArgumentException (Validation): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"" + e.getMessage() + "\"}");
        } catch (Throwable e) {
            System.err.println(">>> [AuthController] CRITICAL ERROR:");
            System.err.println("   Type: " + e.getClass().getName());
            System.err.println("   Message: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"message\": \"Critical failure: " + e.getMessage() + "\", \"type\": \"" + e.getClass().getName() + "\"}");
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
