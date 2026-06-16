package backend.FinSight.service;

import backend.FinSight.dto.ChatResponse;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIChatService {

    private final RestTemplate
            restTemplate =
            new RestTemplate();

    public ChatResponse getReply(
            String message
    ) {

        Map<String,String> request =
                new HashMap<>();

        request.put(
                "question",
                message
        );

        Map response =
                restTemplate.postForObject(

                        "http://localhost:8000/chat",

                        request,

                        Map.class
                );

        String answer =
                response.get(
                        "answer"
                ).toString();

        return new ChatResponse(
                answer
        );
    }
}
