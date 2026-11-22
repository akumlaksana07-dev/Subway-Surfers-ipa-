import * as THREE from 'three';
import type { HeroClassId } from '../types/game';

export interface HeroRunnerRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  scarf: THREE.Mesh;
  thrusterLeft: THREE.Mesh;
  thrusterRight: THREE.Mesh;
  boostAura: THREE.Mesh;
  shadow: THREE.Mesh;
}

export interface SciencePortalRig {
  group: THREE.Group;
  ringOuter: THREE.Mesh;
  ringInner: THREE.Mesh;
  coreCrystal: THREE.Mesh;
  setGateColor: (hex: number) => void;
}

export interface RunnerAssetKit {
  // Shared textures
  trackTex: THREE.CanvasTexture;
  stripeTex: THREE.CanvasTexture;
  trainTex: THREE.CanvasTexture;
  buildingTex: THREE.CanvasTexture;
  shadowTex: THREE.CanvasTexture;
  // Shared materials
  steelMat: THREE.MeshStandardMaterial;
  darkSteelMat: THREE.MeshStandardMaterial;
  brassMat: THREE.MeshStandardMaterial;
  stripeMat: THREE.MeshStandardMaterial;
  trainBodyMat: THREE.MeshStandardMaterial;
  trainWindshieldMat: THREE.MeshStandardMaterial;
  headlightMat: THREE.MeshStandardMaterial;
  lightConeMat: THREE.MeshBasicMaterial;
  beaconMat: THREE.MeshStandardMaterial;
  coinGoldMat: THREE.MeshStandardMaterial;
  coinCoreMat: THREE.MeshStandardMaterial;
  healGlassMat: THREE.MeshStandardMaterial;
  healTrimMat: THREE.MeshStandardMaterial;
  platformTrimMat: THREE.MeshStandardMaterial;
  curbMat: THREE.MeshStandardMaterial;
  buildingMat: THREE.MeshStandardMaterial;
  domeGlassMat: THREE.MeshStandardMaterial;
  outerGroundMat: THREE.MeshStandardMaterial;
  // Shared geometries
  trainHullGeo: THREE.BoxGeometry;
  trainRoofGeo: THREE.BoxGeometry;
  trainNoseGeo: THREE.ExtrudeGeometry;
  trainLampGeo: THREE.CylinderGeometry;
  trainConeGeo: THREE.ConeGeometry;
  trainBogieGeo: THREE.BoxGeometry;
  trainWheelGeo: THREE.CylinderGeometry;
  trainWindshieldGeo: THREE.BoxGeometry;
  trainAcGeo: THREE.BoxGeometry;
  barrierPostGeo: THREE.BoxGeometry;
  barrierBaseGeo: THREE.BoxGeometry;
  barrierBeamGeo: THREE.BoxGeometry;
  barrierBeaconGeo: THREE.CylinderGeometry;
  beamPostGeo: THREE.BoxGeometry;
  beamBarGeo: THREE.BoxGeometry;
  beamPipeGeo: THREE.CylinderGeometry;
  coinRimGeo: THREE.TorusGeometry;
  coinDiscGeo: THREE.CylinderGeometry;
  coinCoreGeo: THREE.OctahedronGeometry;
  coinOrbitGeo: THREE.TorusGeometry;
  healFlaskGeo: THREE.LatheGeometry;
  healCollarGeo: THREE.CylinderGeometry;
  dispose: () => void;
}

export function createRunnerAssetKit(textures: {
  trackTex: THREE.CanvasTexture;
  stripeTex: THREE.CanvasTexture;
  trainTex: THREE.CanvasTexture;
  buildingTex: THREE.CanvasTexture;
  shadowTex: THREE.CanvasTexture;
}): RunnerAssetKit {
  const { trackTex, stripeTex, trainTex, buildingTex, shadowTex } = textures;

  const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.35, metalness: 0.8 });
  const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.55, metalness: 0.65 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.88 });
  const stripeMat = new THREE.MeshStandardMaterial({ map: stripeTex, roughness: 0.42, metalness: 0.25 });
  const trainBodyMat = new THREE.MeshStandardMaterial({ map: trainTex, roughness: 0.32, metalness: 0.62 });
  const trainWindshieldMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.65,
    roughness: 0.12,
    metalness: 0.35,
  });
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xfef9c3,
    emissive: 0xfde047,
    emissiveIntensity: 2.2,
    roughness: 0.1,
  });
  const lightConeMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xe11d48,
    emissiveIntensity: 2.0,
    roughness: 0.2,
  });
  const coinGoldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xb45309,
    emissiveIntensity: 0.45,
    roughness: 0.18,
    metalness: 0.92,
  });
  const coinCoreMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 1.7,
    roughness: 0.15,
  });
  const healGlassMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x10b981,
    emissiveIntensity: 1.5,
    roughness: 0.12,
    metalness: 0.15,
  });
  const healTrimMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.25, metalness: 0.9 });
  const platformTrimMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 1.25,
    roughness: 0.3,
  });
  const curbMat = new THREE.MeshStandardMaterial({ color: 0x162436, roughness: 0.65, metalness: 0.3 });
  const buildingMat = new THREE.MeshStandardMaterial({
    map: buildingTex,
    roughness: 0.5,
    metalness: 0.35,
  });
  const domeGlassMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.55,
    roughness: 0.2,
    metalness: 0.4,
    wireframe: false,
  });
  const outerGroundMat = new THREE.MeshStandardMaterial({ color: 0x07101d, roughness: 0.95, metalness: 0.05 });

  // Aerodynamic sloped train nose via ExtrudeGeometry
  const noseShape = new THREE.Shape();
  noseShape.moveTo(0, 0);
  noseShape.lineTo(0.85, 0);
  noseShape.lineTo(0.42, 1.45);
  noseShape.lineTo(0, 2.25);
  noseShape.closePath();

  const trainNoseGeo = new THREE.ExtrudeGeometry(noseShape, {
    depth: 2.24,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: 2,
  });
  trainNoseGeo.rotateY(-Math.PI / 2);
  trainNoseGeo.translate(1.12, 0.36, 4.55);

  const trainHullGeo = new THREE.BoxGeometry(2.34, 2.32, 9.0);
  const trainRoofGeo = new THREE.BoxGeometry(2.02, 0.28, 8.7);
  const trainLampGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.16, 14);
  trainLampGeo.rotateX(Math.PI / 2);
  const trainConeGeo = new THREE.ConeGeometry(0.95, 4.8, 16, 1, true);
  trainConeGeo.rotateX(Math.PI / 2);
  const trainBogieGeo = new THREE.BoxGeometry(1.96, 0.42, 2.1);
  const trainWheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 14);
  trainWheelGeo.rotateZ(Math.PI / 2);
  const trainWindshieldGeo = new THREE.BoxGeometry(1.86, 0.68, 0.14);
  const trainAcGeo = new THREE.BoxGeometry(1.3, 0.22, 1.6);

  const barrierPostGeo = new THREE.BoxGeometry(0.18, 1.08, 0.18);
  const barrierBaseGeo = new THREE.BoxGeometry(0.36, 0.1, 0.46);
  const barrierBeamGeo = new THREE.BoxGeometry(2.42, 0.54, 0.24);
  const barrierBeaconGeo = new THREE.CylinderGeometry(0.11, 0.14, 0.18, 12);

  const beamPostGeo = new THREE.BoxGeometry(0.24, 3.05, 0.24);
  const beamBarGeo = new THREE.BoxGeometry(2.8, 0.76, 0.42);
  const beamPipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.84, 12);
  beamPipeGeo.rotateZ(Math.PI / 2);

  const coinRimGeo = new THREE.TorusGeometry(0.38, 0.075, 10, 22);
  const coinDiscGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.06, 18);
  coinDiscGeo.rotateX(Math.PI / 2);
  const coinCoreGeo = new THREE.OctahedronGeometry(0.16, 0);
  const coinOrbitGeo = new THREE.TorusGeometry(0.52, 0.025, 6, 24);

  // Erlenmeyer alchemy flask profile via LatheGeometry
  const flaskPoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.36, 0.0),
    new THREE.Vector2(0.38, 0.08),
    new THREE.Vector2(0.28, 0.36),
    new THREE.Vector2(0.13, 0.54),
    new THREE.Vector2(0.13, 0.72),
    new THREE.Vector2(0.17, 0.76),
  ];
  const healFlaskGeo = new THREE.LatheGeometry(flaskPoints, 18);
  const healCollarGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 14);

  const allMaterials: THREE.Material[] = [
    steelMat,
    darkSteelMat,
    brassMat,
    stripeMat,
    trainBodyMat,
    trainWindshieldMat,
    headlightMat,
    lightConeMat,
    beaconMat,
    coinGoldMat,
    coinCoreMat,
    healGlassMat,
    healTrimMat,
    platformTrimMat,
    curbMat,
    buildingMat,
    domeGlassMat,
    outerGroundMat,
  ];

  const allGeometries: THREE.BufferGeometry[] = [
    trainHullGeo,
    trainRoofGeo,
    trainNoseGeo,
    trainLampGeo,
    trainConeGeo,
    trainBogieGeo,
    trainWheelGeo,
    trainWindshieldGeo,
    trainAcGeo,
    barrierPostGeo,
    barrierBaseGeo,
    barrierBeamGeo,
    barrierBeaconGeo,
    beamPostGeo,
    beamBarGeo,
    beamPipeGeo,
    coinRimGeo,
    coinDiscGeo,
    coinCoreGeo,
    coinOrbitGeo,
    healFlaskGeo,
    healCollarGeo,
  ];

  return {
    trackTex,
    stripeTex,
    trainTex,
    buildingTex,
    shadowTex,
    steelMat,
    darkSteelMat,
    brassMat,
    stripeMat,
    trainBodyMat,
    trainWindshieldMat,
    headlightMat,
    lightConeMat,
    beaconMat,
    coinGoldMat,
    coinCoreMat,
    healGlassMat,
    healTrimMat,
    platformTrimMat,
    curbMat,
    buildingMat,
    domeGlassMat,
    outerGroundMat,
    trainHullGeo,
    trainRoofGeo,
    trainNoseGeo,
    trainLampGeo,
    trainConeGeo,
    trainBogieGeo,
    trainWheelGeo,
    trainWindshieldGeo,
    trainAcGeo,
    barrierPostGeo,
    barrierBaseGeo,
    barrierBeamGeo,
    barrierBeaconGeo,
    beamPostGeo,
    beamBarGeo,
    beamPipeGeo,
    coinRimGeo,
    coinDiscGeo,
    coinCoreGeo,
    coinOrbitGeo,
    healFlaskGeo,
    healCollarGeo,
    dispose: () => {
      allGeometries.forEach((g) => g.dispose());
      allMaterials.forEach((m) => m.dispose());
    },
  };
}

export function createHeroRunnerGroup(
  heroClass: HeroClassId,
  suitColorHex: number,
  accentColorHex: number,
  shadowTex: THREE.CanvasTexture,
): HeroRunnerRig {
  const root = new THREE.Group();
  const bodyPivot = new THREE.Group();
  root.add(bodyPivot);

  const suitMat = new THREE.MeshStandardMaterial({ color: suitColorHex, roughness: 0.48, metalness: 0.25 });
  const darkPantsMat = new THREE.MeshStandardMaterial({ color: 0x162032, roughness: 0.72, metalness: 0.15 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf1c27d, roughness: 0.55, metalness: 0.02 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.22, metalness: 0.88 });
  const glowMat = new THREE.MeshStandardMaterial({
    color: accentColorHex,
    emissive: accentColorHex,
    emissiveIntensity: 1.9,
    roughness: 0.15,
    metalness: 0.2,
  });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x2b1810, roughness: 0.82, metalness: 0.05 });
  const scarfMat = new THREE.MeshStandardMaterial({
    color: accentColorHex,
    emissive: accentColorHex,
    emissiveIntensity: 0.45,
    roughness: 0.55,
    side: THREE.DoubleSide,
  });

  // 1. Torso jacket (Capsule silhouette)
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.46, 6, 12), suitMat);
  torso.scale.set(1.15, 1, 0.78);
  torso.position.y = 1.26;
  torso.castShadow = true;
  bodyPivot.add(torso);

  // 2. Utility Brass Belt + Glowing Buckle
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.11, 14), brassMat);
  belt.scale.set(1.05, 1, 0.76);
  belt.position.y = 0.92;
  bodyPivot.add(belt);

  // 3. Jetpack / Science Backpack + Thruster Nozzles
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.56, 0.24), darkPantsMat);
  pack.position.set(0, 1.3, 0.27);
  pack.castShadow = true;
  bodyPivot.add(pack);

  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.36, 14), glowMat);
  core.position.set(0, 1.3, 0.4);
  bodyPivot.add(core);

  const nozzleGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.16, 10);
  const nozzleL = new THREE.Mesh(nozzleGeo, brassMat);
  nozzleL.position.set(-0.15, 0.98, 0.31);
  nozzleL.rotation.x = 0.25;
  const nozzleR = new THREE.Mesh(nozzleGeo, brassMat);
  nozzleR.position.set(0.15, 0.98, 0.31);
  nozzleR.rotation.x = 0.25;
  bodyPivot.add(nozzleL, nozzleR);

  const flameMat = new THREE.MeshBasicMaterial({
    color: accentColorHex,
    transparent: true,
    opacity: 0.85,
  });
  const flameGeo = new THREE.ConeGeometry(0.08, 0.45, 10);
  flameGeo.rotateX(Math.PI);
  const thrusterLeft = new THREE.Mesh(flameGeo, flameMat);
  thrusterLeft.position.set(-0.15, 0.74, 0.36);
  thrusterLeft.rotation.x = 0.25;
  const thrusterRight = new THREE.Mesh(flameGeo, flameMat);
  thrusterRight.position.set(0.15, 0.74, 0.36);
  thrusterRight.rotation.x = 0.25;
  bodyPivot.add(thrusterLeft, thrusterRight);

  // Hero-class specialization accents
  if (heroClass === 'ksatria') {
    const pauldronGeo = new THREE.SphereGeometry(0.2, 10, 10);
    const pL = new THREE.Mesh(pauldronGeo, brassMat);
    pL.position.set(-0.44, 1.56, 0);
    pL.scale.set(1.1, 0.75, 1.1);
    const pR = new THREE.Mesh(pauldronGeo, brassMat);
    pR.position.set(0.44, 1.56, 0);
    pR.scale.set(1.1, 0.75, 1.1);
    bodyPivot.add(pL, pR);
  } else if (heroClass === 'penjelajah') {
    const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.42, 6);
    const ant = new THREE.Mesh(antGeo, glowMat);
    ant.position.set(0.2, 1.72, 0.32);
    ant.rotation.x = -0.25;
    bodyPivot.add(ant);
  } else {
    const vialOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), glowMat);
    vialOrb.position.set(0, 1.66, 0.34);
    bodyPivot.add(vialOrb);
  }

  // 4. Head + Hair + Cap/Goggles
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 14, 14), skinMat);
  head.position.y = 1.94;
  head.castShadow = true;
  bodyPivot.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.265, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
  hair.position.set(0, 1.97, 0.02);
  bodyPivot.add(hair);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.11, 0.22), glowMat);
  visor.position.set(0, 1.97, -0.17);
  bodyPivot.add(visor);

  const goggleFrame = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.14, 0.14), brassMat);
  goggleFrame.position.set(0, 1.97, -0.14);
  bodyPivot.add(goggleFrame);

  // 5. Flowing Runner Scarf
  const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.72), scarfMat);
  scarf.geometry.translate(0, 0, 0.36);
  scarf.position.set(0, 1.65, 0.14);
  bodyPivot.add(scarf);

  // 6 & 7. Articulated Capsule Arms
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.42, 1.56, 0);
  const armMeshL = new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 0.36, 4, 8), suitMat);
  armMeshL.position.y = -0.24;
  armMeshL.castShadow = true;
  const gloveL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), brassMat);
  gloveL.position.y = -0.48;
  leftArm.add(armMeshL, gloveL);
  bodyPivot.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.42, 1.56, 0);
  const armMeshR = new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 0.36, 4, 8), suitMat);
  armMeshR.position.y = -0.24;
  armMeshR.castShadow = true;
  const gloveR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), brassMat);
  gloveR.position.y = -0.48;
  rightArm.add(armMeshR, gloveR);
  bodyPivot.add(rightArm);

  // 8 & 9. Articulated Capsule Legs + Boots
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.17, 0.85, 0);
  const legMeshL = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.4, 4, 8), darkPantsMat);
  legMeshL.position.y = -0.32;
  legMeshL.castShadow = true;
  const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.36), brassMat);
  bootL.position.set(0, -0.73, -0.05);
  leftLeg.add(legMeshL, bootL);
  bodyPivot.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.17, 0.85, 0);
  const legMeshR = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.4, 4, 8), darkPantsMat);
  legMeshR.position.y = -0.32;
  legMeshR.castShadow = true;
  const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.36), brassMat);
  bootR.position.set(0, -0.73, -0.05);
  rightLeg.add(legMeshR, bootR);
  bodyPivot.add(rightLeg);

  // 10. Boost Aura Ring (visible during Turbo Dash)
  const boostAura = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.06, 8, 28),
    new THREE.MeshBasicMaterial({ color: accentColorHex, transparent: true, opacity: 0.78 }),
  );
  boostAura.rotation.x = Math.PI / 2;
  boostAura.position.y = 0.24;
  boostAura.visible = false;
  root.add(boostAura);

  // Grounded contact shadow disc
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.68 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.025;
  root.add(shadow);

  return {
    root,
    bodyPivot,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    scarf,
    thrusterLeft,
    thrusterRight,
    boostAura,
    shadow,
  };
}

export function createLabTrainGroup(kit: RunnerAssetKit): THREE.Group {
  const group = new THREE.Group();

  const hull = new THREE.Mesh(kit.trainHullGeo, kit.trainBodyMat);
  hull.position.y = 1.54;
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  const roof = new THREE.Mesh(kit.trainRoofGeo, kit.darkSteelMat);
  roof.position.y = 2.82;
  group.add(roof);

  // Sloped aerodynamic nose
  const nose = new THREE.Mesh(kit.trainNoseGeo, kit.brassMat);
  nose.castShadow = true;
  group.add(nose);

  // Twin glowing headlights + volumetric cones
  const lampL = new THREE.Mesh(kit.trainLampGeo, kit.headlightMat);
  lampL.position.set(-0.66, 1.12, 4.92);
  const lampR = new THREE.Mesh(kit.trainLampGeo, kit.headlightMat);
  lampR.position.set(0.66, 1.12, 4.92);
  group.add(lampL, lampR);

  const coneL = new THREE.Mesh(kit.trainConeGeo, kit.lightConeMat);
  coneL.position.set(-0.66, 0.95, 7.35);
  const coneR = new THREE.Mesh(kit.trainConeGeo, kit.lightConeMat);
  coneR.position.set(0.66, 0.95, 7.35);
  group.add(coneL, coneR);

  // Panoramic front windshield
  const windshield = new THREE.Mesh(kit.trainWindshieldGeo, kit.trainWindshieldMat);
  windshield.position.set(0, 2.15, 4.62);
  windshield.rotation.x = -0.22;
  group.add(windshield);

  // Roof AC modules
  const ac1 = new THREE.Mesh(kit.trainAcGeo, kit.steelMat);
  ac1.position.set(0, 3.04, 2.0);
  const ac2 = new THREE.Mesh(kit.trainAcGeo, kit.steelMat);
  ac2.position.set(0, 3.04, -2.0);
  group.add(ac1, ac2);

  // Bogies + wheels
  const bogieFront = new THREE.Mesh(kit.trainBogieGeo, kit.darkSteelMat);
  bogieFront.position.set(0, 0.25, 2.8);
  const bogieRear = new THREE.Mesh(kit.trainBogieGeo, kit.darkSteelMat);
  bogieRear.position.set(0, 0.25, -2.8);
  group.add(bogieFront, bogieRear);

  for (const wz of [3.3, 2.3, -2.3, -3.3]) {
    for (const wx of [-1.04, 1.04]) {
      const wheel = new THREE.Mesh(kit.trainWheelGeo, kit.steelMat);
      wheel.position.set(wx, 0.28, wz);
      group.add(wheel);
    }
  }

  return group;
}

export function createLowBarrierGroup(kit: RunnerAssetKit): THREE.Group {
  const group = new THREE.Group();

  const postL = new THREE.Mesh(kit.barrierPostGeo, kit.steelMat);
  postL.position.set(-1.05, 0.54, 0);
  const postR = new THREE.Mesh(kit.barrierPostGeo, kit.steelMat);
  postR.position.set(1.05, 0.54, 0);

  const baseL = new THREE.Mesh(kit.barrierBaseGeo, kit.darkSteelMat);
  baseL.position.set(-1.05, 0.05, 0);
  const baseR = new THREE.Mesh(kit.barrierBaseGeo, kit.darkSteelMat);
  baseR.position.set(1.05, 0.05, 0);

  const beam = new THREE.Mesh(kit.barrierBeamGeo, kit.stripeMat);
  beam.position.set(0, 0.86, 0);
  beam.castShadow = true;

  const beaconL = new THREE.Mesh(kit.barrierBeaconGeo, kit.beaconMat);
  beaconL.position.set(-0.92, 1.2, 0);
  const beaconR = new THREE.Mesh(kit.barrierBeaconGeo, kit.beaconMat);
  beaconR.position.set(0.92, 1.2, 0);

  group.add(postL, postR, baseL, baseR, beam, beaconL, beaconR);
  return group;
}

export function createOverheadBeamGroup(kit: RunnerAssetKit): THREE.Group {
  const group = new THREE.Group();

  const postL = new THREE.Mesh(kit.beamPostGeo, kit.darkSteelMat);
  postL.position.set(-1.25, 1.525, 0);
  const postR = new THREE.Mesh(kit.beamPostGeo, kit.darkSteelMat);
  postR.position.set(1.25, 1.525, 0);

  const baseL = new THREE.Mesh(kit.barrierBaseGeo, kit.steelMat);
  baseL.position.set(-1.25, 0.05, 0);
  const baseR = new THREE.Mesh(kit.barrierBaseGeo, kit.steelMat);
  baseR.position.set(1.25, 0.05, 0);

  const beam = new THREE.Mesh(kit.beamBarGeo, kit.stripeMat);
  beam.position.set(0, 2.02, 0);
  beam.castShadow = true;

  const topPipe = new THREE.Mesh(kit.beamPipeGeo, kit.brassMat);
  topPipe.position.set(0, 2.55, 0);

  group.add(postL, postR, baseL, baseR, beam, topPipe);
  return group;
}

export function createSciencePortalGroup(initialGateColorHex: number): SciencePortalRig {
  const group = new THREE.Group();
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x162436, roughness: 0.35, metalness: 0.82 });
  const trimMat = new THREE.MeshStandardMaterial({
    color: initialGateColorHex,
    emissive: initialGateColorHex,
    emissiveIntensity: 1.85,
    roughness: 0.2,
  });
  const curtainMat = new THREE.MeshBasicMaterial({
    color: initialGateColorHex,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.75, 5.4, 0.75), pillarMat);
  pillarL.position.set(-4.95, 2.7, 0);
  const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.75, 5.4, 0.75), pillarMat);
  pillarR.position.set(4.95, 2.7, 0);

  const stripL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 4.8, 0.82), trimMat);
  stripL.position.set(-4.95, 2.6, 0);
  const stripR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 4.8, 0.82), trimMat);
  stripR.position.set(4.95, 2.6, 0);

  const arch = new THREE.Mesh(new THREE.BoxGeometry(10.65, 0.78, 0.85), pillarMat);
  arch.position.set(0, 5.3, 0);

  const archStrip = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.2, 0.9), trimMat);
  archStrip.position.set(0, 5.02, 0);

  const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.13, 12, 36), trimMat);
  ringOuter.position.set(0, 2.55, 0);

  const ringInner = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.08, 10, 32), trimMat);
  ringInner.position.set(0, 2.55, 0);

  const coreCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.44, 0), trimMat);
  coreCrystal.position.set(0, 4.65, 0);

  const curtain = new THREE.Mesh(new THREE.PlaneGeometry(9.2, 4.9), curtainMat);
  curtain.position.set(0, 2.45, 0);

  group.add(pillarL, pillarR, stripL, stripR, arch, archStrip, ringOuter, ringInner, coreCrystal, curtain);

  return {
    group,
    ringOuter,
    ringInner,
    coreCrystal,
    setGateColor: (hex: number) => {
      trimMat.color.setHex(hex);
      trimMat.emissive.setHex(hex);
      curtainMat.color.setHex(hex);
    },
  };
}

export function createCoinMesh(kit: RunnerAssetKit): THREE.Group {
  const group = new THREE.Group();
  const rim = new THREE.Mesh(kit.coinRimGeo, kit.coinGoldMat);
  const disc = new THREE.Mesh(kit.coinDiscGeo, kit.coinGoldMat);
  const nucleus = new THREE.Mesh(kit.coinCoreGeo, kit.coinCoreMat);
  const orbit = new THREE.Mesh(kit.coinOrbitGeo, kit.coinCoreMat);
  orbit.rotation.x = Math.PI / 3;
  orbit.rotation.y = Math.PI / 5;
  group.add(rim, disc, nucleus, orbit);
  return group;
}

export function createHealFlaskGroup(kit: RunnerAssetKit): THREE.Group {
  const group = new THREE.Group();
  const flask = new THREE.Mesh(kit.healFlaskGeo, kit.healGlassMat);
  flask.position.y = -0.32;
  const collar = new THREE.Mesh(kit.healCollarGeo, kit.healTrimMat);
  collar.position.y = 0.42;
  group.add(flask, collar);
  return group;
}

export function createTrackSegment(kit: RunnerAssetKit, segmentIndex: number): THREE.Group {
  const seg = new THREE.Group();

  // Main 3-lane track bed
  const bed = new THREE.Mesh(
    new THREE.PlaneGeometry(10.8, 32),
    new THREE.MeshStandardMaterial({ map: kit.trackTex, roughness: 0.82, metalness: 0.14 }),
  );
  bed.rotation.x = -Math.PI / 2;
  bed.receiveShadow = true;
  seg.add(bed);

  // Physical 3D steel rails on every lane (elevated slightly by 0.03 above bed)
  const railGeo = new THREE.BoxGeometry(0.11, 0.08, 32);
  for (const laneCenter of [-3.2, 0, 3.2]) {
    const railL = new THREE.Mesh(railGeo, kit.steelMat);
    railL.position.set(laneCenter - 0.65, 0.04, 0);
    const railR = new THREE.Mesh(railGeo, kit.steelMat);
    railR.position.set(laneCenter + 0.65, 0.04, 0);
    seg.add(railL, railR);
  }

  // Deep extended nocturnal ground plane (zero void clipping)
  const leftField = new THREE.Mesh(new THREE.PlaneGeometry(75, 32), kit.outerGroundMat);
  leftField.rotation.x = -Math.PI / 2;
  leftField.position.set(-42.9, -0.05, 0);
  const rightField = new THREE.Mesh(new THREE.PlaneGeometry(75, 32), kit.outerGroundMat);
  rightField.rotation.x = -Math.PI / 2;
  rightField.position.set(42.9, -0.05, 0);
  seg.add(leftField, rightField);

  // Viaduct side platform curbs + glowing emissive rails
  const curbL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.52, 32), kit.curbMat);
  curbL.position.set(-6.15, 0.26, 0);
  const curbR = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.52, 32), kit.curbMat);
  curbR.position.set(6.15, 0.26, 0);
  const stripL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 32), kit.platformTrimMat);
  stripL.position.set(-5.42, 0.54, 0);
  const stripR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 32), kit.platformTrimMat);
  stripR.position.set(5.42, 0.54, 0);
  seg.add(curbL, curbR, stripL, stripR);

  // Overhead sci-fi catenary arch every segment
  const archPostL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 6.2, 0.36), kit.darkSteelMat);
  archPostL.position.set(-6.35, 3.1, 0);
  const archPostR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 6.2, 0.36), kit.darkSteelMat);
  archPostR.position.set(6.35, 3.1, 0);
  const archSpan = new THREE.Mesh(new THREE.BoxGeometry(13.0, 0.34, 0.38), kit.darkSteelMat);
  archSpan.position.set(0, 6.1, 0);
  const archGlow = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.08, 0.42), kit.platformTrimMat);
  archGlow.position.set(0, 5.9, 0);
  seg.add(archPostL, archPostR, archSpan, archGlow);

  // Laboratory lamps along the platforms
  const lampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.9,
  });
  for (const zOff of [-10, 10]) {
    for (const side of [-1, 1]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 4.3, 8), kit.steelMat);
      pole.position.set(side * 6.3, 2.15, zOff);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.12), kit.steelMat);
      arm.position.set(side * 5.95, 4.2, zOff);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), lampBulbMat);
      bulb.position.set(side * 5.6, 4.06, zOff);
      seg.add(pole, arm, bulb);
    }
  }

  // Flanking Science City Towers & Glowing Bio-Domes for rich parallax skyline
  const leftHeight = 12 + ((segmentIndex * 7) % 14);
  const rightHeight = 14 + ((segmentIndex * 11) % 16);

  const towerL = new THREE.Mesh(new THREE.BoxGeometry(6.5, leftHeight, 8.5), kit.buildingMat);
  towerL.position.set(-13.5, leftHeight / 2 - 0.1, -6);
  const towerR = new THREE.Mesh(new THREE.BoxGeometry(7.0, rightHeight, 9.0), kit.buildingMat);
  towerR.position.set(14.0, rightHeight / 2 - 0.1, 5);
  seg.add(towerL, towerR);

  // Far backdrop skyline silhouettes
  const farHeightL = 20 + ((segmentIndex * 5) % 15);
  const farHeightR = 18 + ((segmentIndex * 9) % 18);
  const farL = new THREE.Mesh(new THREE.BoxGeometry(9, farHeightL, 11), kit.buildingMat);
  farL.position.set(-24, farHeightL / 2 - 0.1, 8);
  const farR = new THREE.Mesh(new THREE.BoxGeometry(9, farHeightR, 11), kit.buildingMat);
  farR.position.set(24, farHeightR / 2 - 0.1, -8);
  seg.add(farL, farR);

  // Geodesic Bio-Dome alternating sides
  const domeSide = segmentIndex % 2 === 0 ? -1 : 1;
  const dome = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.2, 1),
    kit.domeGlassMat,
  );
  dome.position.set(domeSide * 13.0, 0.4, domeSide === -1 ? 8 : -7);
  dome.scale.set(1.1, 0.72, 1.1);
  seg.add(dome);

  return seg;
}
