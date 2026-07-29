package schoolstart.backend.repository;

import schoolstart.backend.entity.ParentModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParentRepository extends MongoRepository<ParentModel, String> {
    Optional<ParentModel> findByUserId(String userId);
}
