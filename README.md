# Lista + – Lista de Compras Inteligente

## 🌟 Visão geral
PWA completo para planejar, comprar e controlar gastos no mercado. Funciona **100% offline**, instalável como app no celular. Sincronização em tempo real entre celulares (Android + iPhone) via código de 6 dígitos.

## 📦 Tecnologias
- **HTML5 / CSS3 / JavaScript** – estrutura, estilos, lógica
- **localStorage** – dados ficam no dispositivo
- **Supabase** (plano grátis) – sincronização em tempo real entre celulares
- **Capacitor** – build Android (opcional)

## 🛠️ Recursos
- Lista de compras com autocomplete (707 produtos) e unidade sugerida (kg/un/pacote)
- Modo Mercado: registrar preço, qtd real, kg, marcar comprado, total em tempo real
- Pendências de peso (itens por kg não pesados)
- Histórico de preços ("quanto paguei da última vez")
- Relatórios por categoria + gráfico + exportar CSV
- Unidade inteligente (aprende com seu histórico)
- Sugestões de recompra por recorrência
- Rollover: itens não comprados voltam na próxima compra
- Conferência antes de sair (avisa o que faltou)
- Orçamento com teto de gasto + alerta
- Sincronização em tempo real (código de 6 dígitos)
- Backup automático a cada 7 dias + exportar/importar
- Tema claro/escuro, PWA offline, instalável

## 📤 Sincronização (casal)
1. Um dos celulares: "🔗 Conectar casal" → "Gerar código" → anotar os 6 dígitos
2. Outro celular: "Conectar casal" → digitar o mesmo código → "Conectar"
3. A partir daí, a lista sincroniza em tempo real. Dados ficam no Supabase (privado).

## 📄 Licença
MIT – livre para uso, modificação e distribuição.

---
*Feito por **Alan Costa***