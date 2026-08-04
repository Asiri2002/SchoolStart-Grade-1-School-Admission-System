package schoolstart.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import schoolstart.backend.dto.SchoolAdminRequest;
import schoolstart.backend.dto.SchoolAdminResponse;
import schoolstart.backend.service.SchoolAdminService;

import java.util.List;

@RestController
@RequestMapping("/api/school-admins")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EDUCATION_ADMIN')")
public class SchoolAdminController {

    private final SchoolAdminService schoolAdminService;

    @PostMapping
    public ResponseEntity<SchoolAdminResponse> create(
            @Valid @RequestBody SchoolAdminRequest request) {

        return new ResponseEntity<>(
                schoolAdminService.create(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<SchoolAdminResponse>> getAll() {
        return ResponseEntity.ok(schoolAdminService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolAdminResponse> getById(
            @PathVariable String id) {

        return ResponseEntity.ok(schoolAdminService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolAdminResponse> update(
            @PathVariable String id,
            @Valid @RequestBody SchoolAdminRequest request) {

        return ResponseEntity.ok(schoolAdminService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable String id) {

        schoolAdminService.delete(id);
        return ResponseEntity.ok("School Admin deleted successfully.");
    }
}