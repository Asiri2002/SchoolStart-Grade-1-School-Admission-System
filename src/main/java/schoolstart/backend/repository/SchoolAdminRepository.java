package schoolstart.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import schoolstart.backend.entity.SchoolAdminModel;

import java.util.Optional;

public interface SchoolAdminRepository extends MongoRepository<SchoolAdminModel, String> {

    Optional<SchoolAdminModel> findByUserId(String userId);

    boolean existsByUserId(String userId);
}