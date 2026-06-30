package backend.FinSight.controller;

import backend.FinSight.model.User;
import backend.FinSight.repository.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downloadPdf(
            Authentication authentication
    ) throws Exception {

        String username =
                authentication.getName();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow();

        byte[] pdf =
                pdfReportService.generateReport(
                        user.getId(),
                        user.getUsername()
                );

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

    @GetMapping("/pdf/monthly")
    public ResponseEntity<byte[]> downloadMonthlyPdf(
            Authentication authentication,
            @RequestParam int month,
            @RequestParam int year
    ) throws Exception {

        String username =
                authentication.getName();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow();

        byte[] pdf =
                pdfReportService
                        .generateMonthlyReport(
                                user.getId(),
                                user.getUsername(),
                                year,
                                month
                        );

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_PDF
        );

        headers.setContentDisposition(
                ContentDisposition
                        .attachment()
                        .filename(
                                "monthly-report-" +
                                        month +
                                        "-" +
                                        year +
                                        ".pdf"
                        )
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}
