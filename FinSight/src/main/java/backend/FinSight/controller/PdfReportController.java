package backend.FinSight.controller;

import backend.FinSight.service.PdfReportService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ContentDisposition;

import org.springframework.http.HttpHeaders;

import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
public class PdfReportController {

    @Autowired
    private PdfReportService pdfReportService;

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downloadPdf(
            Authentication authentication
    ) throws Exception {

        String userId =
                authentication.getName();

        byte[] pdf =
                pdfReportService
                        .generateReport(userId);

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_PDF
        );

        headers.setContentDisposition(
                ContentDisposition
                        .attachment()
                        .filename(
                                "financial-report.pdf"
                        )
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}
