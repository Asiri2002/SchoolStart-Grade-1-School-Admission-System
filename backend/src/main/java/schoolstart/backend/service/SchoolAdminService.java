package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import schoolstart.backend.dto.SchoolAdminRequest;
import schoolstart.backend.dto.SchoolAdminResponse;
import schoolstart.backend.entity.Role;
import schoolstart.backend.entity.SchoolAdminModel;
import schoolstart.backend.entity.UserModel;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.SchoolAdminRepository;
import schoolstart.backend.repository.UserRepository;
import schoolstart.backend.util.MappingUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchoolAdminService {

    private final SchoolAdminRepository schoolAdminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SchoolAdminResponse create(SchoolAdminRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        UserModel user = UserModel.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.SCHOOL_ADMIN)
                .enabled(true)
                .build();

        UserModel savedUser = userRepository.save(user);

        SchoolAdminModel admin = SchoolAdminModel.builder()
                .userId(savedUser.getId())
                .schoolId(request.getSchoolId())
                .schoolName(request.getSchoolName())
                .Name(request.getName())
                .phone(request.getPhone())
                .build();

        SchoolAdminModel savedAdmin = schoolAdminRepository.save(admin);

        return MappingUtils.mapToSchoolAdminResponse(savedAdmin);
    }

    public SchoolAdminResponse update(String id, SchoolAdminRequest request) {

        SchoolAdminModel admin = schoolAdminRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School Admin not found"));

        UserModel user = userRepository.findById(admin.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }

        if (!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);

        admin.setSchoolId(request.getSchoolId());
        admin.setSchoolName(request.getSchoolName());
        admin.setName(request.getName());
        admin.setPhone(request.getPhone());

        SchoolAdminModel updatedAdmin = schoolAdminRepository.save(admin);

        return MappingUtils.mapToSchoolAdminResponse(updatedAdmin);
    }

    public void delete(String id) {

        SchoolAdminModel admin = schoolAdminRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School Admin not found"));

        userRepository.deleteById(admin.getUserId());

        schoolAdminRepository.delete(admin);
    }

    public SchoolAdminResponse getById(String id) {

        SchoolAdminModel admin = schoolAdminRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School Admin not found"));

        return MappingUtils.mapToSchoolAdminResponse(admin);
    }

    public List<SchoolAdminResponse> getAll() {

        return schoolAdminRepository.findAll()
                .stream()
                .map(MappingUtils::mapToSchoolAdminResponse)
                .collect(Collectors.toList());
    }
}