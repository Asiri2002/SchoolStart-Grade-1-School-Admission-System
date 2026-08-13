package schoolstart.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import schoolstart.backend.dto.NotificationDto;
import schoolstart.backend.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;


    // Create notification
    @PostMapping
    public ResponseEntity<NotificationDto> createNotification(
            @RequestBody NotificationDto notificationDto) {

        return ResponseEntity.ok(
                notificationService.createNotification(
                        notificationDto.getUserId(),
                        notificationDto.getMessage(),
                        notificationDto.getType()
                )
        );
    }


    // Get all notifications for user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsForUser(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                notificationService.getNotificationsForUser(userId)
        );
    }


    // Get unread notifications
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(userId)
        );
    }


    // Get notifications by type
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByType(
            @PathVariable String userId,
            @PathVariable String type) {

        return ResponseEntity.ok(
                notificationService.getNotificationsByType(userId, type)
        );
    }


    // Search notifications
    @GetMapping("/user/{userId}/search")
    public ResponseEntity<List<NotificationDto>> searchNotifications(
            @PathVariable String userId,
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                notificationService.searchNotifications(userId, keyword)
        );
    }


    // Get unread notification count
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getUnreadCount(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                notificationService.getUnreadCount(userId)
        );
    }


    // Mark one notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(
            @PathVariable String id,
            @RequestParam String userId) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id, userId)
        );
    }


    // Mark all notifications as read
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<String> markAllAsRead(
            @PathVariable String userId) {

        notificationService.markAllAsRead(userId);

        return ResponseEntity.ok(
                "All notifications marked as read."
        );
    }


    // Delete notification
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable String id,
            @RequestParam String userId) {

        notificationService.deleteNotification(id, userId);

        return ResponseEntity.ok(
                "Notification deleted successfully."
        );
    }
}