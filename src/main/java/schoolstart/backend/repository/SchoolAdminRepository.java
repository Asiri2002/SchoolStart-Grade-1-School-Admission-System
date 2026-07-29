package schoolstart.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import schoolstart.backend.entity.SchoolAdminModel;

import java.util.Optional;

@Repository
public interface SchoolAdminRepository extends MongoRepository<SchoolAdminModel, String> {
    Optional<SchoolAdminModel> findByUserId(String userId);
    Optional<SchoolAdminModel> findBySchoolId(String schoolId);
}
