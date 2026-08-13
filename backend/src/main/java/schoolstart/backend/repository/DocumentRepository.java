package schoolstart.backend.repository;

import schoolstart.backend.entity.DocumentModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends MongoRepository<DocumentModel, String> {
    List<DocumentModel> findByApplicationId(String applicationId);
}