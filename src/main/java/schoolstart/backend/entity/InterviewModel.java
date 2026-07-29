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

    private String applicationId;

    // Interview Date
    private LocalDate interviewDate;

    // Interview Time
    private LocalTime interviewTime;

    private String venue;

    @Builder.Default
    private String status = "SCHEDULED"; // SCHEDULED, COMPLETED, ABSENT, CANCELLED

    private String comments;

    private Integer score;
}