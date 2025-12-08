import { api } from './axios';

export const pdfService = {
    /**
     * Gera um PDF com as informações do evento (show)
     * @param {number} showId - ID do show
     * @returns {Promise<Blob>} - Retorna o PDF como blob
     */
    async gerarPdfEvento(showId) {
        try {
            console.log('[pdfService] Gerando PDF para o show:', showId);

            const response = await api.get(`/shows/${showId}/pdf`, {
                responseType: 'blob', // Importante: receber como blob
                timeout: 60000, // 60 segundos de timeout para geração do PDF
            });

            console.log('[pdfService] PDF gerado com sucesso');
            return response.data;
        } catch (error) {
            console.error('[pdfService] Erro ao gerar PDF:', error);

            // Verificar se é erro de conexão (backend não está rodando)
            if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                throw new Error('Backend não está respondendo. Verifique se o servidor Spring Boot está rodando.');
            }

            // Verificar se é erro 404 (endpoint não existe)
            if (error.response?.status === 404) {
                throw new Error('Endpoint de PDF não encontrado no backend. Verifique se o PdfController foi implementado.');
            }

            // Verificar se é erro 500 (erro no servidor)
            if (error.response?.status === 500) {
                throw new Error('Erro no servidor ao gerar PDF. Verifique os logs do backend.');
            }

            throw new Error('Não foi possível gerar o PDF do evento. Tente novamente.');
        }
    },    /**
     * Faz o download do PDF gerado
     * @param {Blob} pdfBlob - Blob do PDF
     * @param {string} nomeArquivo - Nome do arquivo (sem extensão)
     */
    downloadPdf(pdfBlob, nomeArquivo = 'evento') {
        try {
            // Criar uma URL temporária para o blob
            const url = window.URL.createObjectURL(pdfBlob);

            // Criar um link temporário e clicar nele
            const link = document.createElement('a');
            link.href = url;
            link.download = `${nomeArquivo}.pdf`;
            document.body.appendChild(link);
            link.click();

            // Limpar
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log('[pdfService] Download do PDF iniciado');
        } catch (error) {
            console.error('[pdfService] Erro ao fazer download do PDF:', error);
            throw new Error('Erro ao fazer download do PDF');
        }
    },

    /**
     * Gera e faz download do PDF em uma única chamada
     * @param {number} showId - ID do show
     * @param {string} nomeEvento - Nome do evento para o arquivo
     */
    async gerarEBaixarPdf(showId, nomeEvento = 'evento') {
        try {
            const pdfBlob = await this.gerarPdfEvento(showId);

            // Sanitizar o nome do arquivo (remover caracteres especiais)
            const nomeArquivoLimpo = nomeEvento
                .replace(/[^a-zA-Z0-9-_]/g, '_')
                .substring(0, 50); // Limitar tamanho

            this.downloadPdf(pdfBlob, nomeArquivoLimpo);

            return true;
        } catch (error) {
            console.error('[pdfService] Erro ao gerar e baixar PDF:', error);
            throw error;
        }
    }
};
