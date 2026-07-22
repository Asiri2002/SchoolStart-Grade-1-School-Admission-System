package schoolstart.backend.repository;

import schoolstart.backend.entity.SchoolModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolRepository extends MongoRepository<SchoolModel, String> {
    Optional<SchoolModel> findByCode(String code);
    List<SchoolModel> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(String name, String code);
}
