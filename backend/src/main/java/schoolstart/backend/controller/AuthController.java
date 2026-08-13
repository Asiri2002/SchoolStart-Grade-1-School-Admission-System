package schoolstart.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import schoolstart.backend.dto.AuthResponse;
import schoolstart.backend.dto.LoginRequest;
import schoolstart.backend.dto.RegisterRequest;
import schoolstart.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // Parent Registration
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @Valid @RequestBody RegisterRequest registerRequest) {

        authService.registerUser(registerRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Parent registered successfully!");
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(
            @Valid @RequestBody LoginRequest loginRequest) {

        AuthResponse response = authService.authenticateUser(loginRequest);

        return ResponseEntity.ok(response);
    }
}