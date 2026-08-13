package schoolstart.backend.service;

import schoolstart.backend.dto.ParentProfileDto;
import schoolstart.backend.entity.ParentModel;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.ParentRepository;
import schoolstart.backend.util.MappingUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParentService {

    @Autowired
    private ParentRepository parentRepository;

    public ParentProfileDto getParentProfile(String userId) {
        ParentModel parent = parentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent profile not found for user: " + userId));
        return MappingUtils.mapToParentProfileDto(parent);
    }

    public ParentProfileDto updateParentProfile(String userId, ParentProfileDto profileDto) {
        ParentModel parent = parentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent profile not found for user: " + userId));

        parent.setFirstName(profileDto.getFirstName());
        parent.setLastName(profileDto.getLastName());
        parent.setPhone(profileDto.getPhone());
        parent.setAddress(profileDto.getAddress());

        ParentModel updated = parentRepository.save(parent);
        return MappingUtils.mapToParentProfileDto(updated);
    }
}
