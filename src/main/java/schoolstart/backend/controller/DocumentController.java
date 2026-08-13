package schoolstart.backend.controller;

import schoolstart.backend.dto.DocumentDto;
import schoolstart.backend.security.UserPrincipal;
import schoolstart.backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@PreAuthorize("hasAuthority('PARENT')")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentDto> uploadDocument(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("applicationId") String applicationId) {
        DocumentDto response = documentService.uploadDocument(userPrincipal.getId(), applicationId, name, file);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}