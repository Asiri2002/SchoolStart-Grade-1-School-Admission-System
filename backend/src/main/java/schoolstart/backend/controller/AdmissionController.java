package schoolstart.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import schoolstart.backend.dto.AdmissionDto;
import schoolstart.backend.service.AdmissionService;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdmissionController {

    private final AdmissionService admissionService;

    // Get admission by ID
    @GetMapping("/{id}")
    public ResponseEntity<AdmissionDto> getAdmissionById(@PathVariable String id) {
        return ResponseEntity.ok(admissionService.getAdmissionById(id));
    }

    // Get admission by Application ID
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<AdmissionDto> getAdmissionByApplicationId(@PathVariable String applicationId) {
        return ResponseEntity.ok(admissionService.getAdmissionByApplicationId(applicationId));
    }

    // Get all admissions
    @GetMapping
    public ResponseEntity<List<AdmissionDto>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.getAllAdmissions());
    }

    // Update admission
    @PutMapping("/{id}")
    public ResponseEntity<AdmissionDto> updateAdmission(
            @PathVariable String id,
            @RequestBody AdmissionDto admissionDto) {

        return ResponseEntity.ok(admissionService.updateAdmission(id, admissionDto));
    }

    // Delete admission
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmission(@PathVariable String id) {
        admissionService.deleteAdmission(id);
        return ResponseEntity.ok("Admission deleted successfully.");
    }

    // Download admission letter PDF
    @GetMapping("/{applicationId}/download")
    public ResponseEntity<byte[]> downloadAdmissionLetter(@PathVariable String applicationId) {

        byte[] pdf = admissionService.downloadAdmissionLetter(applicationId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Admission_Letter_" + applicationId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}