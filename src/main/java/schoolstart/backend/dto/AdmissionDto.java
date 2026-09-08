package schoolstart.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionDto {

    private String id;

    private String applicationId;

    private String admissionNumber;

    // Student Details
    private String studentName;

    // School Details
    private String schoolId;
    private String schoolName;

    private LocalDateTime admissionDate;

    private String status;

    private String feeStatus;
}