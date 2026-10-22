/**
 * GlassMesh Studio - Interactive Application Controller
 */
(function () {
  'use strict';

  const Generator = window.GlassGenerator;
  const Presets = window.GlassPresets;
  const MeshEngine = window.MeshCanvas;

  let currentConfig = Presets.getDefaultConfig();
  let meshRenderer = null;
  let activeCodeTab = 'css'; // 'css' | 'tailwind' | 'svg'

  // DOM Elements
  const el = {
    // Canvas & Preview
    canvas: document.getElementById('mesh-canvas'),
    glassCard: document.getElementById('preview-glass-card'),
    previewContainer: document.getElementById('preview-container'),
    cardMockupSelector: document.getElementById('mockup-selector'),
    mockupTemplates: {
      saas: document.getElementById('mockup-saas'),
      creditCard: document.getElementById('mockup-credit-card'),
      music: document.getElementById('mockup-music'),
      notification: document.getElementById('mockup-notification')
    },

    // Glass Sliders & Inputs
    blurInput: document.getElementById('input-blur'),
    blurVal: document.getElementById('val-blur'),
    opacityInput: document.getElementById('input-opacity'),
    opacityVal: document.getElementById('val-opacity'),
    tintColorInput: document.getElementById('input-tint-color'),
    radiusInput: document.getElementById('input-radius'),
    radiusVal: document.getElementById('val-radius'),
    borderWidthInput: document.getElementById('input-border-width'),
    borderWidthVal: document.getElementById('val-border-width'),
    borderOpacityInput: document.getElementById('input-border-opacity'),
    borderOpacityVal: document.getElementById('val-border-opacity'),
    borderColorInput: document.getElementById('input-border-color'),
    shadowBlurInput: document.getElementById('input-shadow-blur'),
    shadowBlurVal: document.getElementById('val-shadow-blur'),
    shadowOpacityInput: document.getElementById('input-shadow-opacity'),
    shadowOpacityVal: document.getElementById('val-shadow-opacity'),
    shadowColorInput: document.getElementById('input-shadow-color'),
    innerGlowInput: document.getElementById('input-inner-glow'),

    // Mesh Controls
    blendModeSelect: document.getElementById('select-blend-mode'),
    speedSelect: document.getElementById('select-speed'),
    blobColorsContainer: document.getElementById('blob-colors-container'),
    pauseMeshBtn: document.getElementById('btn-pause-mesh'),

    // Presets
    presetChips: document.querySelectorAll('[data-preset]'),

    // Code Output
    codeOutput: document.getElementById('code-output'),
    codeTabs: document.querySelectorAll('.code-tab-btn'),
    copyCodeBtn: document.getElementById('copy-code-btn'),
    downloadSvgBtn: document.getElementById('download-svg-btn'),
    shareLinkBtn: document.getElementById('share-link-btn'),
    resetBtn: document.getElementById('reset-btn'),
    toast: document.getElementById('toast')
  };

  function showToast(message) {
    if (!el.toast) return;
    el.toast.textContent = message;
    el.toast.classList.remove('hidden');
    el.toast.classList.add('visible');
    setTimeout(() => {
      el.toast.classList.remove('visible');
      setTimeout(() => el.toast.classList.add('hidden'), 300);
    }, 2200);
  }

  /**
   * Sync UI input controls with currentConfig
   */
  function syncInputs() {
    const g = currentConfig.glass;
    el.blurInput.value = g.blur;
    el.blurVal.textContent = `${g.blur}px`;
    el.opacityInput.value = g.opacity;
    el.opacityVal.textContent = `${Math.round(g.opacity * 100)}%`;
    el.tintColorInput.value = g.tintColor;
    el.radiusInput.value = g.radius;
    el.radiusVal.textContent = `${g.radius}px`;
    el.borderWidthInput.value = g.borderWidth;
    el.borderWidthVal.textContent = `${g.borderWidth}px`;
    el.borderOpacityInput.value = g.borderOpacity;
    el.borderOpacityVal.textContent = `${Math.round(g.borderOpacity * 100)}%`;
    el.borderColorInput.value = g.borderColor;
    el.shadowBlurInput.value = g.shadowBlur;
    el.shadowBlurVal.textContent = `${g.shadowBlur}px`;
    el.shadowOpacityInput.value = g.shadowOpacity;
    el.shadowOpacityVal.textContent = `${Math.round(g.shadowOpacity * 100)}%`;
    el.shadowColorInput.value = g.shadowColor;
    el.innerGlowInput.checked = !!g.innerGlow;

    el.blendModeSelect.value = currentConfig.mesh.blendMode || 'screen';
    renderBlobColorPickers();
  }

  function renderBlobColorPickers() {
    if (!el.blobColorsContainer) return;
    el.blobColorsContainer.innerHTML = '';

    currentConfig.mesh.blobs.forEach((blob, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'blob-color-item';
      wrapper.innerHTML = `
        <label class="blob-color-label" title="Blob #${idx + 1}">
          <input type="color" value="${blob.color}" class="color-picker-input" data-blob-idx="${idx}">
          <span>#${idx + 1}</span>
        </label>
      `;

      wrapper.querySelector('input').addEventListener('input', (e) => {
        currentConfig.mesh.blobs[idx].color = e.target.value;
        if (meshRenderer) meshRenderer.setBlobs(currentConfig.mesh.blobs);
        updatePreview();
      });

      el.blobColorsContainer.appendChild(wrapper);
    });
  }

  /**
   * Update the live preview card styles and code display
   */
  function updatePreview() {
    const g = currentConfig.glass;
    const bgRgba = Generator.hexToRgba(g.tintColor, g.opacity);
    const borderRgba = Generator.hexToRgba(g.borderColor, g.borderOpacity);
    const shadowRgba = Generator.hexToRgba(g.shadowColor, g.shadowOpacity);

    const shadow = `${g.shadowX}px ${g.shadowY}px ${g.shadowBlur}px ${g.shadowSpread}px ${shadowRgba}`;
    const insetShadow = g.innerGlow
      ? `, inset 0 0 16px 0 ${Generator.hexToRgba(g.borderColor, Math.min(1, g.borderOpacity * 1.5))}`
      : '';

    // Apply inline CSS to preview card
    if (el.glassCard) {
      el.glassCard.style.background = bgRgba;
      el.glassCard.style.backdropFilter = `blur(${g.blur}px)`;
      el.glassCard.style.webkitBackdropFilter = `blur(${g.blur}px)`;
      el.glassCard.style.borderRadius = `${g.radius}px`;
      el.glassCard.style.border = `${g.borderWidth}px solid ${borderRgba}`;
      el.glassCard.style.boxShadow = `${shadow}${insetShadow}`;
    }

    // Update Code Box
    updateCodeBox();
  }

  function updateCodeBox() {
    if (!el.codeOutput) return;

    if (activeCodeTab === 'css') {
      el.codeOutput.textContent = Generator.generateCss(currentConfig.glass);
    } else if (activeCodeTab === 'tailwind') {
      el.codeOutput.textContent = Generator.generateTailwind(currentConfig.glass);
    } else if (activeCodeTab === 'svg') {
      el.codeOutput.textContent = Generator.generateSvg(currentConfig.glass, currentConfig.mesh.blobs);
    }
  }

  /**
   * Setup Draggable Preview Card
   */
  function initDraggableCard() {
    const card = el.glassCard;
    const container = el.previewContainer;
    if (!card || !container) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let initialX = 0, initialY = 0;

    const onMouseDown = (e) => {
      // Don't drag if clicking buttons inside the card
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = card.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      initialX = rect.left - parentRect.left;
      initialY = rect.top - parentRect.top;
      card.style.transition = 'none';
      card.style.cursor = 'grabbing';
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const parentRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      let newX = Math.max(10, Math.min(parentRect.width - cardRect.width - 10, initialX + dx));
      let newY = Math.max(10, Math.min(parentRect.height - cardRect.height - 10, initialY + dy));

      card.style.left = `${newX}px`;
      card.style.top = `${newY}px`;
      card.style.transform = 'none';
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        card.style.cursor = 'grab';
        card.style.transition = 'box-shadow 0.2s ease, border-color 0.2s ease';
      }
    };

    card.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  /**
   * Setup Event Listeners
   */
  function initEventListeners() {
    // Glass Controls
    el.blurInput.addEventListener('input', (e) => {
      currentConfig.glass.blur = parseInt(e.target.value) || 0;
      el.blurVal.textContent = `${currentConfig.glass.blur}px`;
      updatePreview();
    });

    el.opacityInput.addEventListener('input', (e) => {
      currentConfig.glass.opacity = parseFloat(e.target.value) || 0;
      el.opacityVal.textContent = `${Math.round(currentConfig.glass.opacity * 100)}%`;
      updatePreview();
    });

    el.tintColorInput.addEventListener('input', (e) => {
      currentConfig.glass.tintColor = e.target.value;
      updatePreview();
    });

    el.radiusInput.addEventListener('input', (e) => {
      currentConfig.glass.radius = parseInt(e.target.value) || 0;
      el.radiusVal.textContent = `${currentConfig.glass.radius}px`;
      updatePreview();
    });

    el.borderWidthInput.addEventListener('input', (e) => {
      currentConfig.glass.borderWidth = parseFloat(e.target.value) || 0;
      el.borderWidthVal.textContent = `${currentConfig.glass.borderWidth}px`;
      updatePreview();
    });

    el.borderOpacityInput.addEventListener('input', (e) => {
      currentConfig.glass.borderOpacity = parseFloat(e.target.value) || 0;
      el.borderOpacityVal.textContent = `${Math.round(currentConfig.glass.borderOpacity * 100)}%`;
      updatePreview();
    });

    el.borderColorInput.addEventListener('input', (e) => {
      currentConfig.glass.borderColor = e.target.value;
      updatePreview();
    });

    el.shadowBlurInput.addEventListener('input', (e) => {
      currentConfig.glass.shadowBlur = parseInt(e.target.value) || 0;
      el.shadowBlurVal.textContent = `${currentConfig.glass.shadowBlur}px`;
      updatePreview();
    });

    el.shadowOpacityInput.addEventListener('input', (e) => {
      currentConfig.glass.shadowOpacity = parseFloat(e.target.value) || 0;
      el.shadowOpacityVal.textContent = `${Math.round(currentConfig.glass.shadowOpacity * 100)}%`;
      updatePreview();
    });

    el.shadowColorInput.addEventListener('input', (e) => {
      currentConfig.glass.shadowColor = e.target.value;
      updatePreview();
    });

    el.innerGlowInput.addEventListener('change', (e) => {
      currentConfig.glass.innerGlow = e.target.checked;
      updatePreview();
    });

    // Mesh Canvas Controls
    el.blendModeSelect.addEventListener('change', (e) => {
      currentConfig.mesh.blendMode = e.target.value;
      if (meshRenderer) meshRenderer.setBlendMode(e.target.value);
      updatePreview();
    });

    el.speedSelect.addEventListener('change', (e) => {
      const speeds = { slow: 0.5, medium: 1.0, fast: 2.0, static: 0 };
      const spd = speeds[e.target.value] ?? 1.0;
      if (meshRenderer) meshRenderer.setSpeed(spd);
    });

    if (el.pauseMeshBtn) {
      el.pauseMeshBtn.addEventListener('click', () => {
        if (meshRenderer) {
          const isPaused = meshRenderer.togglePause();
          el.pauseMeshBtn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
        }
      });
    }

    // Mockup Card Content Switcher
    if (el.cardMockupSelector) {
      el.cardMockupSelector.addEventListener('change', (e) => {
        const type = e.target.value;
        Object.keys(el.mockupTemplates).forEach(k => {
          if (el.mockupTemplates[k]) {
            el.mockupTemplates[k].classList.toggle('hidden', k !== type);
          }
        });
      });
    }

    // Presets
    el.presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.dataset.preset;
        if (Presets.PRESETS[key]) {
          currentConfig = JSON.parse(JSON.stringify(Presets.PRESETS[key]));
          el.presetChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');

          if (meshRenderer) {
            meshRenderer.setBlobs(currentConfig.mesh.blobs);
            meshRenderer.setBlendMode(currentConfig.mesh.blendMode);
          }

          syncInputs();
          updatePreview();
          showToast(`Preset "${Presets.PRESETS[key].name}" applied`);
        }
      });
    });

    // Code Tabs
    el.codeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        el.codeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeCodeTab = tab.dataset.tab;
        updateCodeBox();
      });
    });

    // Copy Code Button
    if (el.copyCodeBtn) {
      el.copyCodeBtn.addEventListener('click', () => {
        const code = el.codeOutput.textContent;
        navigator.clipboard.writeText(code).then(() => {
          showToast('Code copied to clipboard! 📋');
        });
      });
    }

    // Download SVG
    if (el.downloadSvgBtn) {
      el.downloadSvgBtn.addEventListener('click', () => {
        const svgContent = Generator.generateSvg(currentConfig.glass, currentConfig.mesh.blobs);
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `glassmesh-card-${Date.now()}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('SVG file downloaded!');
      });
    }

    // Share Link
    if (el.shareLinkBtn) {
      el.shareLinkBtn.addEventListener('click', () => {
        const hash = Generator.encodeState(currentConfig);
        window.location.hash = hash;
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Shareable URL copied to clipboard!');
        });
      });
    }

    // Reset Defaults
    if (el.resetBtn) {
      el.resetBtn.addEventListener('click', () => {
        currentConfig = Presets.getDefaultConfig();
        if (meshRenderer) {
          meshRenderer.setBlobs(currentConfig.mesh.blobs);
          meshRenderer.setBlendMode(currentConfig.mesh.blendMode);
        }
        syncInputs();
        updatePreview();
        showToast('Reset to default Aurora preset');
      });
    }
  }

  function init() {
    // Check URL Hash for shared preset
    if (window.location.hash) {
      const decoded = Generator.decodeState(window.location.hash);
      if (decoded && decoded.glass && decoded.mesh) {
        currentConfig = decoded;
      }
    }

    // Initialize Mesh Canvas
    if (el.canvas) {
      meshRenderer = new MeshEngine.MeshRenderer(el.canvas, {
        blobs: currentConfig.mesh.blobs,
        blendMode: currentConfig.mesh.blendMode,
        speed: 1.0
      });
    }

    syncInputs();
    initEventListeners();
    initDraggableCard();
    updatePreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
