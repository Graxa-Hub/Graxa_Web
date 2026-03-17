# Refatoração de Design System (components-2/index como referência)

## 1) Mapeamento da stack atual
- **Motor de estilos:** Tailwind CSS v4 com `@import "tailwindcss"` em `src/index.css`.
- **Config principal:** `tailwind.config.js` com poucas extensões de tema e `preflight` desativado.
- **Padrão dominante:** classes utilitárias inline em JSX (`className="..."`) em páginas e componentes.
- **CSS global existente:** regras globais e customizações extensas do FullCalendar em `src/index.css`.
- **Referência visual:** arquivos em `components-2/*.css` com linguagem baseada em tokens (`--text-primary`, `--border`, `--shadow`).

## 2) Estratégia aplicada
1. Criar tokens globais (cores, tipografia, espaçamento, borda, sombra, superfícies) no `:root`.
2. Criar classes de base reutilizáveis (`.app-shell`, `.surface-card`, `.form-input`, `.btn-primary`, etc.).
3. Refatorar layout global para consumir tokens/classes compartilhadas.
4. Refatorar componentes base de autenticação e feedback (toast/modal).
5. Ajustar páginas de autenticação para usar o novo padrão visual sem alterar comportamento.
6. Reduzir estilos legados ad-hoc substituindo utilitários repetidos por classes do design system.

## 3) Regras de segurança desta refatoração
- Não alterar assinaturas de hooks/services.
- Não alterar fluxo de navegação/autorização.
- Não alterar payloads nem integrações de API.
- Manter a lógica funcional, alterando apenas camada visual e organização de estilos.
