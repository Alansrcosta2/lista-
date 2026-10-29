# Auditoria — Lista + (out/2026)

## Objetivo do app (definido pelo dono)
> Ajudar a dona de casa a anotar o que vai acabando em casa e lembrar do que comprar no mercado, para ninguém esquecer nada e não se lembrar depois que já chegou em casa.

---

## Nota geral: 6/10
Boa base, bem versionada nos dados, mas **3 features anunciadas não funcionam** e a versão está dividida em duas cópias opostas (raiz e `www/`).

---

## 1. Bugs CRÍTICOS (consertar primeiro)

### C1. Scanner IA de corredores está 100% quebrado
- `main.clean.js:2965` e `:2982` usam uma variável `modal` **que nunca foi declarada** no arquivo inteiro → `ReferenceError` sempre que o scanner abrir a câmera.
- `main.clean.js:2953` chama `window.ensurePermission('camera')`, mas essa função nunca é экспosta ao `window` (é local do IIFE) → no APK nativo dá erro antes mesmo da câmera.
- Consequência: câmera abre e trava com alert de erro. Feature morta na prática.

### C2. Modo offline do PWA não funciona de verdade
- `service-worker.js` existe, mas **ninguém chama `serviceWorker.register()`** em lugar nenhum (nem no `main.clean.js`, nem no `index.html`) → o cache offline depende de sorte do navegador.
- O SW também guarda `'style.css?v=5'` mas o HTML pede `style.css` (chave diferente — primeira visita offline pode falhar).

### C3. HTML quebrado na tabela de comprados
- `index.html:289` tem um `</tbody>` órfão (fechamento sem abertura) dentro de `#lista-comprados` — navegadores corrigem sozinhos, mas é erro real que atrapalha o DOM e o re-render.

---

## 2. Bugs ALTOS

- **A1. Prévia de importação abre vazia**: `main.clean.js:2621` grava o resumo em `#prev-info`, mas o HTML (`index.html:144`) só tem `#import-preview-summary` → a pessoa importa e não vê nada antes de aplicar.
- **A2. Documentação mente**: README/About prometem **scanner de código de barras + OpenFoodFacts** e **gráficos Chart.js** — nenhum dos dois existe nessa versão (a busca online nem tem os ids no HTML: `#modal-search` etc. não estão no index.html).
- **A3. Código morto grande** (nunca é carregado pelo index.html):
  - `offline-mode.js` (240 linhas) — e tem bug de **recursão infinita** no `localStorage.setItem` interceptado (`offline-mode.js:167-177`: o override chama a si mesmo enquanto offline)
  - `free-features.js`, `free-features-extra.js`, `lista-handlers.js`
  - `style-backup.css` (1.166 linhas)
  - Dependências npm não usadas: `@capacitor/camera`, `@capacitor-community/image-to-text` (o código usa `getUserMedia` + plugin `Ocr` via window)
- **A4. XSS potencial**: 65 usos de `innerHTML`; importação de backup injeta nomes vindos do arquivo sem escape (`main.clean.js:2620`, `:2490`…) — num WebView (APK) é mais arriscado.

## 3. Médias

- `prompt()` para escolher modo de importação (`:2571`) — ridículo no celular e contradiz a tela do onboarding que fala em "modo Merge" bonito.
- `manifest.json` sem `icons` → app instalado sem ícone direito; só o favicon segura.
- `viewport` com `maximum-scale=1.0; user-scalable=no` (acessibilidade WCAG).
- `tesseract.js` (~2 MB) carregada no `<head>` **sempre**, mesmo sem usar o scanner — deveria ser lazy.
- Pasta `www/` é uma **cópia antiga divergente** do app (código radicalmente diferente da raiz) — risco de editar na pasta errada.
- Filtro de corredores mistura estado local e global (`window.currentAisleFilter` no `:1888` vs variável local) — funciona, mas é frágil.

## 4. O que está BOM (manter)

- ✅ Catálogo de **707 produtos** com categoria/emoji/unidade — autocomplete funciona bem
- ✅ Chaves de storage **versionadas** (`shoppingList_v3`, `boughtItems_v3`, `priceHistory_v3`, `savedLists_v3`…) — histórico seguro
- ✅ Fluxo dois modos (Planejamento → Mercado) com pendências de peso (kg)
- ✅ Pendências de peso + total + histórico de preços
- ✅ Compartilhar por WhatsApp (lista/comprados) + box de "uso em família" via export/import
- ✅ Tema claro/escuro com persistência
- ✅ Backup com validação de schema antes de aplicar
- ✅ CSV de relatórios
- ✅ Sintaxe íntegra (node --check OK nos 2 arquivos)

---

## 5. Julgamento pelo objetivo central

### MANTER (é a essência — "anotar antes de faltar")
| Recurso | Por quê |
|---|---|
| Lista de compras + autocomplete 707 produtos | coração do app |
| Modo Mercado (preço, kg, comprado) | fecha o ciclo da compra |
| Pendências de peso | itens por kg nunca são esquecidos |
| Histórico de preços | "quanto paguei da última vez" |
| Salvar/Abrir listas + WhatsApp | mata o "ninguém esquece" |
| Export/Import família | esposa acompanha a mesma lista |

### REMOVER/SIMPLIFICAR (excesso para o objetivo)
| Retirar | Motivo |
|---|---|
| Scanner IA de corredores | quebrado; custo alto, benefício baixo (pode voltar depois, consertado) |
| Busca online/virtual (modal-search) | nem existe no HTML nesse estado |
| 4 arquivos de código morto + 2 deps npm + style-backup | lixo que confunde manutenção |
| Pasta www/ duplicada | manter só a raiz |

### ADICIONAR (evolução natural da ideia)
- **Modo "Acabou em Casa" (o pulo do gato)**: quando algo **acaba** em casa, ela marca o item numa tela rápido → o item entra sozinho na lista de compras do mercado. É exatamente o seu propósito original ("anotar o que acabou e tem que comprar"), sem depender de ter decidido antes ir ao mercado.
- Alerta amigável no fim da compra: "faltaram X itens, comprados Y" (já tem parcial no `alerta-faltando`).
- Trocar `prompt()` do import por botões no próprio modal.

---

## 6. Plano de ação

**Fase 1 — Consertar (rápido, ~1 sessão)**
1. Definir `modal` = `#modal-ai-scanner` no scanner (aí decide: consertar ou pausar a feature)
2. Registrar o service worker + registrar assets reais
3. Corrigir `</tbody>` órfão
4. Apontar prévia de importação para `#import-preview-summary`

**Fase 2 — Limpar**
5. Apagar código morto (4 JS, style-backup, deps npm não usadas, pasta www/)
6. `manifest.json` com ícones 192/512
7. Escapar HTML antes de innerHTML (importação/nomes)

**Fase 3 — Crescer (opcional)**
8. Modo "Acabou em Casa" (item acabou → entra na lista de compra automática)
9. Modal próprio no lugar de `prompt()`
10. Lazy-load do tesseract (só quando abrir o scanner)

---
*Auditoria gerada automaticamente — out/2026.*
