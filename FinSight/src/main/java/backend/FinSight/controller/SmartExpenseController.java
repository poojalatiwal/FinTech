package backend.FinSight.controller;

import backend.FinSight.dto.SmartExpenseResponse;

import backend.FinSight.service.SmartExpenseService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.MediaType;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/smart-expense")
public class SmartExpenseController {

    @Autowired
    private SmartExpenseService smartExpenseService;

    // VOICE

    @PostMapping(
            value = "/voice",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public SmartExpenseResponse processVoice(
            @RequestParam("file")
            MultipartFile file
    ) throws Exception {

        return smartExpenseService
                .processVoice(file);
    }

    // OCR IMAGE

    @PostMapping(
            value = "/scan",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public SmartExpenseResponse processImage(
            @RequestParam("file")
            MultipartFile file
    ) throws Exception {

        return smartExpenseService
                .processImage(file);
    }
}