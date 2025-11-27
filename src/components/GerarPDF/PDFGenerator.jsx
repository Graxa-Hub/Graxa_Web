/**
 * Componente para Gerar PDFs com Tailwind CSS
 * Exemplo de integração no React
 */

import { useState } from "react";
import useGeneratePDF from "../../hooks/useGeneratePDF";

/**
 * Componente PDFGenerator
 * Permite gerar PDFs consolidados de eventos
 */
export const PDFGenerator = ({ evento = {}, artistas = [], turnes = [] }) => {
  const { generateConsolidatedPDF, loading, error } = useGeneratePDF();
  const [showPreview, setShowPreview] = useState(false);

  const handleGeneratePDF = async () => {
    const data = {
      nomeEvento: evento.nome || "Evento Padrão",
      descricaoEvento: evento.descricao || "Descrição do evento",
      dataEvento: evento.data || new Date().toLocaleDateString("pt-BR"),
      localEvento: evento.local || "Local padrão",
      artistas: artistas || [],
      turnes: turnes || [],
      dataGerador: new Date().toLocaleDateString("pt-BR"),
    };

    const success = await generateConsolidatedPDF(data);

    if (success) {
      alert("PDF gerado com sucesso!");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gerar PDF do Evento
        </h2>
        <p className="text-gray-600">
          Exporte os detalhes do evento em um PDF profissional com Tailwind CSS
        </p>
      </div>

      {/* Informações */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600 uppercase font-semibold">
            Artistas
          </p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {artistas.length}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600 uppercase font-semibold">
            Turnes
          </p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {turnes.length}
          </p>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <p className="font-semibold">Erro ao gerar PDF</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3">
        <button
          onClick={handleGeneratePDF}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-orange-600 text-white rounded font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Gerando PDF..." : "📥 Baixar PDF"}
        </button>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-3 bg-gray-200 text-gray-900 rounded font-semibold hover:bg-gray-300 transition"
        >
          {showPreview ? "👁️ Ocultar Preview" : "👁️ Ver Preview"}
        </button>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-semibold mb-3 text-gray-900">
            Informações que serão exportadas:
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Evento:</strong> {evento.nome || "Não definido"}
            </p>
            <p>
              <strong>Data:</strong> {evento.data || "Não definida"}
            </p>
            <p>
              <strong>Local:</strong> {evento.local || "Não definido"}
            </p>
            <p>
              <strong>Artistas:</strong> {artistas.length} registrados
            </p>
            <p>
              <strong>Turnes:</strong> {turnes.length} registradas
            </p>
            <p>
              <strong>Shows:</strong>{" "}
              {turnes.reduce((acc, t) => acc + (t.shows?.length || 0), 0)}{" "}
              registrados
            </p>
          </div>
        </div>
      )}

      {/* Informações */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900 text-sm">
        <p className="font-semibold mb-2">ℹ️ Informações</p>
        <ul className="list-disc list-inside space-y-1">
          <li>PDF gerado com Tailwind CSS real</li>
          <li>4 páginas: Capa, Artistas, Turnes/Shows, Resumo Financeiro</li>
          <li>Salvo automaticamente em Downloads</li>
          <li>Compatível com qualquer leitor de PDF</li>
        </ul>
      </div>
    </div>
  );
};

/**
 * Componente SimplePDFButton
 * Botão simples para gerar PDF
 */
export const SimplePDFButton = ({ evento, artistas, turnes }) => {
  const { generateConsolidatedPDF, loading } = useGeneratePDF();

  const handleClick = async () => {
    await generateConsolidatedPDF({
      nomeEvento: evento?.nome || "Relatório",
      descricaoEvento: evento?.descricao || "",
      dataEvento: evento?.data || new Date().toLocaleDateString("pt-BR"),
      localEvento: evento?.local || "",
      artistas: artistas || [],
      turnes: turnes || [],
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      <span>📥</span>
      {loading ? "Gerando..." : "Exportar PDF"}
    </button>
  );
};

/**
 * Componente CustomPDFBuilder
 * Builder para criar PDFs customizados
 */
export const CustomPDFBuilder = () => {
  const { generateCustomPDF, loading } = useGeneratePDF();
  const [htmlContent, setHtmlContent] = useState("");

  const handleGenerateCustom = async () => {
    if (!htmlContent.trim()) {
      alert("Digite algum conteúdo HTML");
      return;
    }

    await generateCustomPDF(htmlContent, "customizado.pdf");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Criar PDF Customizado
      </h2>

      <textarea
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        placeholder="Cole seu HTML aqui com classes Tailwind..."
        className="w-full h-64 p-4 border border-gray-300 rounded font-mono text-sm"
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleGenerateCustom}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded font-semibold hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Gerando..." : "Gerar PDF"}
        </button>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900">
        <p className="font-semibold mb-2">⚠️ Dicas:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Use classes Tailwind como <code>class="flex p-4"</code>
          </li>
          <li>
            Inclua a tag <code>&lt;style&gt;</code> com CSS
          </li>
          <li>Sempre use cores seguras (orange-600, gray-700, etc)</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFGenerator;
