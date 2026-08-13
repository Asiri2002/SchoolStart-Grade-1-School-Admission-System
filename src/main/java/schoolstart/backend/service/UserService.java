package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import schoolstart.backend.dto.RegisterRequest;
import schoolstart.backend.dto.UserResponse;
import schoolstart.backend.entity.UserModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Get All Users
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get User By Id
    public UserResponse getUserById(String id) {

        UserModel user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        return mapToResponse(user);
    }

    // Update User
    public UserResponse updateUser(String id, RegisterRequest request) {

        UserModel user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        // Username validation
        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists.");
        }

        // Email validation
        if (!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists.");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());


        // Update password only if provided
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        UserModel updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    // Delete User
    public void deleteUser(String id) {

        UserModel user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        userRepository.delete(user);
    }

    // Entity -> Response
    private UserResponse mapToResponse(UserModel user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .build();
    }
}