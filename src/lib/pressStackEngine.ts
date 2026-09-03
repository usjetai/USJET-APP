import * as THREE from "three";

export type PressVolume = {
  id: string;
  title: string;
  author: string;
  coverSrc?: string;
};

export type PressStackEngine = {
  hover: (index: number | null) => void;
  inspect: (index: number) => void;
  exitInspect: () => void;
  pick: (clientX: number, clientY: number) => number | null;
  dispose: () => void;
};

const CLOTH = [0xc4b676, 0xe8dcc8, 0x2f3d4a, 0x6f6d68, 0x6b2a42, 0xb08968, 0x1f3a55, 0x3d2a22, 0x4a5560, 0x8a7a58, 0x243044];
const INK = ["#18185e", "#2a2418", "#e8eef4", "#111111", "#f6e8ee", "#2b2118", "#f4eee3", "#f3e6d4", "#f8fafc", "#1a1612", "#dbe7f3"];

const W = 2.02;
const T = 0.2;
const D = 1.38;
const GAP = 0.012;
const STRIDE = T + GAP;

function makeSpineTexture(title: string, author: string, cloth: number, ink: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = `#${cloth.toString(16).padStart(6, "0")}`;
    ctx.fillRect(0, 0, 2048, 320);
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.fillRect(0, 0, 2048, 10);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 310, 2048, 10);
    ctx.fillStyle = ink;
    ctx.textBaseline = "middle";
    ctx.font = "500 36px Georgia, 'Times New Roman', serif";
    ctx.textAlign = "left";
    const byline = author.length > 22 ? `${author.slice(0, 20)}…` : author;
    ctx.fillText(byline, 56, 160);
    ctx.font = "600 68px Georgia, 'Times New Roman', serif";
    ctx.textAlign = "center";
    const label = title.length > 36 ? `${title.slice(0, 34)}…` : title;
    ctx.fillText(label, 1024, 160);
    ctx.font = "700 26px Inter, Helvetica, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("USJET", 1990, 160);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makePageTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#efe6d2";
    ctx.fillRect(0, 0, 64, 256);
    ctx.strokeStyle = "rgba(110,90,60,0.38)";
    for (let y = 2; y < 256; y += 2) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(64, y);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function mountPressStack(
  canvas: HTMLCanvasElement,
  volumes: readonly PressVolume[],
  handlers: {
    onHover: (index: number | null) => void;
    onPick: (index: number) => void;
  },
): PressStackEngine | null {
  const total = volumes.length;
  if (!total) return null;

  let disposed = false;
  let raf = 0;
  let hoverIndex: number | null = null;
  let inspectIndex: number | null = null;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x070707, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.08, 40);
  const stackH = (total - 1) * STRIDE;
  const camStack = new THREE.Vector3(0.55, 1.85, 4.15);
  const lookStack = new THREE.Vector3(0, 0.02, 0.04);
  const camDetail = new THREE.Vector3(0.55, 1.15, 3.15);
  const lookDetail = new THREE.Vector3(0, 0.08, 0.18);
  camera.position.copy(camStack);
  const look = lookStack.clone();
  camera.lookAt(look);

  scene.add(new THREE.HemisphereLight(0xf3efe6, 0x1a1a1a, 0.42));
  const key = new THREE.DirectionalLight(0xfff6ea, 1.55);
  key.position.set(1.8, 5.4, 3.6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.4;
  key.shadow.camera.far = 16;
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9eb4c8, 0.38);
  rim.position.set(-3.2, 1.4, 1.6);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 18),
    new THREE.MeshStandardMaterial({ color: 0x070707, roughness: 1, metalness: 0 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -stackH / 2 - T * 0.7;
  floor.receiveShadow = true;
  scene.add(floor);

  const pageTex = makePageTexture();
  const pageMat = new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.94, metalness: 0 });
  const loader = new THREE.TextureLoader();
  const root = new THREE.Group();
  scene.add(root);

  type Node = {
    group: THREE.Group;
    restY: number;
    restZ: number;
    restRotY: number;
    targetY: number;
    targetZ: number;
    targetRotX: number;
    targetRotY: number;
    targetOpacity: number;
    mats: THREE.Material[];
    textures: THREE.Texture[];
  };
  const nodes: Node[] = [];

  volumes.forEach((volume, i) => {
    const cloth = CLOTH[i % CLOTH.length];
    const ink = INK[i % INK.length];
    const spineTex = makeSpineTexture(volume.title, volume.author, cloth, ink);
    const clothMat = new THREE.MeshStandardMaterial({ color: cloth, roughness: 0.78, metalness: 0.03 });
    const coverMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.42, metalness: 0.04 });
    const spineMat = new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.58, metalness: 0.05 });
    const textures: THREE.Texture[] = [spineTex];

    if (volume.coverSrc) {
      loader.load(volume.coverSrc, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        coverMat.map = tex;
        coverMat.needsUpdate = true;
        textures.push(tex);
      });
    } else {
      coverMat.color.setHex(cloth);
    }

    const body = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), [
      pageMat,
      pageMat,
      coverMat,
      clothMat,
      spineMat,
      clothMat,
    ]);
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData.index = i;

    const group = new THREE.Group();
    const restY = ((total - 1) / 2 - i) * STRIDE;
    const restRotY = ((i % 5) - 2) * 0.012;
    group.position.set(((i % 3) - 1) * 0.012, restY, 0);
    group.rotation.y = restRotY;
    group.add(body);
    root.add(group);

    nodes.push({
      group,
      restY,
      restZ: 0,
      restRotY,
      targetY: restY,
      targetZ: 0,
      targetRotX: 0,
      targetRotY: restRotY,
      targetOpacity: 1,
      mats: [clothMat, coverMat, spineMat],
      textures,
    });
  });

  function layout() {
    nodes.forEach((node, i) => {
      if (inspectIndex == null) {
        const hot = hoverIndex === i;
        node.targetY = node.restY + (hot ? 0.012 : 0);
        node.targetZ = hot ? 0.22 : 0;
        node.targetRotX = 0;
        node.targetRotY = node.restRotY;
        node.targetOpacity = 1;
      } else if (i === inspectIndex) {
        node.targetY = 0.1;
        node.targetZ = 0.32;
        node.targetRotX = 0.62;
        node.targetRotY = 0.18;
        node.targetOpacity = 1;
      } else {
        node.targetY = node.restY;
        node.targetZ = -1.15;
        node.targetRotX = 0;
        node.targetRotY = node.restRotY;
        node.targetOpacity = 0;
      }
    });
  }

  function resize() {
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || 800;
    const h = parent?.clientHeight || 640;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function pick(clientX: number, clientY: number): number | null {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(root.children, true)[0];
    const idx = hit?.object.userData.index;
    return typeof idx === "number" ? idx : null;
  }

  function onMove(e: PointerEvent) {
    if (inspectIndex != null) return;
    const next = pick(e.clientX, e.clientY);
    if (next === hoverIndex) return;
    hoverIndex = next;
    handlers.onHover(next);
    layout();
    canvas.style.cursor = next == null ? "default" : "pointer";
  }

  function onClick(e: PointerEvent) {
    const next = pick(e.clientX, e.clientY);
    if (next == null) return;
    handlers.onPick(next);
  }

  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("click", onClick);

  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement ?? canvas);
  resize();
  layout();

  const camFrom = camera.position.clone();
  const camTo = camera.position.clone();
  const lookFrom = look.clone();
  const lookTo = look.clone();
  let camStart = 0;
  let camMs = 1;

  function playCam(toPos: THREE.Vector3, toLook: THREE.Vector3) {
    camFrom.copy(camera.position);
    lookFrom.copy(look);
    camTo.copy(toPos);
    lookTo.copy(toLook);
    camStart = performance.now();
    camMs = reduced ? 1 : 720;
  }

  function ease(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
  }

  function tick() {
    if (disposed) return;
    raf = window.requestAnimationFrame(tick);
    const k = reduced ? 1 : 0.14;
    nodes.forEach((node) => {
      node.group.position.y += (node.targetY - node.group.position.y) * k;
      node.group.position.z += (node.targetZ - node.group.position.z) * k;
      node.group.rotation.x += (node.targetRotX - node.group.rotation.x) * k;
      node.group.rotation.y += (node.targetRotY - node.group.rotation.y) * k;
      node.mats.forEach((m) => {
        m.transparent = node.targetOpacity < 0.98;
        m.opacity += (node.targetOpacity - m.opacity) * k;
        m.depthWrite = m.opacity > 0.2;
      });
    });
    const ct = Math.min(1, (performance.now() - camStart) / camMs);
    const ek = ease(ct);
    camera.position.lerpVectors(camFrom, camTo, ek);
    look.lerpVectors(lookFrom, lookTo, ek);
    camera.lookAt(look);
    renderer.render(scene, camera);
  }
  playCam(camStack, lookStack);
  tick();

  return {
    hover: (index) => {
      hoverIndex = index;
      layout();
    },
    inspect: (index) => {
      inspectIndex = index;
      hoverIndex = null;
      layout();
      playCam(camDetail, lookDetail);
    },
    exitInspect: () => {
      inspectIndex = null;
      layout();
      playCam(camStack, lookStack);
    },
    pick,
    dispose: () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("click", onClick);
      pageTex.dispose();
      nodes.forEach((node) => node.textures.forEach((t) => t.dispose()));
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m !== pageMat) m.dispose();
          });
        }
      });
      pageMat.dispose();
      renderer.dispose();
    },
  };
}
