package schoolstart.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import schoolstart.backend.dto.DashboardStatsDto;
import schoolstart.backend.dto.SchoolAdminDashboardStatsDto;
import schoolstart.backend.security.UserPrincipal;
import schoolstart.backend.service.SchoolAdminDashboardService;

@RestController
@RequestMapping("/api/school-admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SCHOOL_ADMIN')")
public class SchoolAdminDashboardController {

    private final SchoolAdminDashboardService dashboardService;

    @GetMapping
    public ResponseEntity<SchoolAdminDashboardStatsDto> getDashboardStats(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        return ResponseEntity.ok(
                dashboardService.getDashboardStats(userPrincipal.getId()));
    }


}