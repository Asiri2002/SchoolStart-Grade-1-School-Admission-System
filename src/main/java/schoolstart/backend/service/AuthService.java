package schoolstart.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import schoolstart.backend.dto.LoginRequest;
import schoolstart.backend.dto.RegisterRequest;
import schoolstart.backend.entity.UserModel;
import schoolstart.backend.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register User
    public String registerUser(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            return "Username already exists!";
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }

        UserModel user = UserModel.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();

        userRepository.save(user);

        return "User registered successfully!";
    }

    // Login User
    public String loginUser(LoginRequest request) {

        UserModel user = userRepository
                .findByUsername(request.getUsernameOrEmail())
                .orElseGet(() ->
                        userRepository.findByEmail(request.getUsernameOrEmail())
                                .orElse(null));

        if (user == null) {
            return "User not found!";
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return "Invalid password!";
        }

        return "Login successful!";
    }
}
