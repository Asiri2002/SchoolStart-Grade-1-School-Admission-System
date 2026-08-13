package schoolstart.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import schoolstart.backend.dto.InterviewDto;
import schoolstart.backend.security.UserPrincipal;
import schoolstart.backend.service.InterviewService;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;


    // =========================================================
    // CREATE INTERVIEW
    // Only SCHOOL_ADMIN
    // =========================================================
    @PostMapping
    @PreAuthorize("hasAuthority('SCHOOL_ADMIN')")
    public ResponseEntity<InterviewDto> createInterview(
            @Valid @RequestBody InterviewDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        InterviewDto createdInterview =
                interviewService.createInterview(
                        userPrincipal.getId(),
                        dto
                );

        return ResponseEntity.ok(createdInterview);
    }


    // =========================================================
    // GET INTERVIEWS
    // PARENT / SCHOOL_ADMIN / EDUCATION_ADMIN
    // =========================================================
    @GetMapping
    @PreAuthorize(
            "hasAuthority('PARENT') or " +
                    "hasAuthority('SCHOOL_ADMIN') or " +
                    "hasAuthority('EDUCATION_ADMIN')"
    )
    public ResponseEntity<List<InterviewDto>> getInterviews(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String role = userPrincipal.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        List<InterviewDto> interviews =
                interviewService.getInterviews(
                        userPrincipal.getId(),
                        role
                );

        return ResponseEntity.ok(interviews);
    }


    // =========================================================
    // GET INTERVIEW BY ID
    // PARENT / SCHOOL_ADMIN / EDUCATION_ADMIN
    // =========================================================
    @GetMapping("/{id}")
    @PreAuthorize(
            "hasAuthority('PARENT') or " +
                    "hasAuthority('SCHOOL_ADMIN') or " +
                    "hasAuthority('EDUCATION_ADMIN')"
    )
    public ResponseEntity<InterviewDto> getInterviewById(
            @PathVariable String id) {

        InterviewDto interview =
                interviewService.getInterviewById(id);

        return ResponseEntity.ok(interview);
    }


    // =========================================================
    // UPDATE INTERVIEW
    // Only SCHOOL_ADMIN
    // =========================================================
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SCHOOL_ADMIN')")
    public ResponseEntity<InterviewDto> updateInterview(
            @PathVariable String id,
            @Valid @RequestBody InterviewDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        InterviewDto updatedInterview =
                interviewService.updateInterview(
                        userPrincipal.getId(),
                        id,
                        dto
                );

        return ResponseEntity.ok(updatedInterview);
    }


    // =========================================================
    // DELETE INTERVIEW
    // Only SCHOOL_ADMIN
    // =========================================================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SCHOOL_ADMIN')")
    public ResponseEntity<String> deleteInterview(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        interviewService.deleteInterview(
                userPrincipal.getId(),
                id
        );

        return ResponseEntity.ok(
                "Interview deleted successfully."
        );
    }
}

