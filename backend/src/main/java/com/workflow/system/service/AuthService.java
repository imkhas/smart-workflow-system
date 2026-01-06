package com.workflow.system.service;

import com.workflow.system.dto.request.LoginRequest;
import com.workflow.system.dto.request.RegisterRequest;
import com.workflow.system.dto.response.AuthResponse;
import com.workflow.system.dto.response.MessageResponse;
import com.workflow.system.entity.User;
import com.workflow.system.entity.enums.Role;
import com.workflow.system.repository.UserRepository;
import com.workflow.system.security.JwtTokenProvider;
import com.workflow.system.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtTokenProvider jwtUtils;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(item -> item.getAuthority().replace("ROLE_", ""))
                .orElse("STAFF");

        return new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFullName(),
                role,
                userDetails.getDepartment());
    }

    @Transactional
    public MessageResponse registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(encoder.encode(signUpRequest.getPassword()));
        user.setFullName(signUpRequest.getFullName());
        user.setDepartment(signUpRequest.getDepartment());
        user.setPhone(signUpRequest.getPhone());
        user.setActive(true);

        // Assign role
        String strRole = signUpRequest.getRole();
        Role role = Role.STAFF;

        if (strRole != null) {
            try {
                role = Role.valueOf(strRole.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Default to STAFF if invalid role provided (or handle error)
            }
        }

        user.setRole(role);
        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }
}
