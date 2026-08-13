package schoolstart.backend.dto;

import schoolstart.backend.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {

    private String id;

    // Relationship references
    private String childId;
    private String schoolId;
    private String parentId;

    // Child Information
    private String childFullName;
    private String birthDate;
    private String gender;

    // Parent Information
    private String parentFullName;
    private String relationship;
    private String nicNumber;
    private String contactNumber;

    // Display names
    private String childName;
    private String schoolName;
    private String parentName;

    // NEW: School image
    private String schoolImage;

    // Application management
    private ApplicationStatus status;

    private LocalDateTime submissionDate;

    // NEW: Status timeline
    private List<StatusTimelineDto> timeline;

    // Documents
    private List<String> documentIds;

    // Interview and admission process
    private String interviewId;

    private String admissionId;
}