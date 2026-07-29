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

    // Get all notifications for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsForUser(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                notificationService.getNotificationsForUser(userId)
        );
    }

    // Mark a notification as read
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

        return ResponseEntity.ok("All notifications marked as read.");
    }

    // Delete a notification
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable String id,
            @RequestParam String userId) {

        notificationService.deleteNotification(id, userId);

        return ResponseEntity.ok("Notification deleted successfully.");
    }
}