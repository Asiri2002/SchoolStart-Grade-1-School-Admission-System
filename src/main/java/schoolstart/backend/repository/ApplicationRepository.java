package schoolstart.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
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
    // Dashboard Statistics
    long countBySchoolId(String schoolId);

    long countBySchoolIdAndStatus(String schoolId, ApplicationStatus status);

    Page<ApplicationModel> findBySchoolId(String schoolId, Pageable pageable);

    Page<ApplicationModel> findBySchoolIdAndStatus(
            String schoolId,
            ApplicationStatus status,
            Pageable pageable
    );

    List<ApplicationModel> findBySchoolIdAndIdIn(
            String schoolId,
            List<String> ids
    );

    Page<ApplicationModel> findBySchoolIdAndChildFullNameContainingIgnoreCase(
            String schoolId,
            String childFullName,
            Pageable pageable
    );

    Page<ApplicationModel> findBySchoolIdAndParentFullNameContainingIgnoreCase(
            String schoolId,
            String parentFullName,
            Pageable pageable
    );



    @Query("""
    {
        'schoolId': ?0,
        '$or': [
            { 'childFullName': { '$regex': ?1, '$options': 'i' } },
            { 'parentFullName': { '$regex': ?1, '$options': 'i' } }
        ]
    }
""")
    Page<ApplicationModel> searchApplications(
            String schoolId,
            String search,
            Pageable pageable
    );

    @Query("""
    {
        'schoolId': ?0,
        'status': ?1,
        '$or': [
            { 'childFullName': { '$regex': ?2, '$options': 'i' } },
            { 'parentFullName': { '$regex': ?2, '$options': 'i' } }
        ]
    }
""")
    Page<ApplicationModel> searchApplicationsByStatus(
            String schoolId,
            ApplicationStatus status,
            String search,
            Pageable pageable
    );


}
