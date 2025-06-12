import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Textures
const loader = new THREE.TextureLoader();

const doorAlphaTexture = loader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = loader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorColorTexture = loader.load("./textures/door/color.jpg");
const doorHeightTexture = loader.load("./textures/door/height.jpg");
const doorMetalnessTexture = loader.load("./textures/door/metalness.jpg");
const doorNormalTexture = loader.load("./textures/door/normal.jpg");
const doorroughnessTexture = loader.load("./textures/door/roughness.jpg");

const matcapTextture = loader.load("./textures/matcaps/3.png");
const grdientTexture = loader.load("./textures/gradient/3.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTextture.colorSpace = THREE.SRGBColorSpace;

// objects

// const material = new THREE.MeshBasicMaterial();

// const material = new THREE.MeshNormalMaterial();

// const material = new THREE.MeshMatcapMaterial();
// material.map = doorColorTexture;
// material.matcap = matcapTextture;

// const material = new THREE.MeshStandardMaterial();
// gui.add(material, "metalness").min(0).max(1).step(0.0001);
// gui.add(material, "roughness").min(0).max(1).step(0.0001);
// gui.add(material, "aoMapIntensity").min(0).max(3).step(0.0001);

// material.metalness = 1;
// material.roughness = 1;

// material.map = doorColorTexture;
// // 陰影材質
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// // 凹凸、立體感材質：只模擬效果不影響 mesh 模型
// material.normalMap = doorNormalTexture;
// material.normalScale.set(1, 1);
// // 金屬反光材質
// material.metalnessMap = doorMetalnessTexture;
// // 粗糙、顆粒材質
// material.roughnessMap = doorroughnessTexture;
// // 灰階：白顯示、黑隱藏
// // material.transparent = true;
// // material.alphaMap = doorAlphaTexture;

// // 立體材質：真的影響 mesh 模型，所以網格要夠多才能成型
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;

const material = new THREE.MeshPhysicalMaterial();
// material.map = doorColorTexture;
material.metalness = 1;
material.roughness = 0;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(1, 1);
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorroughnessTexture;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
// material.clearcoat = 1;
// material.clearcoatRoughness = 0.1;

// material.sheen = 1;
// material.sheenRoughness = 0;
// material.sheenColor.set(1, 1, 1);

// material.iridescence = 1;
// material.iridescenceThicknessRange = [100, 400];
// material.iridescenceIOR = 1;

material.transmission = 1;
material.ior = 1;
material.thickness = 1;

gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

gui.addColor(material, "sheenColor");
gui.add(material, "sheen").min(0).max(1).step(0.0001);
gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);

gui.add(material, "iridescence").min(0).max(1).step(0.0001);
gui.add(material, "iridescenceIOR").min(1).max(2.333).step(0.0001);
gui.add(material.iridescenceThicknessRange, 0).min(1).max(1000).step(1);
gui.add(material.iridescenceThicknessRange, 1).min(1).max(1000).step(1);

gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(2.333).step(0.0001);
gui.add(material, "thickness").min(1).max(10).step(0.0001);

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 200, 200), material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 100),
  material
);

scene.add(sphere, plane, torus);

sphere.position.x = -1.5;
torus.position.x = 1.5;

// lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);

// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// envireonment
const rgbeloader = new RGBELoader();
rgbeloader.load(
  "./textures/environmentMap/hayloft_4k.hdr",
  (envireonmentMap) => {
    console.log(envireonmentMap);

    envireonmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = envireonmentMap;
    scene.environment = envireonmentMap;
  }
);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  plane.rotation.x = 0.1 * elapsedTime;
  sphere.rotation.x = 0.1 * elapsedTime;
  torus.rotation.x = 0.1 * elapsedTime;

  plane.rotation.y = -0.15 * elapsedTime;
  sphere.rotation.y = -0.15 * elapsedTime;
  torus.rotation.y = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
