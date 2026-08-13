package schoolstart.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import schoolstart.backend.dto.ApplicationResponse;
import schoolstart.backend.service.ApplicationStatusService;

@RestController
@RequestMapping("/api/application-status")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApplicationStatusController {

    private final ApplicationStatusService applicationStatusService;

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationStatus(
            @PathVariable String id) {

        ApplicationResponse response =
                applicationStatusService.getApplicationStatus(id);

        return ResponseEntity.ok(response);
    }
}