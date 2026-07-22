package schoolstart.backend.service;

import schoolstart.backend.dto.ParentProfileDto;
import schoolstart.backend.entity.ParentModel;
import schoolstart.backend.repository.ParentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParentService {

    @Autowired
    private ParentRepository parentRepository;

    public ParentProfileDto getParentProfile(String userId) {

        ParentModel parent = parentRepository.findByUserId(userId).orElse(null);

        if (parent == null) {
            return null;
        }

        ParentProfileDto dto = new ParentProfileDto();
        dto.setFirstName(parent.getFirstName());
        dto.setLastName(parent.getLastName());
        dto.setPhone(parent.getPhone());
        dto.setAddress(parent.getAddress());

        return dto;
    }

    public ParentProfileDto updateParentProfile(String userId, ParentProfileDto profileDto) {

        ParentModel parent = parentRepository.findByUserId(userId).orElse(null);

        if (parent == null) {
            return null;
        }

        parent.setFirstName(profileDto.getFirstName());
        parent.setLastName(profileDto.getLastName());
        parent.setPhone(profileDto.getPhone());
        parent.setAddress(profileDto.getAddress());

        ParentModel updated = parentRepository.save(parent);

        ParentProfileDto dto = new ParentProfileDto();
        dto.setFirstName(updated.getFirstName());
        dto.setLastName(updated.getLastName());
        dto.setPhone(updated.getPhone());
        dto.setAddress(updated.getAddress());

        return dto;
    }
}