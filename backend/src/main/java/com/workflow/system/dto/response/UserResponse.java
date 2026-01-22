package com.workflow.system.dto.response;

import com.workflow.system.entity.User;
import com.workflow.system.entity.enums.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String department;
    private String phone;
    private Role role;
    private Boolean active;
    private String profilePicture;
    private String address;
    private String facebook;
    private String twitter;
    private String googlePlus;
    private String tags;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setDepartment(user.getDepartment());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setActive(user.getActive());
        response.setProfilePicture(user.getProfilePicture());
        response.setAddress(user.getAddress());
        response.setFacebook(user.getFacebook());
        response.setTwitter(user.getTwitter());
        response.setGooglePlus(user.getGooglePlus());
        response.setTags(user.getTags());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
