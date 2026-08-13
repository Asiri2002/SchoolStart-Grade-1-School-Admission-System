package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import schoolstart.backend.dto.EducationAdminProfileDto;
import schoolstart.backend.dto.UserResponse;
import schoolstart.backend.entity.Role;
import schoolstart.backend.entity.UserModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.UserRepository;
import schoolstart.backend.util.MappingUtils;

@Service
@RequiredArgsConstructor
public class EducationAdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Get logged-in Education Admin profile
    public UserResponse getProfile(String username) {

        UserModel user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.EDUCATION_ADMIN) {
            throw new BadRequestException(
                    "Only Education Admin can view this profile");
        }

        return MappingUtils.mapToUserDto(user);
    }

    // Update logged-in Education Admin profile
    public UserResponse updateProfile(
            String username,
            EducationAdminProfileDto dto) {

        UserModel user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.EDUCATION_ADMIN) {
            throw new BadRequestException(
                    "Only Education Admin can update this profile");
        }

        // Check username uniqueness
        if (!user.getUsername().equals(dto.getUsername())
                && userRepository.existsByUsername(dto.getUsername())) {

            throw new BadRequestException(
                    "Username already exists");
        }

        // Check email uniqueness
        if (!user.getEmail().equals(dto.getEmail())
                && userRepository.existsByEmail(dto.getEmail())) {

            throw new BadRequestException(
                    "Email already exists");
        }

        // Update profile
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        // Update password
        if (dto.getPassword() != null
                && !dto.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(dto.getPassword())
            );
        }

        UserModel updatedUser = userRepository.save(user);

        return MappingUtils.mapToUserDto(updatedUser);
    }
}