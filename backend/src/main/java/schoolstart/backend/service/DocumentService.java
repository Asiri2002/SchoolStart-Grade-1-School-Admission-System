package schoolstart.backend.service;

import schoolstart.backend.dto.DocumentDto;
import schoolstart.backend.entity.ApplicationModel;
import schoolstart.backend.entity.DocumentModel;
import schoolstart.backend.entity.ParentModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.ApplicationRepository;
import schoolstart.backend.repository.DocumentRepository;
import schoolstart.backend.repository.ParentRepository;
import schoolstart.backend.util.MappingUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ParentRepository parentRepository;

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Transactional
    public DocumentDto uploadDocument(String userId, String applicationId, String name, MultipartFile file) {
        ParentModel parent = parentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent profile not found for user: " + userId));

        ApplicationModel application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        if (!application.getParentId().equals(parent.getId())) {
            throw new BadRequestException("You are not authorized to upload documents for this application.");
        }

        if (file.isEmpty()) {
            throw new BadRequestException("Failed to upload empty file.");
        }

        try {
            // Ensure directory exists
            Path root = Paths.get(uploadDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            // Generate unique file name
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            Path targetPath = root.resolve(uniqueFileName);

            // Copy file to directory
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Create Document entity
            DocumentModel document = DocumentModel.builder()
                    .applicationId(applicationId)
                    .name(name)
                    .type(file.getContentType())
                    .url(targetPath.toAbsolutePath().toString())
                    .uploadDate(LocalDateTime.now())
                    .status("PENDING")
                    .build();

            DocumentModel savedDoc = documentRepository.save(document);

            // Link to Application
            application.getDocumentIds().add(savedDoc.getId());
            applicationRepository.save(application);

            return MappingUtils.mapToDocumentDto(savedDoc);

        } catch (IOException e) {
            throw new BadRequestException("Could not store file. Error: " + e.getMessage());
        }
    }
}
