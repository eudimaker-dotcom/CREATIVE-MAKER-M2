# Premium Hub - Project Context & Guidelines

Este documento serve como a fonte de verdade para o desenvolvimento do **Premium Hub**, um marketplace de templates PSD curado em Luanda.

## 1. Visão e Identidade
- **Nome**: Premium Hub
- **Slogan**: "Curated in Luanda"
- **Público**: Designers e criativos de alto nível.
- **Vibe**: Luxuosa, tecnológica, sombria (dark mode) e minimalista.

## 2. Stack Técnica
- **Framework**: React 18 + Vite + TypeScript.
- **Estilização**: Tailwind CSS (estilo moderno/glassmorphism).
- **Animações**: `motion/react` (Framer Motion).
- **Ícones**: `lucide-react`.
- **Componentes de Terceiros**:
  - `swiper`: Usado no Hero, AdSlider e TemplateDetailModal.
  - `recharts`: Para visualização de dados (se necessário).

## 3. Design System (D.N.A Visual)
- **Cores**: 
  - Fundo: Dark (#000000).
  - Acentos: Gradientes (Blue/Purple/Orange para packs específicos).
  - Cartões: Border `white/5` ou `white/10`, Background `white/0.02` ou `glass`.
- **Tipografia**:
  - Títulos: `font-black`, `uppercase`, `tracking-tighter`.
  - Subtítulos: `tracking-[0.4em]` ou `[0.5em]`, `font-black`.
- **Efeitos**: 
  - `backdrop-blur-xl` para modais e elementos suspensos.
  - Sombra `drop-shadow-2xl` em imagens de mockups.
  - Animação `hover:scale-105` em gatilhos de interação.

## 4. Componentes Críticos & Lógica
- **`AdSlider.tsx`**: Slider principal no topo com gradientes abstratos e animação `pulse`.
- **`TemplateDetailModal.tsx`**: 
  - Usa `Swiper` para galeria de imagens.
  - Navegação personalizada (Chevron icons) com index `z-[130]` para evitar sobreposição.
  - Overlay em `fixed inset-0` com `z-[100]`.
- **`constants.ts`**: Central de dados. Todos os templates e suas galerias de imagens devem ser registados aqui.

## 5. Convenções de Código
- **Imagens**: Usar caminhos relativos para `/src/assets/images/`.
- **Modais**: Sempre envolver com `AnimatePresence` para transições suaves.
- **Responsividade**: Mobile-first, garantindo que sliders tenham touch targets adequados.

## 6. Histórico de Alterações Recentes (Importante)
- Implementada galeria de imagens completa para o "GMLab Medical Template".
- Refatorada a Modal de Detalhes para suportar Swiper nativo em vez de navegação manual de state.
- Adicionada a insígnia "Curated in Luanda" no Hero.
