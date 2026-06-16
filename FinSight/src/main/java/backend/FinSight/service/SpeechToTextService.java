package backend.FinSight.service;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.core.io.FileSystemResource;

import org.springframework.http.MediaType;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.reactive.function.BodyInserters;

import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
public class SpeechToTextService {

    @Value("${sarvam.api.key}")
    private String apiKey;

    private final WebClient webClient =
            WebClient.builder()
                    .baseUrl("https://api.sarvam.ai")
                    .build();

    public String transcribeAudio(
            MultipartFile audioFile
    ) throws IOException {

        File tempFile =
                File.createTempFile(
                        "audio",
                        audioFile.getOriginalFilename()
                );

        audioFile.transferTo(tempFile);

        Map response =
                webClient.post()
                        .uri("/speech-to-text")
                        .header(
                                "api-subscription-key",
                                apiKey
                        )
                        .contentType(
                                MediaType.MULTIPART_FORM_DATA
                        )
                        .body(
                                BodyInserters
                                        .fromMultipartData(
                                                "file",
                                                new FileSystemResource(
                                                        tempFile
                                                )
                                        )
                        )
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();
        tempFile.delete();

        return response.get("transcript")
                .toString();
    }
}