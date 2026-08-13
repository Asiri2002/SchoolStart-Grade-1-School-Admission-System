package schoolstart.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import schoolstart.backend.dto.SchoolDto;
import schoolstart.backend.entity.SchoolModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.SchoolRepository;
import schoolstart.backend.util.MappingUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchoolService {

    @Autowired
    private SchoolRepository schoolRepository;

    public List<SchoolDto> getAllSchools() {
        return schoolRepository.findAll()
                .stream()
                .map(MappingUtils::mapToSchoolDto)
                .collect(Collectors.toList());
    }

    public SchoolDto getSchoolById(String id) {
        SchoolModel school = schoolRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "School not found with ID: " + id
                        ));

        return MappingUtils.mapToSchoolDto(school);
    }

    public List<SchoolDto> searchSchools(String query) {
        return schoolRepository
                .findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(query, query)
                .stream()
                .map(MappingUtils::mapToSchoolDto)
                .collect(Collectors.toList());
    }

    public List<SchoolDto> getSchoolsByDistrict(String district) {
        return schoolRepository.findByDistrictIgnoreCase(district)
                .stream()
                .map(MappingUtils::mapToSchoolDto)
                .collect(Collectors.toList());
    }

    public List<SchoolDto> getSchoolsByType(String type) {
        return schoolRepository.findByTypeIgnoreCase(type)
                .stream()
                .map(MappingUtils::mapToSchoolDto)
                .collect(Collectors.toList());
    }

    public List<SchoolDto> getSchoolsByStatus(boolean active) {
        return schoolRepository.findByActive(active)
                .stream()
                .map(MappingUtils::mapToSchoolDto)
                .collect(Collectors.toList());
    }

    public SchoolDto createSchool(SchoolDto schoolDto) {

        if (schoolRepository.existsByCode(schoolDto.getCode())) {
            throw new BadRequestException(
                    "School with code '" + schoolDto.getCode() + "' already exists."
            );
        }

        if (schoolRepository.existsByName(schoolDto.getName())) {
            throw new BadRequestException(
                    "School with name '" + schoolDto.getName() + "' already exists."
            );
        }

        if (schoolRepository.existsByEmail(schoolDto.getEmail())) {
            throw new BadRequestException(
                    "Email '" + schoolDto.getEmail() + "' already exists."
            );
        }

        SchoolModel school = MappingUtils.mapToSchoolEntity(schoolDto);

        school.setId(null);
        school.setCreatedDate(LocalDate.now());

        if (schoolDto.getActive() == null) {
            school.setActive(true);
        }

        SchoolModel savedSchool = schoolRepository.save(school);

        return MappingUtils.mapToSchoolDto(savedSchool);
    }

    public SchoolDto updateSchool(String id, SchoolDto schoolDto) {

        SchoolModel school = schoolRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "School not found with ID: " + id
                        ));

        schoolRepository.findByCode(schoolDto.getCode())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new BadRequestException(
                                "School code '" + schoolDto.getCode() + "' already exists."
                        );
                    }
                });

        schoolRepository.findByEmail(schoolDto.getEmail())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new BadRequestException(
                                "Email '" + schoolDto.getEmail() + "' already exists."
                        );
                    }
                });

        school.setName(schoolDto.getName());
        school.setCode(schoolDto.getCode());
        school.setDistrict(schoolDto.getDistrict());
        school.setType(schoolDto.getType());
        school.setAddress(schoolDto.getAddress());
        school.setEmail(schoolDto.getEmail());
        school.setPhone(schoolDto.getPhone());
        school.setPrincipalName(schoolDto.getPrincipalName());
        school.setCapacity(schoolDto.getCapacity());
        school.setAvailableSeats(schoolDto.getAvailableSeats());
        school.setImageUrl(schoolDto.getImageUrl());
        school.setDescription(schoolDto.getDescription());

        if (schoolDto.getActive() != null) {
            school.setActive(schoolDto.getActive());
        }

        SchoolModel updatedSchool = schoolRepository.save(school);

        return MappingUtils.mapToSchoolDto(updatedSchool);
    }

    public void deleteSchool(String id) {

        SchoolModel school = schoolRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "School not found with ID: " + id
                        ));

        schoolRepository.delete(school);
    }

    public SchoolDto changeSchoolStatus(String id) {

        SchoolModel school = schoolRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "School not found with ID: " + id
                        ));

        school.setActive(!school.isActive());

        SchoolModel updatedSchool = schoolRepository.save(school);

        return MappingUtils.mapToSchoolDto(updatedSchool);
    }
}