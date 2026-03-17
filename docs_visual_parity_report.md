# Refatoração visual GRAXA x REF

## 1) Auditoria de stack e tokens
- **GRAXA:** React + Vite + Tailwind v4 + CSS global em `src/index.css`.
- **REF:** React + Vite com CSS tradicional por componente e design tokens em `:root`.
- **Decisão:** consolidar tokens globais no GRAXA seguindo a paleta/escala da REF (dark-first, bordas neutras, radius curto, sombra suave, tipografia compacta).

### Tokens extraídos da REF e aplicados
- Cores base: `--bg`, `--surface`, `--surface-elevated`, `--surface-hover`.
- Tipografia: sistema sans nativo + tamanhos compactos (11–14 para UI, 22 para título principal).
- Bordas/radius: `--border`, `--border-hover`, `--border-strong`, `--radius-sm/md/lg`.
- Sombras: `--shadow-soft`, `--shadow-card`.
- Estados: hover/focus com variações sutis de borda/fundo.

## 2) Mapeamento de equivalência visual
- **Board/Header REF** → Header e shell principal do GRAXA.
- **Column/Card REF** → Containers, cards, sidebar e itens de navegação do GRAXA.
- **TaskModal/ConfirmModal REF** → modais e toasts globais do GRAXA.
- **Inputs/buttons REF** → componentes atômicos (`Input`, `Select`, `Textarea`, `InputDate`, `AddButton`).

## 3) Refatoração aplicada
- Layout global, sidebar, header, navegação, autenticação, formulário base, modal de confirmação e toast.
- Customização visual de FullCalendar para aderir à nova paleta.
- Unificação de classes utilitárias em classes base (`surface-card`, `form-input`, `btn-primary`, `nav-item`).

## 4) Remoção/consolidação de legado
- Redução de estilos claros antigos em pontos críticos (auth + navegação + feedback UI).
- Padrão visual único dark-first, evitando coexistência de duas linguagens visuais nesses módulos.

## 5) Validação e divergências restantes
- O projeto possui módulos legados adicionais fora desta trilha (ex.: `features/Evento`) com inconsistências de import já existentes.
- Ainda há telas específicas que podem manter aparência antiga se usam classes isoladas não migradas.
- Próximo passo para 100%: migrar páginas de domínio (evento, logística, relatórios) por bloco funcional usando os mesmos tokens.
