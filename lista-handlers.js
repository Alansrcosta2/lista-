// Handler para botão "Ver minha lista" no modal de busca (problema #9)
document.addEventListener('DOMContentLoaded', () => {
    const searchViewListBtn = document.getElementById('search-view-list');
    if (searchViewListBtn) {
        searchViewListBtn.addEventListener('click', () => {
            const searchResults = document.getElementById('search-results');
            const searchStatus = document.getElementById('search-status');

            // Pegar referência à lista atual
            const listaAtual = JSON.parse(localStorage.getItem('shoppingList_v3') || '[]');
            const items = listaAtual.filter(it => !it.comprado);

            if (items.length === 0) {
                if (searchResults) searchResults.innerHTML = '<em>Sua lista está vazia ou todos os itens já foram comprados.</em>';
                if (searchStatus) searchStatus.textContent = 'Lista vazia';
                return;
            }

            // Função emojiDe simplificada para este contexto
            const getEmoji = (nome) => {
                const n = String(nome || '').toLowerCase();
                if (n.includes('banana')) return '🍌';
                if (n.includes('maçã') || n.includes('maca')) return '🍎';
                if (n.includes('laranja')) return '🍊';
                if (n.includes('carne')) return '🥩';
                if (n.includes('frango')) return '🍗';
                if (n.includes('leite')) return '🥛';
                if (n.includes('pão') || n.includes('pao')) return '🍞';
                return '📦';
            };

            if (searchResults) {
                searchResults.innerHTML = items.map(it => {
                    const nome = it.nome || 'Item';
                    const qtd = it.qtd || 1;
                    const uni = it.unidade || 'un';
                    const em = getEmoji(nome);
                    return `<div class="saved-list-item"><span>${em} ${nome} — ${qtd} ${uni}</span><div class="saved-list-actions"><button class="pick-online" data-n="${encodeURIComponent(nome)}" data-code="" data-img="" data-uni="${uni}">Selecionar</button></div></div>`;
                }).join('');
            }
            if (searchStatus) searchStatus.textContent = `${items.length} item(ns) na sua lista`;
        });
    }

    // Handler para toggle da tabela de planejamento (problema #10)
    const toggleListaBtn = document.getElementById('toggle-lista');
    const listaWrapper = document.getElementById('lista-wrapper');

    if (toggleListaBtn && listaWrapper) {
        let isHidden = false;

        toggleListaBtn.addEventListener('click', () => {
            isHidden = !isHidden;
            listaWrapper.style.display = isHidden ? 'none' : '';
            toggleListaBtn.textContent = isHidden ? '▶ Mostrar' : '▼ Ocultar';
        });
    }
});
