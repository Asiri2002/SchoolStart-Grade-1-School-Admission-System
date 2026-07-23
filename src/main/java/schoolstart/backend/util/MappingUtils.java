package schoolstart.backend.util;

import schoolstart.backend.dto.*;
import schoolstart.backend.entity.*;

public class MappingUtils {

    public static UserResponse mapToUserDto(UserModel user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .build();
    }

    public static ParentProfileDto mapToParentProfileDto(ParentModel parent) {
        if (parent == null) return null;
        return ParentProfileDto.builder()
                .id(parent.getId())
                .userId(parent.getUserId())
                .firstName(parent.getFirstName())
                .lastName(parent.getLastName())
                .phone(parent.getPhone())
                .address(parent.getAddress())
                .childIds(parent.getChildIds())
                .build();
    }

    public static ChildDto mapToChildDto(ChildModel child) {
        if (child == null) return null;
        return ChildDto.builder()
                .id(child.getId())
                .parentId(child.getParentId())
                .firstName(child.getFirstName())
                .lastName(child.getLastName())
                .dateOfBirth(child.getDateOfBirth())
                .gender(child.getGender())
                .birthCertificateNumber(child.getBirthCertificateNumber())
                .applicationIds(child.getApplicationIds())
                .build();
    }

    public static ChildModel mapToChildEntity(ChildDto dto) {
        if (dto == null) return null;
        return ChildModel.builder()
                .id(dto.getId())
                .parentId(dto.getParentId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .birthCertificateNumber(dto.getBirthCertificateNumber())
                .applicationIds(dto.getApplicationIds())
                .build();
    }
    public static SchoolDto mapToSchoolDto(SchoolModel school) {
        if (school == null) return null;

        return SchoolDto.builder()
                .id(school.getId())
                .name(school.getName())
                .code(school.getCode())
                .address(school.getAddress())
                .email(school.getEmail())
                .phone(school.getPhone())
                .capacity(school.getCapacity())
                .availableSeats(school.getAvailableSeats())
                .imageUrl(school.getImageUrl())
                .description(school.getDescription())
                .build();
    }

    public static SchoolModel mapToSchoolEntity(SchoolDto dto) {
        if (dto == null) return null;

        return SchoolModel.builder()
                .id(dto.getId())
                .name(dto.getName())
                .code(dto.getCode())
                .address(dto.getAddress())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .capacity(dto.getCapacity())
                .availableSeats(dto.getAvailableSeats())
                .imageUrl(dto.getImageUrl())
                .description(dto.getDescription())
                .build();
    }
}

