package schoolstart.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import schoolstart.backend.entity.InterviewModel;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends MongoRepository<InterviewModel, String> {

    // Check if this school has already scheduled an interview
    Optional<InterviewModel> findByApplicationIdAndSchoolId(
            String applicationId,
            String schoolId
    );

    // Get all interviews for an application
    List<InterviewModel> findByApplicationId(String applicationId);

    // Get all interviews for a school
    List<InterviewModel> findBySchoolId(String schoolId);

    // Get interviews for multiple applications
    List<InterviewModel> findByApplicationIdIn(List<String> applicationIds);
}