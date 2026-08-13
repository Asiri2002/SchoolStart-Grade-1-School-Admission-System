package schoolstart.backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "application_status_history")
public class ApplicationStatusHistory {

    @Id
    private String id;

    private String applicationId;

    private ApplicationStatus status;

    private LocalDateTime updatedAt;
}