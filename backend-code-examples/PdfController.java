package com.graxa.backend.controller;

import com.graxa.backend.service.PdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shows")
@RequiredArgsConstructor
@Tag(name = "PDF", description = "Geração de PDFs de eventos")
@CrossOrigin(origins = "*")
public class PdfController {

    private final PdfService pdfService;

    @GetMapping("/{showId}/pdf")
    @Operation(summary = "Gera PDF com informações do show", 
               description = "Gera um relatório em PDF contendo todas as informações do show, incluindo agenda, logística e colaboradores")
    public ResponseEntity<Resource> gerarPdfShow(@PathVariable Long showId) {
        try {
            byte[] pdfBytes = pdfService.gerarPdfShow(showId);
            
            ByteArrayResource resource = new ByteArrayResource(pdfBytes);
            
            String filename = "evento_" + showId + "_" + System.currentTimeMillis() + ".pdf";
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdfBytes.length)
                    .body(resource);
                    
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
    }
}
