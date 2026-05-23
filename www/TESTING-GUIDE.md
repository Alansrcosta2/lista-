# 🧪 Guia de Testes - Lista+ v2.1

## ⚡ Teste Rápido (5 minutos)

### 1. Abrir o App
- Abra `index.html` no navegador (Edge/Chrome)
- ✅ Deve carregar sem erros no console (F12)

### 2. Testar Entrada por Voz 🎤
1. Clique no botão 🎤 ao lado de "Adicionar"
2. Permitir acesso ao microfone
3. Fale: "banana e maçã e leite"
4. ✅ Deve adicionar 3 itens à lista

**Se der erro**: Verifique se permitiu o microfone

### 3. Testar Campo de Notas 📝
1. Digite um produto: "Banana"
2. No campo "📝 Notas": "Preferir orgânicas"
3. Clique "Adicionar"
4. ✅ Nota deve aparecer salva (verificar no localStorage)

### 4. Testar Indicador Offline 📡
1. Abrir console (F12)
2. Aba Network → Offline (checkbox)
3. ✅ Deve aparecer "📡 Modo Offline" no canto superior direito
4. Desmarcar Offline
5. ✅ Deve mostrar "✅ Online" e desaparecer em 3s

### 5. Testar Notificações 🔔
1. Aguardar 5 segundos após abrir
2. Deve aparecer botão "🔔 Ativar Notificações"
3. Clicar e permitir
4. ✅ Deve mostrar notificação de confirmação

### 6. Testar Atalhos ⌨️
1. Pressione `Ctrl+N`
2. ✅ Deve focar no campo "Nome do produto"
3. Pressione `Ctrl+M`
4. ✅ Deve ir para Modo Mercado
5. Pressione `ESC`
6. ✅ Deve fechar modais abertos

---

## 🔍 Teste Completo (15 minutos)

### Correções Originais (11)

#### 1. Editar Pendências
- [ ] Adicionar produto "Banana" com unidade "kg"
- [ ] Ir para mercado, selecionar e marcar comprado
- [ ] **NÃO** informar peso
- [ ] Clicar "Editar pendências"
- [ ] ✅ Item deve ser selecionado, foco no peso

#### 2. Total Oculto no Planejamento
- [ ] Estar no modo planejamento
- [ ] ✅ **NÃO** deve mostrar "Total da compra"
- [ ] Ir para mercado
- [ ] ✅ Agora deve mostrar o total

#### 3. Modal de Busca Limpo
- [ ] Ir para mercado → "Buscar produto online"
- [ ] Digitar "coca cola" e buscar
- [ ] Fechar modal
- [ ] Abrir novamente
- [ ] ✅ Campos devem estar vazios

#### 4. Busca Online
- [ ] "Buscar produto online"
- [ ] Digitar "coca cola"
- [ ] ✅ Deve retornar resultados

#### 5. Exportar Dados
- [ ] Menu ⋯ → Exportar Dados
- [ ] ✅ Deve baixar JSON ou abrir compartilhar
- [ ] ✅ Deve mostrar toast verde "✅ Dados exportados"

#### 6. Sistema de Feedback
- [ ] Tentar adicionar item sem nome
- [ ] ✅ Deve mostrar toast vermelho com erro
- [ ] Adicionar item válido
- [ ] ✅ Deve mostrar toast verde de sucesso

#### 7. Tooltips
- [ ] Passar mouse sobre "Editar pendências"
- [ ] ✅ Deve aparecer tooltip explicativo
- [ ] Passar mouse sobre "🎤"
- [ ] ✅ Tooltip deve explicar entrada por voz

#### 8. Comprados Filtrados
- [ ] Adicionar produto no planejamento
- [ ] Ir para mercado, marcar como comprado
- [ ] Voltar para planejamento
- [ ] ✅ Produto **NÃO** deve aparecer

#### 9. Ver Lista no Modal
- [ ] Adicionar alguns produtos
- [ ] "Buscar produto online"
- [ ] Clicar "📋 Ver minha lista"
- [ ] ✅ Deve mostrar produtos da lista

#### 10. Toggle Tabela
- [ ] Clicar botão "▼ Ocultar" acima da tabela
- [ ] ✅ Tabela deve desaparecer, botão vira "▶ Mostrar"
- [ ] Clicar novamente
- [ ] ✅ Tabela deve aparecer

#### 11. Botão Comprados Salvos
- [ ] Rolar até o final da página
- [ ] ✅ Deve ter botão "Abrir Comprados Salvos"
- [ ] Clicar nele
- [ ] ✅ Deve abrir modal de listas

---

### Melhorias Gratuitas (8)

#### 12. Entrada por Voz 🎤
- [ ] Clicar botão 🎤
- [ ] ✅ Deve ficar vermelho e pulsar
- [ ] Falar: "arroz e feijão e óleo"
- [ ] ✅ Deve adicionar 3 itens
- [ ] ✅ Deve mostrar toast de confirmação

#### 13. Campo de Notas 📝
- [ ] Adicionar "Leite", nota: "Sem lactose"
- [ ] ✅ Deve salvar no localStorage
- [ ] Verificar console: `localStorage.getItem('shoppingList_v3')`
- [ ] ✅ Item deve ter propriedade "notes"

#### 14. Swipe para Deletar ⚡
**Mobile/Touch apenas**
- [ ] Deslizar item para esquerda
- [ ] ✅ Deve pedir confirmação
- [ ] Confirmar
- [ ] ✅ Item deve ser deletado

#### 15. Notificações Web 🔔
- [ ] Aguardar botão flutuante aparecer (5s)
- [ ] Clicar "🔔 Ativar Notificações"
- [ ] Permitir no navegador
- [ ] ✅ Notificação deve aparecer
- [ ] ✅ Botão desaparece

#### 16. QR Code 📱
**Preparado, não ativo ainda**
- [ ] Verificar no console: `typeof QRCode`
- [ ] ✅ Deve retornar "function" (biblioteca carregada)

#### 17. Atalhos de Teclado ⌨️
- [ ] `Ctrl+N` → ✅ Foca campo nome
- [ ] `Ctrl+M` → ✅ Modo mercado
- [ ] `Ctrl+P` → ✅ Volta planejamento
- [ ] `ESC` → ✅ Fecha modais

#### 18. Estilos para Notas 👁️
- [ ] Adicionar produto com nota
- [ ] ✅ Nota deve aparecer com ícone 📝
- [ ] ✅ Fonte menor, itálico
- [ ] ✅ Animação suave

#### 19. Modo Offline Melhorado 📡
- [ ] Abrir Dev Tools (F12)
- [ ] Network → Marcar "Offline"
- [ ] ✅ Indicador "📡 Modo Offline" aparece
- [ ] Adicionar item offline
- [ ] Desmarcar "Offline"
- [ ] ✅ Indicador "✅ Online" aparece
- [ ] ✅ Toast "Sincronizando..."

---

## 🐛 Checklist de Erros Comuns

### Console (F12)
- [ ] ✅ Sem erros vermelhos
- [ ] ✅ Scripts carregados: produtos.js, main.clean.js, lista-handlers.js, free-features.js, free-features-extra.js, offline-mode.js

### LocalStorage
```javascript
// Verificar dados no console
localStorage.getItem('shoppingList_v3')
localStorage.getItem('boughtItems_v2')
localStorage.getItem('priceHistory_v1')
```
- [ ] ✅ Dados devem estar salvos corretamente

### Permissões
- [ ] ✅ Microfone permitido (para voz)
- [ ] ✅ Notificações permitidas
- [ ] ✅ Localização permitida (para mapas)

---

## 📱 Teste Mobile

Se tiver Android/iOS:

1. **PWA Install**
   - [ ] Menu → Instalar aplicativo
   - [ ] ✅ Deve adicionar à tela inicial

2. **Swipe Gestures**
   - [ ] Deslizar items
   - [ ] ✅ Deve deletar

3. **Offline Mode**
   - [ ] Ativar modo avião
   - [ ] ✅ App deve continuar funcionando

---

## 🎯 Resultado Esperado

**Tudo funcionando**: 19/19 ✅  
**Alguns problemas**: Anote quais falharam  
**Muitos erros**: Verifique console do navegador

---

## 📞 Se algo não funcionar

**Anote:**
1. Qual funcionalidade
2. O que aconteceu
3. Mensagem de erro (se houver)
4. Navegador e versão

**Comunique**: Me passe os erros que eu corrijo! 🔧

---

## ✅ Checklist Visual Rápido

```
[ ] App abre sem erro
[ ] 🎤 Botão de voz aparece
[ ] 📝 Campo de notas presente
[ ] 📡 Indicador offline funciona
[ ] 🔔 Botão notificações aparece
[ ] ⌨️ Atalhos funcionam
[ ] 💬 Toasts aparecem coloridos
[ ] 💾 Dados salvam no localStorage
```

**Tempo estimado**: 15-20 minutos para teste completo

Boa sorte! 🚀
