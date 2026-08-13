package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import schoolstart.backend.dto.AdmissionDto;
import schoolstart.backend.entity.AdmissionModel;
import schoolstart.backend.repository.AdmissionRepository;
import schoolstart.backend.util.MappingUtils;
import schoolstart.backend.util.PdfGenerator;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdmissionService {

    private final AdmissionRepository admissionRepository;

    // Get admission by ID
    public AdmissionDto getAdmissionById(String id) {

        AdmissionModel admission = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found with id: " + id));

        return MappingUtils.mapToAdmissionDto(admission);
    }

    // Get admission by Application ID
    public AdmissionDto getAdmissionByApplicationId(String applicationId) {

        AdmissionModel admission = admissionRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("Admission not found for application ID: " + applicationId));

        return MappingUtils.mapToAdmissionDto(admission);
    }

    // Get all admissions
    public List<AdmissionDto> getAllAdmissions() {

        return admissionRepository.findAll()
                .stream()
                .map(MappingUtils::mapToAdmissionDto)
                .collect(Collectors.toList());
    }

    // Update admission
    public AdmissionDto updateAdmission(String id, AdmissionDto admissionDto) {

        AdmissionModel admission = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found with id: " + id));

        admission.setApplicationId(admissionDto.getApplicationId());
        admission.setAdmissionNumber(admissionDto.getAdmissionNumber());
        admission.setStudentName(admissionDto.getStudentName());
        admission.setSchoolName(admissionDto.getSchoolName());
        admission.setAdmissionDate(admissionDto.getAdmissionDate());
        admission.setStatus(admissionDto.getStatus());
        admission.setFeeStatus(admissionDto.getFeeStatus());

        AdmissionModel updatedAdmission = admissionRepository.save(admission);

        return MappingUtils.mapToAdmissionDto(updatedAdmission);
    }

    // Delete admission
    public void deleteAdmission(String id) {

        AdmissionModel admission = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found with id: " + id));

        admissionRepository.delete(admission);
    }

    // Download admission letter PDF
    public byte[] downloadAdmissionLetter(String applicationId) {

        AdmissionModel admission = admissionRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("Admission not found for application ID: " + applicationId));

        return PdfGenerator.generate(admission);
    }
}