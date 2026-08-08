package schoolstart.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import schoolstart.backend.dto.EducationAdminProfileDto;
import schoolstart.backend.dto.UserResponse;
import schoolstart.backend.service.EducationAdminService;

@RestController
@RequestMapping("/api/education-admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EducationAdminController {

    private final EducationAdminService educationAdminService;

    // Get logged-in Education Admin profile
    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('EDUCATION_ADMIN')")
    public ResponseEntity<UserResponse> getProfile(
            Authentication authentication) {

        String username = authentication.getName();

        UserResponse response =
                educationAdminService.getProfile(username);

        return ResponseEntity.ok(response);
    }

    // Update logged-in Education Admin profile
    @PutMapping("/profile")
    @PreAuthorize("hasAuthority('EDUCATION_ADMIN')")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody EducationAdminProfileDto dto,
            Authentication authentication) {

        String username = authentication.getName();

        UserResponse response =
                educationAdminService.updateProfile(username, dto);

        return ResponseEntity.ok(response);
    }
}