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
@Document(collection = "documents")
public class DocumentModel {
    @Id
    private String id;

    private String applicationId;

    private String name;

    private String type;

    private String url;

    @Builder.Default
    private LocalDateTime uploadDate = LocalDateTime.now();

    @Builder.Default
    private String status = "PENDING"; // PENDING, VERIFIED, REJECTED
}

