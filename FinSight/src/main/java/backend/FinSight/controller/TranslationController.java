package backend.FinSight.controller;

import backend.FinSight.dto.TranslationRequest;
import backend.FinSight.dto.TranslationResponse;

import backend.FinSight.service.TranslationService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/translate")
public class TranslationController {

    @Autowired
    private TranslationService translationService;

    @PostMapping
    public TranslationResponse translate(
            @RequestBody TranslationRequest request
    ) {

        return translationService.translate(
                request.getMessage(),
                request.getTargetLanguage()
        );
    }
}