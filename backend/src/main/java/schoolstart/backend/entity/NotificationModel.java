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
@Document(collection = "notifications")
public class NotificationModel {
    @Id
    private String id;

    private String userId;

    private String message;

    private String type; // INFO, APPLICATION, INTERVIEW, ADMISSION

    @Builder.Default
    private boolean read = false;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}

