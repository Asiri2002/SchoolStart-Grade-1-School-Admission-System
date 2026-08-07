package schoolstart.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import schoolstart.backend.entity.NotificationModel;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<NotificationModel, String> {

    // Get all notifications for a user
    List<NotificationModel> findByUserIdOrderByTimestampDesc(String userId);

    // Get unread/read notifications
    List<NotificationModel> findByUserIdAndReadOrderByTimestampDesc(String userId, boolean read);

    // Get notifications by type (SYSTEM, APPLICATION, INTERVIEW, ADMISSION)
    List<NotificationModel> findByUserIdAndTypeOrderByTimestampDesc(String userId, String type);

    // Search notifications by message
    List<NotificationModel> findByUserIdAndMessageContainingIgnoreCase(String userId, String keyword);

    // Count unread notifications
    long countByUserIdAndRead(String userId, boolean read);

    // Delete all notifications of a user (optional)
    void deleteByUserId(String userId);

    // Recent notifications (optional)
    List<NotificationModel> findTop5ByUserIdOrderByTimestampDesc(String userId);
}