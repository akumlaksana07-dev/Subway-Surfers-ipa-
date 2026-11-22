import * as THREE from 'three';

export function createTrackBedTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep slate ballast foundation
  ctx.fillStyle = '#0D1829';
  ctx.fillRect(0, 0, 1024, 1024);

  // Textured crushed ballast stone speckles
  for (let i = 0; i < 3200; i++) {
    const x = (i * 197 + (i % 13) * 7) % 1024;
    const y = (i * 313 + (i % 17) * 11) % 1024;
    ctx.fillStyle = i % 4 === 0 ? '#1B2D47' : i % 2 === 0 ? '#132238' : '#09121F';
    ctx.fillRect(x, y, 4, 4);
  }

  // Three recessed rail channels with sleepers, tie-plates & lane chevrons
  const laneCenters = [172, 512, 852];
  for (const cx of laneCenters) {
    // Channel shadow gradient
    const chanGrad = ctx.createLinearGradient(cx - 120, 0, cx + 120, 0);
    chanGrad.addColorStop(0, '#09121F');
    chanGrad.addColorStop(0.15, '#112036');
    chanGrad.addColorStop(0.5, '#152742');
    chanGrad.addColorStop(0.85, '#112036');
    chanGrad.addColorStop(1, '#09121F');
    ctx.fillStyle = chanGrad;
    ctx.fillRect(cx - 120, 0, 240, 1024);

    // Composite railway sleepers with wood/metallic detail
    for (let y = 0; y < 1024; y += 64) {
      ctx.fillStyle = '#2A201B';
      ctx.fillRect(cx - 104, y + 14, 208, 24);
      ctx.fillStyle = '#3F3028';
      ctx.fillRect(cx - 104, y + 14, 208, 6);
      // Steel tie plates
      ctx.fillStyle = '#64748B';
      ctx.fillRect(cx - 78, y + 12, 24, 28);
      ctx.fillRect(cx + 54, y + 12, 24, 28);
    }

    // Subtle directional chevrons along the center of each lane
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.lineWidth = 4;
    for (let y = 32; y < 1024; y += 128) {
      ctx.beginPath();
      ctx.moveTo(cx - 24, y + 16);
      ctx.lineTo(cx, y);
      ctx.lineTo(cx + 24, y + 16);
      ctx.stroke();
    }

    // Twin rail shadow beds (3D steel rails sit right above these)
    ctx.fillStyle = '#070E18';
    ctx.fillRect(cx - 70, 0, 14, 1024);
    ctx.fillRect(cx + 56, 0, 14, 1024);
  }

  // Crisp glowing lane divider strips
  for (const sepX of [340, 684]) {
    ctx.fillStyle = '#0A2E2B';
    ctx.fillRect(sepX - 8, 0, 16, 1024);
    ctx.fillStyle = '#10B981';
    for (let y = 0; y < 1024; y += 64) {
      ctx.fillRect(sepX - 3, y + 8, 6, 40);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createHazardStripeTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 128);
  bgGrad.addColorStop(0, '#FBBF24');
  bgGrad.addColorStop(0.5, '#F59E0B');
  bgGrad.addColorStop(1, '#D97706');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 128);

  ctx.fillStyle = '#0F172A';
  for (let x = -128; x < 640; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 32, 0);
    ctx.lineTo(x - 32, 128);
    ctx.lineTo(x - 64, 128);
    ctx.closePath();
    ctx.fill();
  }

  // Brushed metallic top/bottom border bevel
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, 512, 10);
  ctx.fillRect(0, 118, 512, 10);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createTrainSideTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Sleek metallic hull gradient
  const hullGrad = ctx.createLinearGradient(0, 0, 0, 512);
  hullGrad.addColorStop(0, '#1E4356');
  hullGrad.addColorStop(0.55, '#122D3D');
  hullGrad.addColorStop(1, '#0C1E2B');
  ctx.fillStyle = hullGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Vertical metallic panel seams & rivets
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.lineWidth = 3;
  for (let x = 0; x < 1024; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // High-contrast racing stripe + brass/emerald trim
  ctx.fillStyle = '#10B981';
  ctx.fillRect(0, 326, 1024, 14);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(0, 344, 1024, 42);
  ctx.fillStyle = '#FDE68A';
  ctx.fillRect(0, 348, 1024, 6);

  // Illuminated panoramic laboratory windows with reflections
  for (let x = 48; x < 960; x += 156) {
    // Dark window bezel
    ctx.fillStyle = '#09111C';
    ctx.beginPath();
    ctx.roundRect(x - 6, 86, 118, 176, 14);
    ctx.fill();

    // Glowing cyan interior glass
    const winGrad = ctx.createLinearGradient(x, 92, x, 256);
    winGrad.addColorStop(0, '#7DD3FC');
    winGrad.addColorStop(0.5, '#0EA5E9');
    winGrad.addColorStop(1, '#0369A1');
    ctx.fillStyle = winGrad;
    ctx.beginPath();
    ctx.roundRect(x, 92, 106, 164, 10);
    ctx.fill();

    // Diagonal glass specular highlight
    ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
    ctx.beginPath();
    ctx.moveTo(x + 10, 96);
    ctx.lineTo(x + 42, 96);
    ctx.lineTo(x + 14, 210);
    ctx.lineTo(x + 4, 210);
    ctx.closePath();
    ctx.fill();
  }

  // Lower equipment louver vents
  ctx.fillStyle = '#0A1622';
  for (let x = 70; x < 960; x += 220) {
    ctx.fillRect(x, 412, 140, 62);
    ctx.fillStyle = '#1E3A5F';
    for (let ly = 420; ly < 466; ly += 10) {
      ctx.fillRect(x + 10, ly, 120, 4);
    }
    ctx.fillStyle = '#0A1622';
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createBuildingFacadeTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0B1626';
  ctx.fillRect(0, 0, 512, 512);

  // Architectural mullions
  ctx.fillStyle = '#14243B';
  for (let x = 0; x < 512; x += 64) {
    ctx.fillRect(x, 0, 8, 512);
  }
  for (let y = 0; y < 512; y += 48) {
    ctx.fillRect(0, y, 512, 8);
  }

  // Deterministic lit science-lab windows
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 8; col++) {
      const seed = (row * 17 + col * 31) % 11;
      if (seed < 4) {
        ctx.fillStyle = seed === 0 ? '#34D399' : seed === 1 ? '#38BDF8' : '#FBBF24';
        ctx.fillRect(col * 64 + 16, row * 48 + 14, 34, 22);
      } else {
        ctx.fillStyle = '#0F1E33';
        ctx.fillRect(col * 64 + 16, row * 48 + 14, 34, 22);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createSkyDomeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#040914');
  grad.addColorStop(0.38, '#081529');
  grad.addColorStop(0.62, '#0E2845');
  grad.addColorStop(0.76, '#133C55');
  grad.addColorStop(1.0, '#091322');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle aurora / nebula band
  const aurora = ctx.createRadialGradient(256, 280, 20, 256, 280, 240);
  aurora.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
  aurora.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
  aurora.addColorStop(1, 'rgba(9, 19, 34, 0)');
  ctx.fillStyle = aurora;
  ctx.fillRect(0, 80, 512, 340);

  // Crisp stars in upper hemisphere
  for (let i = 0; i < 160; i++) {
    const x = (i * 97 + 43) % 512;
    const y = (i * 53 + 17) % 270;
    const alpha = 0.25 + ((i * 19) % 70) / 100;
    const size = i % 9 === 0 ? 2 : 1.2;
    ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
    ctx.fillRect(x, y, size, size);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
