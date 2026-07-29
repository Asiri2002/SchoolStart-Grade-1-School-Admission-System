package schoolstart.backend.repository;

import schoolstart.backend.entity.InterviewModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends MongoRepository<InterviewModel, String> {
    Optional<InterviewModel> findByApplicationId(String applicationId);
    List<InterviewModel> findByApplicationIdIn(List<String> applicationIds);
}
