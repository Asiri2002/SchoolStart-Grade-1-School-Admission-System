package schoolstart.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import schoolstart.backend.entity.ApplicationStatusHistory;

import java.util.List;

public interface ApplicationStatusHistoryRepository
        extends MongoRepository<ApplicationStatusHistory, String> {

    List<ApplicationStatusHistory> findByApplicationIdOrderByUpdatedAtAsc(String applicationId);

}