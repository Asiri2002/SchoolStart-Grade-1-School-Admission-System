package schoolstart.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import schoolstart.backend.dto.SchoolDto;
import schoolstart.backend.service.SchoolService;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
@CrossOrigin(origins = "*")
public class SchoolController {

    @Autowired
    private SchoolService schoolService;


    // Get all schools
    // Parent + School Admin + Education Admin
    @GetMapping
    @PreAuthorize("hasAnyRole('PARENT','SCHOOL_ADMIN','EDUCATION_ADMIN')")
    public ResponseEntity<List<SchoolDto>> getAllSchools() {
        return ResponseEntity.ok(
                schoolService.getAllSchools()
        );
    }


    // Get school by ID
    // Parent + School Admin + Education Admin
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PARENT','SCHOOL_ADMIN','EDUCATION_ADMIN')")
    public ResponseEntity<SchoolDto> getSchoolById(
            @PathVariable String id
    ) {
        return ResponseEntity.ok(
                schoolService.getSchoolById(id)
        );
    }


    // Search schools
    // Parent + School Admin + Education Admin
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('PARENT','SCHOOL_ADMIN','EDUCATION_ADMIN')")
    public ResponseEntity<List<SchoolDto>> searchSchools(
            @RequestParam String query
    ) {
        return ResponseEntity.ok(
                schoolService.searchSchools(query)
        );
    }


    // Filter by district
    @GetMapping("/district/{district}")
    @PreAuthorize("hasAnyRole('PARENT','SCHOOL_ADMIN','EDUCATION_ADMIN')")
    public ResponseEntity<List<SchoolDto>> getSchoolsByDistrict(
            @PathVariable String district
    ) {
        return ResponseEntity.ok(
                schoolService.getSchoolsByDistrict(district)
        );
    }


    // Filter by school type
    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('PARENT','SCHOOL_ADMIN','EDUCATION_ADMIN')")
    public ResponseEntity<List<SchoolDto>> getSchoolsByType(
            @PathVariable String type
    ) {
        return ResponseEntity.ok(
                schoolService.getSchoolsByType(type)
        );
    }


    // Filter by active status
    @GetMapping("/status/{active}")
    @PreAuthorize("hasAnyRole('PARENT','SCHOOL_ADMIN','EDUCATION_ADMIN')")
    public ResponseEntity<List<SchoolDto>> getSchoolsByStatus(
            @PathVariable boolean active
    ) {
        return ResponseEntity.ok(
                schoolService.getSchoolsByStatus(active)
        );
    }


    // Create school
    // Only Education Admin
    @PostMapping
    @PreAuthorize("hasRole('EDUCATION_ADMIN')")
    public ResponseEntity<SchoolDto> createSchool(
            @Valid @RequestBody SchoolDto schoolDto
    ) {

        SchoolDto createdSchool =
                schoolService.createSchool(schoolDto);

        return new ResponseEntity<>(
                createdSchool,
                HttpStatus.CREATED
        );
    }


    // Update schools
    // School Admin + Education Admin
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN','EDUCATION_ADMIN')")
    public ResponseEntity<SchoolDto> updateSchool(
            @PathVariable String id,
            @Valid @RequestBody SchoolDto schoolDto
    ) {

        return ResponseEntity.ok(
                schoolService.updateSchool(id, schoolDto)
        );
    }


    // Delete school
    // Only Education Admin
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EDUCATION_ADMIN')")
    public ResponseEntity<String> deleteSchool(
            @PathVariable String id
    ) {

        schoolService.deleteSchool(id);

        return ResponseEntity.ok(
                "School deleted successfully."
        );
    }


    // Activate / Deactivate school
    // Only Education Admin
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('EDUCATION_ADMIN')")
    public ResponseEntity<SchoolDto> changeSchoolStatus(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                schoolService.changeSchoolStatus(id)
        );
    }
}