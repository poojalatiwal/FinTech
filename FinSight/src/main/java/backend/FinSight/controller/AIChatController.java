package backend.FinSight.controller;

import backend.FinSight.dto.AIChatRequest;
import backend.FinSight.dto.ChatResponse;
import backend.FinSight.model.User;
import backend.FinSight.repository.UserRepository;
import backend.FinSight.service.AIChatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AIChatController {

    @Autowired
    private AIChatService aiChatService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/chat")
    public ChatResponse chat(
            @RequestBody AIChatRequest request,
            Authentication authentication
    ) {

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return aiChatService.getReply(
                user.getId(),
                request.getMessage()
        );
    }
}