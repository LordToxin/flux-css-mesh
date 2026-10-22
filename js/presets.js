/**
 * GlassMesh Studio - Designer Curated Presets
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GlassPresets = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PRESETS = {
    aurora: {
      name: 'Aurora Borealis',
      description: 'Vibrant neon waves inspired by the Nordic night skies.',
      glass: {
        blur: 18,
        opacity: 0.16,
        tintColor: '#ffffff',
        radius: 24,
        borderWidth: 1,
        borderOpacity: 0.28,
        borderColor: '#ffffff',
        shadowX: 0,
        shadowY: 8,
        shadowBlur: 32,
        shadowSpread: 0,
        shadowColor: '#000000',
        shadowOpacity: 0.35,
        innerGlow: true,
        noise: 15
      },
      mesh: {
        blendMode: 'screen',
        animationSpeed: 'medium',
        blobs: [
          { x: 20, y: 30, radius: 45, color: '#ec4899', vx: 0.4, vy: 0.3 },
          { x: 75, y: 25, radius: 40, color: '#8b5cf6', vx: -0.3, vy: 0.4 },
          { x: 30, y: 75, radius: 50, color: '#06b6d4', vx: 0.35, vy: -0.35 },
          { x: 80, y: 80, radius: 45, color: '#10b981', vx: -0.4, vy: -0.25 }
        ]
      }
    },
    deepSpace: {
      name: 'Deep Space Nebula',
      description: 'Cinematic deep indigo cosmic glow for modern developer tools.',
      glass: {
        blur: 24,
        opacity: 0.12,
        tintColor: '#0f172a',
        radius: 20,
        borderWidth: 1,
        borderOpacity: 0.22,
        borderColor: '#38bdf8',
        shadowX: 0,
        shadowY: 16,
        shadowBlur: 48,
        shadowSpread: -8,
        shadowColor: '#0284c7',
        shadowOpacity: 0.25,
        innerGlow: true,
        noise: 10
      },
      mesh: {
        blendMode: 'normal',
        animationSpeed: 'slow',
        blobs: [
          { x: 15, y: 20, radius: 50, color: '#1e1b4b', vx: 0.2, vy: 0.15 },
          { x: 80, y: 35, radius: 45, color: '#312e81', vx: -0.15, vy: 0.2 },
          { x: 35, y: 70, radius: 40, color: '#0284c7', vx: 0.2, vy: -0.18 },
          { x: 70, y: 85, radius: 45, color: '#c026d3', vx: -0.22, vy: -0.15 }
        ]
      }
    },
    sunsetHorizon: {
      name: 'Sunset Horizon',
      description: 'Warm, emotional golden-hour palette with coral highlights.',
      glass: {
        blur: 16,
        opacity: 0.2,
        tintColor: '#ffffff',
        radius: 28,
        borderWidth: 1.5,
        borderOpacity: 0.35,
        borderColor: '#fde68a',
        shadowX: 0,
        shadowY: 12,
        shadowBlur: 36,
        shadowSpread: 0,
        shadowColor: '#f43f5e',
        shadowOpacity: 0.2,
        innerGlow: false,
        noise: 8
      },
      mesh: {
        blendMode: 'screen',
        animationSpeed: 'medium',
        blobs: [
          { x: 25, y: 25, radius: 45, color: '#f59e0b', vx: 0.3, vy: 0.2 },
          { x: 75, y: 30, radius: 50, color: '#f43f5e', vx: -0.25, vy: 0.35 },
          { x: 30, y: 80, radius: 40, color: '#ec4899', vx: 0.25, vy: -0.3 },
          { x: 80, y: 75, radius: 45, color: '#7c3aed', vx: -0.3, vy: -0.2 }
        ]
      }
    },
    minimalIce: {
      name: 'Minimal Frosted Ice',
      description: 'Ultra-subtle, clean luxury frosted glass for high-end SaaS.',
      glass: {
        blur: 28,
        opacity: 0.22,
        tintColor: '#ffffff',
        radius: 18,
        borderWidth: 1,
        borderOpacity: 0.45,
        borderColor: '#ffffff',
        shadowX: 0,
        shadowY: 10,
        shadowBlur: 40,
        shadowSpread: -5,
        shadowColor: '#000000',
        shadowOpacity: 0.12,
        innerGlow: true,
        noise: 20
      },
      mesh: {
        blendMode: 'normal',
        animationSpeed: 'slow',
        blobs: [
          { x: 20, y: 20, radius: 45, color: '#64748b', vx: 0.15, vy: 0.12 },
          { x: 80, y: 30, radius: 40, color: '#94a3b8', vx: -0.12, vy: 0.15 },
          { x: 30, y: 75, radius: 45, color: '#38bdf8', vx: 0.15, vy: -0.12 },
          { x: 75, y: 80, radius: 40, color: '#cbd5e1', vx: -0.14, vy: -0.1 }
        ]
      }
    },
    neoLime: {
      name: 'Neo Lime & Mint',
      description: 'High-contrast energetic tech gradient with electric greens.',
      glass: {
        blur: 20,
        opacity: 0.14,
        tintColor: '#022c22',
        radius: 24,
        borderWidth: 1,
        borderOpacity: 0.35,
        borderColor: '#a3e635',
        shadowX: 0,
        shadowY: 8,
        shadowBlur: 32,
        shadowSpread: 0,
        shadowColor: '#84cc16',
        shadowOpacity: 0.15,
        innerGlow: true,
        noise: 12
      },
      mesh: {
        blendMode: 'screen',
        animationSpeed: 'fast',
        blobs: [
          { x: 25, y: 25, radius: 45, color: '#84cc16', vx: 0.5, vy: 0.4 },
          { x: 75, y: 30, radius: 40, color: '#10b981', vx: -0.4, vy: 0.5 },
          { x: 30, y: 75, radius: 50, color: '#06b6d4', vx: 0.45, vy: -0.4 },
          { x: 80, y: 80, radius: 40, color: '#14532d', vx: -0.5, vy: -0.3 }
        ]
      }
    }
  };

  return {
    PRESETS,
    getDefaultConfig: () => JSON.parse(JSON.stringify(PRESETS.aurora))
  };
});
