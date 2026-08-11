package schoolstart.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import schoolstart.backend.entity.ApplicationModel;
import schoolstart.backend.entity.ApplicationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface ApplicationRepository extends MongoRepository<ApplicationModel, String> {
    List<ApplicationModel> findByParentId(String parentId);
    List<ApplicationModel> findBySchoolId(String schoolId);
    List<ApplicationModel> findByChildId(String childId);
    List<ApplicationModel> findByStatus(ApplicationStatus status);
    // Dashboard Statistics
    long countBySchoolId(String schoolId);

    long countBySchoolIdAndStatus(String schoolId, ApplicationStatus status);

    Page<ApplicationModel> findBySchoolId(String schoolId, Pageable pageable);
}
