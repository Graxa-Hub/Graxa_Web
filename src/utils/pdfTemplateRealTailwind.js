/**
 * Template Consolidado com Tailwind CSS Real
 * Usa classes Tailwind compiladas em tempo de execução
 */

import { tailwindCSSPrecompiled } from "./tailwindGenerator.js";

/**
 * Gera uma linha de artista na tabela
 */
const gerarLinhaArtista = (artista, index) => {
  const bgcolor = index % 2 === 0 ? "bg-gray-50" : "bg-white";
  return `
    <tr class="${bgcolor}">
      <td class="px-4 py-2 text-sm">${artista.nome || "N/A"}</td>
      <td class="px-4 py-2 text-sm">${artista.genero || "N/A"}</td>
      <td class="px-4 py-2 text-sm">${artista.tipo || "N/A"}</td>
      <td class="px-4 py-2 text-sm text-right">${
        artista.cachê ? `R$ ${artista.cachê.toLocaleString("pt-BR")}` : "N/A"
      }</td>
    </tr>
  `;
};

/**
 * Gera uma linha de show
 */
const gerarLinhaShow = (show, index) => {
  const bgcolor = index % 2 === 0 ? "bg-gray-50" : "bg-white";
  const data = show.data
    ? new Date(show.data).toLocaleDateString("pt-BR")
    : "N/A";
  return `
    <tr class="${bgcolor}">
      <td class="px-4 py-2 text-sm">${data}</td>
      <td class="px-4 py-2 text-sm">${show.local || "N/A"}</td>
      <td class="px-4 py-2 text-sm">${show.artistas?.length || 0} artistas</td>
      <td class="px-4 py-2 text-sm text-right">${
        show.cachê ? `R$ ${show.cachê.toLocaleString("pt-BR")}` : "N/A"
      }</td>
    </tr>
  `;
};

/**
 * Template consolidado com Tailwind CSS real
 */
export const pdfTemplateConsolidadoRealTailwind = (data = {}) => {
  const {
    nomeEvento = "Evento Padrão",
    descricaoEvento = "Descrição do evento",
    artistas = [],
    turnes = [],
    localEvento = "Local padrão",
    dataEvento = new Date().toLocaleDateString("pt-BR"),
    dataGerador = new Date().toLocaleDateString("pt-BR"),
  } = data;

  const totalArtistas = artistas.length;
  const totalShows = turnes.reduce((acc, t) => acc + (t.shows?.length || 0), 0);
  const totalCacheArtistas = artistas.reduce(
    (acc, a) => acc + (a.cachê || 0),
    0
  );
  const totalCacheTurnes = turnes.reduce(
    (acc, t) =>
      acc + (t.shows?.reduce((s, show) => s + (show.cachê || 0), 0) || 0),
    0
  );

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório - ${nomeEvento}</title>
      <style>
        ${tailwindCSSPrecompiled}
        
        /* Estilos Adicionais para PDF */
        @page {
          size: A4;
          margin: 10mm;
        }
        
        .container { max-width: 100%; padding: 1.5rem; }

        .header-gradient { background: linear-gradient(135deg, #ff3f22 0%, #e63a1f 100%); }

        .card { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1rem; background: white; }

        .card-title { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin-bottom: 1rem; }

        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem; }

        .info-item { border-left: 4px solid #ff3f22; padding-left: 0.75rem; }

        .info-label { font-size: 0.875rem; color: #6b7280; text-transform: uppercase; font-weight: 600; }

        .info-value { font-size: 1.25rem; color: #1f2937; font-weight: 600; margin-top: 0.25rem; }

        .total-card { background: #f9fafb; border: 2px solid #ff3f22; }

        .page-number { text-align: right; color: #9ca3af; font-size: 0.875rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb; }

      </style>

    </head>
    <body>
      <div class="container">
        <div class="header-gradient text-white p-6" style="border-radius: 0.5rem; margin-bottom: 2rem; text-align: center;">
          <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">Título - ${nomeEvento}</h1>
          <h2 style="font-size: 1.5rem; font-weight: 300; margin-bottom: 1.5rem;">CRONOGRAMA DE HORÁRIO</h2>
          <h2 style="font-size: 1.5rem; font-weight: 300; margin-bottom: 1.5rem;">DD.MM.YYYY - DIA DE SEMANA - ${nomeEvento}</h2>
          <h2 style="font-size: 1.5rem; font-weight: 300; margin-bottom: 1.5rem;">NOME DO LOCA - ENDEREÇO DO LOCAL</h2>
          <div style="border-top: 2px solid rgba(255,255,255,0.3); padding-top: 1.5rem;">
            <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">${nomeEvento}</p>
            <p style="font-size: 1rem; opacity: 0.9;">${dataEvento}</p>
          </div>
        </div>

        <div class="card total-card">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Total de Artistas</div>
              <div class="info-value">${totalArtistas}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Total de Shows</div>
              <div class="info-value">${totalShows}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Cachê Artistas</div>
              <div class="info-value">R$ ${totalCacheArtistas.toLocaleString(
                "pt-BR"
              )}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Cachê Turnes</div>
              <div class="info-value">R$ ${totalCacheTurnes.toLocaleString(
                "pt-BR"
              )}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Informações do Evento</div>
          <div class="info-grid">
            <div>
              <div class="info-label">Local</div>
              <p style="color: #374151; margin-top: 0.5rem;">${localEvento}</p>
            </div>
            <div>
              <div class="info-label">Data do Evento</div>
              <p style="color: #374151; margin-top: 0.5rem;">${dataEvento}</p>
            </div>
          </div>
          <div style="margin-top: 1rem;">
            <div class="info-label">Descrição</div>
            <p style="color: #374151; margin-top: 0.5rem; line-height: 1.6;">${descricaoEvento}</p>
          </div>
        </div>

        <div class="page-number">Página 1 de 4</div>
      </div>

      <!-- Página 2: Artistas -->
      <div class="page-break"></div>
      <div class="container">
        <h2 style="font-size: 1.75rem; font-weight: 600; color: #1f2937; margin-bottom: 1.5rem; border-bottom: 2px solid #ff3f22; padding-bottom: 0.75rem;">
          Artistas
        </h2>

        ${
          artistas.length > 0
            ? `
          <table class="w-full" style="margin-bottom: 1rem;">
            <thead>
              <tr class="bg-orange-600">
                <th class="px-4 py-2 text-left text-white font-bold text-sm">Nome</th>
                <th class="px-4 py-2 text-left text-white font-bold text-sm">Gênero</th>
                <th class="px-4 py-2 text-left text-white font-bold text-sm">Tipo</th>
                <th class="px-4 py-2 text-right text-white font-bold text-sm">Cachê</th>
              </tr>
            </thead>
            <tbody>
              ${artistas
                .map((artista, index) => gerarLinhaArtista(artista, index))
                .join("")}
            </tbody>
          </table>
          `
            : '<p class="text-gray-600">Nenhum artista registrado</p>'
        }

        <div class="page-number">Página 2 de 4</div>
      </div>

      <!-- Página 3: Turnes -->
      <div class="page-break"></div>
      <div class="container">
        <h2 style="font-size: 1.75rem; font-weight: 600; color: #1f2937; margin-bottom: 1.5rem; border-bottom: 2px solid #ff3f22; padding-bottom: 0.75rem;">
          Turnes e Shows
        </h2>

        ${
          turnes.length > 0
            ? turnes
                .map((turne, idx) => {
                  const shows = turne.shows || [];
                  return `
          <div class="card" style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.25rem; font-weight: 600; color: #1f2937;">
                ${turne.nome || `Turne ${idx + 1}`}
              </h3>
              <span class="bg-orange-600 text-white px-4 py-2 rounded text-sm font-semibold">${
                shows.length
              } shows</span>
            </div>
            
            ${
              shows.length > 0
                ? `
              <table class="w-full">
                <thead>
                  <tr style="background-color: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                    <th class="px-4 py-2 text-left font-semibold text-sm text-gray-900">Data</th>
                    <th class="px-4 py-2 text-left font-semibold text-sm text-gray-900">Local</th>
                    <th class="px-4 py-2 text-left font-semibold text-sm text-gray-900">Artistas</th>
                    <th class="px-4 py-2 text-right font-semibold text-sm text-gray-900">Cachê</th>
                  </tr>
                </thead>
                <tbody>
                  ${shows
                    .map((show, showIdx) => gerarLinhaShow(show, showIdx))
                    .join("")}
                </tbody>
              </table>
            `
                : '<p class="text-gray-600">Nenhum show registrado</p>'
            }
          </div>
          `;
                })
                .join("")
            : '<p class="text-gray-600">Nenhuma turne registrada</p>'
        }

        <div class="page-number">Página 3 de 4</div>
      </div>

      <!-- Página 4: Resumo -->
      <div class="page-break"></div>
      <div class="container">
        <h2 style="font-size: 1.75rem; font-weight: 600; color: #1f2937; margin-bottom: 1.5rem; border-bottom: 2px solid #ff3f22; padding-bottom: 0.75rem;">
          Resumo Financeiro
        </h2>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
          <div class="card">
            <div class="info-label">ARTISTAS</div>
            <div class="info-value" style="color: #ff3f22; margin-top: 0.5rem;">
              ${totalArtistas}
            </div>
            <div style="color: #6b7280; margin-top: 0.5rem; font-size: 0.875rem;">
              Cachê Total: R$ ${totalCacheArtistas.toLocaleString("pt-BR")}
            </div>
          </div>

          <div class="card">
            <div class="info-label">SHOWS</div>
            <div class="info-value" style="color: #ff3f22; margin-top: 0.5rem;">
              ${totalShows}
            </div>
            <div style="color: #6b7280; margin-top: 0.5rem; font-size: 0.875rem;">
              Cachê Total: R$ ${totalCacheTurnes.toLocaleString("pt-BR")}
            </div>
          </div>
        </div>

        <div class="card total-card">
          <div style="text-align: center;">
            <div class="info-label">TOTAL GERAL</div>
            <div style="font-size: 2rem; font-weight: 700; color: #ff3f22; margin-top: 0.75rem;">
              R$ ${(totalCacheArtistas + totalCacheTurnes).toLocaleString(
                "pt-BR"
              )}
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 0.875rem;">
          <p>Relatório gerado em ${dataGerador}</p>
          <p style="margin-top: 0.5rem;">GRAXA - Sistema de Gestão de Eventos</p>
        </div>

        <div class="page-number">Página 4 de 4</div>
      </div>
    </body>
    </html>
  `;
};

export default pdfTemplateConsolidadoRealTailwind;
