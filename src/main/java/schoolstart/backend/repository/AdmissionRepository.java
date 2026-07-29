package schoolstart.backend.repository;

import schoolstart.backend.entity.AdmissionModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdmissionRepository extends MongoRepository<AdmissionModel, String> {
    Optional<AdmissionModel> findByApplicationId(String applicationId);
    Optional<AdmissionModel> findByAdmissionNumber(String admissionNumber);
}
