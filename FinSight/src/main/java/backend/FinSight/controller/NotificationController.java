package backend.FinSight.controller;

import backend.FinSight.model.Notification;

import backend.FinSight.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService
            notificationService;

    @GetMapping
    public List<Notification>
    getNotifications(
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return notificationService
                .getNotifications(userId);
    }
}

