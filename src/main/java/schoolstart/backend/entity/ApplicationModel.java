package schoolstart.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "applications")
public class ApplicationModel {
    @Id
    private String id;

    private String childId;

    private String schoolId;

    private String parentId;

    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Builder.Default
    private LocalDateTime submissionDate = LocalDateTime.now();

    @Builder.Default
    private List<String> documentIds = new ArrayList<>();

    private String interviewId;

    private String admissionId;
}
