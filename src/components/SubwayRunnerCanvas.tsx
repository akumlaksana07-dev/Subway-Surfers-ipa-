import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { HERO_CLASSES, REGION_BOSSES } from '../data/questions';
import type { HeroClassId, TopicId } from '../types/game';
import { soundEngine } from '../utils/sound';
import {
  createCoinMesh,
  createHealFlaskGroup,
  createHeroRunnerGroup,
  createLabTrainGroup,
  createLowBarrierGroup,
  createOverheadBeamGroup,
  createRunnerAssetKit,
  createSciencePortalGroup,
  createTrackSegment,
} from '../three/models';
import {
  createBuildingFacadeTexture,
  createContactShadowTexture,
  createHazardStripeTexture,
  createSkyDomeTexture,
  createTrackBedTexture,
  createTrainSideTexture,
} from '../three/proceduralTextures';

interface SubwayRunnerCanvasProps {
  heroClass: HeroClassId;
  activeTopic: TopicId;
  isPaused: boolean;
  isQuizOpen: boolean;
  triggerPortalSeq: number;
  lastQuizOutcomeSeq: number;
  lastQuizOutcomeCorrect: boolean;
  onCollectCoin: () => void;
  onCollectHeal: () => void;
  onObstacleHit: () => void;
  onReachQuizPortal: () => void;
  onDistanceTick: (meters: number, portalMetersLeft: number) => void;
}

const LANE_X = [-3.2, 0, 3.2] as const;
const SEGMENT_LENGTH = 32;
const SEGMENT_COUNT = 6;
const PORTAL_INTERVAL_METERS = 115;

type ObstacleKind = 'barrier' | 'beam' | 'train';

interface RunnerObstacle {
  kind: ObstacleKind;
  lane: number;
  z: number;
  mesh: THREE.Group;
  hitChecked: boolean;
}

interface RunnerPickup {
  kind: 'coin' | 'heal';
  lane: number;
  y: number;
  z: number;
  mesh: THREE.Group;
  collected: boolean;
}

interface BurstParticle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
}

interface SpeedStreak {
  x: number;
  y: number;
  z: number;
  speedMult: number;
}

const _vec3 = new THREE.Vector3();
const _targetColor = new THREE.Color();
const _dummy = new THREE.Object3D();

export function SubwayRunnerCanvas({
  heroClass,
  activeTopic,
  isPaused,
  isQuizOpen,
  triggerPortalSeq,
  lastQuizOutcomeSeq,
  lastQuizOutcomeCorrect,
  onCollectCoin,
  onCollectHeal,
  onObstacleHit,
  onReachQuizPortal,
  onDistanceTick,
}: SubwayRunnerCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const stateRef = useRef({
    isPaused,
    isQuizOpen,
    activeTopic,
    onCollectCoin,
    onCollectHeal,
    onObstacleHit,
    onReachQuizPortal,
    onDistanceTick,
  });
  stateRef.current = {
    isPaused,
    isQuizOpen,
    activeTopic,
    onCollectCoin,
    onCollectHeal,
    onObstacleHit,
    onReachQuizPortal,
    onDistanceTick,
  };

  // Sync triggers immediately during render to avoid 1-frame race conditions after closing Quiz
  const portalTriggerRef = useRef(triggerPortalSeq);
  const outcomeTriggerRef = useRef(lastQuizOutcomeSeq);
  const pendingPortalJumpRef = useRef(false);
  const pendingOutcomeRef = useRef<'none' | 'correct' | 'wrong'>('none');

  if (triggerPortalSeq !== portalTriggerRef.current) {
    portalTriggerRef.current = triggerPortalSeq;
    pendingPortalJumpRef.current = true;
  }

  if (lastQuizOutcomeSeq !== outcomeTriggerRef.current) {
    outcomeTriggerRef.current = lastQuizOutcomeSeq;
    pendingOutcomeRef.current = lastQuizOutcomeCorrect ? 'correct' : 'wrong';
  }

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const initW = container.clientWidth || window.innerWidth;
    const initH = container.clientHeight || window.innerHeight;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(initW, initH);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const skyColor = new THREE.Color(0x07101f);
    scene.background = skyColor;
    scene.fog = new THREE.FogExp2(0x07101f, 0.0125);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(62, initW / initH, 0.1, 185);
    camera.position.set(0, 4.6, 8.2);
    camera.lookAt(0, 1.5, -12);

    // Hardware-GPU Postprocessing Bloom + Tone Mapping OutputPass
    let composer: EffectComposer | null = null;
    let bloomPass: UnrealBloomPass | null = null;
    if (!isSoftwareGl) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      bloomPass = new UnrealBloomPass(new THREE.Vector2(initW, initH), 0.38, 0.35, 0.85);
      composer.addPass(bloomPass);
      composer.addPass(new OutputPass());
    }

    // 3-Point Warm/Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff3db, 1.7);
    keyLight.position.set(9, 17, 10);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 50;
      keyLight.shadow.camera.left = -13;
      keyLight.shadow.camera.right = 13;
      keyLight.shadow.camera.top = 13;
      keyLight.shadow.camera.bottom = -13;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x10b981, 0.8);
    rimLight.position.set(-9, 8, -16);
    scene.add(rimLight);

    // Procedural Gradient SkyDome with aurora & stars
    const skyTex = createSkyDomeTexture();
    const skyGeo = new THREE.SphereGeometry(145, 24, 16);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    // Procedural Textures & Shared Asset Kit (Zero per-wave allocation leaks)
    const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const trackTex = createTrackBedTexture(maxAniso);
    const stripeTex = createHazardStripeTexture(maxAniso);
    const trainTex = createTrainSideTexture(maxAniso);
    const buildingTex = createBuildingFacadeTexture(maxAniso);
    const shadowTex = createContactShadowTexture();

    const kit = createRunnerAssetKit({
      trackTex,
      stripeTex,
      trainTex,
      buildingTex,
      shadowTex,
    });

    // Infinite Viaduct Track + Skyline Segments
    const segments: THREE.Group[] = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const seg = createTrackSegment(kit, i);
      seg.position.z = -i * SEGMENT_LENGTH + 8;
      scene.add(seg);
      segments.push(seg);
    }

    // Speed-Line Tunnel Motes (InstancedMesh)
    const STREAK_COUNT = 44;
    const streakGeo = new THREE.BoxGeometry(0.045, 0.045, 1.8);
    const streakMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const streakInstanced = new THREE.InstancedMesh(streakGeo, streakMat, STREAK_COUNT);
    streakInstanced.frustumCulled = false;
    scene.add(streakInstanced);

    const streaks: SpeedStreak[] = Array.from({ length: STREAK_COUNT }, (_, idx) => {
      const side = idx % 2 === 0 ? -1 : 1;
      return {
        x: side * (4.6 + Math.random() * 5.2),
        y: 0.7 + Math.random() * 4.5,
        z: -Math.random() * 75,
        speedMult: 1.1 + Math.random() * 0.6,
      };
    });

    // Hero Runner
    const heroMeta = HERO_CLASSES.find((h) => h.id === heroClass) || HERO_CLASSES[0];
    const hero = createHeroRunnerGroup(heroClass, heroMeta.suitColorHex, heroMeta.accentColorHex, shadowTex);
    scene.add(hero.root);

    // Portal Gate
    const initialGateColor = REGION_BOSSES[stateRef.current.activeTopic].gateColorHex;
    const portalObj = createSciencePortalGroup(initialGateColor);
    portalObj.group.visible = false;
    scene.add(portalObj.group);

    // Active Obstacles, Pickups, Particles
    const obstacles: RunnerObstacle[] = [];
    const pickups: RunnerPickup[] = [];
    const particles: BurstParticle[] = [];
    const particleGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const coinParticleMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const healParticleMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const crashParticleMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Runner Physics State
    let currentLane = 1; // 0 = left, 1 = center, 2 = right
    let playerX: number = LANE_X[1];
    let playerY = 0;
    let velY = 0;
    let isGrounded = true;
    let slideTimer = 0;
    let jumpBufferTimer = 0;
    let invulnTimer = 0;
    let boostTimer = 0;
    let shakeTimer = 0;
    let distanceMeters = 0;
    let metersSincePortal = 0;
    let portalSpawned = false;
    let portalTriggered = false;
    let portalZ = -86;
    let spawnCooldownZ = 18;
    let runTime = 0;
    let lastHudSync = 0;
    let appliedTopic: TopicId = stateRef.current.activeTopic;
    let contextLost = false;

    function spawnBurst(x: number, y: number, z: number, mat: THREE.Material, count: number) {
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(particleGeo, mat);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        particles.push({
          mesh,
          vel: new THREE.Vector3(
            (Math.random() - 0.5) * 7.5,
            Math.random() * 5.2 + 2.2,
            (Math.random() - 0.5) * 6.5,
          ),
          life: 0.45 + Math.random() * 0.25,
        });
      }
    }

    function clearFieldAhead() {
      for (const obs of obstacles) scene.remove(obs.mesh);
      obstacles.length = 0;
      for (const p of pickups) scene.remove(p.mesh);
      pickups.length = 0;
    }

    function spawnWave(zPos: number) {
      const pattern = Math.random();
      const laneA = Math.floor(Math.random() * 3);
      const laneB = (laneA + 1 + Math.floor(Math.random() * 2)) % 3;

      if (pattern < 0.38) {
        const train = createLabTrainGroup(kit);
        train.position.set(LANE_X[laneA], 0, zPos);
        scene.add(train);
        obstacles.push({ kind: 'train', lane: laneA, z: zPos, mesh: train, hitChecked: false });

        if (Math.random() < 0.65) {
          const barrier = createLowBarrierGroup(kit);
          barrier.position.set(LANE_X[laneB], 0, zPos - 2);
          scene.add(barrier);
          obstacles.push({ kind: 'barrier', lane: laneB, z: zPos - 2, mesh: barrier, hitChecked: false });
        }

        const freeLane = [0, 1, 2].find((l) => l !== laneA && l !== laneB) ?? 1;
        for (let k = 0; k < 4; k++) {
          const coin = createCoinMesh(kit);
          coin.position.set(LANE_X[freeLane], 0.92, zPos + 4 - k * 2.6);
          scene.add(coin);
          pickups.push({ kind: 'coin', lane: freeLane, y: 0.92, z: coin.position.z, mesh: coin, collected: false });
        }
      } else if (pattern < 0.7) {
        const barrier = createLowBarrierGroup(kit);
        barrier.position.set(LANE_X[laneA], 0, zPos);
        scene.add(barrier);
        obstacles.push({ kind: 'barrier', lane: laneA, z: zPos, mesh: barrier, hitChecked: false });

        for (let k = -1; k <= 1; k++) {
          const coin = createCoinMesh(kit);
          const yHeight = k === 0 ? 2.15 : 1.55;
          coin.position.set(LANE_X[laneA], yHeight, zPos - k * 2.2);
          scene.add(coin);
          pickups.push({ kind: 'coin', lane: laneA, y: yHeight, z: coin.position.z, mesh: coin, collected: false });
        }

        const beam = createOverheadBeamGroup(kit);
        beam.position.set(LANE_X[laneB], 0, zPos - 6);
        scene.add(beam);
        obstacles.push({ kind: 'beam', lane: laneB, z: zPos - 6, mesh: beam, hitChecked: false });
      } else {
        for (let k = 0; k < 5; k++) {
          const isHeal = k === 2 && Math.random() < 0.28;
          const mesh = isHeal ? createHealFlaskGroup(kit) : createCoinMesh(kit);
          mesh.position.set(LANE_X[laneA], 0.95, zPos - k * 2.4);
          scene.add(mesh);
          pickups.push({
            kind: isHeal ? 'heal' : 'coin',
            lane: laneA,
            y: 0.95,
            z: mesh.position.z,
            mesh,
            collected: false,
          });
        }

        const barrier = createLowBarrierGroup(kit);
        barrier.position.set(LANE_X[laneB], 0, zPos - 3);
        scene.add(barrier);
        obstacles.push({ kind: 'barrier', lane: laneB, z: zPos - 3, mesh: barrier, hitChecked: false });
      }
    }

    function moveLane(delta: number) {
      if (stateRef.current.isPaused || stateRef.current.isQuizOpen) return;
      const next = Math.max(0, Math.min(2, currentLane + delta));
      if (next !== currentLane) {
        currentLane = next;
        soundEngine.playSwipe();
      }
    }

    function triggerJump() {
      if (stateRef.current.isPaused || stateRef.current.isQuizOpen) return;
      jumpBufferTimer = 0.14;
    }

    function triggerSlide() {
      if (stateRef.current.isPaused || stateRef.current.isQuizOpen) return;
      soundEngine.playSwipe();
      if (!isGrounded) {
        velY = Math.min(velY, -24);
      }
      slideTimer = 0.62;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.isPaused || stateRef.current.isQuizOpen) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveLane(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveLane(1);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        triggerJump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        triggerSlide();
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        moveLane(dx > 0 ? 1 : -1);
      } else if (dy < 0) {
        triggerJump();
      } else {
        triggerSlide();
      }
    };

    const onBlur = () => {
      jumpBufferTimer = 0;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('blur', onBlur);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer?.setSize(w, h);
      bloomPass?.resolution.set(w, h);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);

      if (contextLost) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      // Dynamic Biome Palette Shift
      if (stateRef.current.activeTopic !== appliedTopic) {
        appliedTopic = stateRef.current.activeTopic;
        portalObj.setGateColor(REGION_BOSSES[appliedTopic].gateColorHex);
      }
      _targetColor.setHex(REGION_BOSSES[appliedTopic].gateColorHex);
      rimLight.color.lerp(_targetColor, 1 - Math.exp(-3 * dt));
      kit.platformTrimMat.color.lerp(_targetColor, 1 - Math.exp(-2.5 * dt));
      kit.platformTrimMat.emissive.lerp(_targetColor, 1 - Math.exp(-2.5 * dt));
      kit.domeGlassMat.emissive.lerp(_targetColor, 1 - Math.exp(-2 * dt));

      // Handle immediate quiz portal trigger
      if (pendingPortalJumpRef.current) {
        pendingPortalJumpRef.current = false;
        clearFieldAhead();
        portalSpawned = true;
        portalTriggered = false;
        portalZ = -22;
        portalObj.setGateColor(REGION_BOSSES[stateRef.current.activeTopic].gateColorHex);
        portalObj.group.position.set(0, 0, portalZ);
        portalObj.group.visible = true;
      }

      // Handle quiz outcome VFX
      if (pendingOutcomeRef.current !== 'none') {
        const outcome = pendingOutcomeRef.current;
        pendingOutcomeRef.current = 'none';
        portalSpawned = false;
        portalTriggered = false;
        portalObj.group.visible = false;
        metersSincePortal = 0;
        clearFieldAhead();
        spawnCooldownZ = 24;

        if (outcome === 'correct') {
          boostTimer = 2.8;
          invulnTimer = 3.2;
          spawnBurst(playerX, 1.3, 0, healParticleMat, 20);
        } else {
          shakeTimer = 0.36;
          invulnTimer = 1.6;
          spawnBurst(playerX, 1.3, 0, crashParticleMat, 14);
        }
      }

      const activeRun = !stateRef.current.isPaused && !stateRef.current.isQuizOpen;

      if (activeRun) {
        runTime += dt;
        const baseSpeed = 19.5 + Math.min(11, distanceMeters * 0.008);
        const speed = boostTimer > 0 ? baseSpeed * 1.48 : baseSpeed;
        const dz = speed * dt;

        distanceMeters += dz;
        metersSincePortal += dz;

        if (boostTimer > 0) boostTimer = Math.max(0, boostTimer - dt);
        if (invulnTimer > 0) invulnTimer = Math.max(0, invulnTimer - dt);
        if (shakeTimer > 0) shakeTimer = Math.max(0, shakeTimer - dt);

        // Scroll infinite viaduct segments
        for (const seg of segments) {
          seg.position.z += dz;
          if (seg.position.z > SEGMENT_LENGTH + 8) {
            seg.position.z -= SEGMENT_COUNT * SEGMENT_LENGTH;
          }
        }

        // Scroll atmospheric speed streaks
        streakMat.opacity = boostTimer > 0 ? 0.78 : 0.34;
        for (let i = 0; i < STREAK_COUNT; i++) {
          const st = streaks[i];
          st.z += dz * st.speedMult * (boostTimer > 0 ? 1.55 : 1.0);
          if (st.z > 12) {
            st.z = -72 - Math.random() * 14;
          }
          _dummy.position.set(st.x, st.y, st.z);
          _dummy.scale.set(1, 1, boostTimer > 0 ? 2.1 : 1.0);
          _dummy.updateMatrix();
          streakInstanced.setMatrixAt(i, _dummy.matrix);
        }
        streakInstanced.instanceMatrix.needsUpdate = true;

        // Lane lateral damping & lean tilt
        const targetX = LANE_X[currentLane];
        const prevX = playerX;
        playerX = THREE.MathUtils.damp(playerX, targetX, 16, dt);
        const vx = (playerX - prevX) / Math.max(dt, 0.001);
        hero.root.position.x = playerX;
        hero.bodyPivot.rotation.z = THREE.MathUtils.clamp(-vx * 0.032, -0.34, 0.34);

        // Jump buffer + vertical gravity
        if (jumpBufferTimer > 0) {
          jumpBufferTimer -= dt;
          if (isGrounded) {
            velY = 13.8;
            isGrounded = false;
            slideTimer = 0;
            jumpBufferTimer = 0;
            soundEngine.playJump();
          }
        }

        if (!isGrounded) {
          velY -= 34 * dt;
          playerY += velY * dt;
          if (playerY <= 0) {
            playerY = 0;
            velY = 0;
            isGrounded = true;
          }
        }
        hero.root.position.y = playerY;
        hero.shadow.position.y = -playerY + 0.025;
        const shadowScale = Math.max(0.45, 1 - playerY * 0.16);
        hero.shadow.scale.set(shadowScale, shadowScale, 1);

        // Slide / Run cycle kinematics + Scarf + Thrusters
        if (slideTimer > 0) {
          slideTimer = Math.max(0, slideTimer - dt);
          hero.bodyPivot.scale.set(1.12, 0.52, 1.12);
          hero.bodyPivot.rotation.x = 0.55;
        } else {
          hero.bodyPivot.scale.set(1, 1, 1);
          hero.bodyPivot.rotation.x = 0.12;
        }

        const stridePhase = runTime * (speed * 0.68);
        if (isGrounded && slideTimer <= 0) {
          hero.leftLeg.rotation.x = Math.sin(stridePhase) * 0.88;
          hero.rightLeg.rotation.x = -Math.sin(stridePhase) * 0.88;
          hero.leftArm.rotation.x = -Math.sin(stridePhase) * 0.78;
          hero.rightArm.rotation.x = Math.sin(stridePhase) * 0.78;
          hero.bodyPivot.position.y = Math.abs(Math.cos(stridePhase)) * 0.085;
        } else {
          hero.leftLeg.rotation.x = -0.35;
          hero.rightLeg.rotation.x = 0.45;
          hero.leftArm.rotation.x = -0.82;
          hero.rightArm.rotation.x = -0.82;
          hero.bodyPivot.position.y = 0;
        }

        hero.scarf.rotation.x = -0.15 + Math.sin(runTime * 14) * 0.12;
        hero.scarf.rotation.y = Math.cos(runTime * 10) * 0.09;

        const flameScale = boostTimer > 0 ? 1.9 + Math.sin(runTime * 36) * 0.35 : 0.65 + Math.sin(runTime * 22) * 0.15;
        hero.thrusterLeft.scale.set(1, flameScale, 1);
        hero.thrusterRight.scale.set(1, flameScale, 1);

        // Boost & Invulnerability visual cues
        hero.boostAura.visible = boostTimer > 0;
        if (boostTimer > 0) {
          hero.boostAura.rotation.z += dt * 7;
        }
        hero.bodyPivot.visible = invulnTimer > 0 && boostTimer <= 0 ? Math.floor(runTime * 16) % 2 === 0 : true;

        // Spawn Obstacles / Portal
        if (!portalSpawned && metersSincePortal >= PORTAL_INTERVAL_METERS) {
          portalSpawned = true;
          portalTriggered = false;
          portalZ = -86;
          portalObj.setGateColor(REGION_BOSSES[stateRef.current.activeTopic].gateColorHex);
          portalObj.group.position.set(0, 0, portalZ);
          portalObj.group.visible = true;
        } else if (!portalSpawned) {
          spawnCooldownZ -= dz;
          if (spawnCooldownZ <= 0 && metersSincePortal < PORTAL_INTERVAL_METERS - 24) {
            spawnWave(-86);
            spawnCooldownZ = 22 + Math.random() * 9;
          }
        }

        // Advance Portal
        if (portalSpawned) {
          portalZ += dz;
          portalObj.group.position.z = portalZ;
          portalObj.ringOuter.rotation.z += dt * 2.2;
          portalObj.ringInner.rotation.z -= dt * 3.1;
          portalObj.coreCrystal.rotation.y += dt * 2.5;
          if (!portalTriggered && portalZ >= -1.2) {
            portalTriggered = true;
            stateRef.current.onReachQuizPortal();
          }
        }

        // Advance & Collide Obstacles
        const heroHeight = slideTimer > 0 ? 0.92 : 1.95;
        const heroBottom = playerY;
        const heroTop = playerY + heroHeight;

        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i];
          const extraTrainSpeed = obs.kind === 'train' ? 6.8 * dt : 0;
          obs.z += dz + extraTrainSpeed;
          obs.mesh.position.z = obs.z;

          if (!obs.hitChecked) {
            const zHalf = obs.kind === 'train' ? 4.6 : 0.68;
            if (Math.abs(obs.z) < zHalf && Math.abs(playerX - LANE_X[obs.lane]) < 1.05) {
              let hit = false;
              if (obs.kind === 'barrier') {
                hit = heroBottom < 1.15;
              } else if (obs.kind === 'beam') {
                hit = heroTop > 1.45;
              } else if (obs.kind === 'train') {
                hit = heroBottom < 2.85;
              }

              if (hit) {
                obs.hitChecked = true;
                if (boostTimer > 0) {
                  spawnBurst(obs.mesh.position.x, 1.4, obs.z, coinParticleMat, 14);
                  scene.remove(obs.mesh);
                  obstacles.splice(i, 1);
                  continue;
                } else if (invulnTimer <= 0) {
                  invulnTimer = 1.25;
                  shakeTimer = 0.32;
                  soundEngine.playCrash();
                  spawnBurst(playerX, 1.1, 0, crashParticleMat, 14);
                  stateRef.current.onObstacleHit();
                }
              }
            }
          }

          if (obs.z > 16) {
            scene.remove(obs.mesh);
            obstacles.splice(i, 1);
          }
        }

        // Advance & Collect Pickups (with subtle magnetic pull)
        for (let i = pickups.length - 1; i >= 0; i--) {
          const p = pickups[i];
          p.z += dz;
          p.mesh.position.z = p.z;
          p.mesh.rotation.y += dt * 3.4;

          if (!p.collected && p.z > -4.2 && p.z < 1.2 && Math.abs(playerX - LANE_X[p.lane]) < 1.55) {
            p.mesh.position.x = THREE.MathUtils.damp(p.mesh.position.x, playerX, 10, dt);
            p.mesh.position.y = THREE.MathUtils.damp(p.mesh.position.y, playerY + 1.0, 10, dt);
          }

          if (!p.collected && Math.abs(p.z) < 1.2 && Math.abs(p.mesh.position.x - playerX) < 1.15) {
            if (Math.abs(playerY + 0.9 - p.mesh.position.y) < 1.45) {
              p.collected = true;
              soundEngine.playCoin();
              spawnBurst(p.mesh.position.x, p.mesh.position.y, 0, p.kind === 'heal' ? healParticleMat : coinParticleMat, 8);
              if (p.kind === 'heal') {
                stateRef.current.onCollectHeal();
              } else {
                stateRef.current.onCollectCoin();
              }
              scene.remove(p.mesh);
              pickups.splice(i, 1);
              continue;
            }
          }

          if (p.z > 14) {
            scene.remove(p.mesh);
            pickups.splice(i, 1);
          }
        }

        if (runTime - lastHudSync > 0.12) {
          lastHudSync = runTime;
          const remaining = Math.max(0, Math.round(PORTAL_INTERVAL_METERS - metersSincePortal));
          stateRef.current.onDistanceTick(
            Math.round(distanceMeters),
            portalSpawned ? Math.max(0, Math.round(-portalZ)) : remaining,
          );
        }
      } else if (stateRef.current.isQuizOpen) {
        portalObj.ringOuter.rotation.z += dt * 1.5;
        portalObj.ringInner.rotation.z -= dt * 2.1;
        portalObj.coreCrystal.rotation.y += dt * 2.0;
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.life -= dt;
        pt.vel.y -= 18 * dt;
        pt.mesh.position.addScaledVector(pt.vel, dt);
        pt.mesh.scale.setScalar(Math.max(0.01, pt.life * 2));
        if (pt.life <= 0) {
          scene.remove(pt.mesh);
          particles.splice(i, 1);
        }
      }

      // Smooth Chase Camera + FOV boost + Decay Shake
      const targetCamX = playerX * 0.48;
      const targetCamY = stateRef.current.isQuizOpen ? 3.5 : 4.5 + playerY * 0.35;
      const targetCamZ = stateRef.current.isQuizOpen ? 6.4 : 8.3;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 8, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 8, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 8, dt);

      if (shakeTimer > 0) {
        camera.position.x += (Math.random() - 0.5) * 0.35;
        camera.position.y += (Math.random() - 0.5) * 0.28;
      }

      const targetFov = boostTimer > 0 ? 73 : stateRef.current.isQuizOpen ? 56 : 62;
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 7, dt);
      camera.updateProjectionMatrix();

      skyDome.position.copy(camera.position);
      _vec3.set(playerX * 0.35, 1.55 + playerY * 0.3, -12);
      camera.lookAt(_vec3);

      if (composer && !isSoftwareGl) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });

      kit.dispose();
      skyGeo.dispose();
      skyMat.dispose();
      skyTex.dispose();
      streakGeo.dispose();
      streakMat.dispose();
      trackTex.dispose();
      stripeTex.dispose();
      trainTex.dispose();
      buildingTex.dispose();
      shadowTex.dispose();
      envTex.dispose();
      particleGeo.dispose();
      coinParticleMat.dispose();
      healParticleMat.dispose();
      crashParticleMat.dispose();
      composer?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [heroClass]);

  if (webglFailed) {
    return (
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#07101f] via-[#0d2238] to-[#081320] flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-slate-700 bg-[#0E1B2D] p-6 text-center space-y-2">
          <p className="text-base font-bold text-white">Mode Lintasan Ringan Aktif</p>
          <p className="text-xs text-slate-300">
            Perangkat tidak mengaktifkan akselerasi WebGL. Gunakan tombol Portal Soal (Q) di kanan atas untuk melanjutkan kuis RPG.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#07101f] touch-none"
      aria-label="Arena 3D Petualangan Subway Sains"
    />
  );
}
