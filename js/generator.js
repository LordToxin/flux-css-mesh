/**
 * GlassMesh Generator Engine
 * Core code generators: CSS, Tailwind, SVG, and URL serialization
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GlassGenerator = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(255, 255, 255, ${alpha})`;
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Generates pure CSS rules for glassmorphism
   */
  function generateCss(glassConfig) {
    const bgRgba = hexToRgba(glassConfig.tintColor, glassConfig.opacity);
    const borderRgba = hexToRgba(glassConfig.borderColor, glassConfig.borderOpacity);
    const shadowRgba = hexToRgba(glassConfig.shadowColor, glassConfig.shadowOpacity);

    const shadow = `${glassConfig.shadowX}px ${glassConfig.shadowY}px ${glassConfig.shadowBlur}px ${glassConfig.shadowSpread}px ${shadowRgba}`;
    const insetShadow = glassConfig.innerGlow
      ? `, inset 0 0 16px 0 ${hexToRgba(glassConfig.borderColor, Math.min(1, glassConfig.borderOpacity * 1.5))}`
      : '';

    return [
      `/* Glassmorphism Card Style */`,
      `.glass-card {`,
      `  background: ${bgRgba};`,
      `  backdrop-filter: blur(${glassConfig.blur}px);`,
      `  -webkit-backdrop-filter: blur(${glassConfig.blur}px);`,
      `  border-radius: ${glassConfig.radius}px;`,
      `  border: ${glassConfig.borderWidth}px solid ${borderRgba};`,
      `  box-shadow: ${shadow}${insetShadow};`,
      `}`
    ].join('\n');
  }

  /**
   * Generates Tailwind CSS classes
   */
  function generateTailwind(glassConfig) {
    const blurClass = `backdrop-blur-[${glassConfig.blur}px]`;
    const radiusClass = `rounded-[${glassConfig.radius}px]`;
    const borderClass = `border-[${glassConfig.borderWidth}px]`;

    // Hex with alpha
    const alphaHex = Math.round(glassConfig.opacity * 255).toString(16).padStart(2, '0');
    const bgClass = `bg-[${glassConfig.tintColor}${alphaHex}]`;

    const borderAlphaHex = Math.round(glassConfig.borderOpacity * 255).toString(16).padStart(2, '0');
    const borderColorClass = `border-[${glassConfig.borderColor}${borderAlphaHex}]`;

    const shadowAlphaHex = Math.round(glassConfig.shadowOpacity * 255).toString(16).padStart(2, '0');
    const shadowClass = `shadow-[${glassConfig.shadowX}px_${glassConfig.shadowY}px_${glassConfig.shadowBlur}px_${glassConfig.shadowSpread}px_${glassConfig.shadowColor}${shadowAlphaHex}]`;

    return `${bgClass} ${blurClass} ${radiusClass} ${borderClass} ${borderColorClass} ${shadowClass}`;
  }

  /**
   * Generates Standalone SVG
   */
  function generateSvg(glassConfig, meshBlobs = []) {
    const bgRgba = hexToRgba(glassConfig.tintColor, glassConfig.opacity);
    const borderRgba = hexToRgba(glassConfig.borderColor, glassConfig.borderOpacity);

    const blobGradients = meshBlobs.map((blob, i) => `
      <radialGradient id="blobGrad${i}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${blob.color}" stop-opacity="0.85" />
        <stop offset="100%" stop-color="${blob.color}" stop-opacity="0" />
      </radialGradient>
    `).join('');

    const blobCircles = meshBlobs.map((blob, i) => `
      <circle cx="${blob.x}%" cy="${blob.y}%" r="${blob.radius || 35}%" fill="url(#blobGrad${i})" />
    `).join('');

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">`,
      `  <defs>`,
      blobGradients,
      `    <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">`,
      `      <feGaussianBlur stdDeviation="${glassConfig.blur / 2}" result="blur" />`,
      `      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />`,
      `    </filter>`,
      `  </defs>`,
      `  <rect width="800" height="600" fill="#090d16" />`,
      `  <g id="mesh-background">`,
      blobCircles,
      `  </g>`,
      `  <!-- Glass Card Layer -->`,
      `  <g transform="translate(180, 140)">`,
      `    <rect width="440" height="320" rx="${glassConfig.radius}" fill="${bgRgba}" stroke="${borderRgba}" stroke-width="${glassConfig.borderWidth}" />`,
      `  </g>`,
      `</svg>`
    ].join('\n');
  }

  /**
   * Generates pure CSS background radial mesh declaration
   */
  function generateMeshCss(meshBlobs = [], blendMode = 'normal') {
    if (!meshBlobs || meshBlobs.length === 0) return 'background: #090d16;';

    const gradients = meshBlobs.map(b => {
      return `radial-gradient(circle at ${Math.round(b.x)}% ${Math.round(b.y)}%, ${b.color} 0%, transparent 60%)`;
    });

    return [
      `/* Animated Mesh Background CSS */`,
      `.mesh-canvas {`,
      `  background-color: #090d16;`,
      `  background-image:`,
      `    ${gradients.join(',\n    ')};`,
      `  background-blend-mode: ${blendMode};`,
      `}`
    ].join('\n');
  }

  /**
   * State URL hash encoding / decoding
   */
  function encodeState(state) {
    try {
      return encodeURIComponent(btoa(JSON.stringify(state)));
    } catch (e) {
      return '';
    }
  }

  function decodeState(hashStr) {
    try {
      if (!hashStr) return null;
      const clean = decodeURIComponent(hashStr.replace(/^#/, ''));
      return JSON.parse(atob(clean));
    } catch (e) {
      return null;
    }
  }

  return {
    hexToRgba,
    generateCss,
    generateTailwind,
    generateSvg,
    generateMeshCss,
    encodeState,
    decodeState
  };
});
