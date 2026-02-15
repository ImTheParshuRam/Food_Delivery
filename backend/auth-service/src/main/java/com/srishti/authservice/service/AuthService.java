package com.srishti.authservice.service;

import com.srishti.authservice.dto.RegisterRequest;
import com.srishti.authservice.dto.UserDto;
import com.srishti.authservice.dto.UserResponse;
import com.srishti.authservice.model.DeliveryAgent;
import com.srishti.authservice.model.UserCredential;
import com.srishti.authservice.model.UserRole;
import com.srishti.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder  passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public String saveUser(RegisterRequest registerRequest) {
        System.out.println(">>> [AuthService] saveUser called with: " + registerRequest);
        try {
            // Check for existing username
            System.out.println(">>> [AuthService] Checking if username exists: " + registerRequest.getUsername());
            if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
                System.out.println(">>> [AuthService] Username already exists!");
                throw new IllegalArgumentException("Username already exists");
            }
            
            System.out.println(">>> [AuthService] Creating UserCredential...");
            UserCredential credential = new UserCredential();
            credential.setUsername(registerRequest.getUsername());
            // credential.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // Moved to separate line for logging
            String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
            System.out.println(">>> [AuthService] Password encoded.");
            credential.setPassword(encodedPassword);
            credential.setFullName(registerRequest.getName());
            
            // Convert phone string to Long
            try {
                System.out.println(">>> [AuthService] Parsing phone: " + registerRequest.getPhone());
                Long phoneNumber = Long.parseLong(registerRequest.getPhone().replaceAll("[^0-9]", ""));
                credential.setPhoneNumber(phoneNumber);
            } catch (NumberFormatException e) {
                System.err.println(">>> [AuthService] Phone parse error: " + e.getMessage());
                credential.setPhoneNumber(0L);
            }
            
            credential.setAddress(registerRequest.getAddress());
            System.out.println(">>> [AuthService] Address set: " + registerRequest.getAddress());
            credential.setUserRole(registerRequest.getRole() != null ? registerRequest.getRole() : UserRole.CUSTOMER);
            System.out.println(">>> [AuthService] Role set: " + credential.getUserRole());
            
            System.out.println(">>> [AuthService] Calling userRepository.save()...");
            userRepository.save(credential);
            System.out.println(">>> [AuthService] User saved successfully!");
            
            // Sync with User Service
            try {
                syncWithUserService(registerRequest);
                System.out.println(">>> [AuthService] Synced with User Service successfully");
            } catch (Exception e) {
                System.err.println(">>> [AuthService] Failed to sync with User Service: " + e.getMessage());
                // Don't fail the whole registration, just log
            }
            
            return "User added to the system";
        } catch (Exception e) {
            System.err.println(">>> [AuthService] ERROR in saveUser:");
            System.err.println("   Type: " + e.getClass().getName());
            System.err.println("   Message: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save user: " + e.getMessage(), e);
        }
    }

    public com.srishti.authservice.dto.LoginResponse generateToken(String username) {
        String token = jwtService.generateToken(username);
        UserCredential user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        com.srishti.authservice.dto.UserDto userDto = com.srishti.authservice.dto.UserDto.builder()
                .id(String.valueOf(user.getId()))
                .fullName(user.getFullName())
                .email(user.getUsername()) // Mapping username to email field based on existing pattern
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .userRole(user.getUserRole())
                .build();
                
        return com.srishti.authservice.dto.LoginResponse.builder()
                .token(token)
                .user(userDto)
                .message("Login successful")
                .build();
    }

    private void syncWithUserService(RegisterRequest request) {
        String url = "http://localhost:8087/api/v1/user";
        org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
        
        // Create payload matching User entity in User Service
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("username", request.getUsername());
        payload.put("fullName", request.getName());
        payload.put("email", request.getEmail());
        payload.put("password", request.getPassword()); // Ideally should be hashed or handled securely
        payload.put("phoneNumber", request.getPhone() != null ? request.getPhone().replaceAll("[^0-9]", "") : null);
        // Address mapping might be needed if User Service expects nested object
        // Assuming flat structure or matching structure
        payload.put("address", request.getAddress());
        payload.put("role", request.getRole());

        try {
            restTemplate.postForObject(url, payload, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Error calling user-service: " + e.getMessage());
        }
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

    public UserResponse getUser(Long id) {
        try {
            Optional<UserCredential> user = userRepository.findById(id);
            if(user.isPresent()) {
                UserCredential user1 = user.get();
                return mapUserToUserResponse(user1);
            }
        } catch (NumberFormatException e) {
            return UserResponse.builder()
                    .responseCode(400)
                    .msg("Invalid user ID format")
                    .build();
        }
        return UserResponse.builder()
                .responseCode(404)
                .msg("User with given id is not present")
                .build();
    }

    public UserResponse updateUser(UserCredential user) {
        if(user.getId() == null) {
            return UserResponse.builder()
                    .responseCode(400)
                    .msg("Please provide user id")
                    .build();
        }
        Optional<UserCredential> userOptional = userRepository.findById(user.getId());
        if(userOptional.isPresent()) {
            return updateUser(userOptional.get(), user);
        }
        return UserResponse.builder()
                .responseCode(404)
                .msg("User with given id is not present")
                .build();
    }

    private UserResponse updateUser(UserCredential user, UserCredential userNew) {
        user.setFullName(userNew.getFullName());
        user.setUsername(userNew.getUsername());
        user.setPhoneNumber(userNew.getPhoneNumber());
        user.setAddress(userNew.getAddress());
        userRepository.save(user);
        return mapUserToUserResponse(user);
    }

    private UserResponse mapUserToUserResponse(UserCredential user1) {
        return UserResponse.builder()
                .user(UserDto.builder()
                        .id(String.valueOf(user1.getId()))
                        .fullName(user1.getFullName())
                        .email(user1.getUsername())
                        .phoneNumber(user1.getPhoneNumber())
                        .address(user1.getAddress())
                        .userRole(user1.getUserRole())
                        .build())
                .responseCode(200)
                .msg("Success")
                .build();
    }

    public List<DeliveryAgent> getDeliveryAgents() {
        List<UserCredential> allUsers = userRepository.findAll();
        allUsers.stream().filter(userCredential -> userCredential.getUserRole().equals(UserRole.DELIVERY_AGENT));

        return allUsers.stream().map(user -> DeliveryAgent.builder()
                .name(user.getFullName())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .build()).toList();
    }

    public String getUserRole(String username) {
        Optional<UserCredential> userCredential = userRepository.findByUsername(username);
        return userCredential.map(credential -> credential.getUserRole().toString()).orElse(null);
    }
}
