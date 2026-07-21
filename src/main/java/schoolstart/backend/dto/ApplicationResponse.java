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
    private String childId;
    private String childName;
    private String schoolId;
    private String schoolName;
    private String parentId;
    private String parentName;
    private ApplicationStatus status;
    private LocalDateTime submissionDate;
    private List<String> documentIds;
    private String interviewId;
    private String admissionId;
}
