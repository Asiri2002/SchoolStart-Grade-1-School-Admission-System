package schoolstart.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "admissions")
public class AdmissionModel {

    @Id
    private String id;

    // Application Details
    private String applicationId;
    private String admissionNumber;

    // Student Details
    private String studentName;

    // School Details
    private String schoolName;

    @Builder.Default
    private LocalDateTime admissionDate = LocalDateTime.now();

    @Builder.Default
    private String status = "OFFERED"; // OFFERED, ACCEPTED, REJECTED, CANCELLED

    @Builder.Default
    private String feeStatus = "PENDING"; // PENDING, PAID, WAIVED
}