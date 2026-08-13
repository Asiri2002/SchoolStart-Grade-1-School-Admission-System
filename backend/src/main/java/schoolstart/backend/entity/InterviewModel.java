package schoolstart.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "interviews")
public class InterviewModel {

    @Id
    private String id;

    // Application reference
    private String applicationId;

    // Parent who receives notifications
    private String parentId;

    // School that conducts the interview
    private String schoolId;

    // Interview date
    private LocalDate interviewDate;

    // Interview time
    private LocalTime interviewTime;

    // Interview location
    private String venue;

    @Builder.Default
    private String status = "SCHEDULED";
    // SCHEDULED, COMPLETED, ABSENT, CANCELLED

    private String comments;

    // Interview marks
    private Integer score;
}