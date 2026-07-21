package schoolstart.backend.service;

import schoolstart.backend.dto.ChildDto;
import schoolstart.backend.entity.ChildModel;
import schoolstart.backend.entity.ParentModel;
import schoolstart.backend.repository.ChildRepository;
import schoolstart.backend.repository.ParentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChildService {

    @Autowired
    private ChildRepository childRepository;

    @Autowired
    private ParentRepository parentRepository;

    // Get parent by user id
    private ParentModel getParentByUserId(String userId) {
        return parentRepository.findByUserId(userId).orElse(null);
    }

    // Add Child
    @Transactional
    public ChildDto addChild(String userId, ChildDto childDto) {

        ParentModel parent = getParentByUserId(userId);

        if (parent == null) {
            return null;
        }

        ChildModel child = new ChildModel();

        child.setFirstName(childDto.getFirstName());
        child.setLastName(childDto.getLastName());
        child.setDateOfBirth(childDto.getDateOfBirth());
        child.setGender(childDto.getGender());
        child.setBirthCertificateNumber(childDto.getBirthCertificateNumber());
        child.setParentId(parent.getId());

        ChildModel savedChild = childRepository.save(child);

        if (parent.getChildIds() == null) {
            parent.setChildIds(new ArrayList<>());
        }

        parent.getChildIds().add(savedChild.getId());
        parentRepository.save(parent);

        ChildDto dto = new ChildDto();
        dto.setId(savedChild.getId());
        dto.setFirstName(savedChild.getFirstName());
        dto.setLastName(savedChild.getLastName());
        dto.setDateOfBirth(savedChild.getDateOfBirth());
        dto.setGender(savedChild.getGender());
        dto.setBirthCertificateNumber(savedChild.getBirthCertificateNumber());

        return dto;
    }

    // Get All Children
    public List<ChildDto> getChildren(String userId) {

        ParentModel parent = getParentByUserId(userId);

        if (parent == null) {
            return new ArrayList<>();
        }

        List<ChildModel> children = childRepository.findByParentId(parent.getId());

        List<ChildDto> childDtos = new ArrayList<>();

        for (ChildModel child : children) {

            ChildDto dto = new ChildDto();

            dto.setId(child.getId());
            dto.setFirstName(child.getFirstName());
            dto.setLastName(child.getLastName());
            dto.setDateOfBirth(child.getDateOfBirth());
            dto.setGender(child.getGender());
            dto.setBirthCertificateNumber(child.getBirthCertificateNumber());

            childDtos.add(dto);
        }

        return childDtos;
    }

    // Update Child
    @Transactional
    public ChildDto updateChild(String userId, String childId, ChildDto childDto) {

        ParentModel parent = getParentByUserId(userId);

        if (parent == null) {
            return null;
        }

        ChildModel child = childRepository.findById(childId).orElse(null);

        if (child == null) {
            return null;
        }

        if (!child.getParentId().equals(parent.getId())) {
            return null;
        }

        child.setFirstName(childDto.getFirstName());
        child.setLastName(childDto.getLastName());
        child.setDateOfBirth(childDto.getDateOfBirth());
        child.setGender(childDto.getGender());
        child.setBirthCertificateNumber(childDto.getBirthCertificateNumber());

        ChildModel updatedChild = childRepository.save(child);

        ChildDto dto = new ChildDto();

        dto.setId(updatedChild.getId());
        dto.setFirstName(updatedChild.getFirstName());
        dto.setLastName(updatedChild.getLastName());
        dto.setDateOfBirth(updatedChild.getDateOfBirth());
        dto.setGender(updatedChild.getGender());
        dto.setBirthCertificateNumber(updatedChild.getBirthCertificateNumber());

        return dto;
    }

    // Delete Child
    @Transactional
    public boolean deleteChild(String userId, String childId) {

        ParentModel parent = getParentByUserId(userId);

        if (parent == null) {
            return false;
        }

        ChildModel child = childRepository.findById(childId).orElse(null);

        if (child == null) {
            return false;
        }

        if (!child.getParentId().equals(parent.getId())) {
            return false;
        }

        childRepository.delete(child);

        if (parent.getChildIds() != null) {
            parent.getChildIds().remove(childId);
        }

        parentRepository.save(parent);

        return true;
    }
}