package schoolstart.backend.util;

import schoolstart.backend.dto.*;
import schoolstart.backend.entity.*;

public class MappingUtils {

    public static UserResponse mapToUserDto(UserModel user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .build();
    }

    public static ParentProfileDto mapToParentProfileDto(ParentModel parent) {
        if (parent == null) return null;
        return ParentProfileDto.builder()
                .id(parent.getId())
                .userId(parent.getUserId())
                .firstName(parent.getFirstName())
                .lastName(parent.getLastName())
                .phone(parent.getPhone())
                .address(parent.getAddress())
                .childIds(parent.getChildIds())
                .build();
    }

    public static ChildDto mapToChildDto(ChildModel child) {
        if (child == null) return null;
        return ChildDto.builder()
                .id(child.getId())
                .parentId(child.getParentId())
                .firstName(child.getFirstName())
                .lastName(child.getLastName())
                .dateOfBirth(child.getDateOfBirth())
                .gender(child.getGender())
                .birthCertificateNumber(child.getBirthCertificateNumber())
                .applicationIds(child.getApplicationIds())
                .build();
    }

    public static ChildModel mapToChildEntity(ChildDto dto) {
        if (dto == null) return null;
        return ChildModel.builder()
                .id(dto.getId())
                .parentId(dto.getParentId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .birthCertificateNumber(dto.getBirthCertificateNumber())
                .applicationIds(dto.getApplicationIds())
                .build();
    }
    public static SchoolDto mapToSchoolDto(SchoolModel school) {
        if (school == null) return null;

        return SchoolDto.builder()
                .id(school.getId())
                .name(school.getName())
                .code(school.getCode())
                .district(school.getDistrict())
                .type(school.getType())
                .address(school.getAddress())
                .email(school.getEmail())
                .phone(school.getPhone())
                .principalName(school.getPrincipalName())
                .capacity(school.getCapacity())
                .availableSeats(school.getAvailableSeats())
                .imageUrl(school.getImageUrl())
                .description(school.getDescription())
                .active(school.isActive())
                .createdDate(school.getCreatedDate())
                .build();
    }

    public static SchoolModel mapToSchoolEntity(SchoolDto dto) {
        if (dto == null) return null;

        return SchoolModel.builder()
                .id(dto.getId())
                .name(dto.getName())
                .code(dto.getCode())
                .district(dto.getDistrict())
                .type(dto.getType())
                .address(dto.getAddress())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .principalName(dto.getPrincipalName())
                .capacity(dto.getCapacity())
                .availableSeats(dto.getAvailableSeats())
                .imageUrl(dto.getImageUrl())
                .description(dto.getDescription())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .createdDate(dto.getCreatedDate())
                .build();
    }

    public static ApplicationResponse mapToApplicationResponse(ApplicationModel application) {
        if (application == null) return null;

        return ApplicationResponse.builder()
                .id(application.getId())

                // Relationship IDs
                .childId(application.getChildId())
                .schoolId(application.getSchoolId())

                // Child information
                .childFullName(application.getChildFullName())
                .birthDate(application.getBirthDate())
                .gender(application.getGender())

                // Parent information
                .parentFullName(application.getParentFullName())
                .relationship(application.getRelationship())
                .nicNumber(application.getNicNumber())
                .contactNumber(application.getContactNumber())

                // Application details
                .status(application.getStatus())
                .submissionDate(application.getSubmissionDate())
                .documentIds(application.getDocumentIds())
                .interviewId(application.getInterviewId())
                .admissionId(application.getAdmissionId())

                .build();
    }


    public static ApplicationModel mapToApplicationEntity(ApplicationRequest request) {
        if (request == null) return null;

        return ApplicationModel.builder()
                .childId(request.getChildId())
                .schoolId(request.getSchoolId())

                // Child information
                .childFullName(request.getChildFullName())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())

                // Parent information
                .parentFullName(request.getParentFullName())
                .relationship(request.getRelationship())
                .nicNumber(request.getNicNumber())
                .contactNumber(request.getContactNumber())

                .status(ApplicationStatus.SUBMITTED)

                .build();
    }
    public static DocumentDto mapToDocumentDto(DocumentModel document) {
        if (document == null) return null;
        return DocumentDto.builder()
                .id(document.getId())
                .applicationId(document.getApplicationId())
                .name(document.getName())
                .type(document.getType())
                .url(document.getUrl())
                .uploadDate(document.getUploadDate())
                .status(document.getStatus())
                .build();
    }
    public static InterviewDto mapToInterviewDto(InterviewModel interview) {
        if (interview == null) return null;

        return InterviewDto.builder()
                .id(interview.getId())
                .applicationId(interview.getApplicationId())
                .interviewDate(interview.getInterviewDate())
                .interviewTime(interview.getInterviewTime())
                .venue(interview.getVenue())
                .status(interview.getStatus())
                .comments(interview.getComments())
                .score(interview.getScore())
                .build();
    }

    public static InterviewModel mapToInterviewEntity(InterviewDto dto) {
        if (dto == null) return null;

        return InterviewModel.builder()
                .id(dto.getId())
                .applicationId(dto.getApplicationId())
                .interviewDate(dto.getInterviewDate())
                .interviewTime(dto.getInterviewTime())
                .venue(dto.getVenue())
                .status(dto.getStatus())
                .comments(dto.getComments())
                .score(dto.getScore())
                .build();
    }
    public static AdmissionModel mapToAdmissionModel(AdmissionDto dto) {
        if (dto == null) {
            return null;
        }

        return AdmissionModel.builder()
                .id(dto.getId())
                .applicationId(dto.getApplicationId())
                .admissionNumber(dto.getAdmissionNumber())
                .studentName(dto.getStudentName())
                .schoolName(dto.getSchoolName())
                .admissionDate(dto.getAdmissionDate())
                .status(dto.getStatus())
                .feeStatus(dto.getFeeStatus())
                .build();
    }

    public static AdmissionDto mapToAdmissionDto(AdmissionModel admission) {
        if (admission == null) {
            return null;
        }

        return AdmissionDto.builder()
                .id(admission.getId())
                .applicationId(admission.getApplicationId())
                .admissionNumber(admission.getAdmissionNumber())
                .studentName(admission.getStudentName())
                .schoolName(admission.getSchoolName())
                .admissionDate(admission.getAdmissionDate())
                .status(admission.getStatus())
                .feeStatus(admission.getFeeStatus())
                .build();
    }
    public static NotificationDto mapToNotificationDto(NotificationModel notification) {
        if (notification == null) {
            return null;
        }

        return NotificationDto.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .message(notification.getMessage())
                .type(notification.getType())
                .read(notification.isRead())
                .timestamp(notification.getTimestamp())
                .build();
    }

    public static NotificationModel mapToNotificationEntity(NotificationDto dto) {
        if (dto == null) {
            return null;
        }

        return NotificationModel.builder()
                .id(dto.getId())
                .userId(dto.getUserId())
                .message(dto.getMessage())
                .type(dto.getType())
                .read(dto.isRead())
                .timestamp(dto.getTimestamp())
                .build();
    }
}

