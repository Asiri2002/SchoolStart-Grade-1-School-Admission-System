package schoolstart.backend.controller;

import schoolstart.backend.dto.ApplicationRequest;
import schoolstart.backend.dto.ApplicationResponse;
import schoolstart.backend.security.UserPrincipal;
import schoolstart.backend.service.ApplicationService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/applications")
@PreAuthorize("hasAuthority('ROLE_PARENT')")
@CrossOrigin(origins = "*")
public class ApplicationController {


    @Autowired
    private ApplicationService applicationService;

    // CREATE APPLICATION

    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ApplicationRequest request
    ){
        ApplicationResponse response =
                applicationService.createApplication(
                        userPrincipal.getId(),
                        request
                );
        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }
    // GET MY APPLICATIONS

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        List<ApplicationResponse> applications =
                applicationService.getMyApplications(
                        userPrincipal.getId()
                );
        return ResponseEntity.ok(applications);
    }

    // GET SINGLE APPLICATION

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getMyApplication(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id
    ){
        ApplicationResponse response =
                applicationService.getMyApplication(
                        id,
                        userPrincipal.getId()
                );
        return ResponseEntity.ok(response);
    }

    // UPDATE APPLICATION
    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id,
            @Valid @RequestBody ApplicationRequest request
    ){
        ApplicationResponse response =
                applicationService.updateApplication(
                        id,
                        userPrincipal.getId(),
                        request
                );
        return ResponseEntity.ok(response);
    }
}