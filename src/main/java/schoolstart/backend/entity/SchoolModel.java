package schoolstart.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "schools")
public class SchoolModel {

    @Id
    private String id;

    // School Name
    @Indexed(unique = true)
    private String name;

    // School Code
    @Indexed(unique = true)
    private String code;

    // District (e.g., Colombo, Galle, Kandy)
    private String district;

    // School Type (National, Provincial, Private)
    private String type;

    // Address
    private String address;

    // Contact Details
    @Indexed(unique = true)
    private String email;

    private String phone;

    // Principal
    private String principalName;

    // Student Capacity
    private int capacity;

    // Available Seats
    private int availableSeats;

    // School Image
    private String imageUrl;

    // Description
    private String description;

    // Active / Inactive Status
    private boolean active;

    // Created Date
    private LocalDate createdDate;
}