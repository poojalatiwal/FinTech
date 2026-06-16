package backend.FinSight.service;

import backend.FinSight.dto.SmartExpenseResponse;

import backend.FinSight.service.OcrService;
import backend.FinSight.service.SpeechToTextService;
import backend.FinSight.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SmartExpenseService {

    @Autowired
    private SpeechToTextService speechToTextService;

    @Autowired
    private OcrService ocrService;

    @Autowired
    private TranslationService translationService;

    // VOICE PROCESSING
    public SmartExpenseResponse processVoice(
            MultipartFile file
    ) throws Exception {

        String text =
                speechToTextService
                        .transcribeAudio(file);

        return analyzeExpense(
                text,
                "VOICE"
        );
    }

    // OCR IMAGE PROCESSING

    public SmartExpenseResponse processImage(
            MultipartFile file
    ) throws Exception {

        String text =
                ocrService.extractText(file);

        return analyzeExpense(
                text,
                "OCR"
        );
    }

    // COMMON ANALYSIS LOGIC
    private SmartExpenseResponse analyzeExpense(
            String text,
            String type
    ) {

        // NULL SAFETY

        if (text == null || text.isBlank()) {

            text = "";
        }

        String lowerText =
                text.toLowerCase();

        // CATEGORY DETECTION

        String category = "Other";

        if (lowerText.contains("food")
                || lowerText.contains("restaurant")
                || lowerText.contains("pizza")
                || lowerText.contains("burger")) {

            category = "Food";

        } else if (lowerText.contains("travel")
                || lowerText.contains("uber")
                || lowerText.contains("taxi")
                || lowerText.contains("flight")) {

            category = "Travel";

        } else if (lowerText.contains("shopping")
                || lowerText.contains("amazon")
                || lowerText.contains("mall")) {

            category = "Shopping";

        } else if (lowerText.contains("medical")
                || lowerText.contains("hospital")
                || lowerText.contains("medicine")) {

            category = "Medical";
        }

        // AMOUNT EXTRACTION

        double amount = 0;

        try {

            Pattern pattern =
                    Pattern.compile("\\d+(\\.\\d+)?");

            Matcher matcher =
                    pattern.matcher(text);

            if (matcher.find()) {

                amount =
                        Double.parseDouble(
                                matcher.group()
                        );
            }

        } catch (Exception e) {

            amount = 0;
        }

        // AI INSIGHT

        String insight;

        if (amount > 5000) {

            insight =
                    "You are overspending on "
                            + category + ".";

        } else if (amount > 2000) {

            insight =
                    "Your spending on "
                            + category
                            + " is moderate.";

        } else {

            insight =
                    "Your spending looks normal.";
        }

        // TRANSLATION

        String translatedInsight;

        try {

            translatedInsight =
                    translationService.translate(
                            insight,
                            "hi-IN"
                    ).getTranslatedText();

        } catch (Exception e) {

            translatedInsight =
                    insight;
        }

        // RESPONSE

        return new SmartExpenseResponse(
                type,
                "Expense Detected",
                amount,
                category,
                insight,
                translatedInsight
        );
    }
}
