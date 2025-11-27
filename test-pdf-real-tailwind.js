/**
 * Teste do Template Consolidado com Tailwind CSS Real
 */

import { pdfTemplateConsolidadoRealTailwind } from "./src/utils/pdfTemplateRealTailwind.js";
import pdfService from "./src/services/pdfService.js";

// Dados de teste
const testData = {
  nomeEvento: "Festival de Música - Verão 2024",
  descricaoEvento:
    "Um festival de música incrível com os melhores artistas do Brasil. Uma experiência única com múltiplas atrações e shows ao vivo.",
  dataEvento: "2024-12-15",
  localEvento: "Estádio Municipal de São Paulo",
  dataGerador: new Date().toLocaleDateString("pt-BR"),

  artistas: [
    { nome: "Artist A", genero: "Rock", tipo: "Banda", cachê: 15000 },
    { nome: "Artist B", genero: "Pop", tipo: "Solo", cachê: 12000 },
    { nome: "Artist C", genero: "Sertanejo", tipo: "Dupla", cachê: 18000 },
    { nome: "Artist D", genero: "Eletrônico", tipo: "DJ", cachê: 10000 },
    { nome: "Artist E", genero: "Funk", tipo: "Grupo", cachê: 11000 },
  ],

  turnes: [
    {
      nome: "Turne 1 - Vale do Paraíba",
      shows: [
        {
          data: "2024-12-01",
          local: "São José dos Campos",
          artistas: ["Artist A", "Artist B"],
          cachê: 5000,
        },
        {
          data: "2024-12-02",
          local: "Jacareí",
          artistas: ["Artist C"],
          cachê: 4000,
        },
        {
          data: "2024-12-03",
          local: "Taubaté",
          artistas: ["Artist D", "Artist E"],
          cachê: 4500,
        },
      ],
    },
    {
      nome: "Turne 2 - Litoral",
      shows: [
        {
          data: "2024-12-08",
          local: "Santos",
          artistas: ["Artist A", "Artist C"],
          cachê: 6000,
        },
        {
          data: "2024-12-09",
          local: "Praia Grande",
          artistas: ["Artist B", "Artist D"],
          cachê: 5500,
        },
        {
          data: "2024-12-10",
          local: "Guarujá",
          artistas: ["Artist E"],
          cachê: 4000,
        },
      ],
    },
  ],
};

async function testRealTailwindPDF() {
  try {
    console.log("🎨 Testando Template com Tailwind CSS Real...\n");

    // Gera o template HTML
    const html = pdfTemplateConsolidadoRealTailwind(testData);

    // Verifica se o HTML contém classes Tailwind
    const hasTailwindClasses =
      /class="[^"]*\b(flex|grid|px-|py-|bg-|text-|border|rounded)\b[^"]*"/.test(
        html
      );
    console.log(`✓ HTML gerado com sucesso`);
    console.log(
      `✓ Classes Tailwind presentes: ${hasTailwindClasses ? "Sim" : "Não"}`
    );
    console.log(`✓ Tamanho do HTML: ${(html.length / 1024).toFixed(2)} KB\n`);

    // Gera o PDF
    console.log("📄 Gerando PDF com Tailwind CSS...");
    const pdfPath = await pdfService.generatePDF(html, {
      filename: "relatorio-tailwind-real.pdf",
      format: "A4",
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    console.log(`\n✅ PDF com Tailwind CSS Real gerado com sucesso!`);
    console.log(`📍 Local: ${pdfPath}`);

    return true;
  } catch (error) {
    console.error("\n❌ Erro ao testar Template com Tailwind CSS Real:");
    console.error(error.message);
    return false;
  }
}

// Executa o teste
testRealTailwindPDF().then((success) => {
  process.exit(success ? 0 : 1);
});
