package backend.FinSight.service;

import backend.FinSight.dto.TranslationResponse;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import org.springframework.stereotype.Service;

import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class TranslationService {

    @Value("${sarvam.api.key}")
    private String apiKey;

    private final WebClient webClient =
            WebClient.builder()
                    .baseUrl("https://api.sarvam.ai")
                    .build();

    public TranslationResponse translate(
            String message,
            String targetLanguage
    ) {

        Map<String, Object> body =
                new HashMap<>();

        body.put("input", message);

        body.put("source_language_code", "en-IN");

        body.put("target_language_code",
                targetLanguage);

        body.put("speaker_gender", "Male");

        body.put("mode", "formal");

        Map response =
                webClient.post()

                        .uri("/translate")

                        .header(
                                HttpHeaders.AUTHORIZATION,
                                "Bearer " + apiKey
                        )

                        .contentType(
                                MediaType.APPLICATION_JSON
                        )

                        .bodyValue(body)

                        .retrieve()

                        .bodyToMono(Map.class)

                        .block();

        String translatedText =
                response.get("translated_text")
                        .toString();

        return new TranslationResponse(
                translatedText
        );
    }
}