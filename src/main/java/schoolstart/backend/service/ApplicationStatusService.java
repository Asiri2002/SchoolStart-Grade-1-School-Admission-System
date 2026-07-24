package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import schoolstart.backend.dto.ApplicationResponse;
import schoolstart.backend.dto.StatusTimelineDto;
import schoolstart.backend.entity.ApplicationModel;
import schoolstart.backend.entity.SchoolModel;
import schoolstart.backend.repository.ApplicationRepository;
import schoolstart.backend.repository.ApplicationStatusHistoryRepository;
import schoolstart.backend.repository.SchoolRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationStatusService {

    private final ApplicationRepository applicationRepository;
    private final SchoolRepository schoolRepository;
    private final ApplicationStatusHistoryRepository historyRepository;

    public ApplicationResponse getApplicationStatus(String applicationId) {

        System.out.println("Searching application ID : " + applicationId);

        ApplicationModel application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found with id : " + applicationId
                                )
                        );

        System.out.println("Application found : " + application.getId());

        SchoolModel school =
                schoolRepository.findById(application.getSchoolId())
                        .orElse(null);

        List<StatusTimelineDto> timeline =
                historyRepository.findByApplicationIdOrderByUpdatedAtAsc(applicationId)
                        .stream()
                        .map(history ->
                                new StatusTimelineDto(
                                        history.getStatus().name(),
                                        history.getUpdatedAt()
                                )
                        )
                        .collect(Collectors.toList());

        return ApplicationResponse.builder()
                .id(application.getId())
                .childId(application.getChildId())
                .schoolId(application.getSchoolId())
                .parentId(application.getParentId())
                .childFullName(application.getChildFullName())
                .birthDate(application.getBirthDate())
                .gender(application.getGender())
                .parentFullName(application.getParentFullName())
                .relationship(application.getRelationship())
                .nicNumber(application.getNicNumber())
                .contactNumber(application.getContactNumber())
                .schoolName(school != null ? school.getName() : null)
                .schoolImage(school != null ? school.getImageUrl() : null)
                .status(application.getStatus())
                .submissionDate(application.getSubmissionDate())
                .timeline(timeline)
                .documentIds(application.getDocumentIds())
                .interviewId(application.getInterviewId())
                .admissionId(application.getAdmissionId())
                .build();
    }
}