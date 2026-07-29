package schoolstart.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "school_admins")
public class SchoolAdminModel {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    @Indexed
    private String schoolId;

    private String firstName;

    private String lastName;

    private String phone;
}
