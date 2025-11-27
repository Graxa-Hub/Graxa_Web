/**
 * Gerador de CSS Tailwind para PDFs
 * Extrai e compila CSS Tailwind em tempo de execução
 */

import postcss from "postcss";
import tailwindcss from "tailwindcss";
import fs from "fs";
import path from "path";

/**
 * Cache de CSS compilado
 */
let tailwindCSSCache = null;

/**
 * Gera CSS Tailwind compilado para PDFs
 * Usa as classes que você especificar
 */
export async function generateTailwindCSS(classes = "") {
  try {
    // Se temos cache, retorna
    if (tailwindCSSCache) {
      return tailwindCSSCache;
    }

    // HTML com todas as classes que queremos compilar
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body>
        <!-- Display -->
        <div class="block flex grid inline-block"></div>
        
        <!-- Flexbox -->
        <div class="flex-col flex-row justify-center justify-between items-center gap-2 gap-3 gap-4"></div>
        
        <!-- Grid -->
        <div class="grid-cols-2 grid-cols-3 grid-cols-4"></div>
        
        <!-- Padding -->
        <div class="p-2 p-3 p-4 p-5 p-6 px-2 px-4 py-2 py-4"></div>
        
        <!-- Margin -->
        <div class="m-0 m-2 m-4 mt-2 mt-4 mb-2 mb-4 mx-auto"></div>
        
        <!-- Cores Texto -->
        <div class="text-gray-600 text-gray-700 text-gray-900 text-white text-orange-600 text-red-600 text-green-600 text-blue-600"></div>
        
        <!-- Cores Fundo -->
        <div class="bg-white bg-gray-50 bg-gray-100 bg-gray-200 bg-orange-600 bg-gradient-to-r from-orange-600 to-orange-700"></div>
        
        <!-- Border -->
        <div class="border border-b border-l border-l-4 border-orange-600 rounded rounded-lg"></div>
        
        <!-- Tamanho -->
        <div class="w-full max-w-2xl max-w-3xl"></div>
        
        <!-- Tipografia -->
        <div class="text-center text-left text-right text-sm text-base text-lg text-xl text-2xl font-bold font-semibold font-medium uppercase"></div>
        
        <!-- Sombra -->
        <div class="shadow shadow-lg opacity-50 opacity-75 opacity-90"></div>
        
        <!-- H1-H3 -->
        <h1 class="text-2xl font-bold"></h1>
        <h2 class="text-xl font-semibold"></h2>
        <h3 class="text-lg font-semibold"></h3>
        <p class="text-base"></p>
        
        <!-- Tabela -->
        <table class="w-full">
          <thead>
            <tr>
              <th class="bg-orange-600 text-white px-4 py-2 text-left font-bold text-sm"></th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="px-4 py-2"></td>
            </tr>
            <tr class="even:bg-gray-50">
              <td class="px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
        
        <!-- Custom Classes -->
        ${classes}
      </body>
      </html>
    `;

    // Cria arquivo temporário
    const tempFile = path.join(process.cwd(), ".temp-tailwind.html");
    fs.writeFileSync(tempFile, htmlContent);

    try {
      // Processa com Tailwind
      const input =
        "@tailwind base; @tailwind components; @tailwind utilities;";

      const result = await postcss([
        tailwindcss({
          content: [tempFile],
          theme: {
            extend: {
              colors: {
                "brand-orange": "#ff3f22",
                "brand-orange-light": "#ff6b47",
              },
            },
          },
          corePlugins: {
            preflight: false,
          },
        }),
      ]).process(input, { from: undefined });

      tailwindCSSCache = result.css;

      // Limpa arquivo temporário
      try {
        fs.unlinkSync(tempFile);
      } catch (e) {
        // Ignora erro ao deletar
      }

      return tailwindCSSCache;
    } catch (error) {
      console.error("Erro ao compilar Tailwind:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erro ao gerar CSS Tailwind:", error);
    throw error;
  }
}

/**
 * Versão simplificada: Retorna um CSS pré-compilado
 * Use isto se generateTailwindCSS tiver problemas
 */
export const tailwindCSSPrecompiled = `
  /* Reset Base */
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  /* Display */
  .block { display: block; }
  .flex { display: flex; }
  .grid { display: grid; }
  .inline-block { display: inline-block; }
  
  /* Flexbox */
  .flex-col { flex-direction: column; }
  .flex-row { flex-direction: row; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .items-center { align-items: center; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  .gap-4 { gap: 1rem; }
  
  /* Grid */
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  
  /* Padding */
  .p-2 { padding: 0.5rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .p-5 { padding: 1.25rem; }
  .p-6 { padding: 1.5rem; }
  .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
  
  /* Margin */
  .m-0 { margin: 0; }
  .m-2 { margin: 0.5rem; }
  .m-4 { margin: 1rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-4 { margin-top: 1rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  
  /* Cores Texto */
  .text-gray-600 { color: #4b5563; }
  .text-gray-700 { color: #374151; }
  .text-gray-900 { color: #111827; }
  .text-white { color: white; }
  .text-orange-600 { color: #ff3f22; }
  .text-red-600 { color: #dc2626; }
  .text-green-600 { color: #16a34a; }
  .text-blue-600 { color: #2563eb; }
  
  /* Cores Fundo */
  .bg-white { background-color: white; }
  .bg-gray-50 { background-color: #f9fafb; }
  .bg-gray-100 { background-color: #f3f4f6; }
  .bg-gray-200 { background-color: #e5e7eb; }
  .bg-orange-600 { background-color: #ff3f22; }
  .bg-gradient-to-r { background: linear-gradient(to right, var(--tw-gradient-stops)); }
  .from-orange-600 { --tw-gradient-stops: #ff3f22, var(--tw-gradient-to, rgba(255, 63, 34, 0)); }
  .to-orange-700 { --tw-gradient-to: #e63a1f; }
  
  /* Border */
  .border { border: 1px solid #e5e7eb; }
  .border-b { border-bottom: 1px solid #e5e7eb; }
  .border-l { border-left: 1px solid #e5e7eb; }
  .border-l-4 { border-left: 4px solid #ff3f22; }
  .border-orange-600 { border-color: #ff3f22; }
  .rounded { border-radius: 0.375rem; }
  .rounded-lg { border-radius: 0.5rem; }
  
  /* Tamanho */
  .w-full { width: 100%; }
  .max-w-2xl { max-width: 42rem; }
  .max-w-3xl { max-width: 48rem; }
  
  /* Tipografia */
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.5; color: #1f2937; }
  h1 { font-size: 2rem; font-weight: 700; line-height: 1.2; }
  h2 { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
  h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
  p { margin-bottom: 1rem; }
  
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-sm { font-size: 0.875rem; }
  .text-base { font-size: 1rem; }
  .text-lg { font-size: 1.125rem; }
  .text-xl { font-size: 1.25rem; }
  .text-2xl { font-size: 1.5rem; }
  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .font-medium { font-weight: 500; }
  .uppercase { text-transform: uppercase; }
  
  /* Sombra */
  .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
  .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
  
  /* Opacidade */
  .opacity-50 { opacity: 0.5; }
  .opacity-75 { opacity: 0.75; }
  .opacity-90 { opacity: 0.9; }
  
  /* PDF */
  .page-break { page-break-after: always; page-break-inside: avoid; }
  .no-break { page-break-inside: avoid; }
  
  /* Tabelas */
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
  th { background-color: #ff3f22; color: white; padding: 0.75rem; text-align: left; font-weight: 600; font-size: 0.875rem; }
  td { padding: 0.75rem; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) { background-color: #f9fafb; }
`;

export default { generateTailwindCSS, tailwindCSSPrecompiled };
