/**
 * Componente Relatorio - Visualização Colorida
 * Exibe dados bem formatados e legíveis no React
 */

import { useState } from "react";
import pdfService from "../../services/pdfService";
import { gerarHTMLRelatorio } from "../../utils/relatorioHTMLBuilder";

export function RelatorioViewer({ evento = {}, artistas = [], turnes = [] }) {
  const [loading, setLoading] = useState(false);

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

  const handleExportPDF = async () => {
    try {
      setLoading(true);

      // Gera HTML puro para PDF
      const html = gerarHTMLRelatorio({
        nomeEvento: evento.nome || "Evento",
        descricaoEvento: evento.descricao || "",
        dataEvento: evento.data || new Date().toLocaleDateString("pt-BR"),
        localEvento: evento.local || "",
        artistas,
        turnes,
        dataGerador: new Date().toLocaleDateString("pt-BR"),
      });

      // Gera o PDF
      await pdfService.generatePDF(html, {
        filename: `${evento.nome || "relatorio"}.pdf`,
        format: "A4",
        margin: {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "10mm",
        },
      });

      alert("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-2">
            {"Título - " + artistas.nome}
          </h1>
          <h2 className="text-2xl font-light mb-4">CRONOGRAMA DE HORÁRIO</h2>
          <div className="border-t border-white border-opacity-30 pt-4 mt-4">
            <p className="text-xl font-semibold">
              {evento.nome || "Evento Padrão"}
            </p>
            <p className="text-orange-100">
              {evento.data || "Data não definida"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Total de Artistas
          </p>
          <p className="text-3xl font-bold text-orange-600">{totalArtistas}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Total de Shows
          </p>
          <p className="text-3xl font-bold text-orange-600">{totalShows}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Cachê Artistas
          </p>
          <p className="text-2xl font-bold text-green-600">
            R$ {totalCacheArtistas.toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Cachê Turnes
          </p>
          <p className="text-2xl font-bold text-blue-600">
            R$ {totalCacheTurnes.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Informações do Evento */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-orange-600">
          Informações do Evento
        </h3>
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Local
            </p>
            <p className="text-lg text-gray-900">
              {evento.local || "Não definido"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Data do Evento
            </p>
            <p className="text-lg text-gray-900">
              {evento.data
                ? new Date(evento.data).toLocaleDateString("pt-BR")
                : "Não definida"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Descrição
          </p>
          <p className="text-gray-700 leading-relaxed">
            {evento.descricao || "Sem descrição"}
          </p>
        </div>
      </div>

      {/* Artistas */}
      {artistas.length > 0 && (
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-orange-600">
            Artistas
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="px-6 py-3 text-left font-semibold">Nome</th>
                  <th className="px-6 py-3 text-left font-semibold">Gênero</th>
                  <th className="px-6 py-3 text-left font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-right font-semibold">Cachê</th>
                </tr>
              </thead>
              <tbody>
                {artistas.map((artista, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 text-gray-900">{artista.nome}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {artista.genero}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{artista.tipo}</td>
                    <td className="px-6 py-4 text-right text-gray-900 font-semibold">
                      R$ {artista.cachê?.toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Turnes */}
      {turnes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-orange-600">
            Turnes e Shows
          </h3>
          <div className="space-y-6">
            {turnes.map((turne, turneIdx) => (
              <div
                key={turneIdx}
                className="border-l-4 border-orange-600 pl-6 py-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-bold text-gray-900">
                    {turne.nome}
                  </h4>
                  <span className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-semibold">
                    {turne.shows?.length || 0} shows
                  </span>
                </div>

                {turne.shows && turne.shows.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Data
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Local
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Artistas
                          </th>
                          <th className="px-4 py-2 text-right font-semibold text-gray-700">
                            Cachê
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {turne.shows.map((show, showIdx) => (
                          <tr
                            key={showIdx}
                            className={
                              showIdx % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td className="px-4 py-3 text-gray-900">
                              {new Date(show.data).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {show.local}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {show.artistas?.length || 0} artistas
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                              R$ {show.cachê?.toLocaleString("pt-BR")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo Financeiro */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-orange-600">
          Resumo Financeiro
        </h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <p className="text-sm font-semibold text-orange-600 uppercase mb-2">
              Artistas
            </p>
            <p className="text-3xl font-bold text-orange-600 mb-2">
              {totalArtistas}
            </p>
            <p className="text-orange-700">
              Cachê: R$ {totalCacheArtistas.toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-sm font-semibold text-blue-600 uppercase mb-2">
              Shows
            </p>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {totalShows}
            </p>
            <p className="text-blue-700">
              Cachê: R$ {totalCacheTurnes.toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
        <div className="p-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg">
          <p className="text-sm font-semibold opacity-90 uppercase mb-2">
            Total Geral
          </p>
          <p className="text-4xl font-bold">
            R$ {(totalCacheArtistas + totalCacheTurnes).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Botão de Exportação */}
      <div className="sticky bottom-6 right-6 flex justify-end">
        <button
          onClick={handleExportPDF}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-lg font-bold text-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
        >
          <span className="text-xl">📥</span>
          {loading ? "Gerando PDF..." : "Exportar para PDF"}
        </button>
      </div>
    </div>
  );
}

export default RelatorioViewer;
