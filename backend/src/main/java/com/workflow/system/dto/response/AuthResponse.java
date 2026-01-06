package com.workflow.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String department;

    // Constructor without type
    public AuthResponse(String accessToken, Long id, String username, String email, String fullName, String role,
            String department) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.department = department;
    }
}
