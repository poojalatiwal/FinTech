package backend.FinSight.dto;

import lombok.Data;

@Data
public class TranslationRequest {

    private String message;

    // hi-IN, ta-IN, bn-IN etc.
    private String targetLanguage;
}