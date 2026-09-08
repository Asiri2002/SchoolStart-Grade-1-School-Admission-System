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
public class DocumentDto {
    private String id;
    private String applicationId;
    private String name;
    private String type;
    private String url;
    private LocalDateTime uploadDate;
    private String status;
    private String rejectionReason;
}
