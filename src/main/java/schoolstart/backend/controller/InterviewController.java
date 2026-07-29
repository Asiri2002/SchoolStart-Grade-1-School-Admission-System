package schoolstart.backend.controller;

import schoolstart.backend.dto.InterviewDto;
import schoolstart.backend.security.UserPrincipal;
import schoolstart.backend.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "*")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @GetMapping
    //@PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<InterviewDto>> getInterviews(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String role = userPrincipal.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        List<InterviewDto> interviews =
                interviewService.getInterviews(userPrincipal.getId(), role);

        return ResponseEntity.ok(interviews);
    }
}