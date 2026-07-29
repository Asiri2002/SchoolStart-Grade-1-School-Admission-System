package schoolstart.backend.service;

import schoolstart.backend.dto.AuthResponse;
import schoolstart.backend.dto.LoginRequest;
import schoolstart.backend.dto.RegisterRequest;
import schoolstart.backend.entity.ParentModel;
import schoolstart.backend.entity.Role;
import schoolstart.backend.entity.SchoolAdminModel;
import schoolstart.backend.entity.UserModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.repository.ParentRepository;
import schoolstart.backend.repository.SchoolAdminRepository;
import schoolstart.backend.repository.UserRepository;
import schoolstart.backend.security.JwtTokenProvider;
import schoolstart.backend.security.UserPrincipal;
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
    private UserRepository userRepository;

    @Autowired
    private ParentRepository parentRepository;

    @Autowired
    private SchoolAdminRepository schoolAdminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public void registerUser(RegisterRequest registerRequest) {

        if (registerRequest.getRole() == null) {
            throw new BadRequestException("Role is required.");

        }

        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email Address already in use!");

        }



        // Validate School ID for School Admin registration
        if (registerRequest.getRole() == Role.ROLE_SCHOOL_ADMIN &&
                (registerRequest.getSchoolId() == null ||
                        registerRequest.getSchoolId().isBlank())) {

            throw new BadRequestException("School ID is required.");
        }

        // Creating user's account
        UserModel user = UserModel.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .enabled(true)
                .build();

        UserModel savedUser = userRepository.save(user);

        // If the registered user is a parent, create a blank Parent profile for them
        if (registerRequest.getRole() == Role.PARENT) {
            ParentModel parent = ParentModel.builder()
                    .userId(savedUser.getId())
                    .firstName("")
                    .lastName("")
                    .phone("")
                    .address("")
                    .build();
            parentRepository.save(parent);
        }

        if (registerRequest.getRole() == Role.ROLE_SCHOOL_ADMIN) {
            SchoolAdminModel schoolAdmin = SchoolAdminModel.builder()
                    .userId(savedUser.getId())
                    .schoolId(registerRequest.getSchoolId())
                    .firstName("")
                    .lastName("")
                    .phone("")
                    .build();
            schoolAdminRepository.save(schoolAdmin);
        }
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
