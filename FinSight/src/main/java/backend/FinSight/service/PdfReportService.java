package backend.FinSight.service;

import backend.FinSight.model.Expense;
import backend.FinSight.repository.ExpenseRepository;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.time.Month;

@Service
public class PdfReportService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public byte[] generateReport(String userId, String username)
            throws Exception {
        System.out.println("PDF User = " + userId);
        List<Expense> expenses =
                expenseRepository.findByUserId(userId);

        Document document =
                new Document(PageSize.A4, 40, 40, 40, 40);

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);

        document.open();

        // =========================
        // FONTS
        // =========================

        Font titleFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        24,
                        BaseColor.BLACK
                );

        Font headingFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        16,
                        new BaseColor(0, 102, 204)
                );

        Font normalFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA,
                        11
                );

        Font boldFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        12
                );

        // =========================
        // HEADER
        // =========================

        Paragraph title =
                new Paragraph(
                        "FinSight Financial Report",
                        titleFont
                );

        title.setAlignment(Element.ALIGN_CENTER);

        document.add(title);

        Paragraph subTitle =
                new Paragraph(
                        "AI Powered Financial Intelligence",
                        normalFont
                );

        subTitle.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(subTitle);

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "Generated On: "
                                + LocalDate.now(),
                        boldFont
                )
        );

        document.add(
                new Paragraph(
                        "User: " + username,
                        boldFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        // =========================
        // TOTAL SUMMARY
        // =========================

        double totalExpense = 0;

        for (Expense expense : expenses) {
            totalExpense += expense.getAmount();
        }

        document.add(
                new Paragraph(
                        "Financial Summary",
                        headingFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        PdfPTable summaryTable =
                new PdfPTable(2);

        summaryTable.setWidthPercentage(100);

        summaryTable.addCell("Metric");
        summaryTable.addCell("Value");

        summaryTable.addCell("Total Expenses");
        summaryTable.addCell(
                "₹" + totalExpense
        );

        summaryTable.addCell(
                "Total Transactions"
        );

        summaryTable.addCell(
                String.valueOf(expenses.size())
        );

        document.add(summaryTable);

        document.add(
                new Paragraph(" ")
        );

        // =========================
        // EXPENSE DETAILS
        // =========================

        document.add(
                new Paragraph(
                        "Expense Details",
                        headingFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        PdfPTable expenseTable =
                new PdfPTable(4);

        expenseTable.setWidthPercentage(100);

        expenseTable.setWidths(
                new float[]{
                        4, 3, 2, 3
                }
        );

        PdfPCell cell;

        cell = new PdfPCell(
                new Phrase("Title")
        );
        expenseTable.addCell(cell);

        cell = new PdfPCell(
                new Phrase("Category")
        );
        expenseTable.addCell(cell);

        cell = new PdfPCell(
                new Phrase("Amount")
        );
        expenseTable.addCell(cell);

        cell = new PdfPCell(
                new Phrase("Date")
        );
        expenseTable.addCell(cell);
        for (Expense expense : expenses) {

            expenseTable.addCell(
                    expense.getTitle()
            );

            expenseTable.addCell(
                    expense.getCategory()
            );

            expenseTable.addCell(
                    "₹" + expense.getAmount()
            );

            expenseTable.addCell(
                    expense.getDate() != null
                            ? expense.getDate().toString()
                            : "-"
            );
        }

        document.add(expenseTable);

        document.add(
                new Paragraph(" ")
        );

        // =========================
        // AI INSIGHT
        // =========================

        document.add(
                new Paragraph(
                        "AI Insights",
                        headingFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        String insight;

        if (totalExpense > 50000) {

            insight =
                    "Your spending is significantly high this month. Consider reducing discretionary expenses and reviewing large transactions.";

        } else if (totalExpense > 25000) {

            insight =
                    "Your spending is moderate and under control. Continue monitoring category-wise expenses.";

        } else {

            insight =
                    "Excellent financial discipline. Your spending remains healthy and sustainable.";
        }

        PdfPTable insightTable =
                new PdfPTable(1);

        insightTable.setWidthPercentage(100);

        PdfPCell insightCell =
                new PdfPCell(
                        new Phrase(insight)
                );

        insightCell.setPadding(12);

        insightCell.setBackgroundColor(
                new BaseColor(
                        230,
                        245,
                        255
                )
        );

        insightTable.addCell(
                insightCell
        );

        document.add(
                insightTable
        );

        document.add(
                new Paragraph(" ")
        );

        // =========================
        // RECOMMENDATIONS
        // =========================

        document.add(
                new Paragraph(
                        "Recommendations",
                        headingFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "• Track expenses regularly.",
                        normalFont
                )
        );

        document.add(
                new Paragraph(
                        "• Maintain an emergency fund.",
                        normalFont
                )
        );

        document.add(
                new Paragraph(
                        "• Increase investments whenever possible.",
                        normalFont
                )
        );

        document.add(
                new Paragraph(
                        "• Follow category-wise budgets.",
                        normalFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        // =========================
        // FOOTER
        // =========================

        Paragraph footer =
                new Paragraph(
                        "Generated by FinSight • AI Financial Intelligence",
                        FontFactory.getFont(
                                FontFactory.HELVETICA_OBLIQUE,
                                10,
                                BaseColor.GRAY
                        )
                );

        footer.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(footer);

        document.close();

        return out.toByteArray();
    }

    public byte[] generateMonthlyReport(
            String userId,
            String username,
            int year,
            int month
    ) throws Exception {

        LocalDate start =
                LocalDate.of(
                        year,
                        month,
                        1
                );

        LocalDate end =
                start.withDayOfMonth(
                        start.lengthOfMonth()
                );

        List<Expense> expenses =
                expenseRepository
                        .findByUserIdAndDateBetween(
                                userId,
                                start,
                                end
                        );

        System.out.println(
                "Monthly Expenses Found = "
                        + expenses.size()
        );

        return generateReportFromExpenses(
                expenses,
                username,
                month,
                year
        );
    }

    private byte[] generateReportFromExpenses(
            List<Expense> expenses,
            String username,
            int month,
            int year
    ) throws Exception {
        Document document =
                new Document(
                        PageSize.A4,
                        40,
                        40,
                        40,
                        40
                );

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        PdfWriter.getInstance(
                document,
                out
        );
        document.open();

        // =========================
        // FONTS
        // =========================

        Font titleFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        24,
                        BaseColor.BLACK
                );

        Font headingFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        16,
                        new BaseColor(0, 102, 204)
                );

        Font normalFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA,
                        11
                );

        Font boldFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        12
                );

        // =========================
        // HEADER
        // =========================

        String reportTitle =
                "FinSight Monthly Report - "
                        + Month.of(month)
                        .name()
                        + " "
                        + year;

        Paragraph title =
                new Paragraph(
                        reportTitle,
                        titleFont
                );

        title.setAlignment(Element.ALIGN_CENTER);

        document.add(title);

        Paragraph subTitle =
                new Paragraph(
                        "AI Powered Financial Intelligence",
                        normalFont
                );

        subTitle.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(subTitle);

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "Generated On: "
                                + LocalDate.now(),
                        boldFont
                )
        );

        document.add(
                new Paragraph(
                        "User: " + username,
                        boldFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        // =========================
        // TOTAL SUMMARY
        // =========================

        double totalExpense = 0;

        for (Expense expense : expenses) {
            totalExpense += expense.getAmount();
        }

        document.add(
                new Paragraph(
                        "Financial Summary",
                        headingFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        PdfPTable summaryTable =
                new PdfPTable(2);

        summaryTable.setWidthPercentage(100);

        summaryTable.addCell("Metric");
        summaryTable.addCell("Value");

        summaryTable.addCell("Total Expenses");
        summaryTable.addCell(
                "₹" + totalExpense
        );

        summaryTable.addCell(
                "Total Transactions"
        );

        summaryTable.addCell(
                String.valueOf(expenses.size())
        );

        document.add(summaryTable);

        document.add(
                new Paragraph(" ")
        );

        // =========================
        // EXPENSE DETAILS
        // =========================

        document.add(
                new Paragraph(
                        "Expense Details",
                        headingFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        PdfPTable expenseTable =
                new PdfPTable(4);

        expenseTable.setWidthPercentage(100);

        expenseTable.setWidths(
                new float[]{
                        4, 3, 2, 3
                }
        );

        PdfPCell cell;

        cell = new PdfPCell(
                new Phrase("Title")
        );
        expenseTable.addCell(cell);

        cell = new PdfPCell(
                new Phrase("Category")
        );
        expenseTable.addCell(cell);

        cell = new PdfPCell(
                new Phrase("Amount")
        );
        expenseTable.addCell(cell);

        cell = new PdfPCell(
                new Phrase("Date")
        );
        expenseTable.addCell(cell);
        for (Expense expense : expenses) {

            expenseTable.addCell(
                    expense.getTitle()
            );

            expenseTable.addCell(
                    expense.getCategory()
            );

            expenseTable.addCell(
                    "₹" + expense.getAmount()
            );

            expenseTable.addCell(
                    expense.getDate() != null
                            ? expense.getDate().toString()
                            : "-"
            );
        }

        document.add(expenseTable);

        document.add(
                new Paragraph(" ")
        );

        // =========================
        // AI INSIGHT
        // =========================

        document.add(
                new Paragraph(
                        "AI Insights",
                        headingFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        String insight;

        if (totalExpense > 50000) {

            insight =
                    "Your spending is significantly high this month. Consider reducing discretionary expenses and reviewing large transactions.";

        } else if (totalExpense > 25000) {

            insight =
                    "Your spending is moderate and under control. Continue monitoring category-wise expenses.";

        } else {

            insight =
                    "Excellent financial discipline. Your spending remains healthy and sustainable.";
        }

        PdfPTable insightTable =
                new PdfPTable(1);

        insightTable.setWidthPercentage(100);

        PdfPCell insightCell =
                new PdfPCell(
                        new Phrase(insight)
                );

        insightCell.setPadding(12);

        insightCell.setBackgroundColor(
                new BaseColor(
                        230,
                        245,
                        255
                )
        );

        insightTable.addCell(
                insightCell
        );

        document.add(
                insightTable
        );

        document.add(
                new Paragraph(" ")
        );

        // =========================
        // RECOMMENDATIONS
        // =========================

        document.add(
                new Paragraph(
                        "Recommendations",
                        headingFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        document.add(
                new Paragraph(
                        "• Track expenses regularly.",
                        normalFont
                )
        );

        document.add(
                new Paragraph(
                        "• Maintain an emergency fund.",
                        normalFont
                )
        );

        document.add(
                new Paragraph(
                        "• Increase investments whenever possible.",
                        normalFont
                )
        );

        document.add(
                new Paragraph(
                        "• Follow category-wise budgets.",
                        normalFont
                )
        );

        document.add(
                new Paragraph(" ")
        );

        // =========================
        // FOOTER
        // =========================

        Paragraph footer =
                new Paragraph(
                        "Generated by FinSight • AI Financial Intelligence",
                        FontFactory.getFont(
                                FontFactory.HELVETICA_OBLIQUE,
                                10,
                                BaseColor.GRAY
                        )
                );

        footer.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(footer);

        document.close();

        return out.toByteArray();
    }
}

