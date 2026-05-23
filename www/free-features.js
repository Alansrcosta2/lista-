// ===== MELHORIAS GRATUITAS =====

// 1. ENTRADA POR VOZ (Web Speech API - Grátis!)
document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('voice-add');

    if (!voiceBtn) return;

    // Verificar se o navegador suporta
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        voiceBtn.style.display = 'none';
        console.log('[voice] Navegador não suporta Web Speech API');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    let isListening = false;

    voiceBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
            return;
        }

        // Iniciar gravação
        isListening = true;
        voiceBtn.textContent = '🔴';
        voiceBtn.style.animation = 'pulse 1s infinite';

        try {
            recognition.start();
        } catch (e) {
            console.error('[voice] Erro ao iniciar:', e);
            resetVoiceButton();
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('[voice] Reconhecido:', transcript);

        // Processar múltiplos itens: "banana e maçã e leite"
        const items = transcript.split(' e ').map(item => item.trim()).filter(item => item.length > 0);

        items.forEach(itemName => {
            // Adicionar à lista
            const lista = JSON.parse(localStorage.getItem('shoppingList_v3') || '[]');

            // Verificar se já existe
            const exists = lista.some(it => it.nome.toLowerCase() === itemName.toLowerCase());
            if (!exists) {
                lista.push({
                    nome: itemName.charAt(0).toUpperCase() + itemName.slice(1),
                    qtd: 1,
                    unidade: 'un',
                    categoria: '',
                    comprado: false,
                    preco: null,
                    total: null,
                    notes: null
                });
            }

            localStorage.setItem('shoppingList_v3', JSON.stringify(lista));
        });

        // Feedback
        if (items.length > 0) {
            const msg = items.length === 1
                ? `✅ Adicionado: ${items[0]}`
                : `✅ Adicionados ${items.length} itens: ${items.join(', ')}`;

            // Usar showToast se existir
            if (typeof showToast === 'function') {
                showToast(msg, 'success');
            } else {
                alert(msg);
            }

            // Recarregar página para mostrar os itens
            location.reload();
        }
    };

    recognition.onerror = (event) => {
        console.error('[voice] Erro:', event.error);
        let errorMsg = 'Erro ao reconhecer voz';

        switch (event.error) {
            case 'no-speech':
                errorMsg = 'Nenhuma fala detectada';
                break;
            case 'audio-capture':
                errorMsg = 'Microfone não encontrado';
                break;
            case 'not-allowed':
                errorMsg = 'Permissão de microfone negada';
                break;
        }

        if (typeof showToast === 'function') {
            showToast(errorMsg, 'error');
        } else {
            alert(errorMsg);
        }

        resetVoiceButton();
    };

    recognition.onend = () => {
        resetVoiceButton();
    };

    function resetVoiceButton() {
        isListening = false;
        voiceBtn.textContent = '🎤';
        voiceBtn.style.animation = '';
    }
});

// 2. SWIPE PARA DELETAR
document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchEndX = 0;
    let currentRow = null;

    const handleSwipe = () => {
        const diff = touchStartX - touchEndX;
        const threshold = 100; // pixels

        if (!currentRow) return;

        // Swipe left (deletar)
        if (diff > threshold) {
            const idx = currentRow.dataset.i;
            if (idx !== undefined) {
                const lista = JSON.parse(localStorage.getItem('shoppingList_v3') || '[]');
                const itemName = lista[idx]?.nome || 'Item';

                if (confirm(`Deletar "${itemName}"?`)) {
                    lista.splice(idx, 1);
                    localStorage.setItem('shoppingList_v3', JSON.stringify(lista));

                    if (typeof showToast === 'function') {
                        showToast(`🗑️ ${itemName} removido`, 'info');
                    }

                    location.reload();
                }
            }
        }

        // Swipe right (marcar comprado) - opcional
        if (diff < -threshold) {
            console.log('[swipe] Swipe right detectado (futuro: marcar comprado)');
        }
    };

    // Adicionar listeners após tabela carregar
    setTimeout(() => {
        document.querySelectorAll('#lista tbody tr').forEach(row => {
            row.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                currentRow = row;
            });

            row.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                currentRow = null;
            });
        });
    }, 1000);
});

// CSS para animação do botão de voz
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
`;
document.head.appendChild(style);
