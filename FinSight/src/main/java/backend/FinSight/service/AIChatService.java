package backend.FinSight.service;

import backend.FinSight.dto.AIChatRequest;
import backend.FinSight.dto.ChatResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIChatService {

    private final RestTemplate restTemplate =
            new RestTemplate();

    // =====================================
    // Used by ForecastService
    // =====================================
    public ChatResponse getReply(String message) {

        AIChatRequest request = new AIChatRequest();

        request.setUserId("");

        request.setMessage(message);

        ChatResponse response =
                restTemplate.postForObject(
                        "http://localhost:8000/chat",
                        request,
                        ChatResponse.class
                );

        if (response == null) {
            throw new RuntimeException(
                    "No response received from AI service."
            );
        }

        return response;
    }

    // =====================================
    // Used by AI Chat (RAG)
    // =====================================
    public ChatResponse getReply(
            String userId,
            String message
    ) {

        AIChatRequest request = new AIChatRequest();

        request.setUserId(userId);

        request.setMessage(message);

        ChatResponse response =
                restTemplate.postForObject(
                        "http://localhost:8000/chat",
                        request,
                        ChatResponse.class
                );

        if (response == null) {
            throw new RuntimeException(
                    "No response received from AI service."
            );
        }

        return response;
    }
}