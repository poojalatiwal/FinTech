package backend.FinSight.controller;

import backend.FinSight.dto.ChatRequest;
import backend.FinSight.dto.ChatResponse;

import backend.FinSight.service.AIChatService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AIChatController {

    @Autowired
    private AIChatService aiChatService;

    @PostMapping("/chat")
    public ChatResponse chat(
            @RequestBody ChatRequest request
    ) {

        return aiChatService.getReply(
                request.getMessage()
        );
    }
}

