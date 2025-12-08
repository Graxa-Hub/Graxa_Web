package com.graxa.backend.service;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * Serviço para geração de PDFs usando Puppeteer (Node.js)
 * 
 * IMPORTANTE: Este serviço requer que você tenha um script Node.js separado
 * rodando que recebe HTML e retorna PDF.
 * 
 * Alternativa 1: Usar biblioteca Java como Flying Saucer, OpenPDF ou iText
 * Alternativa 2: Usar um microsserviço Node.js com Puppeteer
 * Alternativa 3: Usar uma API externa como PDFShift, DocRaptor, etc.
 */
@Service
@Slf4j
public class PdfGeneratorService {

    private final MustacheFactory mustacheFactory = new DefaultMustacheFactory();

    /**
     * Gera PDF a partir de um template HTML com dados dinâmicos
     * 
     * @param templateName Nome do arquivo de template (ex:
     *                     "template-pdf-evento.html")
     * @param dados        Map com os dados para preencher o template
     * @return Array de bytes do PDF gerado
     */
    public byte[] gerarPdfDeTemplate(String templateName, Map<String, Object> dados) throws IOException {
        // 1. Carregar e processar o template HTML
        String htmlProcessado = processarTemplate(templateName, dados);

        // 2. Converter HTML para PDF
        return converterHtmlParaPdf(htmlProcessado);
    }

    /**
     * Processa o template HTML substituindo variáveis pelos dados
     */
    private String processarTemplate(String templateName, Map<String, Object> dados) throws IOException {
        try {
            // Carregar template do classpath (resources)
            ClassPathResource resource = new ClassPathResource("templates/" + templateName);

            try (InputStreamReader reader = new InputStreamReader(
                    resource.getInputStream(), StandardCharsets.UTF_8)) {

                Mustache mustache = mustacheFactory.compile(reader, templateName);

                StringWriter writer = new StringWriter();
                mustache.execute(writer, dados);
                writer.flush();

                return writer.toString();
            }

        } catch (Exception e) {
            log.error("Erro ao processar template: {}", templateName, e);
            throw new IOException("Erro ao processar template HTML", e);
        }
    }

    /**
     * Converte HTML para PDF usando Puppeteer via Node.js
     * 
     * OPÇÃO 1: Chamar script Node.js via ProcessBuilder
     */
    private byte[] converterHtmlParaPdf(String html) throws IOException {
        try {
            // Salvar HTML temporário
            File tempHtmlFile = File.createTempFile("evento_", ".html");
            File tempPdfFile = File.createTempFile("evento_", ".pdf");

            try (FileWriter writer = new FileWriter(tempHtmlFile, StandardCharsets.UTF_8)) {
                writer.write(html);
            }

            // Chamar script Node.js com Puppeteer
            // IMPORTANTE: Você precisa ter o Node.js e o script instalados
            String scriptPath = "scripts/generate-pdf.js"; // Caminho para o script

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "node",
                    scriptPath,
                    tempHtmlFile.getAbsolutePath(),
                    tempPdfFile.getAbsolutePath());

            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // Ler saída do processo
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.debug("Puppeteer: {}", line);
                }
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new IOException("Erro ao gerar PDF. Exit code: " + exitCode);
            }

            // Ler PDF gerado
            byte[] pdfBytes;
            try (FileInputStream fis = new FileInputStream(tempPdfFile)) {
                pdfBytes = fis.readAllBytes();
            }

            // Limpar arquivos temporários
            tempHtmlFile.delete();
            tempPdfFile.delete();

            return pdfBytes;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Processo de geração de PDF foi interrompido", e);
        } catch (Exception e) {
            log.error("Erro ao converter HTML para PDF", e);
            throw new IOException("Erro ao gerar PDF", e);
        }
    }

    /**
     * ALTERNATIVA: Usando biblioteca Java pura (sem Puppeteer)
     * 
     * Adicione ao pom.xml:
     * <dependency>
     * <groupId>org.xhtmlrenderer</groupId>
     * <artifactId>flying-saucer-pdf</artifactId>
     * <version>9.1.22</version>
     * </dependency>
     */
    /*
     * private byte[] converterHtmlParaPdfJava(String html) throws IOException {
     * try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
     * ITextRenderer renderer = new ITextRenderer();
     * renderer.setDocumentFromString(html);
     * renderer.layout();
     * renderer.createPDF(outputStream);
     * return outputStream.toByteArray();
     * } catch (Exception e) {
     * log.error("Erro ao converter HTML para PDF usando Flying Saucer", e);
     * throw new IOException("Erro ao gerar PDF", e);
     * }
     * }
     */
}
