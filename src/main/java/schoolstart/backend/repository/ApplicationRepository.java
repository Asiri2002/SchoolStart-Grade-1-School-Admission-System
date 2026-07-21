package schoolstart.backend.repository;

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
}
