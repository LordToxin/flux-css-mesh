// FluxMesh - Core Generative Engine
document.addEventListener('DOMContentLoaded', () => {
  // Preset Library
  const PRESETS = {
    cyberpunk: {
      base: '#080811',
      blend: 'normal',
      nodes: [
        { color: '#8957e5', x: 20, y: 30, radius: 55 },
        { color: '#00f5d4', x: 80, y: 70, radius: 50 },
        { color: '#ff007f', x: 75, y: 25, radius: 60 },
        { color: '#3b82f6', x: 25, y: 80, radius: 45 }
      ]
    },
    toxic: {
      base: '#050c09',
      blend: 'normal',
      nodes: [
        { color: '#10b981', x: 15, y: 25, radius: 60 },
        { color: '#00f5d4', x: 75, y: 35, radius: 50 },
        { color: '#84cc16', x: 30, y: 80, radius: 55 },
        { color: '#064e3b', x: 85, y: 85, radius: 70 }
      ]
    },
    tokyonight: {
      base: '#1a1b26',
      blend: 'normal',
      nodes: [
        { color: '#7aa2f7', x: 25, y: 30, radius: 50 },
        { color: '#bb9af7', x: 75, y: 20, radius: 55 },
        { color: '#7dcfff', x: 30, y: 75, radius: 45 },
        { color: '#f7768e', x: 80, y: 80, radius: 50 }
      ]
    },
    sunset: {
      base: '#120508',
      blend: 'normal',
      nodes: [
        { color: '#f97316', x: 20, y: 20, radius: 55 },
        { color: '#ef4444', x: 80, y: 30, radius: 60 },
        { color: '#eab308', x: 40, y: 80, radius: 50 },
        { color: '#9333ea', x: 85, y: 80, radius: 65 }
      ]
    },
    aurora: {
      base: '#030d14',
      blend: 'screen',
      nodes: [
        { color: '#06b6d4', x: 20, y: 40, radius: 60 },
        { color: '#10b981', x: 50, y: 20, radius: 50 },
        { color: '#6366f1', x: 80, y: 60, radius: 55 },
        { color: '#a855f7', x: 30, y: 80, radius: 45 }
      ]
    },
    deepspace: {
      base: '#020205',
      blend: 'normal',
      nodes: [
        { color: '#4338ca', x: 15, y: 20, radius: 65 },
        { color: '#1e1b4b', x: 85, y: 30, radius: 75 },
        { color: '#0284c7', x: 40, y: 75, radius: 50 },
        { color: '#581c87', x: 80, y: 85, radius: 60 }
      ]
    }
  };

  // State
  let state = {
    baseColor: PRESETS.toxic.base,
    blendMode: PRESETS.toxic.blend,
    nodes: JSON.parse(JSON.stringify(PRESETS.toxic.nodes)),
    glass: {
      blur: 16,
      opacity: 12,
      borderOpacity: 20,
      saturation: 180,
      visible: true
    },
    exportFormat: 'css'
  };

  // DOM Elements
  const meshBg = document.getElementById('meshBackground');
  const pinsOverlay = document.getElementById('pinsOverlay');
  const glassCard = document.getElementById('glassCardPreview');
  const presetSelect = document.getElementById('presetSelect');
  const randomizeBtn = document.getElementById('randomizeBtn');
  const nodesList = document.getElementById('nodesList');
  const nodeCount = document.getElementById('nodeCount');
  const addNodeBtn = document.getElementById('addNodeBtn');
  const blendModeSelect = document.getElementById('blendModeSelect');
  const baseColorInput = document.getElementById('baseColorInput');
  const darknessVal = document.getElementById('darknessVal');

  // Glass Controls
  const blurInput = document.getElementById('blurInput');
  const blurVal = document.getElementById('blurVal');
  const opacityInput = document.getElementById('opacityInput');
  const opacityVal = document.getElementById('opacityVal');
  const borderOpacityInput = document.getElementById('borderOpacityInput');
  const borderOpacityVal = document.getElementById('borderOpacityVal');
  const satInput = document.getElementById('satInput');
  const satVal = document.getElementById('satVal');
  const showGlassToggle = document.getElementById('showGlassToggle');

  // Export Modal Elements
  const exportModalBtn = document.getElementById('exportModalBtn');
  const exportModal = document.getElementById('exportModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const codeOutput = document.getElementById('codeOutput');
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  const downloadPngBtn = document.getElementById('downloadPngBtn');
  const downloadSvgBtn = document.getElementById('downloadSvgBtn');
  const toast = document.getElementById('toast');

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  // Export Tabs
  document.querySelectorAll('.export-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.export-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.exportFormat = tab.dataset.format;
      updateCodeOutput();
    });
  });

  // Render & Update Functions
  function updateMeshBackground() {
    const gradients = state.nodes.map(node => {
      return `radial-gradient(at ${node.x}% ${node.y}%, ${node.color} 0px, transparent ${node.radius}%)`;
    });

    meshBg.style.backgroundColor = state.baseColor;
    meshBg.style.backgroundImage = gradients.join(', ');
    meshBg.style.backgroundBlendMode = state.blendMode;
  }

  function updateGlassCard() {
    if (!state.glass.visible) {
      glassCard.style.display = 'none';
      return;
    }
    glassCard.style.display = 'block';
    const bgAlpha = (state.glass.opacity / 100).toFixed(2);
    const borderAlpha = (state.glass.borderOpacity / 100).toFixed(2);

    glassCard.style.background = `rgba(255, 255, 255, ${bgAlpha})`;
    glassCard.style.backdropFilter = `blur(${state.glass.blur}px) saturate(${state.glass.saturation}%)`;
    glassCard.style.webkitBackdropFilter = `blur(${state.glass.blur}px) saturate(${state.glass.saturation}%)`;
    glassCard.style.border = `1px solid rgba(255, 255, 255, ${borderAlpha})`;
    glassCard.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, ${borderAlpha})`;
  }

  function renderPins() {
    pinsOverlay.innerHTML = '';
    state.nodes.forEach((node, index) => {
      const pin = document.createElement('div');
      pin.className = 'mesh-pin';
      pin.style.left = `${node.x}%`;
      pin.style.top = `${node.y}%`;
      pin.style.backgroundColor = node.color;
      pin.style.color = node.color;
      pin.dataset.index = index;

      const label = document.createElement('span');
      label.textContent = index + 1;
      pin.appendChild(label);

      // Drag handling
      setupDrag(pin, index);
      pinsOverlay.appendChild(pin);
    });
  }

  function setupDrag(element, index) {
    let isDragging = false;

    const onStart = (e) => {
      isDragging = true;
      e.preventDefault();
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove);
      document.addEventListener('touchend', onEnd);
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const rect = pinsOverlay.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let x = ((clientX - rect.left) / rect.width) * 100;
      let y = ((clientY - rect.top) / rect.height) * 100;

      x = Math.max(0, Math.min(100, Math.round(x)));
      y = Math.max(0, Math.min(100, Math.round(y)));

      state.nodes[index].x = x;
      state.nodes[index].y = y;

      element.style.left = `${x}%`;
      element.style.top = `${y}%`;

      updateMeshBackground();
      updateNodesListValues();
    };

    const onEnd = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };

    element.addEventListener('mousedown', onStart);
    element.addEventListener('touchstart', onStart);
  }

  function renderNodesList() {
    nodesList.innerHTML = '';
    nodeCount.textContent = state.nodes.length;

    state.nodes.forEach((node, index) => {
      const item = document.createElement('div');
      item.className = 'node-item';
      item.innerHTML = `
        <div class="node-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="node-color-preview" style="background:${node.color}"></div>
            <span>Node #${index + 1} (${node.x}%, ${node.y}%)</span>
          </div>
          ${state.nodes.length > 2 ? `<button class="delete-node-btn" data-index="${index}">&times;</button>` : ''}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center;">
          <input type="color" class="color-picker-full" value="${node.color}" data-index="${index}">
          <div style="font-size:11px;color:var(--text-muted);display:flex;flex-direction:column;gap:2px;">
            <span>Spread Radius: <b>${node.radius}%</b></span>
            <input type="range" min="20" max="90" value="${node.radius}" data-radius-index="${index}" class="styled-range">
          </div>
        </div>
      `;
      nodesList.appendChild(item);
    });

    // Node Listeners
    nodesList.querySelectorAll('input[type="color"]').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = e.target.dataset.index;
        state.nodes[idx].color = e.target.value;
        updateMeshBackground();
        renderPins();
      });
    });

    nodesList.querySelectorAll('input[data-radius-index]').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = e.target.dataset.radiusIndex;
        state.nodes[idx].radius = parseInt(e.target.value);
        updateMeshBackground();
      });
    });

    nodesList.querySelectorAll('.delete-node-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        state.nodes.splice(idx, 1);
        updateMeshBackground();
        renderPins();
        renderNodesList();
      });
    });
  }

  function updateNodesListValues() {
    const headers = nodesList.querySelectorAll('.node-header span');
    headers.forEach((h, idx) => {
      if (state.nodes[idx]) {
        h.textContent = `Node #${idx + 1} (${state.nodes[idx].x}%, ${state.nodes[idx].y}%)`;
      }
    });
  }

  // Code Generation
  function generateCssCode() {
    const gradients = state.nodes.map(node => {
      return `    radial-gradient(at ${node.x}% ${node.y}%, ${node.color} 0px, transparent ${node.radius}%)`;
    }).join(',\n');

    let css = `/* Generated by FluxMesh Studio */\n.mesh-container {\n  background-color: ${state.baseColor};\n  background-image:\n${gradients};\n  background-blend-mode: ${state.blendMode};\n}\n`;

    if (state.glass.visible) {
      const bgAlpha = (state.glass.opacity / 100).toFixed(2);
      const borderAlpha = (state.glass.borderOpacity / 100).toFixed(2);
      css += `\n/* Modern Glassmorphic Element */\n.glass-panel {\n  background: rgba(255, 255, 255, ${bgAlpha});\n  backdrop-filter: blur(${state.glass.blur}px) saturate(${state.glass.saturation}%);\n  -webkit-backdrop-filter: blur(${state.glass.blur}px) saturate(${state.glass.saturation}%);\n  border: 1px solid rgba(255, 255, 255, ${borderAlpha});\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);\n  border-radius: 20px;\n}\n`;
    }
    return css;
  }

  function generateTailwindCode() {
    const bgAlpha = Math.round(state.glass.opacity);
    const borderAlpha = Math.round(state.glass.borderOpacity);

    return `<!-- Tailwind CSS Container -->\n<div class="relative w-full min-h-screen bg-[${state.baseColor}]">\n  <!-- Glass Card -->\n  <div class="backdrop-blur-[${state.glass.blur}px] backdrop-saturate-[${state.glass.saturation}%] bg-white/[0.${bgAlpha < 10 ? '0' + bgAlpha : bgAlpha}] border border-white/[0.${borderAlpha < 10 ? '0' + borderAlpha : borderAlpha}] rounded-2xl shadow-2xl p-8">\n    <h3 class="text-white font-bold text-xl">Glassmorphism UI</h3>\n  </div>\n</div>`;
  }

  function generateSvgCode() {
    const defs = state.nodes.map((n, i) => `    <radialGradient id="grad${i}" cx="${n.x}%" cy="${n.y}%" r="${n.radius}%">\n      <stop offset="0%" stop-color="${n.color}" />\n      <stop offset="100%" stop-color="${n.color}" stop-opacity="0" />\n    </radialGradient>`).join('\n');
    const rects = state.nodes.map((_, i) => `  <rect width="100%" height="100%" fill="url(#grad${i})" style="mix-blend-mode: ${state.blendMode}" />`).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">\n  <defs>\n${defs}\n  </defs>\n  <rect width="100%" height="100%" fill="${state.baseColor}" />\n${rects}\n</svg>`;
  }

  function updateCodeOutput() {
    if (state.exportFormat === 'css') {
      codeOutput.textContent = generateCssCode();
    } else if (state.exportFormat === 'tailwind') {
      codeOutput.textContent = generateTailwindCode();
    } else if (state.exportFormat === 'svg') {
      codeOutput.textContent = generateSvgCode();
    }
  }

  // 4K PNG Generator
  function download4kPng() {
    const canvas = document.createElement('canvas');
    canvas.width = 3840;
    canvas.height = 2160;
    const ctx = canvas.getContext('2d');

    // Base color
    ctx.fillStyle = state.baseColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Radial gradients
    state.nodes.forEach(node => {
      const cx = (node.x / 100) * canvas.width;
      const cy = (node.y / 100) * canvas.height;
      const r = (node.radius / 100) * Math.max(canvas.width, canvas.height);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, node.color);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    const link = document.createElement('a');
    link.download = `flux-mesh-4k-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('4K Ultra-HD PNG downloaded!');
  }

  function downloadSvg() {
    const svgData = generateSvgCode();
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `flux-mesh-vector-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Vector SVG downloaded!');
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2400);
  }

  // Event Listeners
  presetSelect.addEventListener('change', (e) => {
    const chosen = PRESETS[e.target.value];
    if (chosen) {
      state.baseColor = chosen.base;
      state.blendMode = chosen.blend;
      state.nodes = JSON.parse(JSON.stringify(chosen.nodes));
      baseColorInput.value = state.baseColor;
      darknessVal.textContent = state.baseColor;
      blendModeSelect.value = state.blendMode;
      updateMeshBackground();
      renderPins();
      renderNodesList();
    }
  });

  randomizeBtn.addEventListener('click', () => {
    const colors = ['#00f5d4', '#8957e5', '#ff007f', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
    state.nodes.forEach(n => {
      n.x = Math.floor(Math.random() * 85) + 10;
      n.y = Math.floor(Math.random() * 85) + 10;
      n.color = colors[Math.floor(Math.random() * colors.length)];
      n.radius = Math.floor(Math.random() * 35) + 40;
    });
    updateMeshBackground();
    renderPins();
    renderNodesList();
    showToast('Seed randomized!');
  });

  addNodeBtn.addEventListener('click', () => {
    if (state.nodes.length >= 8) {
      showToast('Maximum 8 mesh nodes reached');
      return;
    }
    const colors = ['#00f5d4', '#8957e5', '#ff007f', '#10b981', '#3b82f6'];
    state.nodes.push({
      color: colors[state.nodes.length % colors.length],
      x: 50,
      y: 50,
      radius: 50
    });
    updateMeshBackground();
    renderPins();
    renderNodesList();
  });

  blendModeSelect.addEventListener('change', (e) => {
    state.blendMode = e.target.value;
    updateMeshBackground();
  });

  baseColorInput.addEventListener('input', (e) => {
    state.baseColor = e.target.value;
    darknessVal.textContent = state.baseColor;
    updateMeshBackground();
  });

  // Glass inputs
  blurInput.addEventListener('input', (e) => {
    state.glass.blur = parseInt(e.target.value);
    blurVal.textContent = `${state.glass.blur}px`;
    updateGlassCard();
  });

  opacityInput.addEventListener('input', (e) => {
    state.glass.opacity = parseInt(e.target.value);
    opacityVal.textContent = `${state.glass.opacity}%`;
    updateGlassCard();
  });

  borderOpacityInput.addEventListener('input', (e) => {
    state.glass.borderOpacity = parseInt(e.target.value);
    borderOpacityVal.textContent = `${state.glass.borderOpacity}%`;
    updateGlassCard();
  });

  satInput.addEventListener('input', (e) => {
    state.glass.saturation = parseInt(e.target.value);
    satVal.textContent = `${state.glass.saturation}%`;
    updateGlassCard();
  });

  showGlassToggle.addEventListener('change', (e) => {
    state.glass.visible = e.target.checked;
    updateGlassCard();
  });

  // Modal actions
  exportModalBtn.addEventListener('click', () => {
    updateCodeOutput();
    exportModal.classList.remove('hidden');
  });

  closeModalBtn.addEventListener('click', () => {
    exportModal.classList.add('hidden');
  });

  exportModal.addEventListener('click', (e) => {
    if (e.target === exportModal) exportModal.classList.add('hidden');
  });

  copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeOutput.textContent);
    showToast('Code copied to clipboard!');
  });

  downloadPngBtn.addEventListener('click', download4kPng);
  downloadSvgBtn.addEventListener('click', downloadSvg);

  // Initialize
  presetSelect.value = 'toxic';
  baseColorInput.value = state.baseColor;
  darknessVal.textContent = state.baseColor;
  updateMeshBackground();
  updateGlassCard();
  renderPins();
  renderNodesList();
});
