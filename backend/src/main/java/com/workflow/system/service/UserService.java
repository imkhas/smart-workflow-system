package com.workflow.system.service;

import com.workflow.system.dto.response.UserResponse;
import com.workflow.system.entity.User;
import com.workflow.system.exception.ResourceNotFoundException;
import com.workflow.system.repository.UserRepository;
import com.workflow.system.security.UserDetailsImpl;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workflow.system.entity.enums.Role;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    FileStorageService fileStorageService;

    @Autowired
    PasswordEncoder passwordEncoder;

    public UserResponse getCurrentUserProfile() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.fromEntity(user);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserResponse.fromEntity(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUserProfile(Long userId, String fullName, String phone, String department,
            MultipartFile profilePicture, String address, String facebook, String twitter, String googlePlus,
            String tags) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Only update allowed fields
        if (fullName != null)
            user.setFullName(fullName);
        if (phone != null)
            user.setPhone(phone);
        if (department != null)
            user.setDepartment(department);
        if (profilePicture != null && !profilePicture.isEmpty()) {
            String fileName = fileStorageService.storeImage(profilePicture);
            user.setProfilePicture("/api/uploads/" + fileName);
        }
        if (address != null)
            user.setAddress(address);
        if (facebook != null)
            user.setFacebook(facebook);
        if (twitter != null)
            user.setTwitter(twitter);
        if (googlePlus != null)
            user.setGooglePlus(googlePlus);
        if (tags != null)
            user.setTags(tags);

        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setActive(active);
        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(Long userId, String email, String fullName, String department, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (email != null)
            user.setEmail(email);
        if (fullName != null)
            user.setFullName(fullName);
        if (department != null)
            user.setDepartment(department);
        if (role != null) {
            try {
                user.setRole(Role.valueOf(role.toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Ignore invalid role
            }
        }

        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
