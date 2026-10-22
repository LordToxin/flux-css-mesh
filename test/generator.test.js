/**
 * Unit Test Suite for Glassmorphism & Mesh Generator Engine
 */
const assert = require('assert');
const generator = require('../js/generator.js');
const presets = require('../js/presets.js');

let passCount = 0;
let failCount = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

console.log('--- RUNNING GLASSMESH GENERATOR TEST SUITE ---');

it('converts hex to rgba accurately', () => {
  assert.strictEqual(generator.hexToRgba('#ffffff', 0.5), 'rgba(255, 255, 255, 0.5)');
  assert.strictEqual(generator.hexToRgba('#000000', 1), 'rgba(0, 0, 0, 1)');
  assert.strictEqual(generator.hexToRgba('#f00', 0.8), 'rgba(255, 0, 0, 0.8)');
});

it('generates valid CSS glassmorphism rules', () => {
  const config = {
    blur: 20,
    opacity: 0.15,
    tintColor: '#ffffff',
    radius: 16,
    borderWidth: 1,
    borderOpacity: 0.3,
    borderColor: '#ffffff',
    shadowX: 0,
    shadowY: 8,
    shadowBlur: 32,
    shadowSpread: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    innerGlow: true
  };

  const css = generator.generateCss(config);

  assert(css.includes('backdrop-filter: blur(20px);'), 'Must include backdrop-filter with blur');
  assert(css.includes('-webkit-backdrop-filter: blur(20px);'), 'Must include webkit prefix');
  assert(css.includes('border-radius: 16px;'), 'Must set border-radius');
  assert(css.includes('border: 1px solid rgba(255, 255, 255, 0.3);'), 'Must set border');
  assert(css.includes('inset 0 0 16px 0'), 'Must include inner glow when enabled');
});

it('synthesizes Tailwind CSS arbitrary value classes', () => {
  const config = {
    blur: 16,
    opacity: 0.2,
    tintColor: '#ffffff',
    radius: 24,
    borderWidth: 1,
    borderOpacity: 0.3,
    borderColor: '#ffffff',
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 16,
    shadowSpread: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.2
  };

  const tw = generator.generateTailwind(config);

  assert(tw.includes('backdrop-blur-[16px]'), 'Must include arbitrary blur');
  assert(tw.includes('rounded-[24px]'), 'Must include arbitrary radius');
  assert(tw.includes('border-[1px]'), 'Must include arbitrary border width');
});

it('generates well-formed standalone SVG graphic', () => {
  const config = presets.getDefaultConfig();
  const svg = generator.generateSvg(config.glass, config.mesh.blobs);

  assert(svg.startsWith('<svg'), 'Must start with <svg tag');
  assert(svg.endsWith('</svg>\n') || svg.endsWith('</svg>'), 'Must close with </svg>');
  assert(svg.includes('<filter id="glassBlur"'), 'Must define SVG blur filter');
  assert(svg.includes('<radialGradient'), 'Must define radial gradient for mesh blobs');
  assert(svg.includes('<rect'), 'Must contain rect elements');
});

it('verifies all curated presets generate valid code without throwing', () => {
  for (const [key, preset] of Object.entries(presets.PRESETS)) {
    const css = generator.generateCss(preset.glass);
    assert(css.length > 50, `Preset ${key} must generate CSS`);

    const tw = generator.generateTailwind(preset.glass);
    assert(tw.length > 20, `Preset ${key} must generate Tailwind`);

    const svg = generator.generateSvg(preset.glass, preset.mesh.blobs);
    assert(svg.includes('</svg>'), `Preset ${key} must generate complete SVG`);
  }
});

it('encodes and decodes state losslessly', () => {
  const config = presets.getDefaultConfig();
  const hash = generator.encodeState(config);
  assert(hash.length > 10, 'Encoded hash must not be empty');

  const decoded = generator.decodeState(hash);
  assert.strictEqual(decoded.glass.blur, config.glass.blur);
  assert.strictEqual(decoded.mesh.blendMode, config.mesh.blendMode);
  assert.strictEqual(decoded.mesh.blobs.length, config.mesh.blobs.length);
});

console.log(`\nTest results: ${passCount} passed, ${failCount} failed.`);
if (failCount > 0) {
  process.exit(1);
} else {
  console.log('All GlassMesh tests passed successfully! ✨');
}
