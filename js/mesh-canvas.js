/**
 * Interactive Animated Mesh Gradient Canvas Engine
 * Smooth 60fps radial particle physics with interactive dragging and blend modes
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MeshCanvas = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class MeshRenderer {
    constructor(canvasElement, config = {}) {
      this.canvas = canvasElement;
      this.ctx = canvasElement.getContext('2d');
      this.blobs = config.blobs || [];
      this.blendMode = config.blendMode || 'screen';
      this.speed = config.speed || 1.0;
      this.isPaused = false;
      this.draggedBlobIndex = -1;

      this.resize();
      this.initEvents();
      this.startLoop();
    }

    setBlobs(blobs) {
      this.blobs = blobs || [];
    }

    setBlendMode(mode) {
      this.blendMode = mode;
    }

    setSpeed(speedMultiplier) {
      this.speed = speedMultiplier;
    }

    togglePause() {
      this.isPaused = !this.isPaused;
      return this.isPaused;
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.width = rect.width;
      this.height = rect.height;

      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.resetTransform?.();
      this.ctx.scale(dpr, dpr);
    }

    initEvents() {
      window.addEventListener('resize', () => this.resize());

      // Mouse drag interaction to move blobs manually
      const getCoords = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const xPct = ((clientX - rect.left) / this.width) * 100;
        const yPct = ((clientY - rect.top) / this.height) * 100;
        return { xPct, yPct };
      };

      const onStart = (e) => {
        const { xPct, yPct } = getCoords(e);
        // Find nearest blob within 20% radius
        let closestIdx = -1;
        let minDist = 25;
        this.blobs.forEach((b, idx) => {
          const dx = b.x - xPct;
          const dy = b.y - yPct;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            closestIdx = idx;
          }
        });
        if (closestIdx !== -1) {
          this.draggedBlobIndex = closestIdx;
        }
      };

      const onMove = (e) => {
        if (this.draggedBlobIndex !== -1 && this.blobs[this.draggedBlobIndex]) {
          const { xPct, yPct } = getCoords(e);
          this.blobs[this.draggedBlobIndex].x = Math.max(5, Math.min(95, xPct));
          this.blobs[this.draggedBlobIndex].y = Math.max(5, Math.min(95, yPct));
        }
      };

      const onEnd = () => {
        this.draggedBlobIndex = -1;
      };

      this.canvas.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);

      this.canvas.addEventListener('touchstart', onStart, { passive: true });
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    }

    startLoop() {
      const render = () => {
        this.updatePhysics();
        this.draw();
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    }

    updatePhysics() {
      if (this.isPaused || this.speed === 0) return;

      this.blobs.forEach((blob, idx) => {
        if (idx === this.draggedBlobIndex) return;

        const vx = (blob.vx || 0.3) * this.speed;
        const vy = (blob.vy || 0.3) * this.speed;

        blob.x += vx;
        blob.y += vy;

        // Bounce softly off 0% - 100% boundary
        if (blob.x <= 10) {
          blob.x = 10;
          blob.vx = Math.abs(blob.vx);
        } else if (blob.x >= 90) {
          blob.x = 90;
          blob.vx = -Math.abs(blob.vx);
        }

        if (blob.y <= 10) {
          blob.y = 10;
          blob.vy = Math.abs(blob.vy);
        } else if (blob.y >= 90) {
          blob.y = 90;
          blob.vy = -Math.abs(blob.vy);
        }
      });
    }

    draw() {
      const { ctx, width, height, blobs, blendMode } = this;
      if (!ctx || !width || !height) return;

      // Dark background
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Render radial blobs with selected blend mode
      ctx.globalCompositeOperation = blendMode === 'normal' ? 'source-over' : blendMode;

      blobs.forEach((blob) => {
        const px = (blob.x / 100) * width;
        const py = (blob.y / 100) * height;
        const maxDim = Math.max(width, height);
        const radius = ((blob.radius || 40) / 100) * maxDim;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(0.5, blob.color + 'aa');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  return {
    MeshRenderer
  };
});
