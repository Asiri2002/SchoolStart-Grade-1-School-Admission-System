package schoolstart.backend.service;

import schoolstart.backend.dto.InterviewDto;
import schoolstart.backend.entity.ApplicationModel;
import schoolstart.backend.entity.ApplicationStatus;
import schoolstart.backend.entity.InterviewModel;
import schoolstart.backend.entity.ParentModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.ApplicationRepository;
import schoolstart.backend.repository.InterviewRepository;
import schoolstart.backend.repository.ParentRepository;
import schoolstart.backend.util.MappingUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ParentRepository parentRepository;

    public InterviewDto scheduleInterview(InterviewDto dto) {

        ApplicationModel application = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with ID: " + dto.getApplicationId()));

        if (application.getStatus() == ApplicationStatus.APPROVED
                || application.getStatus() == ApplicationStatus.REJECTED) {

            throw new BadRequestException(
                    "Cannot schedule an interview for an approved or rejected application.");
        }

        InterviewModel interview = MappingUtils.mapToInterviewEntity(dto);

        interview.setId(null);
        interview.setStatus("SCHEDULED");

        InterviewModel savedInterview = interviewRepository.save(interview);

        application.setInterviewId(savedInterview.getId());
        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);

        applicationRepository.save(application);

        return MappingUtils.mapToInterviewDto(savedInterview);
    }

    public List<InterviewDto> getInterviews(String userId, String role) {

        System.out.println("========================================");
        System.out.println("User ID : " + userId);
        System.out.println("Role    : " + role);

        List<InterviewModel> interviews;

        if ("ROLE_PARENT".equals(role)) {

            ParentModel parent = parentRepository.findByUserId(userId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Parent profile not found."));

            List<String> applicationIds = applicationRepository
                    .findByParentId(parent.getId())
                    .stream()
                    .map(ApplicationModel::getId)
                    .collect(Collectors.toList());

            interviews = interviewRepository.findByApplicationIdIn(applicationIds);

        } else if ("ROLE_SCHOOL_ADMIN".equals(role)
                || "ROLE_EDUCATION_ADMIN".equals(role)) {

            interviews = interviewRepository.findAll();

        } else {

            throw new BadRequestException("Invalid user role.");
        }

        System.out.println("Interview Count : " + interviews.size());

        for (InterviewModel interview : interviews) {
            System.out.println(interview);
        }

        System.out.println("========================================");

        return interviews.stream()
                .map(MappingUtils::mapToInterviewDto)
                .collect(Collectors.toList());
    }
}