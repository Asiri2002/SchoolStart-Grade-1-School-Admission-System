package schoolstart.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import schoolstart.backend.dto.NotificationDto;
import schoolstart.backend.entity.NotificationModel;
import schoolstart.backend.exception.BadRequestException;
import schoolstart.backend.exception.ResourceNotFoundException;
import schoolstart.backend.repository.NotificationRepository;
import schoolstart.backend.util.MappingUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Create notification
    public NotificationDto createNotification(String userId, String message, String type) {

        NotificationModel notification = NotificationModel.builder()
                .userId(userId)
                .message(message)
                .type(type)
                .read(false)
                .timestamp(LocalDateTime.now())
                .build();

        NotificationModel savedNotification = notificationRepository.save(notification);

        return MappingUtils.mapToNotificationDto(savedNotification);
    }

    // Get all notifications for a user
    public List<NotificationDto> getNotificationsForUser(String userId) {

        return notificationRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(MappingUtils::mapToNotificationDto)
                .collect(Collectors.toList());
    }

    // Mark single notification as read
    public NotificationDto markAsRead(String id, String userId) {

        NotificationModel notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Notification not found with ID: " + id
                        )
                );

        if (!notification.getUserId().equals(userId)) {
            throw new BadRequestException(
                    "You are not authorized to mark this notification as read."
            );
        }

        notification.setRead(true);

        NotificationModel updatedNotification = notificationRepository.save(notification);

        return MappingUtils.mapToNotificationDto(updatedNotification);
    }

    // Mark all notifications as read for a user
    public void markAllAsRead(String userId) {

        List<NotificationModel> unreadNotifications =
                notificationRepository.findByUserIdAndReadOrderByTimestampDesc(userId, false);

        unreadNotifications.forEach(notification -> notification.setRead(true));

        notificationRepository.saveAll(unreadNotifications);
    }

    // Delete notification
    public void deleteNotification(String id, String userId) {

        NotificationModel notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Notification not found with ID: " + id
                        )
                );

        if (!notification.getUserId().equals(userId)) {
            throw new BadRequestException(
                    "You are not authorized to delete this notification."
            );
        }

        notificationRepository.delete(notification);
    }
}