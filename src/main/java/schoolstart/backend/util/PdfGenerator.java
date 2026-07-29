package schoolstart.backend.util;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import schoolstart.backend.entity.AdmissionModel;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

public class PdfGenerator {

    private PdfGenerator() {
    }

    public static byte[] generate(AdmissionModel admission) {

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {

            Document document = new Document(PageSize.A4, 40, 40, 50, 50);

            PdfWriter.getInstance(document, outputStream);

            document.open();

            // Fonts
            Font schoolFont = new Font(Font.HELVETICA, 22, Font.BOLD, new Color(0, 70, 140));
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font headingFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 12);

            // School Name
            Paragraph school = new Paragraph(admission.getSchoolName(), schoolFont);
            school.setAlignment(Element.ALIGN_CENTER);
            document.add(school);

            Paragraph subtitle = new Paragraph("Grade 1 School Admission System", normalFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);

            document.add(new Paragraph(" "));

            // Title
            Paragraph title = new Paragraph("ADMISSION LETTER", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(" "));

            // Admission Details Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{35, 65});

            addCell(table, "Student Name", headingFont);
            addCell(table, admission.getStudentName(), normalFont);

            addCell(table, "Application ID", headingFont);
            addCell(table, admission.getApplicationId(), normalFont);

            addCell(table, "Admission Number", headingFont);
            addCell(table, admission.getAdmissionNumber(), normalFont);

            addCell(table, "Admission Date", headingFont);
            addCell(table,
                    admission.getAdmissionDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                    normalFont);

            addCell(table, "Status", headingFont);
            addCell(table, admission.getStatus(), normalFont);

            addCell(table, "Fee Status", headingFont);
            addCell(table, admission.getFeeStatus(), normalFont);

            document.add(table);

            document.add(new Paragraph(" "));

            Paragraph message = new Paragraph(
                    "Dear Parent / Guardian,\n\n"
                            + "Congratulations!\n\n"
                            + "We are pleased to inform you that your child has been "
                            + "selected for admission to Grade 1.\n\n"
                            + "Please bring this admission letter together with all "
                            + "required original documents on the admission date.\n\n"
                            + "We warmly welcome your child to our school.",
                    normalFont);

            message.setAlignment(Element.ALIGN_JUSTIFIED);

            document.add(message);

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            Paragraph sign = new Paragraph(
                    "________________________\n"
                            + "Principal\n"
                            + admission.getSchoolName(),
                    headingFont);

            sign.setAlignment(Element.ALIGN_RIGHT);

            document.add(sign);

            document.add(new Paragraph(" "));

            Paragraph footer = new Paragraph(
                    "This is a computer generated admission letter.",
                    new Font(Font.HELVETICA, 10));

            footer.setAlignment(Element.ALIGN_CENTER);

            document.add(footer);

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }

        return outputStream.toByteArray();
    }

    private static void addCell(PdfPTable table, String value, Font font) {

        PdfPCell cell = new PdfPCell(new Phrase(value, font));

        cell.setPadding(8);

        table.addCell(cell);
    }
}