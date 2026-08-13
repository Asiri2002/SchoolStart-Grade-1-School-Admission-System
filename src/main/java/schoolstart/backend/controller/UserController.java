package schoolstart.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import schoolstart.backend.dto.RegisterRequest;
import schoolstart.backend.dto.UserResponse;
import schoolstart.backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Get All Users
    @GetMapping
    @PreAuthorize("hasRole('EDUCATION_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get User By ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EDUCATION_ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Update User
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EDUCATION_ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String id,
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // Delete User
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EDUCATION_ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {

        userService.deleteUser(id);

        return ResponseEntity.ok("User deleted successfully.");
    }
}