/* ===== MELHORIAS EXTRAS GRATUITAS ===== */

// 3. EXIBIR NOTAS NA TABELA
// Adicionar CSS para mostrar notas de forma discreta
const notesStyle = document.createElement('style');
notesStyle.textContent = `
  .item-note {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-style: italic;
    margin-top: 2px;
    opacity: 0.8;
  }
  
  .item-note:before {
    content: "📝 ";
  }
  
  /* Animação suave para notas */
  .item-note {
    animation: fadeInNote 0.3s ease;
  }
  
  @keyframes fadeInNote {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 0.8; transform: translateY(0); }
  }
`;
document.head.appendChild(notesStyle);

// 4. NOTIFICAÇÕES WEB (grátis!)
const NotificationHelper = {
    isSupported: 'Notification' in window,
    permission: null,

    async requestPermission() {
        if (!this.isSupported) {
            console.log('[notify] Notificações não suportadas');
            return false;
        }

        try {
            this.permission = await Notification.requestPermission();
            return this.permission === 'granted';
        } catch (e) {
            console.error('[notify] Erro ao pedir permissão:', e);
            return false;
        }
    },

    show(title, options = {}) {
        if (!this.isSupported || this.permission !== 'granted') {
            return;
        }

        const defaultOptions = {
            icon: 'icon-192.png',
            badge: 'icon-72.png',
            vibrate: [200, 100, 200],
            ...options
        };

        return new Notification(title, defaultOptions);
    },

    notifyPendingItems() {
        const lista = JSON.parse(localStorage.getItem('shoppingList_v3') || '[]');
        const pending = lista.filter(it => !it.comprado).length;

        if (pending > 0) {
            this.show('Lista+', {
                body: `Você tem ${pending} item(ns) pendente(s) na sua lista! 🛒`,
                tag: 'pending-items'
            });
        }
    }
};

// Pedir permissão de notificação após 5 segundos
setTimeout(() => {
    if (NotificationHelper.isSupported && Notification.permission === 'default') {
        const askBtn = document.createElement('button');
        askBtn.textContent = '🔔 Ativar Notificações';
        askBtn.className = 'config-btn';
        askBtn.style.cssText = 'position:fixed; bottom:80px; right:20px; z-index:999; animation: pulse 2s infinite;';

        askBtn.onclick = async () => {
            const granted = await NotificationHelper.requestPermission();
            if (granted) {
                NotificationHelper.show('Lista+', {
                    body: 'Notificações ativadas com sucesso! ✅'
                });
                askBtn.remove();
            }
        };

        document.body.appendChild(askBtn);

        // Remover botão após 30 segundos
        setTimeout(() => askBtn.remove(), 30000);
    }
}, 5000);

// 5. COMPARTILHAR VIA QR CODE (biblioteca grátis)
// Vamos criar a função, mas a biblioteca será carregada via CDN no HTML

const QRShareHelper = {
    generateQRCode(containerId, text) {
        // Esta função será ativada quando a biblioteca QRCode.js estiver carregada
        if (typeof QRCode === 'undefined') {
            console.log('[qr] Biblioteca QRCode.js não carregada ainda');
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = ''; // Limpar

        new QRCode(container, {
            text: text,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    },

    shareList() {
        const lista = JSON.parse(localStorage.getItem('shoppingList_v3') || '[]');
        const data = {
            app: 'Lista+',
            version: '2.0',
            timestamp: new Date().toISOString(),
            items: lista
        };

        const jsonStr = JSON.stringify(data);
        const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
        const shareUrl = `https://lista-plus.app/import?data=${base64}`;

        return shareUrl;
    }
};

// 6. ATALHOS DE TECLADO (grátis!)
document.addEventListener('keydown', (e) => {
    // Ctrl+N - Novo item
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        const nomeInput = document.getElementById('nome');
        if (nomeInput) {
            nomeInput.focus();
            if (typeof showToast === 'function') {
                showToast('💡 Atalho: Ctrl+N = Novo item', 'info');
            }
        }
    }

    // Ctrl+M - Modo Mercado
    if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        const modoBtn = document.getElementById('modo-mercado');
        if (modoBtn && modoBtn.style.display !== 'none') {
            modoBtn.click();
        }
    }

    // Ctrl+P - Voltar Planejamento
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        const voltarBtn = document.getElementById('voltar-planejamento');
        if (voltarBtn && voltarBtn.style.display !== 'none') {
            voltarBtn.click();
        }
    }

    // ESC - Fechar modais
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
                modal.classList.remove('visible');
            }
        });
    }
});

// 7. SCROLL SUAVE AUTOMÁTICO
// Quando adicionar item, scroll suave para o topo
const originalReload = location.reload;
if (typeof showToast === 'function') {
    // Mostrar dica de atalhos na primeira vez
    const firstTime = !localStorage.getItem('shortcuts_shown');
    if (firstTime) {
        setTimeout(() => {
            showToast('💡 Dica: Use Ctrl+N para novo item, Ctrl+M para mercado', 'info');
            localStorage.setItem('shortcuts_shown', 'true');
        }, 3000);
    }
}

console.log('[free-features] Melhorias gratuitas carregadas! 🎉');
console.log('[free-features] - Entrada por voz 🎤');
console.log('[free-features] - Swipe para deletar ⚡');
console.log('[free-features] - Notificações web 🔔');
console.log('[free-features] - Atalhos de teclado ⌨️');
console.log('[free-features] - QR Code compartilhamento 📱');
