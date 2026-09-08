package schoolstart.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import schoolstart.backend.dto.DocumentDto;
import schoolstart.backend.dto.DocumentVerificationRequest;
import schoolstart.backend.security.UserPrincipal;
import schoolstart.backend.service.DocumentService;

import java.util.List;

@RestController
@RequestMapping("/api/school-admin/documents")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SCHOOL_ADMIN')")
public class SchoolAdminDocumentController {

    private final DocumentService documentService;


    // =====================================================
    // GET ALL DOCUMENTS FOR AN APPLICATION
    // =====================================================

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<DocumentDto>> getApplicationDocuments(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String applicationId
    ) {

        return ResponseEntity.ok(
                documentService.getApplicationDocuments(
                        userPrincipal.getId(),
                        applicationId
                )
        );
    }


    // =====================================================
    // VERIFY DOCUMENT
    // =====================================================

    @PutMapping("/{documentId}/verify")
    public ResponseEntity<DocumentDto> verifyDocument(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String documentId
    ) {

        return ResponseEntity.ok(
                documentService.verifyDocument(
                        userPrincipal.getId(),
                        documentId
                )
        );
    }


    // =====================================================
    // REJECT DOCUMENT
    // =====================================================

    @PutMapping("/{documentId}/reject")
    public ResponseEntity<DocumentDto> rejectDocument(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String documentId,
            @RequestBody DocumentVerificationRequest request
    ) {

        return ResponseEntity.ok(
                documentService.rejectDocument(
                        userPrincipal.getId(),
                        documentId,
                        request.getReason()
                )
        );
    }
}