package schoolstart.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "applications")
public class ApplicationModel {

    @Id
    private String id;


    // Relationship references
    private String childId;

    private String schoolId;
    private String parentId;

    // Child Information
    private String childFullName;

    private String birthDate;

    private String gender;


    // Parent Information
    private String parentFullName;

    private String relationship;

    private String nicNumber;

    private String contactNumber;



    // Application management
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;


    @Builder.Default
    private LocalDateTime submissionDate = LocalDateTime.now();



    // Uploaded documents
    @Builder.Default
    private List<String> documentIds = new ArrayList<>();



    // Interview and admission process
    private String interviewId;

    private String admissionId;

}