package schoolstart.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "parents")
public class ParentModel {
    @Id
    private String id;

    private String userId;

    private String firstName;

    private String lastName;

    private String phone;

    private String address;

    @Builder.Default
    private List<String> childIds = new ArrayList<>();
}

