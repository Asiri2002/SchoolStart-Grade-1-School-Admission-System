package schoolstart.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import schoolstart.backend.dto.AuthResponse;
import schoolstart.backend.dto.LoginRequest;
import schoolstart.backend.dto.RegisterRequest;
import schoolstart.backend.entity.ParentModel;
import schoolstart.backend.entity.Role;
import schoolstart.backend.entity.UserModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.repository.ParentRepository;
import schoolstart.backend.repository.UserRepository;
import schoolstart.backend.security.JwtTokenProvider;
import schoolstart.backend.security.UserPrincipal;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ParentRepository parentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public void registerUser(RegisterRequest registerRequest) {

        // Check username
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        // Check email
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email Address already in use!");
        }

        // Create Parent user
        UserModel user = UserModel.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.PARENT)      // Always PARENT
                .enabled(true)
                .build();

        UserModel savedUser = userRepository.save(user);

        // Create Parent Profile
        ParentModel parent = ParentModel.builder()
                .userId(savedUser.getId())
                .firstName("")
                .lastName("")
                .phone("")
                .address("")
                .build();

        parentRepository.save(parent);
    }

    public AuthResponse authenticateUser(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        return AuthResponse.builder()
                .accessToken(jwt)
                .username(userPrincipal.getUsername())
                .email(userPrincipal.getEmail())
                .role(userPrincipal.getAuthorities().iterator().next().getAuthority())
                .userId(userPrincipal.getId())
                .build();
    }
}