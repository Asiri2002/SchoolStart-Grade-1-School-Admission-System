package schoolstart.backend.repository;

import schoolstart.backend.entity.NotificationModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<NotificationModel, String> {
    List<NotificationModel> findByUserIdOrderByTimestampDesc(String userId);
    List<NotificationModel> findByUserIdAndReadOrderByTimestampDesc(String userId, boolean read);
}

