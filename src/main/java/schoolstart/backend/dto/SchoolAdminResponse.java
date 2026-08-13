package schoolstart.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SchoolAdminResponse {

    private String id;
    private String userId;
    private String schoolId;
    private String schoolName;
    private String name;
    private String phone;
}