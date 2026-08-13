package schoolstart.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import schoolstart.backend.entity.SchoolModel;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolRepository extends MongoRepository<SchoolModel, String> {

    // Find school by unique code
    Optional<SchoolModel> findByCode(String code);

    // Find school by email
    Optional<SchoolModel> findByEmail(String email);

    // Check duplicates
    boolean existsByCode(String code);

    boolean existsByName(String name);

    boolean existsByEmail(String email);

    // Search by school name or code
    List<SchoolModel> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(
            String name,
            String code
    );

    // Filter by district
    List<SchoolModel> findByDistrictIgnoreCase(String district);

    // Filter by school type
    List<SchoolModel> findByTypeIgnoreCase(String type);

    // Filter by active status
    List<SchoolModel> findByActive(boolean active);

    // Search by principal name
    List<SchoolModel> findByPrincipalNameContainingIgnoreCase(
            String principalName
    );
}