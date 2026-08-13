package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import schoolstart.backend.dto.ApplicationResponse;
import schoolstart.backend.entity.ApplicationModel;
import schoolstart.backend.entity.SchoolAdminModel;
import schoolstart.backend.repository.ApplicationRepository;
import schoolstart.backend.repository.SchoolAdminRepository;

@Service
@RequiredArgsConstructor
public class SchoolAdminApplicationService {

    private final ApplicationRepository applicationRepository;
    private final SchoolAdminRepository schoolAdminRepository;

    public Page<ApplicationResponse> getApplications(
            String userId,
            int page,
            int size
    ) {

        SchoolAdminModel schoolAdmin = schoolAdminRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("School Admin not found"));

        String schoolId = schoolAdmin.getSchoolId();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Direction.DESC,
                        "submissionDate"
                )
        );

        Page<ApplicationModel> applications =
                applicationRepository.findBySchoolId(
                        schoolId,
                        pageable
                );

        return applications.map(this::mapToResponse);
    }

    private ApplicationResponse mapToResponse(
            ApplicationModel application
    ) {

        return ApplicationResponse.builder()
                .id(application.getId())
                .childId(application.getChildId())
                .schoolId(application.getSchoolId())
                .parentId(application.getParentId())
                .status(application.getStatus())
                .submissionDate(application.getSubmissionDate())
                .documentIds(application.getDocumentIds())
                .interviewId(application.getInterviewId())
                .admissionId(application.getAdmissionId())
                .build();
    }
}