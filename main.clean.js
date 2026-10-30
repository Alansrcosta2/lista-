function updateAppHeight() {
  try {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
    const appHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    document.documentElement.style.setProperty('--app-height', appHeight + 'px');
  } catch (err) {
    console.warn('[layout] updateAppHeight error', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateAppHeight();
  setTimeout(updateAppHeight, 500);
  window.addEventListener('resize', updateAppHeight, { passive: true });
  window.addEventListener('orientationchange', updateAppHeight, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateAppHeight, { passive: true });
    window.visualViewport.addEventListener('scroll', updateAppHeight, { passive: true });
  }

  // ===== STATE =====
  let lista = JSON.parse(localStorage.getItem('shoppingList_v3') || '[]');
  window.lista = lista;
  let listasSalvas = JSON.parse(localStorage.getItem('savedLists_v3') || '{}');
  let ultimaCompra = JSON.parse(localStorage.getItem('ultimaCompra_v1') || '[]');
  let savedPurchases = JSON.parse(localStorage.getItem('savedPurchases_v1') || '{}');
  let selecionado = null;
  let editingBoughtIndex = null;
  let modoMercadoAtivo = false;
  window.addEventListener('error', (e) => { try { console.log('[error]', e.message || e); } catch (_) { } });
  window.addEventListener('unhandledrejection', (e) => { try { console.log('[unhandledrejection]', e.reason || e); } catch (_) { } });

  // ===== ELEMENTS =====
  const el = (id) => document.getElementById(id);
  const els = {
    nome: el('nome'),
    quantidade: el('quantidade'),
    unidadeSel: el('unidade'),
    adicionar: el('adicionar'),
    modoMercado: el('modo-mercado'),
    formPlan: el('form-planejamento'),
    formMercado: el('form-mercado'),
    nomeMercado: el('nome-mercado'),
    valorMercado: el('valor-mercado'),
    pesoMercado: el('peso-mercado'),
    compraKg: document.getElementById('compra-kg'),
    indicadorPreco: el('indicador-preco'),
    verHistoricoPreco: document.getElementById('ver-historico-preco'),
    adicionarComprado: el('adicionar-comprado'),
    marcarPesoDepois: document.getElementById('marcar-peso-depois'),
    voltarPlan: el('voltar-planejamento'),
    tabela: document.querySelector('#lista tbody'),
    tabelaComprados: document.querySelector('#lista-comprados tbody'),
    compradosWrapper: el('comprados-wrapper'),
    compradosSection: document.getElementById('comprados-section'),
    compradosToggle: document.getElementById('comprados-toggle'),
    compradosCount: document.getElementById('comprados-count'),
    compradosPending: document.getElementById('comprados-pending'),
    compradosTotalBadge: document.getElementById('comprados-total-badge'),
    categoriaFiltro: el('categoria-filtro'),
    pesquisa: el('pesquisa'),
    infoMercado: el('info-mercado'),
    alertaFaltando: el('alerta-faltando'),
    totalCompra: el('total-compra'),
    editarPendencias: document.getElementById('editar-pendencias'),
    apagarLista: el('apagar-lista'),
    salvarLista: el('salvar-lista'),
    abrirListas: el('abrir-listas'),
    exportarDados: el('exportar-dados'),
    modalListas: el('modal-listas'),
    fecharListas: el('fechar-listas'),
    savedListsContainer: el('saved-lists-container'),
    themeToggle: el('theme-toggle'),
    shareBtn: document.getElementById('share-btn'),
    autocompleteList: el('autocomplete-list'),
    autocompleteMercadoList: document.getElementById('autocomplete-mercado-list'),
    // Config modal
    configBtn: el('config-btn'),
    modalConfig: el('modal-config'),
    fecharConfig: el('fechar-config'),
    limparBanco: el('btn-limpar-banco'),
    suggestedProductsContainer: el('suggested-products-container'),
    localBaseContainer: document.getElementById('local-base-container'),
    // Header menu & filtros
    menuBtn: el('menu-btn'),
    headerMenu: el('header-menu'),
    filterToggle: el('filter-toggle'),
    filtroDiv: el('filtro'),
    listaWrapper: document.getElementById('lista-wrapper'),
    quickFilters: document.getElementById('quick-filters'),
    qfAll: document.getElementById('qf-all'),
    qfKg: document.getElementById('qf-kg'),
    qfPending: document.getElementById('qf-pending'),
    // Busca Online
    searchOpen: document.getElementById('online-search-open'),
    searchClose: document.getElementById('search-close'),
    searchInput: document.getElementById('search-input'),
    searchEan: document.getElementById('search-ean'),
    searchBtn: document.getElementById('search-btn'),
    searchResults: document.getElementById('search-results'),
    searchStatus: document.getElementById('search-status'),
    // scanCapture: document.getElementById('scan-capture'),
    // AI
    gerarAi: document.getElementById('gerar-ai'),
    modalAi: document.getElementById('modal-ai'),
    fecharAi: document.getElementById('fechar-ai'),
    aiPrompt: document.getElementById('ai-prompt'),
    cancelarAi: document.getElementById('cancelar-ai'),
    gerarAiConfirm: document.getElementById('gerar-ai-confirm'),
    // Onboarding
    modalOnboarding: document.getElementById('modal-onboarding'),
    fecharOnboarding: document.getElementById('fechar-onboarding'),
    onboardingNext: document.getElementById('onboarding-next'),
    // Maps
    mapsBtn: document.getElementById('maps-btn'),
    modalMaps: document.getElementById('modal-maps'),
    fecharMaps: document.getElementById('fechar-maps'),
    mapsNearest: document.getElementById('maps-nearest'),
    mapsList: document.getElementById('maps-list'),
    mapsLoading: document.getElementById('maps-loading'),
    shareModal: document.getElementById('modal-share'),
    shareClose: document.getElementById('fechar-share'),
    shareOptionList: document.getElementById('share-option-list'),
    shareOptionBought: document.getElementById('share-option-bought'),
  };


  // Diagnóstico mínimo
  const diag = () => {
    try {
      const ids = ['nome', 'quantidade', 'adicionar', 'modo-mercado', 'form-planejamento', 'form-mercado', 'nome-mercado', 'valor-mercado', 'peso-mercado', 'indicador-preco', 'adicionar-comprado', 'voltar-planejamento', 'lista', 'lista-comprados', 'comprados-wrapper', 'info-mercado', 'alerta-faltando', 'total-compra', 'apagar-lista', 'salvar-lista', 'abrir-listas', 'exportar-dados', 'modal-listas', 'fechar-listas', 'saved-lists-container', 'theme-toggle', 'modal-config', 'fechar-config', 'btn-limpar-banco', 'reports-btn', 'modal-relatorios', 'fechar-relatorios', 'relatorio-conteudo'];
      const missing = ids.filter(id => !document.getElementById(id));
      console.log('[diag] missing ids:', missing);
      console.log('[diag] lista:', lista.length, 'boughtItems:', (JSON.parse(localStorage.getItem('boughtItems_v3') || '[]') || []).length);
      console.log('[diag] displays:', {
        plan: els.formPlan && getComputedStyle(els.formPlan).display,
        mercado: els.formMercado && getComputedStyle(els.formMercado).display,
        infoMercado: els.infoMercado && getComputedStyle(els.infoMercado).display
      });
    } catch (e) { console.log('[diag] error', e && e.message ? e.message : e); }
  };
  try { window.__diag = diag; } catch (_) { }
  setTimeout(diag, 200);

  // ===== PERMISSIONS (Capacitor / Web) =====
  let isNativePlatform = false;
  try {
    if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) {
      isNativePlatform = true;
    } else if (window.Capacitor && typeof window.Capacitor.isNative === 'boolean') {
      isNativePlatform = window.Capacitor.isNative;
    }
  } catch (_err) { }

  const isStatusGranted = (status) => {
    if (!status) return false;
    const norm = typeof status === 'string' ? status.toLowerCase() : status;
    return norm === 'granted' || norm === 'limited' || norm === 'always';
  };

  async function ensurePermission(name) {
    try {
      const cap = window.Capacitor;
      const plugins = (cap && cap.Plugins) || {};

      if (isNativePlatform) {
        try {
          if (plugins.Permissions && plugins.Permissions.checkPermission) {
            const current = await plugins.Permissions.checkPermission({ name });
            if (isStatusGranted(current && current.state) || (current && current.granted === true)) return true;
          }
        } catch (err) {
          console.log('[perm] check error', name, err);
        }

        if (name === 'geolocation' && plugins.Geolocation && plugins.Geolocation.requestPermissions) {
          try {
            const res = await plugins.Geolocation.requestPermissions();
            if (isStatusGranted(res && res.location) || isStatusGranted(res && res.coarseLocation)) return true;
            if (res && res.granted === true) return true;
          } catch (err) {
            console.log('[perm] geolocation request error', err);
          }
        }

        if (plugins.Permissions && plugins.Permissions.requestPermission) {
          const res = await plugins.Permissions.requestPermission({ name });
          if (isStatusGranted(res && res.state) || (res && res.granted === true)) return true;
          return false;
        }
        if (plugins.Permissions && plugins.Permissions.request) {
          const res = await plugins.Permissions.request({ name });
          if (isStatusGranted(res && res.state) || (res && res.granted === true)) return true;
          return false;
        }

        if (name === 'geolocation' && plugins.Geolocation && plugins.Geolocation.checkPermissions) {
          try {
            const check = await plugins.Geolocation.checkPermissions();
            if (isStatusGranted(check && check.location) || isStatusGranted(check && check.coarseLocation)) return true;
          } catch (err) {
            console.log('[perm] geolocation check error', err);
          }
        }
      }

      if (navigator && navigator.permissions && navigator.permissions.query) {
        try {
          const status = await navigator.permissions.query({ name });
          if (isStatusGranted(status.state)) return true;
          if (status.state === 'prompt') return true; // user will be prompted on access
          if (status.state === 'denied') return false;
        } catch (_err) { }
      }

      return true;
    } catch (err) {
      console.log('[perm] ensure error', name, err);
      return true;
    }
  }

  // ===== UI STATE =====
  let listaColapsada = false;
  let quickFilter = 'all'; // all | kg | pending
  let listFilter = '';
  let budget = parseFloat(localStorage.getItem('budget_v1') || '0') || 0;
  let compradosExpanded = false;

  // ===== THEME =====
  const solUrl = 'menu-icons/sol.png';
  const luaUrl = 'menu-icons/lua-crescente.png';
  const trashUrl = 'menu-icons/icons8-lixeira-480.png';
  const updateThemeIcon = (theme) => {
    if (!els.themeToggle) return;
    const img = els.themeToggle.querySelector('img.theme-icon');
    if (img) {
      if (theme === 'dark') {
        img.src = solUrl;
        img.alt = 'Alternar para tema claro';
      } else {
        img.src = luaUrl;
        img.alt = 'Alternar para tema escuro';
      }
    }
  };

  const applyTheme = (t) => {
    document.body.dataset.theme = t;
    localStorage.setItem('theme_v3', t);
    updateThemeIcon(t);
  };
  applyTheme(localStorage.getItem('theme_v3') || document.body.dataset.theme || 'light');
  if (els.themeToggle) {
    els.themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.dataset.theme === 'dark' ? 'dark' : 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      console.log('[theme] toggled to', nextTheme);
    });
  }

  // ===== ONBOARDING =====
  const showOnboarding = () => {
    // ... rest of the code remains the same ...
    if (localStorage.getItem('onboardingDone')) return;
    if (els.modalOnboarding) {
      els.modalOnboarding.style.display = 'flex';
      els.modalOnboarding.classList.add('visible');
    }
  };
  const closeOnboarding = () => {
    if (els.modalOnboarding) {
      els.modalOnboarding.classList.remove('visible');
      els.modalOnboarding.style.display = 'none';
    }
    localStorage.setItem('onboardingDone', 'true');
  };
  if (els.fecharOnboarding) els.fecharOnboarding.addEventListener('click', closeOnboarding);
  if (els.onboardingNext) els.onboardingNext.addEventListener('click', closeOnboarding);
  if (els.modalOnboarding) window.addEventListener('click', (e) => { if (e.target === els.modalOnboarding) closeOnboarding(); });

  // Show onboarding after splash
  setTimeout(showOnboarding, 2500);

  // ===== MAPS INTEGRATION =====
  // Haversine formula to calculate distance
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }
  const openExternalUrl = async (url) => {
    try {
      const launcher = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AppLauncher;
      if (launcher && launcher.canOpenUrl) {
        const can = await launcher.canOpenUrl({ url });
        if (can && can.value) {
          await launcher.openUrl({ url });
          return;
        }
      }
    } catch (err) {
      console.log('[openExternalUrl] fallback', err);
    }
    try {
      window.location.href = url;
    } catch (_err) {
      window.open(url, '_blank');
    }
  };
  const openMapsModal = () => {
    if (!els.modalMaps) return;
    els.modalMaps.style.display = 'flex';
    els.modalMaps.classList.add('visible');
  };
  const closeMapsModal = () => {
    if (!els.modalMaps) return;
    els.modalMaps.classList.remove('visible');
    els.modalMaps.style.display = 'none';
  };
  if (els.mapsBtn) {
    els.mapsBtn.addEventListener('click', openMapsModal);
  }
  if (els.fecharMaps) els.fecharMaps.addEventListener('click', closeMapsModal);
  if (els.modalMaps) window.addEventListener('click', (e) => { if (e.target === els.modalMaps) closeMapsModal(); });
  if (els.mapsNearest) {
    els.mapsNearest.addEventListener('click', async () => {
      const permissionOk = await ensurePermission('geolocation');
      if (!permissionOk) { alert('Permita o acesso à localização.'); return; }
      if (!navigator.geolocation) { alert('Geolocalização não disponível.'); return; }
      if (els.mapsLoading) { els.mapsLoading.textContent = 'Obtendo localização...'; els.mapsLoading.style.display = 'block'; }
      if (els.mapsList) els.mapsList.innerHTML = '';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (els.mapsLoading) els.mapsLoading.style.display = 'none';
          if (els.mapsList) els.mapsList.innerHTML = '<p style="margin-bottom:10px;">Abrindo o Maps com supermercados próximos...</p>';
          openExternalUrl('https://www.google.com/maps/search/supermercado+perto+de+mim/@' + lat + ',' + lng + ',15z');
          setTimeout(closeMapsModal, 600);
        },
        (err) => {
          if (els.mapsLoading) els.mapsLoading.style.display = 'none';
          alert('Não foi possível obter sua localização.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  const openShareModal = () => {
    if (!els.shareModal) {
      shareListaAtual();
      return;
    }
    els.shareModal.style.display = 'flex';
    els.shareModal.classList.add('visible');
  };

  if (els.shareBtn) {
    els.shareBtn.addEventListener('click', () => {
      openShareModal();
    });
  }

  // ===== HEADER MENU (⋯) =====
  if (els.menuBtn && els.headerMenu) {
    const toggleMenu = () => {
      els.headerMenu.style.display = (els.headerMenu.style.display === 'none' || !els.headerMenu.style.display) ? 'block' : 'none';
    };
    const closeHeaderMenu = () => {
      if (els.headerMenu) els.headerMenu.style.display = 'none';
    };
    els.menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    document.addEventListener('click', (e) => {
      if (!els.headerMenu.contains(e.target) && e.target !== els.menuBtn) {
        closeHeaderMenu();
      }
    });
    const headerMenuCloseBtn = els.headerMenu.querySelector('.header-menu-close');
    if (headerMenuCloseBtn) {
      headerMenuCloseBtn.addEventListener('click', closeHeaderMenu);
    }
    els.headerMenu.addEventListener('click', (e) => {
      const act = e.target.getAttribute && e.target.getAttribute('data-action');
      if (!act) return;
      els.headerMenu.style.display = 'none';
      console.log('[menu]', act);
      if (act === 'config') { openConfig(); return; }
      if (act === 'ajuda') { const m = document.getElementById('modal-ajuda'); if (m) { m.style.display = 'flex'; m.classList.add('visible'); } else { alert('Ajuda indisponível.'); } return; }
      if (act === 'apagar') els.apagarLista && els.apagarLista.click();
      else if (act === 'salvar') els.salvarLista && els.salvarLista.click();
      else if (act === 'abrir') els.abrirListas && els.abrirListas.click();
      else if (act === 'exportar') els.exportarDados && els.exportarDados.click();
      else if (act === 'importar') {
        const importBtn = document.getElementById('importar-dados');
        if (importBtn) importBtn.click();
      } else if (act === 'repetir') {
        if (!Array.isArray(ultimaCompra) || !ultimaCompra.length) { if (typeof showToast === 'function') showToast('Nenhuma compra anterior salva.', 'info'); return; }
        let add = 0;
        ultimaCompra.forEach(it => {
          const existe = (Array.isArray(lista) ? lista : []).some(x => String(x.nome || '').toLowerCase() === String(it.nome || '').toLowerCase() && !x.comprado);
          if (!existe) {
            lista.push({ nome: it.nome, qtd: it.qtd || 1, unidade: it.unidade || 'un', corredor: null, categoria: it.categoria || catDe(it.nome), comprado: false, preco: it.preco || null, total: null });
            add++;
          }
        });
        salvar(); render(); atualizarInfoMercado();
        if (typeof showToast === 'function') showToast('🔁 ' + add + ' itens da última compra adicionados.', 'success');
      } else if (act === 'esquecidos') {
        const modal = document.getElementById('modal-esquecidos');
        const cont = document.getElementById('esquecidos-lista');
        if (!modal || !cont) return;
        const nomesAtuais = new Set((Array.isArray(lista) ? lista : []).filter(x => !x.comprado).map(x => String(x.nome || '').toLowerCase()));
        const faltando = (Array.isArray(ultimaCompra) ? ultimaCompra : []).filter(it => !nomesAtuais.has(String(it.nome || '').toLowerCase()));
        if (!faltando.length) {
          cont.innerHTML = '<em>Nenhum item esquecido — sua lista já cobre a última compra.</em>';
        } else {
          cont.innerHTML = faltando.map(it =>
            '<div class="sugestao-item"><span>' + (emojiDe(it.nome) || '') + ' ' + it.nome + '</span><button data-nome="' + encodeURIComponent(it.nome) + '" data-qtd="' + (it.qtd || 1) + '" data-uni="' + (it.unidade || 'un') + '">+ lista</button></div>'
          ).join('');
          cont.onclick = (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const nome = decodeURIComponent(btn.dataset.nome || '');
            const qtd = parseFloat(btn.dataset.qtd) || 1;
            const uni = btn.dataset.uni || 'un';
            const existe = (Array.isArray(lista) ? lista : []).some(x => String(x.nome || '').toLowerCase() === nome.toLowerCase() && !x.comprado);
            if (!existe) {
              lista.push({ nome, qtd, unidade: uni, corredor: null, categoria: catDe(nome), comprado: false, preco: null, total: null });
              salvar(); render(); atualizarInfoMercado();
              if (typeof showToast === 'function') showToast('✅ Adicionado: ' + nome, 'success');
            }
            // refresh
            btn.parentElement.remove();
          };
        }
        modal.style.display = 'flex'; modal.classList.add('visible');
      } else if (act === 'rapido') {
        const modal = document.getElementById('modal-rapido');
        if (modal) { modal.style.display = 'flex'; modal.classList.add('visible'); }
        const txt = document.getElementById('rapido-texto');
        if (txt) txt.value = '';
      } else if (act === 'salvar-comprados') {
        const nome = prompt('Nome dos comprados:'); if (!nome) return;
        savedPurchases[nome] = Array.isArray(boughtItems) ? boughtItems.slice() : [];
        localStorage.setItem('savedPurchases_v1', JSON.stringify(savedPurchases));
        alert('Comprados salvos!');
      } else if (act === 'abrir-comprados') {
        const abrir = document.getElementById('abrir-comprados-salvos');
        if (abrir) abrir.click();
      }
    });
  }

  const closeShareModal = () => {
    if (!els.shareModal) return;
    els.shareModal.classList.remove('visible');
    els.shareModal.style.display = 'none';
  };

  if (els.shareClose) {
    els.shareClose.addEventListener('click', closeShareModal);
  }

  if (els.shareModal) {
    els.shareModal.addEventListener('click', (e) => {
      if (e.target === els.shareModal) closeShareModal();
    });
  }

  if (els.shareOptionList) {
    els.shareOptionList.addEventListener('click', () => {
      shareListaAtual();
      closeShareModal();
    });
  }

  if (els.shareOptionBought) {
    els.shareOptionBought.addEventListener('click', () => {
      shareItensComprados();
      closeShareModal();
    });
  }

  // ===== FILTER TOGGLE =====
  if (els.filterToggle && els.filtroDiv) {
    els.filterToggle.addEventListener('click', () => {
      const collapsed = els.filtroDiv.classList.toggle('collapsed');
      // opcional: foco no campo de pesquisa ao abrir
      if (!collapsed) setTimeout(() => { if (els.pesquisa) els.pesquisa.focus(); }, 50);
    });
  }

  // Ajustes de UI do Mercado conforme unidade (kg)
  function updateMercadoUI(item) {
    if (!els.valorMercado) return;
    const u = (item && item.unidade ? item.unidade : '').toLowerCase();
    const isKg = (u === 'kg') || !!(els.compraKg && els.compraKg.checked);
    els.valorMercado.placeholder = isKg ? 'Valor do kg (R$)' : 'Valor Unitário (R$)';
    els.valorMercado.setAttribute('aria-label', isKg ? 'Valor do kg em reais' : 'Valor unitário em reais');
    if (els.pesoMercado) {
      els.pesoMercado.style.display = isKg ? '' : 'none';
      if (!isKg) els.pesoMercado.value = '';
    }
    const totalInput = document.getElementById('total-mercado');
    if (totalInput) {
      totalInput.style.display = isKg ? '' : 'none';
      if (!isKg) totalInput.value = '';
    }
    if (els.marcarPesoDepois) {
      els.marcarPesoDepois.style.display = isKg ? '' : 'none';
    }
    const packInput = document.getElementById('packsize-mercado');
    if (packInput) {
      if (u === 'pente' || u === 'pack') {
        const last = (priceHistory[item && item.nome ? item.nome : ''] || [])[0];
        const lastSize = last && last.packSize ? Number(last.packSize) : (u === 'pente' ? 30 : 6);
        packInput.style.display = '';
        packInput.value = String(lastSize);
        packInput.placeholder = u === 'pente' ? 'Ovos por pente' : 'Unid. por pack';
      } else {
        packInput.style.display = 'none';
        packInput.value = '';
      }
    }
    // Dica da última compra
    if (els.indicadorPreco && item) {
      const hist = priceHistory[item.nome] || [];
      const last = hist[0];
      if (last && typeof last.price === 'number') {
        let dica = 'Última: ';
        const u = (last.unit || '').toLowerCase();
        if (u === 'kg') {
          dica += fmt(last.price) + '/kg';
        } else if (u === 'pente' || u === 'pack') {
          const ps = last.packSize ? Number(last.packSize) : null;
          dica += last.unit + (ps ? (' (' + ps + ')') : '') + ' a ' + fmt(last.price);
          if (ps) {
            const unitPrice = last.price / ps;
            dica += ' • ' + fmt(unitPrice) + '/un';
          }
        } else {
          dica += fmt(last.price) + '/' + (u || 'un');
        }
        els.indicadorPreco.className = 'indicador-preco';
        els.indicadorPreco.textContent = dica;
        els.indicadorPreco.style.display = '';
      } else {
        els.indicadorPreco.style.display = 'none';
      }
    }
  }

  if (els.compraKg) {
    els.compraKg.addEventListener('change', () => {
      const item = selecionado != null ? lista[selecionado] : null;
      updateMercadoUI(item);
    });
    setTimeout(() => {
      const item = selecionado != null ? lista[selecionado] : null;
      updateMercadoUI(item);
    }, 0);
  }

  // ===== SPLASH =====
  const splash = document.getElementById('splash');
  if (splash) {
    console.log('[splash] show');
    let hidden = false;
    const splashStart = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const hideSplash = () => {
      if (hidden) return; hidden = true;
      try { document.body.classList.remove('splashing'); } catch (_) { }
      splash.classList.add('hide'); console.log('[splash] hide');
      setTimeout(() => { splash.style.display = 'none'; console.log('[splash] none'); }, 600);
    };
    window.addEventListener('load', () => {
      // garante um tempo mínimo de exibição (~2.0s)
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const elapsed = now - splashStart;
      const minVisible = 1000; // ms
      const wait = Math.max(0, minVisible - elapsed);
      setTimeout(hideSplash, wait);
    });
    // fallback: se o evento load não vier por algum motivo, esconde após 6s
    setTimeout(hideSplash, 6000);
  }

  // ===== CONFIG MODAL =====
  function renderLocalBase() {
    const cont = els.localBaseContainer; if (!cont) return;
    const items = Array.isArray(localProducts) ? localProducts : [];
    if (items.length === 0) { cont.innerHTML = '<em>Sem itens na base local.</em>'; return; }
    cont.innerHTML = items
      .map((p, i) => `
        <div class="saved-list-item">
          <span>${p.nome}</span>
          <div class="saved-list-actions">
            <button class="edit-unit" data-i="${i}">Unidade: ${p.unidade || 'un'}</button>
            <button class="delete-local" data-i="${i}">Remover</button>
          </div>
        </div>`).join('');
    cont.addEventListener('click', (e) => {
      const t = e.target;
      if (!t || !t.classList) return;
      if (t.classList.contains('edit-unit')) {
        const i = parseInt(t.getAttribute('data-i')); if (isNaN(i)) return;
        const cur = items[i]; if (!cur) return;
        let uni = prompt('Unidade para o item:', cur.unidade || 'un') || cur.unidade || 'un';
        uni = String(uni).trim() || 'un';
        var newCur = Object.assign({}, cur);
        newCur.unidade = uni;
        localProducts[i] = newCur;
        salvar(); renderLocalBase();
      }
      if (t.classList.contains('delete-local')) {
        const i = parseInt(t.getAttribute('data-i')); if (isNaN(i)) return;
        const cur = items[i]; if (!cur) return;
        if (confirm(`Remover "${cur.nome}" da sua base local?`)) {
          localProducts.splice(i, 1);
          salvar(); renderLocalBase();
        }
      }
    });
  }

  // ===== MODAIS NOVOS (esquecidos / rapido) =====
  const fecharEsquecidos = document.getElementById('fechar-esquecidos');
  const modalEsquecidos = document.getElementById('modal-esquecidos');
  if (fecharEsquecidos && modalEsquecidos) {
    fecharEsquecidos.addEventListener('click', () => { modalEsquecidos.classList.remove('visible'); modalEsquecidos.style.display = 'none'; });
    modalEsquecidos.addEventListener('click', (e) => { if (e.target === modalEsquecidos) { modalEsquecidos.classList.remove('visible'); modalEsquecidos.style.display = 'none'; } });
  }
  const fecharRapido = document.getElementById('fechar-rapido');
  const modalRapido = document.getElementById('modal-rapido');
  const rapidoCancelar = document.getElementById('rapido-cancelar');
  const rapidoAdicionar = document.getElementById('rapido-adicionar');
  if (fecharRapido && modalRapido) {
    fecharRapido.addEventListener('click', () => { modalRapido.classList.remove('visible'); modalRapido.style.display = 'none'; });
    modalRapido.addEventListener('click', (e) => { if (e.target === modalRapido) { modalRapido.classList.remove('visible'); modalRapido.style.display = 'none'; } });
  }
  if (rapidoCancelar && modalRapido) {
    rapidoCancelar.addEventListener('click', () => { modalRapido.classList.remove('visible'); modalRapido.style.display = 'none'; });
  }
  if (rapidoAdicionar) {
    rapidoAdicionar.addEventListener('click', () => {
      const txt = document.getElementById('rapido-texto');
      const linhas = (txt ? txt.value : '').split('\n').map(x => x.trim()).filter(Boolean);
      let add = 0;
      linhas.forEach(nome => {
        const existe = (Array.isArray(lista) ? lista : []).some(x => String(x.nome || '').toLowerCase() === nome.toLowerCase() && !x.comprado);
        if (!existe) {
          lista.push({ nome, qtd: 1, unidade: 'un', corredor: null, categoria: catDe(nome), comprado: false, preco: null, total: null });
          add++;
        }
      });
      if (add > 0) { salvar(); render(); atualizarInfoMercado(); if (typeof showToast === 'function') showToast('⚡ ' + add + ' itens adicionados.', 'success'); }
      else if (linhas.length) { if (typeof showToast === 'function') showToast('Já estavam na lista.', 'info'); }
      if (modalRapido) { modalRapido.classList.remove('visible'); modalRapido.style.display = 'none'; }
    });
  }

  // ===== TOOLBAR (ações visíveis) =====
  const tbSalvar = document.getElementById('tb-salvar');
  const tbAbrir = document.getElementById('tb-abrir');
  const tbApagar = document.getElementById('tb-apagar');
  if (tbSalvar) tbSalvar.addEventListener('click', () => els.salvarLista && els.salvarLista.click());
  if (tbAbrir) tbAbrir.addEventListener('click', () => els.abrirListas && els.abrirListas.click());
  if (tbApagar) tbApagar.addEventListener('click', () => els.apagarLista && els.apagarLista.click());

  const openConfig = () => {
    if (!els.modalConfig) { console.log('[config] modal-config não encontrado'); alert('Configurações indisponível no momento.'); return; }
    els.modalConfig.style.display = 'flex';
    els.modalConfig.classList.add('visible');
    // Atualiza a seção de itens sugeridos sempre que abrir
    renderSuggested();
    renderLocalBase();
    const elCount = document.getElementById('local-products-count');
    if (elCount) elCount.textContent = `Base local: ${Array.isArray(localProducts) ? localProducts.length : 0}`;
    console.log('[config] open');
  };
  const closeConfig = () => {
    if (!els.modalConfig) return;
    els.modalConfig.classList.remove('visible');
    els.modalConfig.style.display = 'none';
  };
  if (els.configBtn) els.configBtn.addEventListener('click', openConfig);
  if (els.fecharConfig) els.fecharConfig.addEventListener('click', closeConfig);
  window.addEventListener('click', (e) => { if (e.target === els.modalConfig) closeConfig(); });
  // Fallback de delegação (garante abertura mesmo se algo impedir o listener direto)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('#config-btn');
    if (btn) { console.log('[config] open (delegation)'); openConfig(); }
  });
  if (els.limparBanco) {
    els.limparBanco.addEventListener('click', () => {
      if (!confirm('Apagar TODOS os dados locais (listas, comprados, histórico, tema, produtos locais)? Isso não pode ser desfeito.')) return;
      // Clear all localStorage keys
      localStorage.clear();
      // Reset in-memory data
      lista = [];
      boughtItems = [];
      priceHistory = {};
      localProducts = [];
      avgWeightPerPiece = {};
      aisles = {};
      suggestedProducts = [];
      // Reset UI
      render();
      renderComprados();
      atualizarInfoMercado();
      // evita disparar backup automático logo após limpar
      localStorage.setItem('lastBackup_v1', String(Date.now()));
      // Close config modal
      closeConfig();
      alert('Todos os dados locais foram limpos. Recarregue a página se necessário.');
    });
  }

  // ===== RELATÓRIOS (abrir/fechar) =====
  try {
    const reportsBtn = document.getElementById('reports-btn');
    const modalRel = document.getElementById('modal-relatorios');
    const fecharRel = document.getElementById('fechar-relatorios');
    const relContent = document.getElementById('relatorio-conteudo');
    const exportCsvBtn = document.getElementById('exportar-relatorio-csv');

    const openRel = () => {
      if (!modalRel) return;
      // fecha Config para evitar sobreposição
      try { closeConfig(); } catch (_) { }
      modalRel.style.display = 'flex';
      modalRel.classList.add('visible');
      // Load Chart.js via CDN if not already loaded
if (!window.Chart) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
  script.onload = initReportChart;
  document.head.appendChild(script);
} else {
  initReportChart();
}

function initReportChart() {
  const ctxEl = document.getElementById('relatorio-chart');
  const ctx = ctxEl ? ctxEl.getContext('2d') : null;
  if (!ctx) return;
  // Example data - replace with real data retrieval
  const labels = [];
  const dataPoints = [];
  // Populate with placeholder for last 30 days
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    labels.push((d.getMonth() + 1) + '/' + d.getDate());
    dataPoints.push(0);
  }
  window.relatorioChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Gastos (R$)',
        data: dataPoints,
        borderColor: 'rgba(99,102,241,0.8)',
        backgroundColor: 'rgba(99,102,241,0.2)',
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
    }
  });
}

// CSV export for report
function exportReportCSV() {
  const bought = JSON.parse(localStorage.getItem('boughtItems_v3') || '[]');
  if (!Array.isArray(bought) || bought.length === 0) {
    alert('Nenhum dado de compras para exportar.');
    return;
  }
  const headers = ['Produto', 'Quantidade', 'Unidade', 'Preço Unitário', 'Peso', 'Total', 'Data'];
  const rows = bought.map(item => [
    item.nome || '',
    item.qtd != null ? item.qtd : '',
    item.unidade || '',
    item.preco != null ? item.preco : '',
    item.peso != null ? item.peso : '',
    item.total != null ? item.total : '',
    item.date ? new Date(item.date).toISOString().split('T')[0] : ''
  ]);
  const csvContent = [headers].concat(rows).map(function(r) { return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0,10);
  link.href = URL.createObjectURL(blob);
  link.download = 'relatorio_' + timestamp + '.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

document.getElementById('exportar-relatorio-csv') && document.getElementById('exportar-relatorio-csv').addEventListener('click', exportReportCSV);
      // conteúdo básico (placeholder se necessário)
      if (relContent && relContent.innerHTML.trim() === '') {
        relContent.innerHTML = '<em>Selecione um período acima para ver detalhes.</em>';
      }
    };
    const closeRel = () => {
      if (!modalRel) return;
      modalRel.classList.remove('visible');
      modalRel.style.display = 'none';
    };

    if (reportsBtn && modalRel) reportsBtn.addEventListener('click', openRel);
    if (fecharRel && modalRel) fecharRel.addEventListener('click', closeRel);
    window.addEventListener('click', (e) => { if (e.target === modalRel) closeRel(); });

    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', function() {
        // gera CSV simples do histórico de compras
        var rows = [['Data', 'Produto', 'Categoria', 'Unidade', 'Qtd', 'Peso(kg)', 'Preço', 'Total']];
        (Array.isArray(boughtItems) ? boughtItems : []).forEach(function(it) {
          rows.push([
            it.date || '',
            it.nome || '',
            it.categoria || '',
            it.unidade || '',
            it.qtd != null ? String(it.qtd) : '',
            it.peso != null ? String(it.peso) : '',
            it.preco != null ? String(it.preco) : '',
            it.total != null ? String(it.total) : ''
          ]);
        });
        var csv = rows.map(function(r) { return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = 'relatorio-' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  } catch (e) { console.log('[relatorios] init error', e && e.message ? e.message : e); }

  // ===== UTILS =====
  let boughtItems = JSON.parse(localStorage.getItem('boughtItems_v3') || '[]');
  let priceHistory = JSON.parse(localStorage.getItem('priceHistory_v3') || '{}');
  let suggestedProducts = JSON.parse(localStorage.getItem('suggestedProducts_v1') || '[]');
  let localProducts = JSON.parse(localStorage.getItem('localProducts_v1') || '[]');
  let avgWeightPerPiece = JSON.parse(localStorage.getItem('avgWeightPerPiece_v1') || '{}');
  let aisles = JSON.parse(localStorage.getItem('aisles_v1') || '{}');
  let barcodeMap = JSON.parse(localStorage.getItem('barcodeMap_v1') || '{}');

  /**
   * Save all data to localStorage
   */
  const salvar = () => {
    localStorage.setItem('shoppingList_v3', JSON.stringify(lista));
    localStorage.setItem('boughtItems_v3', JSON.stringify(boughtItems));
    localStorage.setItem('priceHistory_v3', JSON.stringify(priceHistory));
    localStorage.setItem('suggestedProducts_v1', JSON.stringify(suggestedProducts));
    localStorage.setItem('localProducts_v1', JSON.stringify(localProducts));
    localStorage.setItem('avgWeightPerPiece_v1', JSON.stringify(avgWeightPerPiece));
    localStorage.setItem('aisles_v1', JSON.stringify(aisles));
    localStorage.setItem('barcodeMap_v1', JSON.stringify(barcodeMap));
    if (window.pushSync) { try { window.pushSync(); } catch (_) { } }
  };

  /**
   * Format currency
   * @param {number} n - Number to format
   * @returns {string} Formatted currency string
   */
  const fmt = (n) => 'R$ ' + Number(n || 0).toFixed(2).replace('.', ',');

  const shareViaWhatsApp = async ({ title, text }) => {
    const message = (text || '').trim();
    if (!message) {
      alert('Nada para compartilhar no momento.');
      return;
    }
    try {
      if (navigator && navigator.share) {
        await navigator.share({ title: title || 'Lista +', text: message });
        return;
      }
    } catch (err) {
      console.log('[share] navigator.share fallback', err);
    }
    const url = 'https://wa.me/?text=' + encodeURIComponent(message);
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (!popup) {
      openExternalUrl(url);
    }
  };

  const formatListForShare = (items, { heading, includeStatus = false } = {}) => {
    if (!Array.isArray(items) || items.length === 0) {
      return heading + '\n\nLista vazia.';
    }
    const lines = items.map((item, idx) => {
      if (!item) return '';
      const parts = [];
      const qty = item.qtd != null && item.qtd !== '' ? String(item.qtd) : '';
      const unidade = item.unidade ? String(item.unidade) : '';
      const peso = item.peso != null && item.peso !== '' ? (Number(item.peso).toFixed(2) + ' kg') : '';
      const extras = [qty && unidade ? (qty + ' ' + unidade) : (qty || unidade), peso].filter(Boolean).join(' · ');
      const status = includeStatus && item.comprado ? '✔️' : '';
      return (idx + 1) + '. ' + (item.nome || 'Item') + (extras ? (' — ' + extras) : '') + (status ? (' ' + status) : '');
    }).filter(Boolean);
    return heading + '\n\n' + lines.join('\n');
  };

  const formatBoughtForShare = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return '🧾 Itens comprados\n\nNenhum item comprado ainda.';
    }
    let total = 0;
    const lines = items.map((item, idx) => {
      if (!item) return '';
      const qtd = item.qtd != null && item.qtd !== '' ? (item.qtd + ' ' + (item.unidade || 'un')) : '';
      const peso = item.peso != null && item.peso !== '' ? (Number(item.peso).toFixed(2) + ' kg') : '';
      const amount = typeof item.total === 'number' ? item.total : typeof item.preco === 'number' ? item.preco * (Number(item.qtd) || 1) : 0;
      total += Number.isFinite(amount) ? amount : 0;
      const extra = [qtd, peso].filter(Boolean).join(' · ');
      return (idx + 1) + '. ' + (item.nome || 'Item') + (extra ? (' — ' + extra) : '') + (amount ? (' → ' + fmt(amount)) : '');
    }).filter(Boolean);
    lines.push('\nTotal estimado: ' + fmt(total));
    return '🧾 Itens comprados\n\n' + lines.join('\n');
  };

  const shareListaAtual = () => {
    const message = formatListForShare(lista, { heading: '🛒 Lista de compras', includeStatus: true });
    shareViaWhatsApp({ title: 'Lista +', text: message });
  };

  const shareItensComprados = () => {
    const message = formatBoughtForShare(boughtItems);
    shareViaWhatsApp({ title: 'Lista + - Compras', text: message });
  };
  // ===== SMART UNIT AI =====
  const baseUnits = ['un', 'kg', 'pacote', 'duzia', 'pente', 'garrafa', 'bandeja'];
  const SMART_BASE = {
    // Carnes & proteínas
    'carne': { kg: 0.92, pacote: 0.5 },
    'carne bovina': { kg: 0.94 },
    'carne suina': { kg: 0.9 },
    'frango': { kg: 0.9, unidade: 0.55, pacote: 0.4 },
    'peito de frango': { kg: 0.92, unidade: 0.6 },
    'coxinha da asa': { kg: 0.9, bandeja: 0.55 },
    'linguica': { kg: 0.8, pacote: 0.6 },
    'presunto': { fatia: 0.6, bandeja: 0.5, kg: 0.45 },
    'queijo prato': { fatia: 0.62, kg: 0.5, bandeja: 0.45 },
    'salsicha': { pacote: 0.72, kg: 0.55 },
    'atum': { lata: 0.92, pacote: 0.4 },

    // Hortifruti
    'banana': { kg: 0.7, cacho: 0.55, un: 0.35 },
    'banana nanica': { kg: 0.7, cacho: 0.55 },
    'manga': { un: 0.74, kg: 0.5 },
    'maca': { un: 0.7, kg: 0.55 },
    'maça': { un: 0.7, kg: 0.55 },
    'laranja': { kg: 0.7, un: 0.45 },
    'limao': { kg: 0.7, un: 0.5 },
    'uva': { bandeja: 0.68, kg: 0.55 },
    'abacate': { un: 0.78, kg: 0.5 },
    'batata': { kg: 0.85, saco: 0.5 },
    'batata doce': { kg: 0.85, saco: 0.45 },
    'tomate': { kg: 0.82, bandeja: 0.5 },
    'cenoura': { kg: 0.75, pacote: 0.45 },
    'alface': { maço: 0.8, unidade: 0.7 },
    'cebola': { kg: 0.85, saco: 0.45 },

    // Mercearia seca
    'arroz': { pacote: 0.9, kg: 0.55 },
    'feijao': { pacote: 0.9, kg: 0.55 },
    'acucar': { pacote: 0.9, kg: 0.55 },
    'farinha': { pacote: 0.82, kg: 0.55 },
    'farofa': { pacote: 0.82 },
    'macarrao': { pacote: 0.88, caixa: 0.4 },
    'cafe': { pacote: 0.85, kg: 0.55 },
    'oleo': { litro: 0.92, garrafa: 0.6 },

    // Laticínios e bebidas
    'leite': { litro: 0.92, caixa: 0.55 },
    'iogurte': { pote: 0.7, bandeja: 0.5, caixa: 0.4 },
    'manteiga': { pote: 0.7, unidade: 0.55 },
    'requeijao': { pote: 0.82, unidade: 0.45 },
    'cerveja': { pack: 0.7, un: 0.45, caixa: 0.4 },
    'refrigerante': { garrafa: 0.75, un: 0.6, pack: 0.4 },

    // Limpeza e higiene
    'detergente': { litro: 0.82, un: 0.55 },
    'amaciante': { litro: 0.85, garrafa: 0.55 },
    'sabao em po': { pacote: 0.88, caixa: 0.5 },
    'papel higienico': { pacote: 0.9, fardo: 0.55 },
    'fralda': { pacote: 0.9, caixa: 0.55 },

    // Padaria e snacks
    'pao': { un: 0.9, pacote: 0.55 },
    'pao de forma': { pacote: 0.92 },
    'bolo': { unidade: 0.7, fatia: 0.55, kg: 0.4 },
    'biscoito': { pacote: 0.9, caixa: 0.5 },
    'salgadinho': { pacote: 0.88 },

    // Outros
    'ovo': { pente: 0.8, duzia: 0.7, un: 0.45 },
    'ovo caipira': { pente: 0.82, duzia: 0.7, un: 0.5 }
  };

  const smartHistoryKey = 'smartHistory_v1';
  const smartProfileKey = 'smartProfile_v1';
  let smartProfile = JSON.parse(localStorage.getItem(smartProfileKey) || 'null') || { local: 'supermercado' };
  let smartHistory = JSON.parse(localStorage.getItem(smartHistoryKey) || 'null') || [];

  const normalizeUnitName = (u) => {
    if (!u) return '';
    return String(u).toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '')
      .replace(/[^a-z]/g, '')
      .trim();
  };

  const unitLabels = {
    kg: 'kg',
    un: 'un',
    unidade: 'un',
    pacote: 'pacote',
    pacote5kg: 'pacote 5kg',
    pente: 'pente',
    duzia: 'dúzia',
    caixa: 'caixa',
    litro: 'litro',
    litro1l: '1L',
    bandeja: 'bandeja',
    cacho: 'cacho',
    pct: 'pct',
    pack: 'pack',
    saco: 'saco',
    fatia: 'fatia',
    pote: 'pote'
  };

  function SmartUnitAI(base, historico, perfil) {
    this.base = base || {};
    this.historico = Array.isArray(historico) ? historico : [];
    this.perfil = perfil || { local: 'supermercado' };
  }

  SmartUnitAI.prototype._normalize = function(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  SmartUnitAI.prototype.calcularConfianca = function(nome) {
    var self = this;
    var n = this._normalize(nome);
    var confs = Object.assign({}, this.base[n] || {});

    var now = Date.now();
    var recentes = this.historico
      .filter(function(reg) { return self._normalize(reg.nome) === n; })
      .slice(-12);

    if (recentes.length) {
      var contagem = {};
      recentes.forEach(function(reg, idx) {
        var u = normalizeUnitName(reg.unidade);
        if (!u) return;
        var recency = Math.max(0.2, 1 - idx * 0.08);
        var ageDays = reg.data ? Math.max(0, (now - new Date(reg.data).getTime()) / 86400000) : 999;
        var weight = recency * (ageDays > 45 ? 0.4 : ageDays > 14 ? 0.7 : 1);
        contagem[u] = (contagem[u] || 0) + weight;
      });

      for (var u in contagem) {
        var score = contagem[u];
        var peso = 0.45 + Math.min(0.45, score / recentes.length);
        confs[u] = Math.max(confs[u] || 0, peso);
      }
    }

    var ajustados = this.aplicarContexto(n, confs);
    var soma = 0;
    for (var k in ajustados) { soma += ajustados[k]; }

    if (!soma) {
      return { un: 1.0 };
    }
    var normalizado = {};
    for (var u2 in ajustados) {
      normalizado[u2] = ajustados[u2] / soma;
    }
    return normalizado;
  };

  SmartUnitAI.prototype.aplicarContexto = function(nome, confs) {
    var ajustes = Object.assign({}, confs);
    var local = (this.perfil && this.perfil.local) || 'supermercado';
    var tem = function(alvo) { return nome.indexOf(alvo) !== -1; };

    if (local === 'feira') {
      if (tem('carne') || tem('frango')) ajustes.kg = (ajustes.kg || 0) * 1.25;
      if (tem('ovo')) ajustes.pente = (ajustes.pente || 0) * 1.2;
      if (tem('banana') || tem('manga')) ajustes.kg = (ajustes.kg || 0) * 1.15;
      if (tem('banana')) ajustes.cacho = (ajustes.cacho || 0) * 1.1;
    }

    if (local === 'acougue' || local === 'açougue') {
      if (tem('carne') || tem('frango')) ajustes.kg = (ajustes.kg || 0) * 1.3;
    }

    if (local === 'supermercado') {
      if (tem('carne')) ajustes.pacote = (ajustes.pacote || 0) * 1.15;
      if (tem('ovo')) ajustes.duzia = (ajustes.duzia || 0) * 1.1;
      ajustes.un = (ajustes.un || 0.2) * 1.05;
    }

    return ajustes;
  };

  SmartUnitAI.prototype.sugerir = function(nome) {
    var self = this;
    if (!nome) {
      return { unidade: baseUnits[0], confianca: 1, alternativas: baseUnits.map(function(u) { return { unidade: u, confianca: 0.5 }; }), dica: '' };
    }
    var confs = this.calcularConfianca(nome);
    var alternativas = [];
    for (var unit in confs) {
      alternativas.push({ unidade: unit, confianca: confs[unit] });
    }
    alternativas.sort(function(a, b) { return b.confianca - a.confianca; });

    var melhor = alternativas[0] || { unidade: baseUnits[0], confianca: 1 };

    var dica = '';
    var recentes = this.historico.filter(function(reg) { return self._normalize(reg.nome) === self._normalize(nome); });
    if (recentes.length >= 2) {
      var ultimo = recentes[recentes.length - 1];
      dica = 'Você costuma comprar em ' + ultimo.unidade;
    } else if (melhor.confianca > 0.85) {
      dica = 'Alta confiança em "' + (unitLabels[normalizeUnitName(melhor.unidade)] || melhor.unidade) + '"';
    }

    return { unidade: melhor.unidade, confianca: melhor.confianca, alternativas: alternativas, dica: dica };
  };

  SmartUnitAI.prototype.registrarCompra = function(nome, unidade, quantidade, preco) {
    var reg = {
      nome: nome,
      unidade: unidade,
      quantidade: quantidade,
      preco: preco,
      data: new Date().toISOString()
    };
    this.historico.push(reg);
    if (this.historico.length > 80) {
      this.historico = this.historico.slice(-80);
    }
  };

  SmartUnitAI.prototype.registrarPreferencia = function(nome, unidade) {
    var n = this._normalize(nome);
    var u = normalizeUnitName(unidade);
    if (!n || !u) return;
    this.base[n] = this.base[n] || {};
    this.base[n][u] = Math.max(this.base[n][u] || 0, 0.6);

  }

  const smartUnit = new SmartUnitAI(SMART_BASE, smartHistory, smartProfile);

  const suggestUnits = (nome, opts = {}) => {
    const suggestion = smartUnit.sugerir(nome);
    const orderedUnits = [];
    suggestion.alternativas.forEach(({ unidade }) => {
      const norm = normalizeUnitName(unidade);
      if (!norm) return;
      if (!orderedUnits.includes(norm)) orderedUnits.push(norm);
    });
    baseUnits.forEach(u => { if (!orderedUnits.includes(u)) orderedUnits.push(u); });
    const def = normalizeUnitName(suggestion.unidade) || orderedUnits[0] || baseUnits[0];
    return { units: orderedUnits, def, hint: suggestion.dica || '', confianca: suggestion.confianca };
  };
  const populateUnidadeOptions = (nome) => {
    if (!els.unidadeSel) return;
    els.unidadeSel.innerHTML = baseUnits
      .map((u) => '<option value="' + u + '">' + (unitLabels[u] || u) + '</option>')
      .join('');
    els.unidadeSel.value = 'un';
    const hintEl = document.getElementById('unidade-hint');
    if (hintEl) { hintEl.style.display = 'none'; hintEl.innerHTML = ''; }
  };

  // inicializa opções
  populateUnidadeOptions(els.nome ? els.nome.value : '');
  if (els.nome) els.nome.addEventListener('input', () => populateUnidadeOptions(els.nome.value));
  const listaBusca = document.getElementById('lista-busca');
  if (listaBusca) {
    listaBusca.addEventListener('input', () => { listFilter = listaBusca.value.trim().toLowerCase(); render(); });
  }

  const orcamentoInput = document.getElementById('orcamento');
  if (orcamentoInput) {
    if (budget > 0) orcamentoInput.value = budget;
    orcamentoInput.addEventListener('change', () => {
      const v = parseFloat(orcamentoInput.value);
      budget = isNaN(v) || v <= 0 ? 0 : v;
      if (budget > 0) localStorage.setItem('budget_v1', String(budget)); else localStorage.removeItem('budget_v1');
      atualizarInfoMercado();
    });
  }

  const getAllProducts = function() { return (window.produtos || []).concat(Array.isArray(localProducts) ? localProducts : []); };
  const normalizeText = function(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); };
  const normalize = normalizeText;
  // sinônimos comuns -> palavra-chave para mapear produtos
  const aliasMap = {
    'manga palmer': 'manga',
    'manga tommy': 'manga',
    'manga espada': 'manga',
    'maçã fuji': 'maca',
    'maça fuji': 'maca',
    'maçã gala': 'maca',
    'maça gala': 'maca',
    'laranja bahia': 'laranja',
    'laranja lima': 'laranja',
    'banana prata': 'banana',
    'banana nanica': 'banana',
    'banana caturra': 'banana',
    'abacate avocado': 'abacate',
    'ovo caipira': 'ovo',
    'ovo vermelho': 'ovo',
    'peito de frango': 'frango',
    'frango inteiro': 'frango',
    'coxinha da asa': 'frango',
    'carne moída': 'carne moida',
    'carne moida': 'carne moida',
    'linguiça toscana': 'linguica',
    'linguiça calabresa': 'linguica',
    'linguica calabresa': 'linguica',
    'linguica toscana': 'linguica',
    'leite integral': 'leite',
    'leite desnatado': 'leite',
    'leite semidesnatado': 'leite',
    'óleo de soja': 'oleo',
    'oleo de soja': 'oleo',
    'óleo girassol': 'oleo',
    'oleo girassol': 'oleo',
    'água mineral': 'agua',
    'agua mineral': 'agua',
    'coca': 'refrigerante cola',
    'coca cola': 'refrigerante cola',
    'refri': 'refrigerante',
    'guarana': 'refrigerante guarana',
    'guaraná': 'refrigerante guarana',
    'pipoca': 'pipoca micro-ondas natural',
    'pipoca doce': 'pipoca doce caramelizada',
    'pipoca salgada': 'pipoca salgada pronta',
    'pipoca manteiga': 'pipoca micro-ondas manteiga',
    'salgadinho': 'salgadinho de milho',
    'salgadinho queijo': 'salgadinho sabor queijo',
    'lenço infantil': 'lenço umedecido infantil',
    'desodorante sem cheiro': 'desodorante sem perfume',
    'desodorante creme': 'desodorante em creme'
  };

  const SMART_RULES = [
    {
      id: 'hortifruti_unidade',
      label: 'Fruta por unidade',
      keywords: ['manga', 'maçã', 'maça', 'laranja', 'pera', 'abacate', 'pêssego', 'pessego', 'mamão', 'mamao', 'kiwi', 'abacaxi', 'goiaba', 'tangerina', 'mexerica', 'ameixa', 'nectarina', 'limão', 'limao', 'limão siciliano', 'limão tahiti', 'coco verde']
        .map(normalizeText),
      unit: 'un',
      alternatives: ['kg', 'bandeja'],
      hint: 'Planeje em unidades e registre o peso real quando pesar no Mercado.',
      confianca: 0.95
    },
    {
      id: 'hortifruti_kg',
      label: 'Hortifruti por kg',
      keywords: ['banana', 'tomate', 'batata', 'cenoura', 'cebola', 'alface', 'repolho', 'couve', 'espinafre', 'beterraba', 'abobrinha', 'pepino', 'mandioca', 'inhame', 'quiabo', 'chuchu']
        .map(normalizeText),
      unit: 'kg',
      alternatives: ['un', 'pacote'],
      hint: 'Digite o peso estimado em kg. No Mercado você confirma o peso da balança.',
      confianca: 0.93
    },
    {
      id: 'carne',
      label: 'Carnes por kg',
      keywords: ['carne', 'frango', 'peixe', 'alcatra', 'picanha', 'maminha', 'costela', 'contrafilé', 'contrafile', 'linguiça', 'linguica', 'salsicha', 'bife', 'hambúrguer', 'hamburguer', 'lombo', 'pernil', 'tilápia', 'tilapia', 'sardinha', 'salmon', 'salmão']
        .map(normalizeText),
      unit: 'kg',
      alternatives: ['bandeja', 'pacote'],
      hint: 'Planeje o corte em kg. Você pode informar o peso exato depois.',
      confianca: 0.94
    },
    {
      id: 'ovos',
      label: 'Ovos (dúzia/pente)',
      keywords: ['ovo', 'ovos'].map(normalizeText),
      unit: 'duzia',
      alternatives: ['pente', 'caixa', 'un'],
      hint: 'Escolha dúzias, pentes ou unidades conforme sua compra habitual.',
      confianca: 0.9
    },
    {
      id: 'embalados',
      label: 'Mercearia em pacotes',
      keywords: ['arroz', 'feijão', 'feijao', 'açúcar', 'acucar', 'sal', 'farinha', 'farofa', 'macarrão', 'macarrao', 'biscoito', 'bolacha', 'café', 'cafe', 'chocolate', 'achocolatado', 'cereal', 'granola', 'lentilha', 'ervilha', 'milho de pipoca']
        .map(normalizeText),
      unit: 'pacote',
      alternatives: ['caixa', 'un'],
      hint: 'Informe quantos pacotes ou caixas deseja levar.',
      confianca: 0.88
    },
    {
      id: 'liquidos',
      label: 'Bebidas / limpeza em litros',
      keywords: ['leite', 'óleo', 'oleo', 'detergente', 'amaciante', 'água', 'agua', 'suco', 'refrigerante', 'cerveja', 'vinho', 'vodka', 'whisky', 'cloro', 'desinfetante']
        .map(normalizeText),
      unit: 'litro',
      alternatives: ['garrafa', 'un'],
      hint: 'Planeje quantos litros ou garrafas precisa. Ajuste conforme o volume da embalagem.',
      confianca: 0.9
    }
  ];

  function reconhecerProduto(nome) {
    if (!nome) return null;
    const base = normalizeText(nome);
    const alias = aliasMap[base] ? normalizeText(aliasMap[base]) : base;
    let escolhido = null;
    let maiorChave = 0;
    SMART_RULES.forEach((regra) => {
      regra.keywords.forEach((palavra) => {
        if (palavra && alias.includes(palavra)) {
          const score = palavra.length;
          if (!escolhido || score > maiorChave) {
            escolhido = regra;
            maiorChave = score;
          }
        }
      });
    });
    if (!escolhido) return null;
    return {
      id: escolhido.id,
      label: escolhido.label,
      unit: escolhido.unit,
      alternatives: escolhido.alternatives || [],
      hint: escolhido.hint || '',
      confianca: escolhido.confianca || 0.9
    };
  }
  const catDe = (nome) => {
    const p = getAllProducts().find(x => x.nome.toLowerCase() === nome.toLowerCase());
    return p ? p.categoria : '';
  };
  const unidadeDe = (nome) => {
    const p = getAllProducts().find(x => x.nome.toLowerCase() === nome.toLowerCase());
    return p ? (p.unidade || 'un') : 'un';
  };
  const emojiDe = (nome) => {
    const p = getAllProducts().find(x => x.nome.toLowerCase() === String(nome || '').toLowerCase());
    if (p && p.emoji) return p.emoji;
    const catMap = {
      'hortifruti': '🥬', 'açougue': '🥩', 'acougue': '🥩', 'frios e laticínios': '🧀', 'laticínios': '🥛',
      'padaria': '🥖', 'mercearia': '🥫', 'limpeza': '🧼', 'higiene pessoal': '🧴', 'bebidas': '🧃',
      'sobremesas': '🍰', 'salgados': '🥟', 'congelados': '🧊', 'condimentos e temperos': '🧂'
    };
    const nameMap = {
      'banana': '🍌', 'maca': '🍎', 'maca fuji': '🍎', 'maca gala': '🍎', 'maça': '🍎', 'laranja': '🍊', 'uva': '🍇', 'manga': '🥭', 'pera': '🍐', 'pessego': '🍑', 'morango': '🍓',
      'abacaxi': '🍍', 'abacate': '🥑', 'tomate': '🍅', 'batata': '🥔', 'cenoura': '🥕', 'cebola': '🧅', 'alface': '🥬', 'repolho': '🥬', 'couve': '🥬',
      'ovo': '🥚', 'frango': '🍗', 'carne': '🥩', 'peixe': '🐟', 'arroz': '🍚', 'feijao': '🫘', 'leite': '🥛', 'cafe': '☕', 'pao': '🥖', 'cerveja': '🍺', 'vinho': '🍷',
      'detergente': '🧼', 'amaciante': '🧴', 'sabao': '🧼', 'sabonete': '🧼', 'shampoo': '🧴', 'refrigerante': '🥤', 'suco': '🧃', 'queijo': '🧀', 'presunto': '🍖',
      'manteiga': '🧈', 'iogurte': '🥛', 'pipoca': '🍿', 'pizza': '🍕', 'salgadinho': '🥨', 'chocolate': '🍫', 'acucar': '🍬', 'farinha': '🥣', 'macarrao': '🍝', 'oleo': '🧴'
    };
    const n = normalize(String(nome || ''));
    if (nameMap[n]) return nameMap[n];
    const cat = normalize(String((p && p.categoria) ? p.categoria : catDe(nome) || ''));
    if (catMap[cat]) return catMap[cat];
    return '🛒';
  };
  const imgDe = (nome) => {
    const p = (Array.isArray(localProducts) ? localProducts : []).find(x => x && x.nome && x.nome.toLowerCase() === String(nome || '').toLowerCase());
    return p && p.img ? p.img : '';
  };
  try {
    if (Array.isArray(localProducts)) {
      let changed = false;
      localProducts = localProducts.map(p => {
        if (!p || !p.nome) return p;
        if (!p.emoji) {
          changed = true;
          var newP = Object.assign({}, p);
          newP.emoji = emojiDe(p.nome);
          return newP;
        }
        return p;
      });
      if (changed) salvar();
    }
  } catch (_) { }
  const existeNaBase = (nome) => getAllProducts().some(x => x.nome.toLowerCase() === String(nome || '').toLowerCase());
  const jaSugerido = (nome) => suggestedProducts.some(s => String(s.nome || '').toLowerCase() === String(nome || '').toLowerCase());

  // Renderizar Itens Sugeridos no modal de Configurações
  function renderSuggested() {
    if (!els.suggestedProductsContainer) return;
    const elCount = document.getElementById('local-products-count');
    if (elCount) elCount.textContent = `Base local: ${Array.isArray(localProducts) ? localProducts.length : 0}`;
    if (!Array.isArray(suggestedProducts)) suggestedProducts = [];
    if (suggestedProducts.length === 0) {
      els.suggestedProductsContainer.innerHTML = '<em>Sem itens sugeridos.</em>';
      return;
    }
    els.suggestedProductsContainer.innerHTML = '<div class="saved-list-item" style="margin-bottom:8px;">' +
        '<span><strong>' + suggestedProducts.length + '</strong> item(ns) sugerido(s)</span>' +
        '<div class="saved-list-actions">' +
          '<button id="clear-suggested">Limpar todos</button>' +
        '</div>' +
      '</div>' +
      suggestedProducts.map((s, i) => '<div class="saved-list-item">' +
          '<span>' + s.nome + '</span>' +
          '<div class="saved-list-actions">' +
            '<button class="promote-sugg" data-i="' + i + '">Promover</button>' +
            '<button class="delete-sugg" data-i="' + i + '">Remover</button>' +
          '</div>' +
        '</div>').join('');
    els.suggestedProductsContainer.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.id === 'clear-suggested') {
        if (confirm('Limpar todos os itens sugeridos?')) {
          suggestedProducts = [];
          salvar();
          renderSuggested();
        }
        return;
      }
      if (t && t.classList && t.classList.contains('delete-sugg')) {
        const i = parseInt(t.getAttribute('data-i'));
        if (!isNaN(i)) {
          suggestedProducts.splice(i, 1);
          salvar();
          renderSuggested();
        }
      }
      if (t && t.classList && t.classList.contains('promote-sugg')) {
        const i = parseInt(t.getAttribute('data-i'));
        if (isNaN(i)) return;
        const itemPromote = suggestedProducts[i];
        const nome = itemPromote ? itemPromote.nome : null;
        if (!nome) return;
        const cat = prompt('Categoria para o item:\n(ex.: Bebidas, Mercearia, Hortifruti, etc.)', '') || '';
        let uni = prompt('Unidade padrão:\n(opções comuns: un, kg, g, ml, L, pct, cx, und)', 'un') || 'un';
        uni = uni.trim() || 'un';
        // adicionar à base local
        localProducts.push({ nome, categoria: cat.trim(), unidade: uni, emoji: emojiDe(nome) });
        // remover dos sugeridos
        suggestedProducts.splice(i, 1);
        salvar();
        renderSuggested();
        popularCategorias();
        alert(`Item "${nome}" adicionado à sua base local.`);
      }
    }, { once: true });
  }

  // ===== AUTOCOMPLETE =====
  const buildAutocomplete = () => {
    if (!els.autocompleteList) return;
    const raw = els.nome.value || '';
    const q = normalize(raw);
    const alias = aliasMap[q] ? normalize(aliasMap[q]) : '';
    els.autocompleteList.innerHTML = '';
    if (q.length < 2) { els.autocompleteList.style.display = 'none'; return; }
    const sugestoes = getAllProducts()
      .filter(p => {
        const n = normalize(p.nome);
        return n.includes(q) || (alias && n.includes(alias));
      })
      .sort((a, b) => {
        const na = normalize(a.nome), nb = normalize(b.nome);
        const pa = na.startsWith(q) ? 0 : (alias && na.startsWith(alias) ? 1 : 2);
        const pb = nb.startsWith(q) ? 0 : (alias && nb.startsWith(alias) ? 1 : 2);
        if (pa !== pb) return pa - pb;
        return na.localeCompare(nb);
      })
      .slice(0, 8);
    if (sugestoes.length === 0) { els.autocompleteList.style.display = 'none'; return; }
    sugestoes.forEach(p => {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      const thumb = imgDe(p.nome);
      const em = (p.emoji || emojiDe(p.nome) || '');
      const media = thumb ? ('<img class="item-thumb" src="' + thumb + '" alt="" />') : (em ? ('<span class="item-emoji-badge">' + em + '</span>') : '');
      div.innerHTML = media + '<span>' + p.nome + '</span>';
      div.addEventListener('click', () => {
        els.nome.value = p.nome;
        els.autocompleteList.style.display = 'none';
        populateUnidadeOptions(p.nome);
      });
      els.autocompleteList.appendChild(div);
    });
    els.autocompleteList.style.display = 'block';
  };
  if (els.nome) {
    els.nome.addEventListener('input', buildAutocomplete);
    document.addEventListener('click', (e) => {
      if (!els.autocompleteList.contains(e.target) && e.target !== els.nome) {
        els.autocompleteList.style.display = 'none';
      }
    });
  }

  // ===== CATEGORIAS =====
  // Categoria removida da UI; manter apenas busca por texto

  // ===== RENDER =====
  function render() {
    // Expondo para o scanner IA
    window.render = render;
    window.lista = lista;
    let dados = lista.slice();
    if (!modoMercadoAtivo) {
      dados = dados.filter(it => !it.comprado);
    }
    if (listFilter) {
      dados = dados.filter(it => String(it.nome || '').toLowerCase().includes(listFilter));
    }

    const pendingSet = new Set((Array.isArray(boughtItems) ? boughtItems : [])
      .filter(x => (x.unidade || '').toLowerCase() === 'kg' && x.peso == null)
      .map(x => String(x.nome || '').toLowerCase()));

    // índice de frequência e recência de compras por nome
    const stats = new Map();
    (Array.isArray(boughtItems) ? boughtItems : []).forEach(b => {
      const k = String(b.nome || '').toLowerCase();
      const cur = stats.get(k) || { freq: 0, last: 0 };
      cur.freq += 1;
      const ts = b.date ? new Date(b.date).getTime() : 0;
      if (ts > cur.last) cur.last = ts;
      stats.set(k, cur);
    });

    // ordenação inteligente
    const aisleOrder = ['hortifruti', 'açougue', 'acougue', 'frios', 'padaria', 'mercearia', 'limpeza', 'higiene', 'bebidas', 'outros'];
    const aisleRank = (name) => {
      const a = String((aisles[String(name || '').toLowerCase()]) || '').toLowerCase();
      const i = aisleOrder.indexOf(a);
      return i >= 0 ? i : aisleOrder.length + 1;
    };
    const scoreOf = (it) => {
      const k = String(it.nome || '').toLowerCase();
      const st = stats.get(k) || { freq: 0, last: 0 };
      const isKg = (it.unidade || '').toLowerCase() === 'kg';
      const pending = pendingSet.has(k) ? 1 : 0;
      const aisleScore = -aisleRank(k); // menor rank = melhor; invertido para ordenar desc depois
      return { pending, isKg: isKg ? 1 : 0, aisleScore, freq: st.freq, last: st.last, name: k };
    };
    dados = dados.slice().sort((a, b) => {
      const A = scoreOf(a), B = scoreOf(b);
      if (A.pending !== B.pending) return B.pending - A.pending; // pendências primeiro
      if (A.isKg !== B.isKg) return B.isKg - A.isKg; // depois itens kg
      if (A.aisleScore !== B.aisleScore) return B.aisleScore - A.aisleScore; // seção preferencial
      if (A.freq !== B.freq) return B.freq - A.freq; // depois mais frequentes
      if (A.last !== B.last) return B.last - A.last; // depois mais recentes
      return A.name.localeCompare(B.name);
    });

    // aplicar quick filters quando Mercado
    if (modoMercadoAtivo) {
      if (quickFilter === 'kg') {
        dados = dados.filter(it => String(it.unidade || '').toLowerCase() === 'kg');
      } else if (quickFilter === 'pending') {
        const pendingSetFilter = new Set((Array.isArray(boughtItems) ? boughtItems : [])
          .filter(x => (x.unidade || '').toLowerCase() === 'kg' && x.peso == null)
          .map(x => String(x.nome || '').toLowerCase()));
        dados = dados.filter(it => pendingSetFilter.has(String(it.nome || '').toLowerCase()));
      }
    }

    els.tabela.innerHTML = dados.map((it, idx) => {
      const normalizeNumber = (valor) => {
        if (valor === '' || valor === null || typeof valor === 'undefined') return '-';
        const num = Number(valor);
        if (!Number.isNaN(num) && Number.isFinite(num)) {
          return num % 1 ? num.toLocaleString('pt-BR') : num.toString();
        }
        return String(valor);
      };
      let badge = '';
      const unidadeLower = String(it.unidade || '').toLowerCase();
      const kgPending = (unidadeLower === 'kg' && pendingSet.has(String(it.nome || '').toLowerCase()));
      const chips = [];
      if (kgPending) chips.push('peso pendente');
      badge = chips.length ? ' ' + chips.map(c => '<span style="font-size:.75rem;color:var(--text-secondary);background:rgba(99,102,241,0.12);border:1px solid var(--border-color);padding:2px 6px;border-radius:8px;margin-left:6px;">' + c + '</span>').join('') : '';

      const quantidadeTxt = unidadeLower === 'kg'
        ? ''
        : (normalizeNumber(it.qtd) + (unidadeLower && unidadeLower !== 'un' ? (' ' + it.unidade) : '')).trim();
      const kgValor = unidadeLower === 'kg'
        ? (() => {
          if (it.peso != null && it.peso !== '') {
            const num = Number(it.peso);
            return Number.isFinite(num) ? (num.toFixed(3).replace('.', ',') + ' kg') : (it.peso + ' kg');
          }
          if (it.qtd != null && it.qtd !== '') {
            const num = Number(it.qtd);
            return Number.isFinite(num) ? (num.toFixed(3).replace('.', ',') + ' kg') : (it.qtd + ' kg');
          }
          return '';
        })()
        : '';
      const lastHist = (priceHistory[it.nome] || [])[0];
      const precoBase = typeof it.total === 'number' && Number.isFinite(it.total)
        ? it.total
        : (typeof it.preco === 'number' && Number.isFinite(it.preco) ? it.preco
          : (lastHist && typeof lastHist.price === 'number' ? lastHist.price : null));
      const precoTxt = precoBase != null ? fmt(precoBase) : '';
      const controles = '<div class="linha-controles" style="display:flex;align-items:center;justify-content:flex-end;gap:8px;">' +
        '<button class="btn-sm" data-act="edit" data-idx="' + idx + '" style="background:transparent;border:none;padding:0;margin:0;width:28px;height:28px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1rem;" title="Editar">✏️</button>' +
        '<button class="btn-sm danger" data-act="rem" data-idx="' + idx + '" style="background:transparent;border:none;padding:0;margin:0;float:right;width:28px;height:28px;border-radius:14px;display:flex;align-items:center;justify-content:center;">' +
          '<img src="' + trashUrl + '" alt="Excluir" style="width:20px;height:20px;object-fit:contain;opacity:0.9;" />' +
        '</button>' +
      '</div>';

      return '<tr data-i="' + idx + '" class="linha-item ' + (selecionado === idx ? 'sel' : '') + '">' +
          '<td>' + (function () { var t = imgDe(it.nome); return t ? ('<img class="item-thumb" src="' + t + '" alt="" />') : ('<span class="item-emoji-badge">' + (emojiDe(it.nome) || '') + '</span>'); })() + it.nome + badge + '</td>' +
          '<td>' + quantidadeTxt + '</td>' +
          '<td>' + kgValor + '</td>' +
          '<td><div class="preco-valor">' + precoTxt + '</div>' + controles + '</td>' +
        '</tr>';
    }).join('');

    // Mostrar/ocultar cabeçalho da tabela conforme contexto
    try {
      const thead = document.querySelector('#lista thead');
      if (thead) thead.style.display = (modoMercadoAtivo && dados.length > 0) ? '' : 'none';
    } catch (_) { }

    els.tabela.querySelectorAll('.btn-sm[data-act="rem"]').forEach(b => {
      b.addEventListener('click', (e) => {
        const i = Number(e.currentTarget.dataset.idx);
        lista.splice(i, 1);
        salvar(); render(); atualizarInfoMercado();
      });
    });
    els.tabela.querySelectorAll('.btn-sm[data-act="edit"]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const i = Number(e.currentTarget.dataset.idx);
        const item = (Array.isArray(lista) ? lista : [])[i];
        if (!item) return;
        const modal = document.getElementById('modal-editar');
        document.getElementById('edit-nome').value = item.nome || '';
        document.getElementById('edit-qtd').value = item.qtd != null ? item.qtd : '';
        const uniSel = document.getElementById('edit-unidade');
        if (uniSel) uniSel.value = item.unidade || 'un';
        if (modal) { modal.style.display = 'flex'; modal.classList.add('visible'); }
        const salvarBtn = document.getElementById('edit-salvar');
        const cancelarBtn = document.getElementById('edit-cancelar');
        const fecharBtn = document.getElementById('fechar-editar');
        const close = () => { if (modal) { modal.classList.remove('visible'); modal.style.display = 'none'; } };
        if (cancelarBtn) cancelarBtn.onclick = close;
        if (fecharBtn) fecharBtn.onclick = close;
        // foto
        const fotoBtn = document.getElementById('edit-foto');
        const fotoInput = document.getElementById('edit-foto-input');
        const fotoPreview = document.getElementById('edit-foto-preview');
        if (fotoPreview) { fotoPreview.style.display = 'none'; fotoPreview.src = ''; }
        if (fotoBtn && fotoInput) {
          fotoBtn.onclick = () => fotoInput.click();
          fotoInput.onchange = () => {
            const file = fotoInput.files && fotoInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const max = 120;
                const scale = Math.min(max / img.width, max / img.height, 1);
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                if (fotoPreview) { fotoPreview.src = dataUrl; fotoPreview.style.display = ''; }
                // store on item temporarily
                item._foto = dataUrl;
              };
              img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
          };
        }
        if (salvarBtn) salvarBtn.onclick = () => {
          item.nome = (document.getElementById('edit-nome').value || '').trim() || item.nome;
          const q = parseFloat(document.getElementById('edit-qtd').value);
          if (!isNaN(q) && q > 0) item.qtd = q;
          item.unidade = document.getElementById('edit-unidade').value || item.unidade;
          item.categoria = catDe(item.nome);
          if (item._foto) {
            const lp = (Array.isArray(localProducts) ? localProducts : []).find(x => String(x.nome || '').toLowerCase() === String(item.nome || '').toLowerCase());
            if (lp) lp.img = item._foto;
            else localProducts.push({ nome: item.nome, categoria: item.categoria || '', unidade: item.unidade || 'un', emoji: emojiDe(item.nome), img: item._foto });
            delete item._foto;
          }
          salvar(); render(); atualizarInfoMercado();
          close();
        };
      });
    });
    els.tabela.querySelectorAll('tr.linha-item').forEach(tr => {
      tr.addEventListener('click', () => {
        if (!modoMercadoAtivo) return;
        selecionado = Number(tr.dataset.i);
        const item = lista[selecionado];
        els.nomeMercado.value = item ? item.nome : '';
        updateMercadoUI(item);
        const qf = document.getElementById('qtd-mercado');
        if (qf) qf.value = item && item.qtd != null ? String(item.qtd) : '';
        if (els.valorMercado) els.valorMercado.value = '';
        els.valorMercado.focus();
        render();
      });
    });

    renderComprados();
  }

  function atualizarInfoMercado() {
    // Ocultar completamente no modo planejamento (problema #2)
    if (!modoMercadoAtivo) {
      if (els.infoMercado) els.infoMercado.style.display = 'none';
      return;
    }

    // Mostrar apenas no modo mercado
    if (els.infoMercado) els.infoMercado.style.display = '';

    const faltam = lista.filter(i => !i.comprado).length;
    const faltamKg = lista.filter(i => !i.comprado && String(i.unidade || '').toLowerCase() === 'kg').length;
    const pendenciasPeso = (Array.isArray(boughtItems) ? boughtItems : []).filter(x => (x.unidade || '').toLowerCase() === 'kg' && x.peso == null).length;
    const total = boughtItems.reduce((s, i) => s + (i.total || 0), 0);
    const listaVazia = (!Array.isArray(lista) || lista.length === 0) && (!Array.isArray(boughtItems) || boughtItems.length === 0);
    const parts = [];
    if (faltam > 0) parts.push('Faltam ' + faltam + ' item(ns)');
    if (faltamKg > 0) parts.push(faltamKg + ' por kg');
    if (pendenciasPeso > 0) parts.push(pendenciasPeso + ' pendência(s) de peso');

    if (els.alertaFaltando) {
      if (listaVazia) els.alertaFaltando.textContent = 'Lista vazia';
      else els.alertaFaltando.textContent = parts.length ? parts.join(' • ') : 'Tudo comprado 🎉';
    }
    if (els.totalCompra) {
      if (listaVazia) {
        els.totalCompra.textContent = '';
        els.totalCompra.style.color = '';
      } else {
        let txt = 'Total: ' + fmt(total);
        if (budget > 0) {
          const restante = budget - total;
          if (restante < 0) {
            txt += '  ⚠️ Acima do orçamento em ' + fmt(Math.abs(restante));
            els.totalCompra.style.color = '#ef4444';
          } else {
            txt += '  (restam ' + fmt(restante) + ')';
            els.totalCompra.style.color = '';
          }
        } else {
          els.totalCompra.style.color = '';
        }
        els.totalCompra.textContent = txt;
      }
    }
    if (els.compradosPending) {
      els.compradosPending.style.display = pendenciasPeso > 0 ? '' : 'none';
      els.compradosPending.textContent = String(pendenciasPeso);
    }
    if (els.compradosTotalBadge) {
      els.compradosTotalBadge.style.display = total > 0 ? '' : 'none';
      els.compradosTotalBadge.textContent = fmt(total);
    }
    try { atualizarSugestoes(); } catch (_) { }
  }

  function renderComprados() {
    if (!els.tabelaComprados) return;
    const hasComprados = boughtItems.length > 0;
    if (els.compradosSection) {
      els.compradosSection.style.display = hasComprados ? '' : 'none';
    }
    if (els.compradosCount) {
      els.compradosCount.textContent = String(boughtItems.length || 0);
    }
    if (!hasComprados) {
      setCompradosExpanded(false);
      if (els.tabelaComprados) els.tabelaComprados.innerHTML = '';
      return;
    }
    // Garante consistência visual com o estado atual
    setCompradosExpanded(compradosExpanded);
    els.tabelaComprados.innerHTML = boughtItems.map((it, bi) => {
      const unidade = String(it.unidade || '').toLowerCase();
      const precoUnit = typeof it.preco === 'number' ? it.preco : null;
      const qtdTxt = unidade === 'kg' ? '' : (typeof it.qtd === 'number' ? (it.qtd % 1 ? it.qtd.toLocaleString('pt-BR') : String(it.qtd)) : (it.qtd || ''));
      const kgTxt = unidade === 'kg' ? (it.peso == null ? '' : (Number(it.peso).toFixed(3).replace('.', ','))) : '';
      const precoTxt = precoUnit != null ? fmt(precoUnit) : '';
      const totalTxt = unidade === 'kg' && it.peso == null ? '' : fmt(it.total);
      const delBtn = '<button class="btn-sm danger delete-bought" data-idx="' + bi + '" title="Excluir" style="background:transparent;border:none;padding:0;margin:0;float:right;width:26px;height:26px;border-radius:13px;display:flex;align-items:center;justify-content:center;"><img src="' + trashUrl + '" alt="Excluir" style="width:18px;height:18px;object-fit:contain;opacity:0.9;" /></button>';
      const qtyCol = unidade === 'kg' ? kgTxt : (qtdTxt || '');
      return '<tr class="linha-comprado" data-i="' + bi + '" data-nome="' + it.nome + '" title="Toque para editar"><td><span class="item-emoji-badge">' + (emojiDe(it.nome) || '') + '</span>' + it.nome + delBtn + '</td><td>' + qtyCol + '</td><td class="comprado-unit">' + precoTxt + '</td><td>' + totalTxt + '</td></tr>';
    }).join('');

    try {
      const rows = document.querySelectorAll('#lista-comprados tbody tr');
      rows.forEach(tr => {
        tr.addEventListener('click', () => {
          const bi = Number(tr.getAttribute('data-i'));
          const it = boughtItems[bi]; if (!it) return;
          editingBoughtIndex = bi;
          modoMercadoAtivo = true;
          if (els.formPlan) els.formPlan.style.display = 'none';
          if (els.formMercado) els.formMercado.style.display = '';
          if (els.quickFilters) els.quickFilters.style.display = 'none';
          els.nomeMercado.value = it.nome || '';
          els.valorMercado.value = typeof it.preco === 'number' ? String(it.preco).replace('.', ',') : '';
          if (els.pesoMercado) els.pesoMercado.value = it.unidade === 'kg' && it.peso != null ? String(it.peso).replace('.', ',') : '';
          const qf = document.getElementById('qtd-mercado'); if (qf) qf.value = it.unidade !== 'kg' && it.qtd != null ? String(it.qtd) : '';
          if (els.compraKg) els.compraKg.checked = (String(it.unidade || '').toLowerCase() === 'kg');
          els.valorMercado && els.valorMercado.focus();
        });
      });
      try {
        document.querySelectorAll('#lista-comprados .delete-bought').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const i = parseInt(btn.getAttribute('data-idx'));
            if (!isNaN(i) && i >= 0) { boughtItems.splice(i, 1); salvar(); renderComprados(); atualizarInfoMercado(); }
          });
        });
      } catch (_) { }
    } catch (_) { }
  }

  // ===== ACTIONS =====
  const registrarPreferenciasManual = () => {
    if (!els.nome || !els.unidadeSel) return;
    smartUnit.registrarPreferencia(els.nome.value, els.unidadeSel.value);
    salvarSmartUnit();
  };

  const salvarSmartUnit = () => {
    localStorage.setItem(smartHistoryKey, JSON.stringify(smartUnit.historico));
    localStorage.setItem(smartProfileKey, JSON.stringify(smartUnit.perfil));
  };

  if (els.unidadeSel) {
    els.unidadeSel.addEventListener('change', registrarPreferenciasManual);
  }

  if (els.adicionar) {
    els.adicionar.addEventListener('click', () => {
      const nome = (els.nome.value || '').trim();
      const qtd = parseFloat(els.quantidade.value || '1');
      if (!nome || isNaN(qtd) || qtd <= 0) { showError('Informe nome e quantidade válida.'); return; }
      
      const uni = els.unidadeSel ? els.unidadeSel.value : 'un';
      
      const itemObj = {
        nome,
        qtd,
        unidade: uni,
        categoria: catDe(nome),
        comprado: false,
        preco: null,
        total: null
      };
      
      // Adição automática à base local quando produto não existir
      if (!existeNaBase(nome)) {
        const existsLocal = (Array.isArray(localProducts) ? localProducts : []).some(x => String(x.nome || '').toLowerCase() === nome.toLowerCase());
        if (!existsLocal) {
          localProducts.push({ nome, categoria: '', unidade: uni, emoji: emojiDe(nome) });
          salvar();
        }
      }
      
      lista.push(itemObj);
      if (els.nome) els.nome.value = '';
      if (els.quantidade) els.quantidade.value = '';
      populateUnidadeOptions('');
      salvarSmartUnit();
      salvar(); render();
      try { /* showToast(`✅ Adicionado: ${nome}`); */ } catch (_) { }
    });
  }

  if (els.modoMercado) {
    els.modoMercado.addEventListener('click', () => {
      modoMercadoAtivo = true; selecionado = null;
      els.formPlan.style.display = 'none';
      els.formMercado.style.display = '';
      document.querySelectorAll('.coluna-mercado').forEach(td => td.style.display = '');
      if (els.nomeMercado) setTimeout(() => els.nomeMercado.focus(), 0);
      // auto-colapsa ao entrar no Mercado
      listaColapsada = true;
      if (els.quickFilters) els.quickFilters.style.display = 'flex';
      render(); atualizarInfoMercado();
      console.log('[mercado] ativado');
    });
  }

  if (els.voltarPlan) {
    els.voltarPlan.addEventListener('click', () => {
      modoMercadoAtivo = false; selecionado = null;
      // rollover: itens comprados saem da lista ativa (já salvos em boughtItems); não comprados ficam
      if (Array.isArray(boughtItems) && boughtItems.length) {
        ultimaCompra = boughtItems.slice();
        try { localStorage.setItem('ultimaCompra_v1', JSON.stringify(ultimaCompra)); } catch (_) { }
      }
      lista = (Array.isArray(lista) ? lista : []).filter(x => !x.comprado);
      window.lista = lista;
      els.formPlan.style.display = '';
      els.formMercado.style.display = 'none';
      document.querySelectorAll('.coluna-mercado').forEach(td => td.style.display = 'none');
      // auto-expandir ao sair do Mercado
      listaColapsada = false;
      if (els.listaWrapper) els.listaWrapper.style.display = '';
      if (els.quickFilters) els.quickFilters.style.display = 'none';
      quickFilter = 'all';
      salvar(); render(); atualizarInfoMercado();
      console.log('[mercado] desativado (rollover aplicado)');
    });
  }

  // ===== TOGGLE: Recolher lista (estado mantido sem botão visível por enquanto) =====
  if (els.listaWrapper) {
    const updateCollapseUI = () => {
      els.listaWrapper.style.display = listaColapsada ? 'none' : '';
    };
    updateCollapseUI();
  }

  if (els.adicionarComprado) {
    els.adicionarComprado.addEventListener('click', () => {
      if (editingBoughtIndex !== null) {
        const bi = editingBoughtIndex; const cur = boughtItems[bi]; if (!cur) { editingBoughtIndex = null; return; }
        const preco = parseFloat((els.valorMercado.value || '').replace(',', '.'));
        const peso = parseFloat((els.pesoMercado?.value || '').replace(',', '.'));
        const qtd = parseFloat((document.getElementById('qtd-mercado')?.value || '').replace(',', '.'));
        const isKg = String(cur.unidade || '').toLowerCase() === 'kg';
        if (isNaN(preco) || preco < 0) { showError('Informe um preço válido.'); return; }
        cur.preco = preco;
        if (isKg) { cur.peso = Number.isFinite(peso) && peso > 0 ? peso : null; cur.total = cur.peso ? (preco * cur.peso) : 0; }
        else { cur.qtd = Number.isFinite(qtd) && qtd > 0 ? qtd : cur.qtd || 1; cur.total = preco * (cur.qtd || 1); }
        cur.date = new Date().toISOString();
        salvar(); editingBoughtIndex = null;
        els.valorMercado.value = ''; if (els.nomeMercado) els.nomeMercado.value = ''; if (els.pesoMercado) els.pesoMercado.value = '';
        const totalInput2 = document.getElementById('total-mercado'); if (totalInput2) totalInput2.value = '';
        if (els.compraKg) els.compraKg.checked = false; updateMercadoUI(null); atualizarInfoMercado(); renderComprados(); render();
        try { /* showToast('✅ Item atualizado'); */ } catch (_) { }
        return;
      }
      if (selecionado === null) { showWarning('Selecione um item na tabela.'); return; }
      const preco = parseFloat((els.valorMercado.value || '').replace(',', '.'));
      if (isNaN(preco) || preco < 0) { showError('Informe um preço válido.'); return; }
      const it = lista[selecionado];
      let peso = parseFloat((els.pesoMercado?.value || '').replace(',', '.')) || 0;
      const uni = (it.unidade || '').toLowerCase();
      const qtdReal = parseFloat((document.getElementById('qtd-mercado')?.value || '').replace(',', '.'));
      const kgToggle = !!(els.compraKg && els.compraKg.checked);
      const isKg = (uni === 'kg') || kgToggle;
      // Se for kg e total informado, derivar peso = total/preco
      if (isKg) {
        const totalInformado = parseFloat((document.getElementById('total-mercado')?.value || '').replace(',', '.')) || 0;
        if (peso <= 0 && totalInformado > 0 && preco > 0) {
          peso = totalInformado / preco;
        }
      }
      let total = 0;
      let packSize = null;
      if (isKg) {
        const efetivo = peso > 0 ? peso : 0;
        total = efetivo > 0 ? (preco * efetivo) : 0;
      } else if (uni === 'pente') {
        const packInput = document.getElementById('packsize-mercado');
        const raw = packInput ? packInput.value : '';
        const last = (priceHistory[it.nome] || [])[0];
        const lastSize = last && last.packSize ? Number(last.packSize) : 30;
        packSize = Math.max(1, parseInt(raw || String(lastSize), 10));
        const q = !isNaN(qtdReal) && qtdReal > 0 ? qtdReal : (it.qtd || 1);
        total = preco * q; // preço por pente
      } else if (uni === 'pack') {
        const packInput = document.getElementById('packsize-mercado');
        const raw = packInput ? packInput.value : '';
        const last = (priceHistory[it.nome] || [])[0];
        const lastSize = last && last.packSize ? Number(last.packSize) : 6;
        packSize = Math.max(1, parseInt(raw || String(lastSize), 10));
        const q = !isNaN(qtdReal) && qtdReal > 0 ? qtdReal : (it.qtd || 1);
        total = preco * q; // preço por pack
      } else {
        // padrão: preço por unidade/embalagem
        const q = !isNaN(qtdReal) && qtdReal > 0 ? qtdReal : (it.qtd || 1);
        total = preco * q;
      }

      // Atualiza histórico de preço por produto (guarda últimos 5)
      if (!priceHistory[it.nome]) priceHistory[it.nome] = [];
      if (preco > 0 && (qtdReal > 0 || peso > 0)) {
        priceHistory[it.nome].unshift({ date: new Date().toISOString(), price: preco, unit: (isKg ? 'kg' : it.unidade), packSize });
        if (priceHistory[it.nome].length > 5) priceHistory[it.nome].pop();
      }

      // Fluxo especial para KG: permitir marcar sem peso e finalizar depois
      if (isKg && (!peso || peso <= 0)) {
        const targetUnit = 'kg';
        const pending = (boughtItems.find(x => x.nome === it.nome && x.unidade === targetUnit && (x.peso == null)));
        if (!pending) {
          boughtItems.unshift({
            nome: it.nome,
            qtd: it.qtd,
            peso: null,
            unidade: 'kg',
            categoria: it.categoria || '',
            preco,
            total: 0,
            packSize: null,
            date: new Date().toISOString(),
            pendingWeight: true
          });
        } else {
          pending.preco = preco;
          pending.date = new Date().toISOString();
        }
        it.comprado = true; it.preco = preco; it.total = null;
      } else {
        // Demais casos (ou kg com peso fornecido)
        // Se havia pendência de peso para este item, finalize-a
        let finalized = false;
        if (isKg) {
          const pending = boughtItems.find(x => x.nome === it.nome && x.unidade === 'kg' && (x.peso == null));
          if (pending) {
            pending.peso = peso;
            pending.total = total;
            pending.pendingWeight = false;
            pending.date = new Date().toISOString();
            finalized = true;
          }
        }
        if (!finalized) {
          boughtItems.unshift({
            nome: it.nome,
            qtd: it.qtd,
            peso: isKg ? (peso || null) : null,
            unidade: isKg ? 'kg' : it.unidade,
            categoria: it.categoria || '',
            preco,
            total,
            packSize: packSize || null,
            date: new Date().toISOString()
          });
        }
        it.comprado = true; it.preco = preco; it.total = total;
        // Aprendizado de peso médio por peça (se qtd disponível)
        if (isKg && peso > 0) {
          const qtyReal = parseFloat((document.getElementById('qtd-mercado')?.value || '').replace(',', '.')) || Number(it.qtd || 0);
          if (qtyReal > 0) {
            const observed = peso / qtyReal;
            const key = String(it.nome || '').toLowerCase();
            const cur = avgWeightPerPiece[key] || { avg: 0, n: 0 };
            const newAvg = (cur.avg * cur.n + observed) / (cur.n + 1);
            avgWeightPerPiece[key] = { avg: newAvg, n: cur.n + 1 };
          }
        }
      }
      try {
        if (selecionado != null && selecionado >= 0) {
          lista.splice(selecionado, 1);
          selecionado = null;
        }
      } catch (_) { }
      salvar();
      els.valorMercado.value = '';
      if (els.nomeMercado) els.nomeMercado.value = '';
      if (els.pesoMercado) els.pesoMercado.value = '';
      const totalInput2 = document.getElementById('total-mercado');
      if (totalInput2) totalInput2.value = '';
      if (els.compraKg) els.compraKg.checked = false;
      updateMercadoUI(null);
      atualizarInfoMercado();
      render();
      try { /* showToast('🛒 Comprado: ' + (it && it.nome ? it.nome : '')); */ } catch (_) { }
      console.log('[comprado] item', it && it.nome, 'preco', preco, 'total', total);
    });
  }

  // ===== AJUDA =====

  // ===== UI FUNCTIONS (Silenciadas a pedido do usuário) =====
  const showError = (msg) => { console.error('[erro]', msg); };
  const showWarning = (msg) => { console.warn('[aviso]', msg); };
  const showSuccess = (msg) => { console.log('[sucesso]', msg); };
  const modalAjuda = document.getElementById('modal-ajuda');
  const fecharAjuda = document.getElementById('fechar-ajuda');
  if (fecharAjuda && modalAjuda) fecharAjuda.addEventListener('click', () => { modalAjuda.classList.remove('visible'); modalAjuda.style.display = 'none'; });
  if (modalAjuda) window.addEventListener('click', (e) => { if (e.target === modalAjuda) { modalAjuda.classList.remove('visible'); modalAjuda.style.display = 'none'; } });
  // abrir via menu ⋯
  // handler de ajuda já consolidado no listener principal do menu

  // Indicador de preço (comparação com último preço conhecido)
  if (els.valorMercado && els.indicadorPreco) {
    const updateIndicador = () => {
      if (els.indicadorPreco) els.indicadorPreco.style.display = 'none';
    };
    els.valorMercado.addEventListener('input', updateIndicador);
    const qtdField = document.getElementById('qtd-mercado');
    if (qtdField) qtdField.addEventListener('input', updateIndicador);
    const totalField = document.getElementById('total-mercado');
    if (totalField) totalField.addEventListener('input', updateIndicador);
    // atualizar quando selecionar item
    document.addEventListener('click', (e) => {
      if (e.target && e.target.closest && e.target.closest('tr.linha-item')) setTimeout(updateIndicador, 0);
    });
  }

  if (els.verHistoricoPreco) {
    els.verHistoricoPreco.addEventListener('click', () => {
      if (selecionado === null) { showWarning('Selecione um item para ver histórico.'); return; }
      const it = lista[selecionado];
      const hist = priceHistory[it.nome] || [];
      const cont = document.getElementById('historico-preco-conteudo');
      const modal = document.getElementById('modal-historico-preco');
      if (!cont || !modal) return;
      if (hist.length === 0) {
        cont.innerHTML = '<em>Sem histórico para este produto.</em>';
      } else {
        const rows = hist.slice(0, 10).map(h => {
          const d = new Date(h.date);
          const dt = isNaN(d.getTime()) ? h.date : d.toLocaleString('pt-BR');
          const unit = h.unit || '';
          const pack = h.packSize ? (' · pack ' + h.packSize) : '';
          return '<div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-color);padding:6px 0;">' +
            '<span>' + dt + '</span><span style="font-weight:600;">' + fmt(h.price) + (unit ? (' · ' + unit) : '') + pack + '</span>' +
          '</div>';
        }).join('');
        cont.innerHTML = rows;
      }
      modal.style.display = 'flex';
      modal.classList.add('visible');
    });
    const fecharHist = document.getElementById('fechar-historico-preco');
    const modalHist = document.getElementById('modal-historico-preco');
    if (fecharHist) fecharHist.addEventListener('click', () => { modalHist.classList.remove('visible'); modalHist.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modalHist) { modalHist.classList.remove('visible'); modalHist.style.display = 'none'; } });
  }

  if (els.apagarLista) {
    els.apagarLista.addEventListener('click', () => {
      if (!confirm('Apagar toda a lista?')) return;
      lista = [];
      boughtItems = [];
      priceHistory = {};
      salvar(); render(); atualizarInfoMercado();
    });
  }

  if (els.salvarLista) {
    els.salvarLista.addEventListener('click', () => {
      const nome = prompt('Nome da lista:');
      if (!nome) return;
      listasSalvas[nome] = lista.slice();
      localStorage.setItem('savedLists_v3', JSON.stringify(listasSalvas));
      showSuccess('Lista salva!');
    });
  }

  // Exportar dados
  if (els.exportarDados) {
    els.exportarDados.addEventListener('click', async () => {
      try {
        const data = {
          lista,
          boughtItems,
          priceHistory,
          localProducts,
          theme: document.body.dataset.theme || 'light'
        };

        let shared = false;

        // Tentar compartilhar via Capacitor Share (nativo)
        try {
          const cap = window.Capacitor;
          const Share = cap && cap.Plugins ? cap.Plugins.Share : null;
          if (Share && (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform() || (cap && cap.isNative === true))) {
            await Share.share({
              title: 'Exportar Dados - Lista+',
              text: JSON.stringify(data, null, 2),
              dialogTitle: 'Compartilhar dados'
            });
            shared = true;
            // showToast('📤 Dados compartilhados com sucesso!');
            return;
          }
        } catch (err) {
          console.log('[export] Capacitor Share error', err);
        }

        // Tentar Web Share API
        if (!shared && navigator && navigator.share) {
          try {
            await navigator.share({
              title: 'Lista+ - Exportar Dados',
              text: JSON.stringify(data, null, 2)
            });
            shared = true;
            // showToast('📤 Dados compartilhados com sucesso!');
            return;
          } catch (err) {
            console.log('[export] Web Share error', err);
          }
        }

        // Fallback: Download do arquivo
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lista-mercado-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        // showToast('💾 Dados exportados com sucesso!');
      } catch (err) {
        console.error('[export] Error:', err);
        // showToast('❌ Erro ao exportar dados. Tente novamente.');
        alert('Erro ao exportar dados: ' + (err && err.message ? err.message : 'Desconhecido'));
      }
    });
  }

  // ===== MODAL LISTAS SALVAS =====
  const abrirModalListas = () => { els.modalListas.style.display = 'flex'; els.modalListas.classList.add('visible'); renderListasSalvas(); };
  const fecharModalListas = () => { els.modalListas.classList.remove('visible'); els.modalListas.style.display = 'none'; };
  const renderListasSalvas = () => {
    els.savedListsContainer.innerHTML = '';
    const nomes = Object.keys(listasSalvas);
    const nomesComprados = Object.keys(savedPurchases);
    if (nomes.length === 0 && nomesComprados.length === 0) { els.savedListsContainer.textContent = 'Nenhuma lista salva.'; return; }
    if (nomes.length > 0) {
      const h = document.createElement('h3'); h.textContent = 'Minhas listas'; els.savedListsContainer.appendChild(h);
    }
    nomes.forEach(n => {
      const div = document.createElement('div');
      div.className = 'saved-list-item';
      div.innerHTML = '<span>' + n + '</span>' +
        '<div class="saved-list-actions">' +
          '<button class="load-btn" data-type="lista" data-n="' + n + '">Carregar</button>' +
          '<button class="delete-btn" data-type="lista" data-n="' + n + '">Excluir</button>' +
        '</div>';
      els.savedListsContainer.appendChild(div);
    });
    if (nomesComprados.length > 0) {
      const h2 = document.createElement('h3'); h2.textContent = 'Comprados salvos'; els.savedListsContainer.appendChild(h2);
      nomesComprados.forEach(n => {
        const div = document.createElement('div');
        div.className = 'saved-list-item';
        div.innerHTML = '<span>' + n + '</span>' +
          '<div class="saved-list-actions">' +
            '<button class="load-btn" data-type="comprados" data-n="' + n + '">Carregar</button>' +
            '<button class="delete-btn" data-type="comprados" data-n="' + n + '">Excluir</button>' +
          '</div>';
        els.savedListsContainer.appendChild(div);
      });
    }
    els.savedListsContainer.addEventListener('click', onClickSavedLists, { once: true });
  };
  const onClickSavedLists = (e) => {
    const n = e.target.dataset.n; if (!n) return;
    const type = e.target.dataset.type || 'lista';
    if (e.target.classList.contains('load-btn')) {
      if (type === 'lista') {
        lista = [].concat(listasSalvas[n] || []); salvar(); render(); atualizarInfoMercado(); fecharModalListas();
      } else {
        boughtItems = Array.isArray(savedPurchases[n]) ? [].concat(savedPurchases[n]) : [];
        salvar(); renderComprados && renderComprados(); fecharModalListas();
      }
    } else if (e.target.classList.contains('delete-btn')) {
      if (type === 'lista') {
        if (confirm('Excluir lista "' + n + '"?')) { delete listasSalvas[n]; localStorage.setItem('savedLists_v3', JSON.stringify(listasSalvas)); renderListasSalvas(); }
      } else {
        if (confirm('Excluir comprados "' + n + '"?')) { delete savedPurchases[n]; localStorage.setItem('savedPurchases_v1', JSON.stringify(savedPurchases)); renderListasSalvas(); }
      }
    }
  };
  if (els.abrirListas) els.abrirListas.addEventListener('click', abrirModalListas);
  if (els.fecharListas) els.fecharListas.addEventListener('click', fecharModalListas);
  window.addEventListener('click', (e) => { if (e.target === els.modalListas) fecharModalListas(); });

  // Botão adicional para abrir comprados salvos (problema #11)
  const btnAbrirCompradosSalvos = document.getElementById('abrir-comprados-salvos');
  if (btnAbrirCompradosSalvos) {
    btnAbrirCompradosSalvos.addEventListener('click', abrirModalListas);
  }

  // Fallback de delegação para abrir listas salvas
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('#abrir-listas');
    if (btn) { console.log('[listas] open (delegation)'); abrirModalListas(); }
  });

  // ===== FILTERS & INIT =====
  // pesquisa removida da UI

  // força estado inicial: planejamento
  modoMercadoAtivo = false;
  if (els.formPlan) els.formPlan.style.display = '';
  if (els.formMercado) els.formMercado.style.display = 'none';
  document.querySelectorAll('.coluna-mercado').forEach(td => td.style.display = 'none');
  render();

  // ===== IMPORTAR DADOS =====
  if (els.exportarDados) {
    // já implementado acima
  }
  const importBtn = document.getElementById('importar-dados');
  if (importBtn) {
    importBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = async () => {
        const file = input.files && input.files[0]; if (!file) return;
        try {
          const text = await file.text();
          const data = JSON.parse(text || '{}');
          const modeRaw = prompt('Modo de importação:\n- merge (adiciona sem sobrescrever)\n- update (atualiza existentes e mantém os demais)\n- replace (substitui tudo)\n\nDigite: merge | update | replace', 'update');
          const mode = (modeRaw || '').toLowerCase().trim();

          // ===== Schema validation + Preview =====
          const validate = (d) => {
            const errors = [];
            if (d.lista && !Array.isArray(d.lista)) errors.push('lista deve ser um array');
            if (Array.isArray(d.lista)) {
              d.lista.forEach((it, idx) => {
                if (typeof it.nome !== 'string' || !it.nome.trim()) errors.push(`lista[${idx}].nome inválido`);
                if (it.qtd != null && isNaN(Number(it.qtd))) errors.push(`lista[${idx}].qtd inválido`);
              });
            }
            if (d.boughtItems && !Array.isArray(d.boughtItems)) errors.push('boughtItems deve ser um array');
            if (d.priceHistory && typeof d.priceHistory !== 'object') errors.push('priceHistory deve ser objeto');
            if (d.localProducts && !Array.isArray(d.localProducts)) errors.push('localProducts deve ser um array');
            if (d.theme && !['light', 'dark'].includes(d.theme)) errors.push('theme inválido');
            return { valid: errors.length === 0, errors };
          };

          const { valid, errors } = validate(data);
          const modalPrev = document.getElementById('modal-import-preview');
          const prevErr = document.getElementById('import-preview-errors');
          const prevSum = document.getElementById('import-preview-summary');
          const prevClose = document.getElementById('fechar-import-preview');
          const prevCancel = document.getElementById('cancelar-import');
          const prevApply = document.getElementById('aplicar-import');

          if (!modalPrev || !prevErr || !prevSum) {
            alert('Prévia indisponível. Aplicando diretamente.');
          } else {
            // calcular diffs conforme modo
            const lower = (s) => String(s || '').toLowerCase();
            var currentByName = {};
            lista.forEach(function(i) { currentByName[lower(i.nome)] = i; });
            let addCount = 0, updCount = 0, ignoreCount = 0;
            if (Array.isArray(data.lista)) {
              data.lista.forEach(function(it) {
                const k = lower(it.nome);
                if (!currentByName[k]) addCount++; else updCount++;
              });
              ignoreCount = lista.length - updCount; // aproximado
            }
            const biCount = Array.isArray(data.boughtItems) ? data.boughtItems.length : 0;
            const lpCount = Array.isArray(data.localProducts) ? data.localProducts.length : 0;
            const phCount = data.priceHistory ? Object.keys(data.priceHistory).length : 0;
            const themeInfo = data.theme ? ('Tema: ' + data.theme) : 'Tema: (sem alteração)';

            prevErr.style.display = valid ? 'none' : '';
            prevErr.innerHTML = valid ? '' : ('Erros de schema:<br>' + errors.map(function(e) { return '- ' + e; }).join('<br>'));
            const prevInfo = prevSum;
            if (prevInfo) {
              prevInfo.innerHTML = '<div><strong>Modo:</strong> ' + (mode || 'merge') + '</div>' +
                '<div style="margin-top:6px;">Lista: +' + addCount + ' novos, ~' + updCount + ' atualizar</div>' +
                '<div>Comprados: ' + biCount + ' itens</div>' +
                '<div>Base Local: ' + lpCount + ' produtos</div>' +
                '<div>' + themeInfo + '</div>';
            }
            // abrir modal
            modalPrev.style.display = 'flex';
            const closePrev = () => { modalPrev.style.display = 'none'; };
            prevClose.onclick = closePrev;
            prevCancel.onclick = closePrev;

            prevApply.onclick = () => {
              if (!valid) { alert('Corrija o arquivo antes de importar.'); return; }
              // aplicar segundo modo escolhido
              if (mode === 'replace') {
                lista = Array.isArray(data.lista) ? data.lista : [];
                boughtItems = Array.isArray(data.boughtItems) ? data.boughtItems : [];
                priceHistory = (data.priceHistory && typeof data.priceHistory === 'object') ? data.priceHistory : {};
                localProducts = Array.isArray(data.localProducts) ? data.localProducts : [];
              } else if (mode === 'update') {
                if (Array.isArray(data.lista)) {
                  var byName = {};
                  lista.forEach(function(i) { byName[String(i.nome || '').toLowerCase()] = i; });
                  data.lista.forEach(function(it) {
                    var k = String(it.nome || '').toLowerCase();
                    if (byName[k]) {
                      var cur = byName[k];
                      byName[k] = Object.assign({}, cur, it);
                    } else {
                      byName[k] = it;
                    }
                  });
                  lista = [];
                  for (var key in byName) { lista.push(byName[key]); }
                }
                if (Array.isArray(data.boughtItems)) {
                  var merged = [].concat(data.boughtItems).concat(boughtItems);
                  var seen = {};
                  boughtItems = merged.filter(function(x) {
                    var key = x.nome + '|' + (x.date || '') + '|' + (x.total || 0);
                    if (seen[key]) return false; seen[key] = true; return true;
                  });
                }
                if (data.priceHistory && typeof data.priceHistory === 'object') {
                  for (const [nome, arr] of Object.entries(data.priceHistory)) {
                    const ordered = (Array.isArray(arr) ? arr : []).slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
                    priceHistory[nome] = ordered;
                  }
                }
                if (Array.isArray(data.localProducts)) {
                  var byNameLP = {};
                  (Array.isArray(localProducts) ? localProducts : []).forEach(function(p) { byNameLP[String(p.nome || '').toLowerCase()] = p; });
                  data.localProducts.forEach(function(p) {
                    var k = String(p.nome || '').toLowerCase();
                    if (byNameLP[k]) {
                      var cur = byNameLP[k];
                      byNameLP[k] = Object.assign({}, cur, p);
                    } else {
                      byNameLP[k] = p;
                    }
                  });
                  localProducts = [];
                  for (var keyLP in byNameLP) { localProducts.push(byNameLP[keyLP]); }
                }
              } else { // merge
                if (Array.isArray(data.lista)) {
                  var nomesExist = {};
                  lista.forEach(function(i) { nomesExist[String(i.nome || '').toLowerCase()] = true; });
                  data.lista.forEach(function(i) {
                    if (!nomesExist[String(i.nome || '').toLowerCase()]) lista.push(i);
                  });
                }
                if (Array.isArray(data.boughtItems)) {
                  boughtItems = [].concat(data.boughtItems).concat(boughtItems);
                }
                  for (var nome in data.priceHistory) {
                    var arr = data.priceHistory[nome];
                    var current = priceHistory[nome] || [];
                    var merged = [].concat(arr).concat(current);
                    var seen = {};
                    var uniq = [];
                    merged.forEach(function(x) {
                      var key = (x.date || '') + '|' + (x.price || '');
                      if (!seen[key]) { seen[key] = true; uniq.push(x); }
                    });
                    uniq.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
                    priceHistory[nome] = uniq.slice(0, 5);
                  }
                if (Array.isArray(data.localProducts)) {
                  var nomesLP = new Set((Array.isArray(localProducts) ? localProducts : []).map(function(p) { return String(p.nome || '').toLowerCase(); }));
                  data.localProducts.forEach(function(p) {
                    if (!nomesLP.has(String(p.nome || '').toLowerCase())) {
                      var newP = Object.assign({}, p);
                      if (!newP.emoji) newP.emoji = emojiDe(p.nome);
                      localProducts.push(newP);
                    }
                  });
                }
              }

              if (data.theme) applyTheme(data.theme);
              salvar();
              render();
              popularCategorias();
              atualizarInfoMercado();
              closePrev();
              console.log('[import] applied', mode || 'merge', { lista: lista.length, bought: boughtItems.length });
            };
            return; // evita aplicar direto
          }

          // fallback: caso não exista modal, aplica direto
          if (data.theme) applyTheme(data.theme);
          salvar();
          render();
          atualizarInfoMercado();
        } catch (e) {
          showError('Arquivo inválido.');
          try { console.log('[import] error', e && e.message ? e.message : e); } catch (_) { }
        }
      };
      input.click();
    });
  }

  // ===== RELATÓRIOS =====
  const reportsBtn = document.getElementById('reports-btn');
  const modalRel = document.getElementById('modal-relatorios');
  const fecharRelBtn = document.getElementById('fechar-relatorios');
  const relConteudo = document.getElementById('relatorio-conteudo');
  const relCanvas = document.getElementById('relatorio-chart');
  const exportCsvBtn = document.getElementById('exportar-relatorio-csv');

  const abrirRel = () => {
    if (!modalRel) return;
    modalRel.style.display = 'flex';
    modalRel.classList.add('visible');
    atualizarRelatorio(0);
  };
  const closeRel = () => {
    if (!modalRel) return;
    modalRel.classList.remove('visible');
    modalRel.style.display = 'none';
  };
  if (reportsBtn) reportsBtn.addEventListener('click', abrirRel);
  if (fecharRelBtn) fecharRelBtn.addEventListener('click', closeRel);
  window.addEventListener('click', (e) => { if (e.target === modalRel) closeRel(); });
  // Fallback de delegação para Relatórios
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('#reports-btn');
    if (btn) { console.log('[reports] open (delegation)'); abrirRel(); }
  });

  function atualizarRelatorio(periodoDias) {
    if (!relConteudo) return;
    const agora = Date.now();
    const limite = periodoDias > 0 ? (agora - periodoDias * 24 * 60 * 60 * 1000) : 0;
    const itens = boughtItems.filter(i => !periodoDias || (new Date(i.date).getTime() >= limite));
    const porCat = {};
    let total = 0;
    itens.forEach(i => {
      const cat = i.categoria || 'Outros';
      porCat[cat] = (porCat[cat] || 0) + (i.total || 0);
      total += (i.total || 0);
    });
    const linhas = Object.entries(porCat)
      .sort((a, b) => b[1] - a[1])
      .map(function(pair) {
        return '<div style="display:flex;justify-content:space-between;"> <span>' + pair[0] + '</span> <strong>' + fmt(pair[1]) + '</strong> </div>';
      })
      .join('');
    relConteudo.innerHTML = '<div style="margin:6px 0;">Total no período: <strong>' + fmt(total) + '</strong></div>' +
      '<hr style="margin:8px 0; border-color: var(--border-color);"/>' +
      (linhas || '<em>Sem compras neste período.</em>');

    // desenhar gráfico de barras simples
    if (relCanvas) {
      const ctx = relCanvas.getContext('2d');
      const data = Object.entries(porCat).sort((a, b) => b[1] - a[1]);
      ctx.clearRect(0, 0, relCanvas.width, relCanvas.height);
      const padding = 28, gap = 8;
      const w = relCanvas.width - padding * 2;
      const h = relCanvas.height - padding * 2;
      const max = Math.max(1, ...data.map(d => d[1]));
      const barW = data.length ? Math.max(10, (w - gap * (data.length - 1)) / data.length) : 0;
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary-color').trim() || '#6366f1';
      ctx.font = '12px Roboto, sans-serif';
      ctx.fillStyle = '#999';
      ctx.fillText('Total: ' + fmt(total), padding, padding - 8);
      data.forEach((d, i) => {
        const x = padding + i * (barW + gap);
        const barH = max ? (d[1] / max) * h : 0;
        const y = padding + (h - barH);
        // bar
        ctx.fillStyle = '#6366f1';
        if (document.body.dataset.theme === 'dark') ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(x, y, barW, barH);
        // label
        ctx.fillStyle = '#bbb';
        if (document.body.dataset.theme === 'dark') ctx.fillStyle = '#ddd';
        const label = d[0].slice(0, 8);
        ctx.fillText(label, x, padding + h + 14);
      });
    }

    // atualizar handler de export para CSV do período atual
    if (exportCsvBtn) {
      exportCsvBtn.onclick = () => {
        const rows = [['Categoria', 'Total']].concat(Object.entries(porCat).map(([c, v]) => [c, v.toFixed(2)]));
        const csv = rows.map(r => r.map(x => typeof x === 'string' && x.includes(',') ? `"${x}"` : String(x)).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'relatorio-categorias-' + (periodoDias || 'all') + '-dias.csv';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
    }
  }

  document.querySelectorAll('#modal-relatorios [data-periodo]')
    .forEach(btn => btn.addEventListener('click', (e) => {
      const d = parseInt(e.currentTarget.getAttribute('data-periodo')) || 0;
      atualizarRelatorio(d);
    }));

  // ===== SERVICE WORKER (PWA) =====
  try {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
        const isSecure = location.protocol === 'https:' || isLocalhost || location.protocol === 'file:';
        if (!isSecure) { console.log('[sw] não registrado: contexto inseguro'); return; }
        navigator.serviceWorker.register('./service-worker.js')
          .then(reg => { console.log('[sw] registrado', reg.scope); })
          .catch(err => { console.log('[sw] erro no registro', err && err.message ? err.message : err); });
      });
    }
  } catch (e) { console.log('[sw] init error', e && e.message ? e.message : e); }

  // ===== FASE 3: INTELIGÊNCIA REAL =====

  function getAllCatalog() {
    const arr = [];
    try {
      if (Array.isArray(window.produtos)) window.produtos.forEach(p => arr.push(p));
    } catch (_) {}
    try {
      if (Array.isArray(localProducts)) localProducts.forEach(p => {
        if (!arr.some(x => String(x.nome).toLowerCase() === String(p.nome).toLowerCase())) arr.push(p);
      });
    } catch (_) {}
    return arr;
  }

  // --- Sugestões automáticas pelo histórico ---
  const sugestoesContainer = document.getElementById('sugestoes-container');

  function calcularSugestoes() {
    const sug = [];
    const nomesNaLista = new Set((Array.isArray(lista) ? lista : []).filter(x => !x.comprado).map(x => String(x.nome || '').toLowerCase()));
    const agora = Date.now();
    // agrupar comprados por nome
    const porNome = {};
    (Array.isArray(boughtItems) ? boughtItems : []).forEach(b => {
      const k = String(b.nome || '').toLowerCase();
      if (!k) return;
      if (!porNome[k]) porNome[k] = [];
      const t = b.date ? new Date(b.date).getTime() : NaN;
      if (!isNaN(t)) porNome[k].push(t);
    });
    Object.keys(porNome).forEach(k => {
      if (nomesNaLista.has(k)) return;
      const datas = porNome[k].sort((a, b) => a - b);
      if (datas.length < 2) return;
      // intervalo médio entre compras
      let soma = 0;
      for (let i = 1; i < datas.length; i++) soma += (datas[i] - datas[i - 1]);
      const intervalo = soma / (datas.length - 1);
      const ultimo = datas[datas.length - 1];
      // sugere se já passou ~80% do intervalo desde a última compra
      if (agora - ultimo >= intervalo * 0.8) {
        // encontra nome original
        const original = (Array.isArray(boughtItems) ? boughtItems : []).find(b => String(b.nome || '').toLowerCase() === k);
        sug.push({ nome: original ? original.nome : k, dias: Math.round((agora - ultimo) / (24 * 60 * 60 * 1000)) });
      }
    });
    return sug.slice(0, 6);
  }

  function atualizarSugestoes() {
    if (!sugestoesContainer) return;
    const sug = calcularSugestoes();
    if (!sug.length) { sugestoesContainer.style.display = 'none'; sugestoesContainer.innerHTML = ''; return; }
    sugestoesContainer.style.display = '';
    sugestoesContainer.innerHTML = '<h4>💡 Sugestões (compra recorrente)</h4>' +
      sug.map(s => '<div class="sugestao-item"><span>' + s.nome + ' <small style="color:var(--text-secondary);">(' + s.dias + ' dias)</small></span><button data-nome="' + encodeURIComponent(s.nome) + '">+ lista</button></div>').join('');
  }

  if (sugestoesContainer) {
    sugestoesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const nome = decodeURIComponent(btn.dataset.nome || '');
      // acha unidade no catálogo ou base
      let uni = 'un';
      const p = getAllCatalog().find(x => String(x.nome).toLowerCase() === nome.toLowerCase());
      if (p && p.unidade) uni = p.unidade;
      // adiciona à lista (evita duplicata)
      const existe = (Array.isArray(lista) ? lista : []).some(x => String(x.nome || '').toLowerCase() === String(nome).toLowerCase() && !x.comprado);
      if (!existe) {
        lista.push({ nome, qtd: 1, unidade: uni || 'un', categoria: (p && p.categoria) ? p.categoria : catDe(nome), comprado: false, preco: null, total: null });
        salvar(); render();
        if (typeof showToast === 'function') showToast('✅ Adicionado: ' + nome, 'success');
      } else {
        if (typeof showToast === 'function') showToast('Já está na lista: ' + nome, 'info');
      }
    });
  }

  try { atualizarSugestoes(); } catch (_) {}

  // --- Conferência antes de sair do mercado ---
  const modalConf = document.getElementById('modal-conferencia');
  const confConteudo = document.getElementById('conferencia-conteudo');
  const confContinuar = document.getElementById('conf-continuar');
  const confSair = document.getElementById('conf-sair');
  let confResolver = null;

  function mostrarConferencia() {
    const faltando = (Array.isArray(lista) ? lista : []).filter(x => !x.comprado);
    if (!faltando.length) return Promise.resolve(true);
    return new Promise((resolve) => {
      confResolver = resolve;
      if (confConteudo) {
        confConteudo.innerHTML = '<p><strong>Faltaram ' + faltando.length + ' item(ns):</strong></p>' +
          '<ul style="margin:6px 0 0 18px;">' + faltando.map(x => '<li>' + (emojiDe(x.nome) || '') + ' ' + x.nome + ' (' + x.qtd + ' ' + x.unidade + ')</li>').join('') + '</ul>' +
          '<p style="margin-top:8px; color:var(--text-secondary);">Deseja sair mesmo assim?</p>';
      }
      if (modalConf) { modalConf.style.display = 'flex'; modalConf.classList.add('visible'); }
    });
  }

  if (confContinuar && modalConf) {
    confContinuar.addEventListener('click', () => { modalConf.classList.remove('visible'); modalConf.style.display = 'none'; if (confResolver) { confResolver(false); confResolver = null; } });
  }
  if (confSair && modalConf) {
    confSair.addEventListener('click', () => { modalConf.classList.remove('visible'); modalConf.style.display = 'none'; if (confResolver) { confResolver(true); confResolver = null; } });
  }

  // interceptar voltar para planejamento
  if (els.voltarPlan) {
    // wrap existing handler by re-binding: remove old listeners not possible; instead add capture-phase guard
  }
  // We'll patch the button click via a capture listener that prevents default and shows conf
  const voltarBtn = els.voltarPlan;
  if (voltarBtn) {
    voltarBtn.addEventListener('click', async (e) => {
      // only act if market mode active
      if (!modoMercadoAtivo) return;
      const faltando = (Array.isArray(lista) ? lista : []).filter(x => !x.comprado);
      if (!faltando.length) return; // let original handler run
      e.stopImmediatePropagation();
      e.preventDefault();
      const sair = await mostrarConferencia();
      if (sair) {
        modoMercadoAtivo = false; selecionado = null;
        // rollover: itens comprados saem da lista ativa
        if (Array.isArray(boughtItems) && boughtItems.length) {
          ultimaCompra = boughtItems.slice();
          try { localStorage.setItem('ultimaCompra_v1', JSON.stringify(ultimaCompra)); } catch (_) { }
        }
        lista = (Array.isArray(lista) ? lista : []).filter(x => !x.comprado);
        window.lista = lista;
        if (els.formPlan) els.formPlan.style.display = '';
        if (els.formMercado) els.formMercado.style.display = 'none';
        document.querySelectorAll('.coluna-mercado').forEach(td => td.style.display = 'none');
        listaColapsada = false;
        if (els.listaWrapper) els.listaWrapper.style.display = '';
        if (els.quickFilters) els.quickFilters.style.display = 'none';
        quickFilter = 'all';
        salvar(); render(); atualizarInfoMercado();
      }
    }, true);
  }

  // ===== TOAST VISUAL =====
  (function initToast() {
    let container = document.getElementById('toast-container');
    if (!container) { container = document.createElement('div'); container.id = 'toast-container'; document.body.appendChild(container); }
    window.showToast = function(msg, type) {
      type = type || 'info';
      console.log('[toast]', msg);
      const t = document.createElement('div');
      t.className = 'toast ' + type;
      t.textContent = String(msg || '');
      container.appendChild(t);
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 250); }, 2600);
    };
  })();


  // ===== BOTÃO DE INSTALAÇÃO PWA =====
  const installBtn = document.getElementById('install-btn');
  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (installBtn) installBtn.style.display = '';
  });
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        if (typeof showToast === 'function') showToast('✅ App instalado!', 'success');
      }
      deferredInstallPrompt = null;
      installBtn.style.display = 'none';
    });
  }
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    if (installBtn) installBtn.style.display = 'none';
    if (typeof showToast === 'function') showToast('✅ App instalado na tela inicial!', 'success');
  });


  // ===== SINCRONIZAÇÃO EM TEMPO REAL (Supabase) =====
  const SUPABASE_URL = 'https://khuhgcoivsmzttrarxpb.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodWhnY29pdnNtenR0cmFyeHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyOTk2MDgsImV4cCI6MjEwODg3NTYwOH0.jEWCa3qElqz8v4RXr6CGgXJjiJeEQ8vS6kfJzGpK7YQ';

  let supabaseClient = null;
  let supabaseLoading = null;
  function carregarSupabase() {
    if (supabaseClient) return Promise.resolve(supabaseClient);
    if (supabaseLoading) return supabaseLoading;
    supabaseLoading = new Promise((resolve) => {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        try { supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); } catch (e) { console.log('[sync] init error', e); }
        resolve(supabaseClient);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = () => {
        try { supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); } catch (e) { console.log('[sync] init error', e); }
        resolve(supabaseClient);
      };
      script.onerror = () => { console.log('[sync] falha ao carregar supabase'); resolve(null); };
      document.head.appendChild(script);
    });
    return supabaseLoading;
  }

  let syncCode = localStorage.getItem('sync_code_v1') || '';
  let syncChannel = null;
  let syncPushTimer = null;
  let syncReceiving = false;

  function setSyncStatus(msg) {
    const el = document.getElementById('sync-status');
    if (el) el.textContent = msg;
  }

  async function pushSyncNow() {
    if (!supabaseClient || !syncCode || syncReceiving) return;
    try {
      const { error } = await supabaseClient
        .from('lista_compras_sync')
        .upsert({ code: syncCode, lista: lista, updated_at: new Date().toISOString() }, { onConflict: 'code' });
      if (error) console.log('[sync] push error', error.message);
    } catch (e) { console.log('[sync] push exception', e && e.message); }
  }

  window.pushSync = function() {
    if (!syncCode) return;
    clearTimeout(syncPushTimer);
    syncPushTimer = setTimeout(pushSyncNow, 800);
  };

  async function pullSync() {
    if (!syncCode) return;
    if (!supabaseClient) { await carregarSupabase(); }
    if (!supabaseClient) return;
    try {
      const { data, error } = await supabaseClient
        .from('lista_compras_sync')
        .select('lista')
        .eq('code', syncCode)
        .maybeSingle();
      if (error) { console.log('[sync] pull error', error.message); return; }
      if (data && Array.isArray(data.lista)) {
        syncReceiving = true;
        lista = data.lista;
        window.lista = lista;
        salvarLocalSemPush();
        render(); atualizarInfoMercado();
        syncReceiving = false;
        setSyncStatus('✅ Sincronizado (' + lista.length + ' itens)');
      } else {
        // no remote yet -> push current
        pushSyncNow();
        setSyncStatus('✅ Conectado. Lista local enviada.');
      }
    } catch (e) { console.log('[sync] pull exception', e && e.message); syncReceiving = false; }
  }

  function salvarLocalSemPush() {
    try {
      localStorage.setItem('shoppingList_v3', JSON.stringify(lista));
    } catch (_) { }
  }

  function subscribeSync() {
    if (!syncCode) return;
    if (!supabaseClient) return;
    if (syncChannel) { try { supabaseClient.removeChannel(syncChannel); } catch (_) { } syncChannel = null; }
    syncChannel = supabaseClient
      .channel('lista-sync-' + syncCode)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lista_compras_sync', filter: 'code=eq.' + syncCode }, (payload) => {
        const novo = payload && payload.new && payload.new.lista;
        if (Array.isArray(novo)) {
          syncReceiving = true;
          lista = novo;
          window.lista = lista;
          salvarLocalSemPush();
          render(); atualizarInfoMercado();
          syncReceiving = false;
          setSyncStatus('🔄 Atualizado pela outra pessoa');
        }
      })
      .subscribe();
  }

  // UI
  const syncBtn = document.getElementById('sync-btn');
  const modalSync = document.getElementById('modal-sync');
  const fecharSync = document.getElementById('fechar-sync');
  const syncCodeInput = document.getElementById('sync-code');
  const syncGerar = document.getElementById('sync-gerar');
  const syncConectar = document.getElementById('sync-conectar');

  function gerarCodigo() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  if (syncBtn && modalSync) {
    syncBtn.addEventListener('click', () => {
      modalSync.style.display = 'flex';
      modalSync.classList.add('visible');
      if (syncCodeInput) syncCodeInput.value = syncCode || '';
      setSyncStatus(syncCode ? ('Conectado ao código ' + syncCode) : 'Digite um código ou gere um novo.');
    });
  }
  if (fecharSync && modalSync) {
    fecharSync.addEventListener('click', () => { modalSync.classList.remove('visible'); modalSync.style.display = 'none'; });
    modalSync.addEventListener('click', (e) => { if (e.target === modalSync) { modalSync.classList.remove('visible'); modalSync.style.display = 'none'; } });
  }
  if (syncGerar && syncCodeInput) {
    syncGerar.addEventListener('click', () => { syncCodeInput.value = gerarCodigo(); });
  }
  if (syncConectar) {
    syncConectar.addEventListener('click', async () => {
      const code = (syncCodeInput ? syncCodeInput.value : '').trim();
      if (!/^[0-9]{6}$/.test(code)) { setSyncStatus('⚠️ Código deve ter 6 dígitos.'); return; }
      setSyncStatus('Carregando módulo de sync...');
      const client = await carregarSupabase();
      if (!client) { setSyncStatus('⚠️ Não foi possível carregar o sync. Verifique a internet.'); return; }
      syncCode = code;
      localStorage.setItem('sync_code_v1', syncCode);
      setSyncStatus('Conectando...');
      await pullSync();
      subscribeSync();
    });
  }

  // auto-reconnect if code saved (lazy)
  if (syncCode) {
    carregarSupabase().then((client) => {
      if (client) { pullSync().then(() => subscribeSync()); }
      else { setSyncStatus('⚠️ Sync indisponível (sem internet).'); }
    });
  }


  // ===== BACKUP AUTOMÁTICO =====
  function fazerBackupAuto() {
    try {
      const data = { lista, boughtItems, priceHistory, localProducts, theme: document.body.dataset.theme || 'light', dataBackup: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lista-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      localStorage.setItem('lastBackup_v1', String(Date.now()));
      if (typeof showToast === 'function') showToast('💾 Backup salvo!', 'success');
    } catch (e) { console.log('[backup] erro', e && e.message); }
  }
  (function checkBackup() {
    const last = parseInt(localStorage.getItem('lastBackup_v1') || '0', 10) || 0;
    const dias = (Date.now() - last) / (24 * 60 * 60 * 1000);
    if ((dias >= 7 || !last) && Array.isArray(lista) && lista.length > 0) {
      setTimeout(() => {
        if (confirm('Já faz ' + (last ? Math.floor(dias) : 'muito tempo') + ' dias do último backup. Fazer backup agora?')) {
          fazerBackupAuto();
        } else {
          localStorage.setItem('lastBackup_v1', String(Date.now()));
        }
      }, 4000);
    }
  })();


});
