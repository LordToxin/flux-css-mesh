# SPEC: GlassMesh Studio Pro (`glassmorphism-mesh-generator`)

## 1. Product Overview & Commercial Vision
`GlassMesh Studio Pro` is an offline-capable, zero-dependency visual design studio for frontend developers, UI/UX designers, and digital artists. It simulates physically modeled frosted glass refraction (`backdrop-filter: blur`, specular highlight rim borders, inner glows) layered over high-performance 60fps radial fluid mesh gradients.

It eliminates the time-consuming trial-and-error of balancing glassmorphism opacity against modern backgrounds and exports production-ready CSS, Tailwind CSS JIT classes, and standalone SVG files.

## 2. Technical Architecture & Modules
```
glassmorphism-mesh-generator/
├── assets/
│   └── favicon.svg           # Scalable vector branding
├── css/
│   └── style.css             # Fluid layout, range sliders, dark UI
├── js/
│   ├── app.js                # Event handlers, card drag-and-drop, UI state
│   ├── generator.js          # Pure math color conversions (HEX/RGBA), CSS & Tailwind generator
│   ├── mesh-canvas.js        # 60fps physics-driven fluid mesh gradient renderer
│   └── presets.js            # Curated palettes (Aurora, Nebula, Sunset, Frosted Ice, Neo Lime)
├── test/
│   └── generator.test.js     # Native Node test suite (HEX/RGBA, CSS, Tailwind, SVG validation)
├── index.html                # Responsive web application interface
├── Dockerfile                # Nginx alpine static container
├── docker-compose.yml        # 1-command container orchestration
└── package.json              # NPM metadata & test runner script
```

## 3. Key Functional Specifications
- **Optical Glass Engine**:
  - Blur radius (0 - 60px) with `-webkit-backdrop-filter` fallback
  - Surface opacity & color tinting
  - Rim highlight width & specular opacity
  - Multi-tier elevation drop shadows
  - Refractive inner glow toggle
- **Fluid Mesh Gradient Physics**:
  - 4-point moving radial blobs with edge bouncing & draggable control points
  - 5 compositing blend modes: `screen`, `normal`, `overlay`, `hard-light`, `color-dodge`
  - Dynamic simulation speed control: Gentle (0.5x), Smooth (1.0x), Flow (2.0x), Pause
- **Multi-Format Code Synthesizer**:
  - Vanilla CSS block with prefixed properties
  - Tailwind CSS arbitrary value utility classes
  - Standalone SVG graphic with embedded filters for Figma & web assets
- **Interactive UI Mockups**:
  - SaaS Pricing Card, FinTech Black Card, Media Player, Activity Toast

## 4. Monetization & Commercial Potential
1. **Free Developer Web Tool / Traffic Driver**: Hosted on a dedicated domain as an organic SEO acquisition funnel for dev agency services or digital products.
2. **Pro Preset & Component Pack ($19 - $39 one-time)**: Commercial UI component library (Figma + React + Tailwind) styled with Glassmorphism effects.
3. **White-Label Embed Widget ($99 - $199)**: Sell to design agencies and no-code platforms (Webflow, Framer app marketplace) as an embedded styling plugin.
4. **GitHub Sponsors & Digital Asset Marketplaces**: Distribution on Gumroad, Lemon Squeezy, and Envato Market.
