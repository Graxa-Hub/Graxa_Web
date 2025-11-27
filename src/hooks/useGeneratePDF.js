/**
 * Hook para gerar PDFs com Tailwind CSS
 * Integração do serviço de PDF com React
 */

import { useState } from "react";

/**
 * Hook useGeneratePDF
 * Facilita a geração de PDFs no React
 */
export const useGeneratePDF = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Gera um PDF consolidado
   */
  const generateConsolidatedPDF = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Chama a API para gerar PDF
      const response = await fetch("/api/pdf/consolidado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      // Descarrega o arquivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.nomeEvento
        ? `${data.nomeEvento}.pdf`
        : "relatorio.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao gerar PDF:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gera um PDF customizado
   */
  const generateCustomPDF = async (htmlContent, filename = "documento.pdf") => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/pdf/custom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: htmlContent,
          filename,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao gerar PDF:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateConsolidatedPDF,
    generateCustomPDF,
    loading,
    error,
  };
};

export default useGeneratePDF;
