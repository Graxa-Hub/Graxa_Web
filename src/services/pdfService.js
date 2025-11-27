import puppeteer from "puppeteer";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Serviço para gerar PDFs a partir de conteúdo HTML
 * Utiliza Puppeteer para converter HTML em PDF
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFService {
  constructor() {
    this.browser = null;
  }

  /**
   * Inicializa o Puppeteer (chamado uma vez)
   */
  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
    return this.browser;
  }

  /**
   * Gera um PDF a partir de conteúdo HTML
   * @param {string} htmlContent - Conteúdo HTML para converter
   * @param {object} options - Opções de configuração
   * @param {string} options.filename - Nome do arquivo (padrão: "documento.pdf")
   * @param {string} options.format - Formato da página (A4, Letter, etc)
   * @param {boolean} options.displayHeaderFooter - Mostrar cabeçalho/rodapé
   * @param {string} options.headerTemplate - Template do cabeçalho
   * @param {string} options.footerTemplate - Template do rodapé
   * @param {string} options.savePath - Caminho para salvar (padrão: Downloads)
   * @returns {string} Caminho completo do arquivo gerado
   */
  async generatePDF(htmlContent, options = {}) {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();

      // Configurações padrão
      const {
        filename = "documento.pdf",
        format = "A4",
        displayHeaderFooter = false,
        headerTemplate = "",
        footerTemplate = "",
        savePath = null,
        margin = { top: 20, right: 20, bottom: 20, left: 20 },
      } = options;

      // Define o caminho de salvamento
      const downloadPath = savePath || path.join(os.homedir(), "Downloads");

      // Cria a pasta se não existir
      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
      }

      const filePath = path.join(downloadPath, filename);

      // Define o conteúdo HTML na página
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      // Gera o PDF
      const pdfOptions = {
        path: filePath,
        format,
        displayHeaderFooter,
        margin,
      };

      if (displayHeaderFooter) {
        pdfOptions.headerTemplate = headerTemplate;
        pdfOptions.footerTemplate = footerTemplate;
      }

      await page.pdf(pdfOptions);
      await page.close();

      console.log("✅ PDF gerado com sucesso em:", filePath);
      return filePath;
    } catch (error) {
      console.error("❌ Erro ao gerar PDF:", error);
      throw error;
    }
  }

  /**
   * Gera um PDF a partir de uma URL
   * @param {string} url - URL da página
   * @param {object} options - Opções de configuração (mesmas que generatePDF)
   * @returns {string} Caminho completo do arquivo gerado
   */
  async generatePDFFromURL(url, options = {}) {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();

      const {
        filename = "documento.pdf",
        format = "A4",
        savePath = null,
      } = options;

      const downloadPath = savePath || path.join(os.homedir(), "Downloads");

      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
      }

      const filePath = path.join(downloadPath, filename);

      await page.goto(url, { waitUntil: "networkidle0" });
      await page.pdf({ path: filePath, format });
      await page.close();

      console.log("✅ PDF gerado com sucesso em:", filePath);
      return filePath;
    } catch (error) {
      console.error("❌ Erro ao gerar PDF:", error);
      throw error;
    }
  }

  /**
   * Gera um PDF em buffer (para enviar como download)
   * @param {string} htmlContent - Conteúdo HTML
   * @param {object} options - Opções de configuração
   * @returns {Buffer} Buffer do PDF
   */
  async generatePDFBuffer(htmlContent, options = {}) {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();

      const {
        format = "A4",
        displayHeaderFooter = false,
        headerTemplate = "",
        footerTemplate = "",
        margin = { top: 20, right: 20, bottom: 20, left: 20 },
      } = options;

      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      const pdfOptions = {
        format,
        displayHeaderFooter,
        margin,
      };

      if (displayHeaderFooter) {
        pdfOptions.headerTemplate = headerTemplate;
        pdfOptions.footerTemplate = footerTemplate;
      }

      const pdfBuffer = await page.pdf(pdfOptions);
      await page.close();

      return pdfBuffer;
    } catch (error) {
      console.error("❌ Erro ao gerar PDF em buffer:", error);
      throw error;
    }
  }

  /**
   * Fecha o navegador
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export default new PDFService();
