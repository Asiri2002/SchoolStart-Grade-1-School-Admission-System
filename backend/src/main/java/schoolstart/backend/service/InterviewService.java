package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import schoolstart.backend.dto.InterviewDto;
import schoolstart.backend.entity.ApplicationModel;
import schoolstart.backend.entity.ApplicationStatus;
import schoolstart.backend.entity.InterviewModel;
import schoolstart.backend.entity.ParentModel;
import schoolstart.backend.entity.SchoolAdminModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.ApplicationRepository;
import schoolstart.backend.repository.InterviewRepository;
import schoolstart.backend.repository.ParentRepository;
import schoolstart.backend.repository.SchoolAdminRepository;
import schoolstart.backend.util.MappingUtils;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final ParentRepository parentRepository;
    private final SchoolAdminRepository schoolAdminRepository;

    // Notification service
    private final NotificationService notificationService;


    // =========================================================
    // CREATE INTERVIEW
    // =========================================================
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


        // Check application status
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


        // Save interview
        InterviewModel savedInterview =
                interviewRepository.save(interview);


        // Update application status
        application.setStatus(
                ApplicationStatus.INTERVIEW_SCHEDULED
        );

        applicationRepository.save(application);


        // =====================================================
        // NOTIFICATION - CREATE
        // =====================================================

        ParentModel parent =
                parentRepository.findById(
                                application.getParentId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Parent not found."
                                ));


        String date =
                savedInterview.getInterviewDate()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "dd MMM yyyy"
                                )
                        );

        String time =
                savedInterview.getInterviewTime()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "h:mm a"
                                )
                        );


        String message =
                "Your interview has been scheduled on "
                        + date
                        + " at "
                        + time
                        + ".";


        notificationService.createNotification(
                parent.getUserId(),
                message,
                "INTERVIEW"
        );


        return MappingUtils.mapToInterviewDto(
                savedInterview
        );
    }


    // =========================================================
    // GET INTERVIEWS
    // =========================================================
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
                            .findByApplicationIdIn(
                                    applicationIds
                            );


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


    // =========================================================
    // GET INTERVIEW BY ID
    // =========================================================
    public InterviewDto getInterviewById(
            String id) {

        InterviewModel interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interview not found with ID: "
                                                + id
                                ));


        return MappingUtils.mapToInterviewDto(
                interview
        );
    }


    // =========================================================
    // UPDATE INTERVIEW
    // =========================================================
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


        // Find application
        ApplicationModel application =
                applicationRepository.findById(
                                interview.getApplicationId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found."
                                ));


        // Update interview date
        interview.setInterviewDate(
                dto.getInterviewDate()
        );


        // Update interview time
        interview.setInterviewTime(
                dto.getInterviewTime()
        );


        // Update venue
        interview.setVenue(
                dto.getVenue()
        );


        // Update status
        if (dto.getStatus() != null) {

            interview.setStatus(
                    dto.getStatus()
            );
        }


        // Update comments
        interview.setComments(
                dto.getComments()
        );


        // Update score
        interview.setScore(
                dto.getScore()
        );


        // Save updated interview
        InterviewModel updatedInterview =
                interviewRepository.save(interview);


        // =====================================================
        // NOTIFICATION - UPDATE
        // =====================================================

        ParentModel parent =
                parentRepository.findById(
                                application.getParentId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Parent not found."
                                ));


        String date =
                updatedInterview.getInterviewDate()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "dd MMM yyyy"
                                )
                        );

        String time =
                updatedInterview.getInterviewTime()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "h:mm a"
                                )
                        );

        String venue =
                updatedInterview.getVenue();


        String message =
                "Your interview schedule has been updated.\n"
                        + "New Date: " + date + "\n"
                        + "Time: " + time + "\n"
                        + "Venue: " + venue;


        notificationService.createNotification(
                parent.getUserId(),
                message,
                "INTERVIEW"
        );


        return MappingUtils.mapToInterviewDto(
                updatedInterview
        );
    }


    // =========================================================
    // DELETE INTERVIEW
    // =========================================================
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


        // Find application before deleting interview
        ApplicationModel application =
                applicationRepository.findById(
                                interview.getApplicationId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found."
                                ));


        // =====================================================
        // NOTIFICATION DATA
        // Get parent before deleting interview
        // =====================================================

        ParentModel parent =
                parentRepository.findById(
                                application.getParentId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Parent not found."
                                ));


        // Save date before deleting
        String date =
                interview.getInterviewDate()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "dd MMM yyyy"
                                )
                        );


        // =====================================================
        // KEEP EXISTING APPLICATION STATUS FEATURE
        // =====================================================

        if (application.getStatus()
                == ApplicationStatus.INTERVIEW_SCHEDULED) {

            application.setStatus(
                    ApplicationStatus.UNDER_REVIEW
            );


            applicationRepository.save(
                    application
            );
        }


        // Delete interview
        interviewRepository.delete(
                interview
        );


        // =====================================================
        // NOTIFICATION - DELETE / CANCEL
        // =====================================================

        String message =
                "Your interview scheduled for "
                        + date
                        + " has been cancelled.\n"
                        + "Please wait for a new schedule.";


        notificationService.createNotification(
                parent.getUserId(),
                message,
                "INTERVIEW"
        );
    }
}

