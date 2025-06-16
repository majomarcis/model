import { Scene, PerspectiveCamera, WebGLRenderer, Clock } from 'three';
import { Loader3DTiles } from 'three-loader-3dtiles';

const scene = new Scene();
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1e7);
camera.position.set(0, 0, 100);
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const clock = new Clock();

let tilesRuntime = null;

async function loadTileset() {
  const result = await Loader3DTiles.load({
    url: 'https://myworker.majomarcis.workers.dev/tileset.json',
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    },
    options: {
      dracoDecoderPath: 'https://cdn.jsdelivr.net/npm/three@0.137.0/examples/jsm/libs/draco/',
      // basisTranscoderPath môže zostať len ak potrebuješ Basis textúry
    }
  });
  scene.add(result.model);
  tilesRuntime = result.runtime;
}

function animate() {
  const dt = clock.getDelta();
  if (tilesRuntime) {
    tilesRuntime.update(dt, window.innerHeight, camera);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

loadTileset();
animate();

// Responzívne okno
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
