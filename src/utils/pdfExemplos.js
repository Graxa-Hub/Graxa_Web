/**
 * Exemplos de uso do PDFService
 * Estes são exemplos que você pode usar em seu código
 */

import pdfService from "@/services/pdfService";
import { templatoPDF } from "@/utils/pdfTemplates";

/**
 * Exemplo 1: Gerar PDF simples com dados
 */
export async function exemplo1_RelatorioSimples() {
  try {
    const dados = {
      titulo: "Relatório de Vendas",
      subtitulo: "Período: Janeiro 2025",
      informacoes: {
        Vendedor: "João Silva",
        Email: "joao@email.com",
        Telefone: "(11) 9999-9999",
        "Total de Vendas": "R$ 15.000,00",
        Comissão: "R$ 1.500,00",
      },
      conteudoExtra: "<p>Vendas realizadas com sucesso durante o período.</p>",
    };

    const html = templatoPDF.relatorioSimples(dados);
    const caminho = await pdfService.generatePDF(html, {
      filename: "relatorio-vendas.pdf",
    });

    console.log("✅ PDF criado:", caminho);
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

/**
 * Exemplo 2: Gerar PDF de Evento com artistas
 */
export async function exemplo2_RelatorioEvento() {
  try {
    const evento = {
      nome: "Festival de Rock 2025",
      descricao: "Um festival incrível com as melhores bandas",
      data: "15 de Março de 2025",
      horario: "19:00",
      local: "Arena São Paulo",
      capacidade: 5000,
      artistas: [
        { nome: "The Strokes", genero: "Rock", horario: "19:30" },
        { nome: "Arctic Monkeys", genero: "Indie Rock", horario: "20:45" },
        { nome: "Foo Fighters", genero: "Alternative Rock", horario: "22:00" },
      ],
      observacoes:
        "Evento sujeito a mudanças. Segue o evento no Instagram para atualizações.",
    };

    const html = templatoPDF.relatorioEvento(evento);
    const caminho = await pdfService.generatePDF(html, {
      filename: "evento-festival-rock.pdf",
    });

    console.log("✅ PDF do evento criado:", caminho);
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

/**
 * Exemplo 3: Gerar PDF de Turné
 */
export async function exemplo3_RelatorioTurne() {
  try {
    const turne = {
      nome: "Tour Nacional 2025",
      artista: "Banda X",
      dataInicio: "10/03/2025",
      dataFim: "30/04/2025",
      shows: [
        {
          data: "10/03/2025",
          local: "Espaço das Américas",
          cidade: "São Paulo",
          horario: "21:00",
        },
        {
          data: "15/03/2025",
          local: "Mineirão",
          cidade: "Belo Horizonte",
          horario: "20:30",
        },
        {
          data: "22/03/2025",
          local: "Marina Hall",
          cidade: "Rio de Janeiro",
          horario: "21:30",
        },
      ],
    };

    const html = templatoPDF.relatorioTurne(turne);
    const caminho = await pdfService.generatePDF(html, {
      filename: "turne-banda-x.pdf",
    });

    console.log("✅ PDF da turné criado:", caminho);
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

/**
 * Exemplo 4: Gerar PDF com HTML customizado
 */
export async function exemplo4_HTMLCustomizado() {
  try {
    const htmlCustomizado = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Meu PDF Customizado</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #ff3f22; }
          .destaque { background-color: #fff3cd; padding: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Documento Customizado</h1>
        <div class="destaque">
          <p>Este é um exemplo de HTML completamente customizado!</p>
          <p>Você pode incluir qualquer HTML válido aqui.</p>
        </div>
      </body>
      </html>
    `;

    const caminho = await pdfService.generatePDF(htmlCustomizado, {
      filename: "custom-document.pdf",
    });

    console.log("✅ PDF customizado criado:", caminho);
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

/**
 * Exemplo 5: Gerar PDF como buffer (para download no navegador)
 */
export async function exemplo5_PDFBuffer() {
  try {
    const dados = {
      titulo: "Documento para Download",
      informacoes: {
        Usuário: "Maria Silva",
        Data: new Date().toLocaleDateString("pt-BR"),
      },
    };

    const html = templatoPDF.relatorioSimples(dados);
    const pdfBuffer = await pdfService.generatePDFBuffer(html);

    // Aqui você retornaria como response para download
    return pdfBuffer; // Enviaria no response HTTP
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

/**
 * Exemplo 6: Gerar PDF a partir de uma URL
 */
export async function exemplo6_PDFFromURL() {
  try {
    // Gera PDF da página completa
    const caminho = await pdfService.generatePDFFromURL(
      "https://exemplo.com/pagina",
      {
        filename: "pagina-web.pdf",
      }
    );

    console.log("✅ PDF da URL criado:", caminho);
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

export default {
  exemplo1_RelatorioSimples,
  exemplo2_RelatorioEvento,
  exemplo3_RelatorioTurne,
  exemplo4_HTMLCustomizado,
  exemplo5_PDFBuffer,
  exemplo6_PDFFromURL,
};
