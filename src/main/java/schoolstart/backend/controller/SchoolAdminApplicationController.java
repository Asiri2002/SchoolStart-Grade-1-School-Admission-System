package schoolstart.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import schoolstart.backend.dto.ApplicationResponse;
import schoolstart.backend.entity.ApplicationStatus;
import schoolstart.backend.security.UserPrincipal;
import schoolstart.backend.service.SchoolAdminApplicationService;

@RestController
@RequestMapping("/api/school-admin/applications")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SCHOOL_ADMIN')")
public class SchoolAdminApplicationController {

    private final SchoolAdminApplicationService applicationService;

    @GetMapping
    public ResponseEntity<Page<ApplicationResponse>> getApplications(
            @AuthenticationPrincipal UserPrincipal userPrincipal,

            @RequestParam(required = false)
            ApplicationStatus status,

            @RequestParam(required = false) String search,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {

        return ResponseEntity.ok(
                applicationService.getApplications(
                        userPrincipal.getId(),
                        status,
                        search,
                        page,
                        size
                )
        );
    }




}