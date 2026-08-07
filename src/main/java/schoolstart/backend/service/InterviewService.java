package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import schoolstart.backend.dto.InterviewDto;
import schoolstart.backend.entity.*;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.*;
import schoolstart.backend.util.MappingUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final ParentRepository parentRepository;
    private final SchoolAdminRepository schoolAdminRepository;


    // Create Interview
    public InterviewDto createInterview(
            String userId,
            InterviewDto dto) {


        SchoolAdminModel schoolAdmin =
                schoolAdminRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "School Admin not found."
                                ));

        ApplicationModel application =
                applicationRepository.findById(dto.getApplicationId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found with ID: "
                                                + dto.getApplicationId()
                                ));


        // Check application belongs to this school
        if (!application.getSchoolId()
                .equals(schoolAdmin.getSchoolId())) {

            throw new BadRequestException(
                    "You cannot schedule an interview for another school."
            );
        }


        // Prevent duplicate interview for same school and application
        if (interviewRepository
                .findByApplicationIdAndSchoolId(
                        dto.getApplicationId(),
                        schoolAdmin.getSchoolId()
                )
                .isPresent()) {

            throw new BadRequestException(
                    "This school already scheduled an interview."
            );
        }


        if (application.getStatus() == ApplicationStatus.APPROVED
                || application.getStatus() == ApplicationStatus.REJECTED) {

            throw new BadRequestException(
                    "Cannot schedule interview for completed application."
            );
        }


        InterviewModel interview =
                MappingUtils.mapToInterviewEntity(dto);


        interview.setId(null);

        interview.setSchoolId(
                schoolAdmin.getSchoolId()
        );

        interview.setStatus(
                "SCHEDULED"
        );


        InterviewModel savedInterview =
                interviewRepository.save(interview);


        application.setStatus(
                ApplicationStatus.INTERVIEW_SCHEDULED
        );

        applicationRepository.save(application);


        return MappingUtils.mapToInterviewDto(savedInterview);
    }



    // Get Interviews
    public List<InterviewDto> getInterviews(
            String userId,
            String role) {


        List<InterviewModel> interviews;


        if ("PARENT".equals(role)) {


            ParentModel parent =
                    parentRepository.findByUserId(userId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Parent profile not found."
                                    ));


            List<String> applicationIds =
                    applicationRepository
                            .findByParentId(parent.getId())
                            .stream()
                            .map(ApplicationModel::getId)
                            .collect(Collectors.toList());


            interviews =
                    interviewRepository
                            .findByApplicationIdIn(applicationIds);


        } else if ("SCHOOL_ADMIN".equals(role)) {


            SchoolAdminModel schoolAdmin =
                    schoolAdminRepository.findByUserId(userId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "School Admin not found."
                                    ));


            interviews =
                    interviewRepository
                            .findBySchoolId(
                                    schoolAdmin.getSchoolId()
                            );


        } else if ("EDUCATION_ADMIN".equals(role)) {


            interviews =
                    interviewRepository.findAll();


        } else {

            throw new BadRequestException(
                    "Invalid user role."
            );
        }


        return interviews.stream()
                .map(MappingUtils::mapToInterviewDto)
                .collect(Collectors.toList());
    }



    // Get Interview By ID
    public InterviewDto getInterviewById(String id) {


        InterviewModel interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interview not found with ID: "
                                                + id
                                ));


        return MappingUtils.mapToInterviewDto(interview);
    }



    public InterviewDto updateInterview(
            String userId,
            String id,
            InterviewDto dto) {


        SchoolAdminModel schoolAdmin =
                schoolAdminRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "School Admin not found."
                                ));


        InterviewModel interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interview not found."
                                ));


        if (!interview.getSchoolId()
                .equals(schoolAdmin.getSchoolId())) {


            throw new BadRequestException(
                    "You cannot update this interview."
            );
        }


        interview.setInterviewDate(
                dto.getInterviewDate()
        );

        interview.setInterviewTime(
                dto.getInterviewTime()
        );

        interview.setVenue(
                dto.getVenue()
        );


        if (dto.getStatus() != null) {

            interview.setStatus(
                    dto.getStatus()
            );
        }


        interview.setComments(
                dto.getComments()
        );


        interview.setScore(
                dto.getScore()
        );


        InterviewModel updatedInterview =
                interviewRepository.save(interview);


        return MappingUtils.mapToInterviewDto(updatedInterview);
    }

    public void deleteInterview(
            String userId,
            String id) {


        SchoolAdminModel schoolAdmin =
                schoolAdminRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "School Admin not found."
                                ));


        InterviewModel interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interview not found."
                                ));



        if (!interview.getSchoolId()
                .equals(schoolAdmin.getSchoolId())) {


            throw new BadRequestException(
                    "You cannot delete this interview."
            );
        }



        ApplicationModel application =
                applicationRepository.findById(
                                interview.getApplicationId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found."
                                ));



        if (application.getStatus()
                == ApplicationStatus.INTERVIEW_SCHEDULED) {


            application.setStatus(
                    ApplicationStatus.UNDER_REVIEW
            );


            applicationRepository.save(application);
        }



        interviewRepository.delete(interview);
    }
}