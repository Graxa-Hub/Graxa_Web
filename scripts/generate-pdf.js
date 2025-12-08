/**
 * Script Node.js para gerar PDF usando Puppeteer
 * 
 * Instalação:
 * cd scripts
 * npm install puppeteer
 * 
 * Uso:
 * node generate-pdf.js <caminho-html-entrada> <caminho-pdf-saida>
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF(htmlPath, pdfPath) {
    let browser;

    try {
        console.log('🚀 Iniciando Puppeteer...');

        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        });

        console.log('📄 Abrindo página...');
        const page = await browser.newPage();

        // Ler o HTML
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // Definir o conteúdo HTML
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        console.log('🎨 Gerando PDF...');

        // Gerar PDF
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            },
            preferCSSPageSize: false
        });

        console.log('✅ PDF gerado com sucesso:', pdfPath);

    } catch (error) {
        console.error('❌ Erro ao gerar PDF:', error);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Verificar argumentos
if (process.argv.length < 4) {
    console.error('❌ Uso: node generate-pdf.js <html-input> <pdf-output>');
    process.exit(1);
}

const htmlPath = process.argv[2];
const pdfPath = process.argv[3];

// Verificar se o arquivo HTML existe
if (!fs.existsSync(htmlPath)) {
    console.error('❌ Arquivo HTML não encontrado:', htmlPath);
    process.exit(1);
}

// Criar diretório de saída se não existir
const outputDir = path.dirname(pdfPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Executar
generatePDF(htmlPath, pdfPath)
    .then(() => {
        console.log('🎉 Processo concluído com sucesso!');
        process.exit(0);
    })
    .catch(error => {
        console.error('💥 Erro fatal:', error);
        process.exit(1);
    });
