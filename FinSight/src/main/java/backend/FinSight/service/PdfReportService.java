package backend.FinSight.service;

import backend.FinSight.model.Expense;

import backend.FinSight.repository.ExpenseRepository;

import com.itextpdf.text.Document;

import com.itextpdf.text.Paragraph;

import com.itextpdf.text.pdf.PdfWriter;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

import java.util.List;

@Service
public class PdfReportService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public byte[] generateReport(
            String userId
    ) throws Exception {

        List<Expense> expenses =
                expenseRepository.findByUserId(userId);

        Document document =
                new Document();

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        PdfWriter.getInstance(
                document,
                out
        );

        document.open();

        // TITLE

        document.add(
                new Paragraph(
                        "FinSight Financial Report"
                )
        );

        document.add(
                new Paragraph(
                        " "
                )
        );

        // TOTAL

        double total = 0;

        for (Expense expense : expenses) {

            total += expense.getAmount();
        }

        document.add(
                new Paragraph(
                        "Total Expenses: ₹" + total
                )
        );

        document.add(
                new Paragraph(
                        " "
                )
        );

        // EXPENSE LIST

        document.add(
                new Paragraph(
                        "Expense Details:"
                )
        );

        for (Expense expense : expenses) {

            document.add(
                    new Paragraph(
                            expense.getTitle()
                                    + " | "
                                    + expense.getCategory()
                                    + " | ₹"
                                    + expense.getAmount()
                    )
            );
        }

        document.add(
                new Paragraph(
                        " "
                )
        );

        // AI INSIGHT

        if (total > 50000) {

            document.add(
                    new Paragraph(
                            "AI Insight: Your expenses are very high this month."
                    )
            );

        } else {

            document.add(
                    new Paragraph(
                            "AI Insight: Your spending looks stable."
                    )
            );
        }

        document.close();

        return out.toByteArray();
    }
}