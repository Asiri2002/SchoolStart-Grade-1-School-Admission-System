package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import schoolstart.backend.dto.ApplicationResponse;
import schoolstart.backend.entity.ApplicationModel;
import schoolstart.backend.entity.ApplicationStatus;
import schoolstart.backend.entity.SchoolAdminModel;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.ApplicationRepository;
import schoolstart.backend.repository.ChildRepository;
import schoolstart.backend.repository.ParentRepository;
import schoolstart.backend.repository.SchoolAdminRepository;
import schoolstart.backend.repository.SchoolRepository;

@Service
@RequiredArgsConstructor
public class SchoolAdminApplicationService {

    private final ApplicationRepository applicationRepository;
    private final SchoolAdminRepository schoolAdminRepository;
    private final ChildRepository childRepository;
    private final ParentRepository parentRepository;
    private final SchoolRepository schoolRepository;

    public Page<ApplicationResponse> getApplications(
            String userId,
            ApplicationStatus status,
            String search,
            int page,
            int size
    ) {

        SchoolAdminModel schoolAdmin =
                schoolAdminRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "School Admin not found"
                                ));

        String schoolId = schoolAdmin.getSchoolId();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Direction.DESC,
                        "submissionDate"
                )
        );

        Page<ApplicationModel> applications;

        // Search + Status
        if (search != null
                && !search.trim().isEmpty()
                && status != null) {

            applications =
                    applicationRepository.searchApplicationsByStatus(
                            schoolId,
                            status,
                            search.trim(),
                            pageable
                    );
        }

        // Search only
        else if (search != null
                && !search.trim().isEmpty()) {

            applications =
                    applicationRepository.searchApplications(
                            schoolId,
                            search.trim(),
                            pageable
                    );
        }

        // Status only
        else if (status != null) {

            applications =
                    applicationRepository.findBySchoolIdAndStatus(
                            schoolId,
                            status,
                            pageable
                    );
        }

        // All applications
        else {

            applications =
                    applicationRepository.findBySchoolId(
                            schoolId,
                            pageable
                    );
        }

        return applications.map(this::mapToResponse);
    }

    private ApplicationResponse mapToResponse(
            ApplicationModel application
    ) {

        ApplicationResponse.ApplicationResponseBuilder response =
                ApplicationResponse.builder()
                        .id(application.getId())
                        .childId(application.getChildId())
                        .schoolId(application.getSchoolId())
                        .parentId(application.getParentId())
                        .status(application.getStatus())
                        .submissionDate(application.getSubmissionDate())
                        .documentIds(application.getDocumentIds())
                        .interviewId(application.getInterviewId())
                        .admissionId(application.getAdmissionId());

        // Child details
        if (application.getChildId() != null) {

            childRepository.findById(application.getChildId())
                    .ifPresent(child -> {

                        String fullName =
                                ((child.getFirstName() != null)
                                        ? child.getFirstName() : "")
                                        + " "
                                        + ((child.getLastName() != null)
                                        ? child.getLastName() : "");

                        response.childName(fullName.trim());
                        response.childFullName(fullName.trim());

                        if (child.getDateOfBirth() != null) {
                            response.birthDate(
                                    child.getDateOfBirth().toString()
                            );
                        }

                        response.gender(child.getGender());
                    });
        }

        // Parent details
        if (application.getParentId() != null) {

            parentRepository.findById(application.getParentId())
                    .ifPresent(parent -> {

                        String fullName =
                                ((parent.getFirstName() != null)
                                        ? parent.getFirstName() : "")
                                        + " "
                                        + ((parent.getLastName() != null)
                                        ? parent.getLastName() : "");

                        response.parentName(fullName.trim());
                        response.parentFullName(fullName.trim());

                        response.contactNumber(parent.getPhone());
                    });
        }

        // School details
        if (application.getSchoolId() != null) {

            schoolRepository.findById(application.getSchoolId())
                    .ifPresent(school -> {

                        response.schoolName(school.getName());
                        response.schoolImage(school.getImageUrl());
                    });
        }

        return response.build();
    }
}