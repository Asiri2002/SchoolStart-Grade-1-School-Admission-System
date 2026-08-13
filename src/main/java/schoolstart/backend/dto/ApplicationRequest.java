package schoolstart.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequest {

    @NotBlank(message = "Child ID is required")
    private String childId;

    @NotBlank(message = "School ID is required")
    private String schoolId;


    // Child Information
    @NotBlank(message = "Child full name is required")
    private String childFullName;

    @NotBlank(message = "Birth date is required")
    private String birthDate;

    @NotBlank(message = "Gender is required")
    private String gender;


    // Parent Information
    @NotBlank(message = "Parent full name is required")
    private String parentFullName;

    @NotBlank(message = "Relationship is required")
    private String relationship;

    @NotBlank(message = "NIC number is required")
    private String nicNumber;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;
}