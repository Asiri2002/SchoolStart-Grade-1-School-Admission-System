package schoolstart.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import schoolstart.backend.dto.AdmissionDto;
import schoolstart.backend.security.UserPrincipal;
import schoolstart.backend.service.AdmissionService;

@RestController
@RequestMapping("/api/school-admin/admissions")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SCHOOL_ADMIN')")
@CrossOrigin(origins = "*")
public class SchoolAdminAdmissionController {

    private final AdmissionService admissionService;


    // =========================================================
    // CREATE ADMISSION
    // =========================================================
    @PostMapping("/{applicationId}")
    public ResponseEntity<AdmissionDto> createAdmission(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String applicationId
    ) {

        AdmissionDto admission =
                admissionService.createAdmission(
                        userPrincipal.getId(),
                        applicationId
                );

        return new ResponseEntity<>(
                admission,
                HttpStatus.CREATED
        );
    }
}