/**
 * API Routes para Geração de PDFs com Tailwind CSS
 * Exemplo de integração com Express.js
 *
 * Uso em app.js/server.js:
 * import pdfRoutes from './routes/pdf.js';
 * app.use('/api/pdf', pdfRoutes);
 */

import express from "express";
import pdfService from "../services/pdfService.js";
import { pdfTemplateConsolidadoRealTailwind } from "../utils/pdfTemplateRealTailwind.js";

const router = express.Router();

/**
 * POST /api/pdf/consolidado
 * Gera um PDF consolidado com dados do evento
 *
 * Body:
 * {
 *   nomeEvento: string,
 *   descricaoEvento: string,
 *   dataEvento: string,
 *   localEvento: string,
 *   artistas: array,
 *   turnes: array
 * }
 */
router.post("/consolidado", async (req, res) => {
  try {
    const data = req.body;

    // Valida dados obrigatórios
    if (!data.nomeEvento) {
      return res.status(400).json({
        error: "Campo nomeEvento é obrigatório",
      });
    }

    // Gera o template HTML com Tailwind
    const html = pdfTemplateConsolidadoRealTailwind(data);

    // Gera o PDF em buffer
    const pdfBuffer = await pdfService.generatePDFBuffer(html, {
      format: "A4",
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    // Envia o PDF como download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${data.nomeEvento || "relatorio"}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar PDF consolidado:", error);
    res.status(500).json({
      error: "Erro ao gerar PDF",
      message: error.message,
    });
  }
});

/**
 * POST /api/pdf/custom
 * Gera um PDF a partir de HTML customizado
 *
 * Body:
 * {
 *   html: string,
 *   filename: string (opcional)
 * }
 */
router.post("/custom", async (req, res) => {
  try {
    const { html, filename = "documento.pdf" } = req.body;

    if (!html) {
      return res.status(400).json({
        error: "Campo html é obrigatório",
      });
    }

    // Gera o PDF em buffer
    const pdfBuffer = await pdfService.generatePDFBuffer(html, {
      format: "A4",
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    // Envia o PDF como download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar PDF customizado:", error);
    res.status(500).json({
      error: "Erro ao gerar PDF",
      message: error.message,
    });
  }
});

/**
 * GET /api/pdf/preview
 * Retorna preview HTML do PDF (sem gerar PDF)
 * Útil para testes
 */
router.get("/preview", (req, res) => {
  try {
    const testData = {
      nomeEvento: "Evento de Teste",
      descricaoEvento: "Este é um evento de teste para visualização",
      dataEvento: new Date().toLocaleDateString("pt-BR"),
      localEvento: "Local de Teste",
      artistas: [
        { nome: "Artista 1", genero: "Rock", tipo: "Banda", cachê: 5000 },
        { nome: "Artista 2", genero: "Pop", tipo: "Solo", cachê: 4000 },
      ],
      turnes: [
        {
          nome: "Turne 1",
          shows: [
            {
              data: new Date().toISOString(),
              local: "Local 1",
              artistas: ["Artista 1"],
              cachê: 2000,
            },
            {
              data: new Date().toISOString(),
              local: "Local 2",
              artistas: ["Artista 2"],
              cachê: 1500,
            },
          ],
        },
      ],
    };

    const html = pdfTemplateConsolidadoRealTailwind(testData);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error) {
    console.error("Erro ao gerar preview:", error);
    res.status(500).json({
      error: "Erro ao gerar preview",
      message: error.message,
    });
  }
});

/**
 * POST /api/pdf/health
 * Verifica se o serviço de PDF está disponível
 */
router.post("/health", async (req, res) => {
  try {
    // Tenta gerar um PDF simples
    const testHTML = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: sans-serif;">
        <h1>✅ Serviço de PDF Funcionando</h1>
        <p>Gerado em: ${new Date().toLocaleString("pt-BR")}</p>
      </body>
      </html>
    `;

    const buffer = await pdfService.generatePDFBuffer(testHTML);

    res.json({
      status: "ok",
      service: "PDF",
      timestamp: new Date().toISOString(),
      bufferSize: buffer.length,
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      service: "PDF",
      message: error.message,
    });
  }
});

export default router;
