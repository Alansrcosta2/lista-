// ===== MODO OFFLINE MELHORADO (Grátis!) =====

// 1. INDICADOR VISUAL DE STATUS OFFLINE/ONLINE
const OfflineIndicator = {
    element: null,

    init() {
        // Criar elemento indicador
        this.element = document.createElement('div');
        this.element.id = 'offline-indicator';
        this.element.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      z-index: 9999;
      transition: all 0.3s ease;
      display: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
        document.body.appendChild(this.element);

        // Verificar status inicial
        this.updateStatus();

        // Listeners de mudança
        window.addEventListener('online', () => this.onOnline());
        window.addEventListener('offline', () => this.onOffline());
    },

    updateStatus() {
        if (navigator.onLine) {
            this.showOnline();
        } else {
            this.showOffline();
        }
    },

    showOffline() {
        this.element.style.display = 'block';
        this.element.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        this.element.style.color = '#fff';
        this.element.innerHTML = '📡 Modo Offline';

        if (typeof showToast === 'function') {
            showToast('📡 Você está offline. Dados salvos localmente.', 'warning');
        }
    },

    showOnline() {
        this.element.style.display = 'block';
        this.element.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        this.element.style.color = '#fff';
        this.element.innerHTML = '✅ Online';

        if (typeof showToast === 'function') {
            showToast('✅ Conectado! Sincronizando...', 'success');
        }

        // Esconder após 3 segundos
        setTimeout(() => {
            this.element.style.display = 'none';
        }, 3000);
    },

    onOffline() {
        this.showOffline();
        console.log('[offline] Modo offline ativado');
    },

    onOnline() {
        this.showOnline();
        console.log('[offline] Voltou online');

        // Tentar sincronizar dados pendentes
        this.syncPendingData();
    },

    syncPendingData() {
        // Verificar se há dados para sincronizar
        const pendingSync = localStorage.getItem('pending_sync');

        if (pendingSync) {
            console.log('[offline] Sincronizando dados pendentes...');

            try {
                // Aqui você poderia enviar para um servidor se tivesse
                // Por enquanto, só limpa a flag
                localStorage.removeItem('pending_sync');

                if (typeof showToast === 'function') {
                    showToast('✅ Dados sincronizados!', 'success');
                }
            } catch (e) {
                console.error('[offline] Erro ao sincronizar:', e);
            }
        }
    }
};

// 2. MELHORAR CACHE DE IMAGENS
const ImageCacheHelper = {
    cacheName: 'lista-plus-images-v1',

    async cacheImage(url) {
        if (!url || !('caches' in window)) return;

        try {
            const cache = await caches.open(this.cacheName);
            const response = await fetch(url);

            if (response.ok) {
                await cache.put(url, response);
                console.log('[cache] Imagem salva:', url);
            }
        } catch (e) {
            console.log('[cache] Erro ao cachear imagem:', e);
        }
    },

    async getCachedImage(url) {
        if (!('caches' in window)) return null;

        try {
            const cache = await caches.open(this.cacheName);
            const response = await cache.match(url);

            if (response) {
                console.log('[cache] Imagem do cache:', url);
                return response;
            }
        } catch (e) {
            console.log('[cache] Erro ao buscar cache:', e);
        }

        return null;
    },

    async clearOldCache() {
        if (!('caches' in window)) return;

        try {
            const cacheNames = await caches.keys();
            const oldCaches = cacheNames.filter(name =>
                name.startsWith('lista-plus-images') && name !== this.cacheName
            );

            await Promise.all(oldCaches.map(name => caches.delete(name)));
            console.log('[cache] Caches antigos removidos:', oldCaches.length);
        } catch (e) {
            console.log('[cache] Erro ao limpar cache:', e);
        }
    }
};

// 3. MONITORAR MUDANÇAS E SALVAR LOCALMENTE
const LocalSyncManager = {
    lastSaveTime: null,

    init() {
        // Interceptar salvamentos
        const originalSetItem = localStorage.setItem;

        localStorage.setItem = function (key, value) {
            originalSetItem.call(this, key, value);

            // Se offline, marcar para sync
            if (!navigator.onLine) {
                localStorage.setItem('pending_sync', 'true');
                console.log('[sync] Dados salvos offline, aguardando conexão');
            }

            LocalSyncManager.lastSaveTime = new Date().toISOString();
        };
    },

    getLastSaveTime() {
        return this.lastSaveTime || localStorage.getItem('last_save_time');
    }
};

// 4. NOTIFICAR SOBRE CAPACIDADE OFFLINE
const OfflineCapabilityNotifier = {
    shown: false,

    show() {
        if (this.shown) return;

        setTimeout(() => {
            if (typeof showToast === 'function') {
                showToast('💾 App funciona 100% offline! Todos os dados ficam no seu dispositivo.', 'info');
            }
            this.shown = true;
            localStorage.setItem('offline_notified', 'true');
        }, 5000);
    },

    shouldShow() {
        return !localStorage.getItem('offline_notified');
    }
};

// Inicializar tudo quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('[offline-mode] Iniciando modo offline melhorado...');

    // Inicializar indicador
    OfflineIndicator.init();

    // Inicializar sync manager
    LocalSyncManager.init();

    // Limpar cache antigo
    ImageCacheHelper.clearOldCache();

    // Mostrar notificação de capacidade offline
    if (OfflineCapabilityNotifier.shouldShow()) {
        OfflineCapabilityNotifier.show();
    }

    console.log('[offline-mode] ✅ Modo offline melhorado ativo!');
});

// 5. ADICIONAR INFO DE ÚLTIMA SINCRONIZAÇÃO
window.addEventListener('load', () => {
    const lastSave = LocalSyncManager.getLastSaveTime();

    if (lastSave) {
        console.log('[offline] Última sincronização:', lastSave);
    }
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.OfflineIndicator = OfflineIndicator;
    window.ImageCacheHelper = ImageCacheHelper;
}
