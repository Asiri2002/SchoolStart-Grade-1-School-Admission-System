package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import schoolstart.backend.dto.DashboardStatsDto;
import schoolstart.backend.dto.SchoolAdminDashboardStatsDto;
import schoolstart.backend.entity.ApplicationStatus;
import schoolstart.backend.entity.SchoolAdminModel;
import schoolstart.backend.repository.ApplicationRepository;
import schoolstart.backend.repository.SchoolAdminRepository;

@Service
@RequiredArgsConstructor
public class SchoolAdminDashboardService {

    private final ApplicationRepository applicationRepository;
    private final SchoolAdminRepository schoolAdminRepository;

    public SchoolAdminDashboardStatsDto getDashboardStats(String userId) {

        SchoolAdminModel schoolAdmin = schoolAdminRepository
                .findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("School Admin not found"));

        String schoolId = schoolAdmin.getSchoolId();

        return SchoolAdminDashboardStatsDto.builder()
                .totalApplications(
                        applicationRepository.countBySchoolId(schoolId)
                )
                .pendingApplications(
                        applicationRepository.countBySchoolIdAndStatus(
                                schoolId,
                                ApplicationStatus.SUBMITTED
                        )
                )
                .approvedApplications(
                        applicationRepository.countBySchoolIdAndStatus(
                                schoolId,
                                ApplicationStatus.APPROVED
                        )
                )
                .rejectedApplications(
                        applicationRepository.countBySchoolIdAndStatus(
                                schoolId,
                                ApplicationStatus.REJECTED
                        )
                )
                .interviewScheduled(
                        applicationRepository.countBySchoolIdAndStatus(
                                schoolId,
                                ApplicationStatus.INTERVIEW_SCHEDULED
                        )
                )
                .build();
    }
}