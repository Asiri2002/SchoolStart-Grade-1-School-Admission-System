package schoolstart.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "children")
public class ChildModel {
    @Id
    private String id;

    private String parentId;

    private String firstName;

    private String lastName;

    private LocalDate dateOfBirth;

    private String gender;

    private String birthCertificateNumber;

    @Builder.Default
    private List<String> applicationIds = new ArrayList<>();
}
