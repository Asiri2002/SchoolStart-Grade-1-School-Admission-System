package schoolstart.backend.controller;

import schoolstart.backend.dto.ParentProfileDto;
import schoolstart.backend.security.UserPrincipal;
import schoolstart.backend.service.ParentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parent/profile")
@PreAuthorize("hasAuthority('PARENT')")
@CrossOrigin(origins = "*")
public class ParentController {

    @Autowired
    private ParentService parentService;

    @GetMapping
    public ResponseEntity<ParentProfileDto> getProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ParentProfileDto profile = parentService.getParentProfile(userPrincipal.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<ParentProfileDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ParentProfileDto profileDto) {

        ParentProfileDto updated = parentService.updateParentProfile(
                userPrincipal.getId(),
                profileDto
        );

        return ResponseEntity.ok(updated);
    }
}