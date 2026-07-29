package schoolstart.backend.service;

import schoolstart.backend.dto.ChildDto;
import schoolstart.backend.entity.ChildModel;
import schoolstart.backend.entity.ParentModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.ChildRepository;
import schoolstart.backend.repository.ParentRepository;
import schoolstart.backend.util.MappingUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChildService {

    @Autowired
    private ChildRepository childRepository;

    @Autowired
    private ParentRepository parentRepository;

    private ParentModel getParentByUserId(String userId) {
        return parentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent profile not found for user: " + userId));
    }

    @Transactional
    public ChildDto addChild(String userId, ChildDto childDto) {
        ParentModel parent = getParentByUserId(userId);

        ChildModel child = MappingUtils.mapToChildEntity(childDto);
        child.setParentId(parent.getId());
        child.setId(null); // Ensure a new ID is generated

        ChildModel savedChild = childRepository.save(child);

        parent.getChildIds().add(savedChild.getId());
        parentRepository.save(parent);

        return MappingUtils.mapToChildDto(savedChild);
    }

    public List<ChildDto> getChildren(String userId) {
        ParentModel parent = getParentByUserId(userId);
        List<ChildModel> children = childRepository.findByParentId(parent.getId());
        return children.stream()
                .map(MappingUtils::mapToChildDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChildDto updateChild(String userId, String childId, ChildDto childDto) {
        ParentModel parent = getParentByUserId(userId);
        ChildModel child = childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID: " + childId));

        if (!child.getParentId().equals(parent.getId())) {
            throw new BadRequestException("You are not authorized to update this child's profile.");
        }

        child.setFirstName(childDto.getFirstName());
        child.setLastName(childDto.getLastName());
        child.setDateOfBirth(childDto.getDateOfBirth());
        child.setGender(childDto.getGender());
        child.setBirthCertificateNumber(childDto.getBirthCertificateNumber());

        ChildModel updated = childRepository.save(child);
        return MappingUtils.mapToChildDto(updated);
    }

    @Transactional
    public void deleteChild(String userId, String childId) {
        ParentModel parent = getParentByUserId(userId);
        ChildModel child = childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID: " + childId));

        if (!child.getParentId().equals(parent.getId())) {
            throw new BadRequestException("You are not authorized to delete this child's profile.");
        }

        childRepository.delete(child);

        parent.getChildIds().remove(childId);
        parentRepository.save(parent);
    }
}
