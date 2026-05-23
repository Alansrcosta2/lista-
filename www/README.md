# Lista+ 🛒

**Lista de Compras Inteligente** - Um aplicativo PWA completo para gerenciar suas compras com recursos avançados de planejamento e controle de gastos.

---

## 📱 Sobre o App

**Lista+** é um aplicativo de lista de compras com foco em planejamento inteligente, controle de preços e facilidade de uso no supermercado. Desenvolvido como PWA (Progressive Web App) com suporte a Android via Capacitor.

### Desenvolvedor
**Alan Costa**  
📧 Email: [Alansr79@hotmail.com](mailto:Alansr79@hotmail.com)

---

## ✨ Funcionalidades Principais

### 🎯 Modo Planejamento
- **Adicionar produtos** com quantidade e unidade personalizada
- **Autocomplete inteligente** com base em produtos frequentes
- **Sugestão automática de unidades** (un, kg, L, pack, pente, etc.)
- **Categorização automática** por tipo de produto
- **Emojis e fotos** para identificação visual
- **Salvar e carregar listas** para reutilizar compras recorrentes

### 🏪 Modo Mercado
- **Interface otimizada** para uso durante as compras
- **Ordenação inteligente** por corredor/categoria
- **Filtros rápidos**: Todos, Por kg, Pendências
- **Marcar produtos como comprados** com preço
- **Produtos por peso** com cálculo automático
- **Histórico de preços** para comparação
- **Indicador visual** de preço (mais caro/mais barato/igual)
- **Pendências de peso** para finalizar depois
- **Editar itens comprados** diretamente da lista

### 💰 Controle Financeiro
- **Total da compra** em tempo real (só no modo mercado)
- **Histórico de preços** por produto
- **Comparação automática** com última compra
- **Estimativa de gasto** baseada em histórico

### 🔍 Busca Online
- **Integração com OpenFoodFacts** para buscar produtos
- **Busca por nome ou código de barras (EAN)**
- **Ver lista de compras** dentro do modal de busca
- **Adicionar produtos** encontrados diretamente à lista

### 📊 Organização
- **Salvar listas de compras** com nomes personalizados
- **Salvar compras realizadas** para consulta futura
- **Exportar/Importar dados** em formato JSON
- **Compartilhar listas** via WhatsApp ou outras apps
- **Buscar supermercados próximos** com geolocalização

### 🎨 Interface e UX
- **Tema claro/escuro** com alternância automática
- **Design moderno** e responsivo
- **Tooltips de ajuda** em funções complexas
- **Feedback visual** com toasts coloridos:
  - ✅ Verde: Sucesso
  - ❌ Vermelho: Erro
  - ⚠️ Laranja: Aviso
  - ℹ️ Cinza: Informação
- **Toggle de tabela** para ocultar/mostrar lista
- **Limpeza automática** de modais

---

## 🆕 Últimas Atualizações (v2.0)

### Correções de Bugs
✅ **Editar pendências melhorado** - Seleção automática de itens com peso pendente  
✅ **Exportar dados corrigido** - Com feedback visual de sucesso/erro  
✅ **Modal de busca** - Campos limpos automaticamente ao fechar  
✅ **Busca online validada** - Integração com OpenFoodFacts funcionando  

### Melhorias de Interface
✅ **Total oculto no planejamento** - Valor só aparece no modo mercado  
✅ **Sistema de feedback visual** - Toasts coloridos por tipo de mensagem  
✅ **Tooltips de ajuda** - Explicações em botões complexos  
✅ **Toggle de tabela** - Ocultar/mostrar lista de planejamento  
✅ **Botão Comprados Salvos** - Acesso rápido na barra inferior  

### Novas Funcionalidades
✅ **Ver lista no modal de busca** - Botão "📋 Ver minha lista"  
✅ **Validação de comprados** - Itens comprados não aparecem no planejamento  

---

## 🚀 Como Usar

### Modo Planejamento
1. **Adicione produtos** digitando o nome
2. **Defina quantidade e unidade**
3. Use **autocomplete** para produtos frequentes
4. **Salve a lista** para reutilizar depois

### Modo Mercado
1. Clique em **"Modo Mercado"**
2. **Selecione um item** da lista
3. **Informe o preço** (e peso, se for kg)
4. Clique em **"Marcar como Comprado"**
5. Veja o **total atualizado** em tempo real

### Recursos Avançados

#### Buscar Produto Online
- Clique em **"Buscar produto online"**
- Digite o **nome ou EAN** do produto
- Clique **"📋 Ver minha lista"** para ver seus produtos
- Adicione produtos encontrados à lista

#### Editar Pendências
- Produtos kg comprados sem peso aparecem como **pendentes**
- Clique em **"Editar pendências"**
- O sistema seleciona automaticamente o primeiro item
- Informe o peso e finalize

#### Histórico de Preços
- Selecione um produto no mercado
- Clique em **"Ver histórico"**
- Veja evolução de preços e peso médio

#### Salvar/Carregar Listas
- **Salvar**: Menu ⋯ → Salvar Lista
- **Abrir**: Menu ⋯ → Abrir Lista Salva
- **Comprados**: Botão "Abrir Comprados Salvos"

---

## 🔧 Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Design moderno com variáveis CSS
- **JavaScript** - Lógica da aplicação
- **LocalStorage** - Persistência de dados
- **PWA** - Instalável e offline
- **Capacitor** - Build nativo Android
- **OpenFoodFacts API** - Busca de produtos
- **Overpass API** - Busca de supermercados

---

## 📦 Estrutura de Dados

### Lista de Compras
```javascript
{
  nome: "Banana",
  qtd: 6,
  unidade: "un",
  categoria: "hortifruti",
  comprado: false,
  preco: null,
  total: null
}
```

### Itens Comprados
```javascript
{
  nome: "Banana",
  qtd: 6,
  unidade: "un",
  preco: 0.89,
  peso: null,
  total: 5.34,
  date: "2025-11-22T12:00:00Z"
}
```

### Histórico de Preços
```javascript
{
  "Banana": [
    {
      price: 0.89,
      date: "2025-11-22",
      weight: null,
      packSize: null
    }
  ]
}
```

---

## 💾 Armazenamento Local

O app usa **LocalStorage** para salvar:
- `shoppingList_v3` - Lista atual
- `boughtItems_v2` - Itens comprados
- `listasSalvas_v2` - Listas salvas
- `savedPurchases_v1` - Compras salvas
- `priceHistory_v1` - Histórico de preços
- `localProducts_v1` - Produtos customizados
- `smartHistory_v1` / `smartProfile_v1` - IA de unidades
- `theme_v1` - Tema preferido

---

## 🎯 Funcionalidades Especiais

### Smart Unit AI
Sistema inteligente que aprende suas preferências de unidade:
- Sugere unidades baseado em histórico
- Adapta-se aos seus hábitos de compra
- Melhora sugestões com o uso

### Ordenação Inteligente
Lista ordenada por:
1. **Pendências de peso** (primeiro)
2. **Itens por kg** (segundo)
3. **Corredor preferencial** (hortifruti, açougue, etc.)
4. **Frequência de compra**
5. **Recência de compra**

### Filtros Rápidos
- **Todos** - Mostra todos os itens
- **Por kg** - Apenas itens vendidos por peso
- **Pendências** - Itens com peso pendente

---

## 📱 Instalação

### Como PWA (Navegador)
1. Abra o app no navegador
2. Menu → Instalar aplicativo
3. Use como app nativo

### Build Android
```bash
# Instalar dependências
npm install

# Build Capacitor
npx cap sync android
npx cap open android

# Ou executar direto
npx cap run android
```

---

## 🔐 Privacidade

- **Dados locais**: Tudo armazenado no seu dispositivo
- **Sem servidor**: Não enviamos dados para nuvem
- **Sem rastreamento**: Sem analytics ou tracking
- **Código aberto**: Transparência total

---

## 🎨 Temas

### Tema Claro
- Fundo branco com elementos azul/roxo
- Ótimo para ambientes bem iluminados

### Tema Escuro
- Fundo escuro com acentos coloridos
- Confortável para uso noturno
- Economia de bateria em OLED

Alterne clicando no ícone ☀️/🌙 no cabeçalho.

---

## 🆘 Ajuda

### Dúvidas Frequentes

**Como adicionar um produto?**
- Modo planejamento → Digite o nome → Escolha quantidade e unidade → Adicionar

**Como marcar como comprado?**
- Modo mercado → Selecione o item → Informe preço → Marcar como Comprado

**Como ver o total gasto?**
- Entre no modo mercado → O total aparece automaticamente

**Como salvar uma lista?**
- Menu ⋯ → Salvar Lista → Digite um nome

**Como exportar meus dados?**
- Menu ⋯ → Exportar Dados → Escolha como compartilhar

**Itens comprados somem da lista?**
- Sim! No planejamento, só aparecem itens não comprados
- No mercado, aparecem todos (comprados ficam separados)

---

## 📞 Suporte

Encontrou um bug ou tem uma sugestão?  
Entre em contato: **[Alansr79@hotmail.com](mailto:Alansr79@hotmail.com)**

---

## 📄 Licença

© 2025 Alan Costa. Todos os direitos reservados.

---

**Versão**: 2.0  
**Última atualização**: 22/11/2025