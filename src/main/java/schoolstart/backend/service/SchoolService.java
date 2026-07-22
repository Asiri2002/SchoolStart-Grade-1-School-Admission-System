package schoolstart.backend.service;

import schoolstart.backend.dto.SchoolDto;
import schoolstart.backend.entity.SchoolModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.SchoolRepository;
import schoolstart.backend.util.MappingUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchoolService {

    @Autowired
    private SchoolRepository schoolRepository;

    public List<SchoolDto> getAllSchools() {
        return schoolRepository.findAll().stream()
                .map(MappingUtils::mapToSchoolDto)
                .collect(Collectors.toList());
    }

    public SchoolDto getSchoolById(String id) {
        SchoolModel school = schoolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with ID: " + id));
        return MappingUtils.mapToSchoolDto(school);
    }

    public List<SchoolDto> searchSchools(String query) {
        return schoolRepository.findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(query, query).stream()
                .map(MappingUtils::mapToSchoolDto)
                .collect(Collectors.toList());
    }

    public SchoolDto createSchool(SchoolDto schoolDto) {
        if (schoolRepository.findByCode(schoolDto.getCode()).isPresent()) {
            throw new BadRequestException("School with code " + schoolDto.getCode() + " already exists.");
        }

        SchoolModel school = MappingUtils.mapToSchoolEntity(schoolDto);
        school.setId(null); // Ensure a new ID is generated

        SchoolModel saved = schoolRepository.save(school);
        return MappingUtils.mapToSchoolDto(saved);
    }

    public SchoolDto updateSchool(String id, SchoolDto schoolDto) {
        SchoolModel school = schoolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with ID: " + id));

        schoolRepository.findByCode(schoolDto.getCode()).ifPresent(s -> {
            if (!s.getId().equals(id)) {
                throw new BadRequestException("School with code " + schoolDto.getCode() + " already exists.");
            }
        });

        school.setName(schoolDto.getName());
        school.setCode(schoolDto.getCode());
        school.setAddress(schoolDto.getAddress());
        school.setEmail(schoolDto.getEmail());
        school.setPhone(schoolDto.getPhone());
        school.setCapacity(schoolDto.getCapacity());
        school.setDescription(schoolDto.getDescription());

        SchoolModel updated = schoolRepository.save(school);
        return MappingUtils.mapToSchoolDto(updated);
    }

    public void deleteSchool(String id) {
        if (!schoolRepository.existsById(id)) {
            throw new ResourceNotFoundException("School not found with ID: " + id);
        }
        schoolRepository.deleteById(id);
    }
}

