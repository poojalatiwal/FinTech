package backend.FinSight.service;

import backend.FinSight.model.Notification;

import backend.FinSight.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository
            notificationRepository;

    // CREATE NOTIFICATION

    public void createNotification(
            String userId,
            String message
    ) {

        Notification notification =
                new Notification();

        notification.setUserId(userId);

        notification.setMessage(message);

        notification.setRead(false);

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        notificationRepository.save(
                notification
        );
    }

    // GET USER NOTIFICATIONS

    public List<Notification>
    getNotifications(
            String userId
    ) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );
    }
}
