package com.vivitasol.projectbackend.controllers;

import com.vivitasol.projectbackend.entities.Orden;
import com.vivitasol.projectbackend.entities.OrdenItem;
import com.vivitasol.projectbackend.services.OrdenService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/ordenes")
public class BoletaController {

    @Autowired
    private OrdenService ordenService;

    @GetMapping("/{id}/boleta")
    public ResponseEntity<byte[]> generarBoleta(@PathVariable Long id) {
        Orden orden = ordenService.obtenerOrden(id);
        if (orden == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph("Boleta de Compra"));
            document.add(new Paragraph("Orden N°: " + orden.getId()));
            document.add(new Paragraph("Fecha: " + orden.getFecha()));
            document.add(new Paragraph("Cliente: " + (orden.getUsuario() != null ? orden.getUsuario().getNombre() : "")));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Items:"));
            for (OrdenItem item : orden.getItems()) {
                document.add(new Paragraph("- " + item.getProducto().getNombre() + " x" + item.getCantidad() + " = $" + item.getSubtotal()));
            }
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Total: $" + orden.getTotal()));
            document.close();
            byte[] pdfBytes = baos.toByteArray();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=boleta_orden_" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
