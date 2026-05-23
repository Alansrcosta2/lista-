# Lista + – Lista de Compras Inteligente

## 🌟 Visão geral
Este é um **PWA** (Progressive Web App) completo que permite planejar, comprar e controlar gastos de forma inteligente. A interface foi aprimorada com **glassmorphism**, gradientes, micro‑animações e tipografia moderna (**Inter**). Tudo é totalmente **gratuito** e **open‑source**.

## 📦 Tecnologias
- **HTML5** – estrutura semântica
- **CSS3** – variáveis, glassmorphism, animações
- **JavaScript** – lógica de lista, armazenamento em `localStorage`
- **Capacitor** – build Android (opcional)
- **Chart.js** (MIT) – gráficos no modal de relatórios

## 🛠️ Instalação & desenvolvimento
```bash
# 1️⃣ Clone o repositório
git clone <repo‑url>
cd "lista +"

# 2️⃣ Instale dependências (Node.js e npm necessários)
npm install

# 3️⃣ Inicie o servidor de desenvolvimento
npm run dev   # abre http://localhost:3000
```
> O app funciona como PWA; basta abrir no navegador e instalar.

## 📂 Estrutura de pastas
```
├─ index.html          # página principal
├─ style.css           # estilos premium (glass, gradientes, animações)
├─ main.clean.js       # lógica da aplicação
├─ produtos.js         # dados de produtos
├─ manifest.json       # config PWA
├─ icons/              # ícones e splash screens
└─ README.md           # este documento
```

## 📦 Build para produção
```bash
npm run build   # gera arquivos minificados em /dist
```
Os arquivos são otimizados com **cssnano** (sem custos).

## 📤 Backup
Um script PowerShell (`backup_lista_plus.ps1`) foi criado para gerar um `ZIP` com tudo que está em `lista +`. Execute‑o no diretório do projeto:
```powershell
./backup_lista_plus.ps1
```

## 📊 Relatórios
- Abra o **modal Relatórios** via menu → **Abrir Relatórios**.
- Selecione o período (7, 30, 90 dias ou tudo).
- Um gráfico de barras (Chart.js) mostra total gasto por dia.
- Clique **Exportar CSV** para baixar os dados.

## 🎨 Design premium
- **Glassmorphism**: classe `.glass` aplicada em containers e modais.
- **Gradientes**: `body` usa `linear-gradient(135deg, var(--bg-main), var(--bg-surface))`.
- **Micro‑animações**: `modalFadeIn`, `modalContentIn` etc.
- **Tipografia**: fonte `Inter` via Google Fonts.
- **Ripple effect**: efeito de onda nos botões (`button::after`).
- **Acessibilidade**: `:focus-visible` outlines, cores com contraste WCAG 2.1.

## 🧰 Scripts úteis
- **Backup** – `backup_lista_plus.ps1`
- **Limpar banco local** – botão *Limpar Banco Local* no modal Configurações.
- **Exportar/Importar** – opções no menu.

## 📄 Licença
Este projeto está licenciado sob a **MIT License** – livre para uso, modificação e distribuição.

---
*Feito por **Alan Costa** – © 2025*