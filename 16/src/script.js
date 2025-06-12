import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Textures
const loader = new THREE.TextureLoader();

// door
const doorAlphaTexture = loader.load("/door/alpha.jpg");
const doorAmbientOcclusionTexture = loader.load("/door/ambientOcclusion.jpg");
const doorColorTexture = loader.load("/door/color.jpg");
const doorHeightTexture = loader.load("/door/height.jpg");
const doorMetalnessTexture = loader.load("/door/metalness.jpg");
const doorNormalTexture = loader.load("/door/normal.jpg");
const doorroughnessTexture = loader.load("/door/roughness.jpg");

// wall
const wallColorTexture = loader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg"
);
const wallARMTexture = loader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg"
);
const wallNormalTexture = loader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg"
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace; // 不懂

// roof

const roofColorTexture = loader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg"
);
const roofARMTexture = loader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg"
);
const roofNormalTexture = loader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg"
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

// bush
const bushColorTexture = loader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg"
);
const bushARMTexture = loader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg"
);
const bushNormalTexture = loader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg"
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

// floor
const floorAlphaTexture = loader.load("./floor/alpha.jpg");
const floorColorTexture = loader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg"
);
const floorARMTexture = loader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg"
);
const floorNormalTexture = loader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg"
);
const floorDisplacementTexture = loader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg"
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// grave
const graveColorTexture = loader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg"
);
const graveARMTexture = loader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg"
);
const graveNormalTexture = loader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg"
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    transparent: true,
    alphaMap: floorAlphaTexture,
    normalMap: floorNormalTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    aoMap: floorARMTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
    wireframe: false,
  })
);

floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;

scene.add(floor);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");

/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

const wall = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    normalMap: wallNormalTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
  })
);

wall.position.y = 2.5 / 2;

house.add(wall);

// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);

roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI / 4;

roof.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(roof.geometry.attributes.uv.array, 2)
);

house.add(roof);

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorroughnessTexture,
    normalMap: doorNormalTexture,
  })
);

door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.y = 2 / 2;
door.position.z = 2 + 0.01;

house.add(door);

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  map: bushColorTexture,
  aoMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(bush1.geometry.attributes.uv.array, 2)
);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(bush2.geometry.attributes.uv.array, 2)
);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(bush3.geometry.attributes.uv.array, 2)
);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(bush4.geometry.attributes.uv.array, 2)
);

house.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

const graveCounts = 50;

for (let i = 0; i < graveCounts; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(grave.geometry.attributes.uv.array, 2)
  );

  // min:4 , max:10
  const radius = 4 + Math.random() * 6;
  const angle = Math.random() * 2 * Math.PI;

  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  grave.castShadow = true;

  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 0.12);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);

// point light
const doorLight = new THREE.PointLight("#ff7d46", 2, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.setClearColor("#262837");
renderer.shadowMap.enabled = true;

// Shadows
ambientLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

wall.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.sin(ghost1Angle) * 5;
  ghost1.position.z = Math.cos(ghost1Angle) * 5;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = elapsedTime * 0.2;
  ghost2.position.x = Math.sin(ghost2Angle) * 4;
  ghost2.position.z = Math.cos(ghost2Angle) * 4;
  ghost2.position.y = Math.sin(elapsedTime * 2) + Math.sin(elapsedTime * 3);

  const ghost3Angle = -elapsedTime * 0.15;
  ghost3.position.x = Math.sin(ghost3Angle) * 7;
  ghost3.position.z = Math.cos(ghost3Angle) * 7;
  ghost3.position.y = Math.sin(elapsedTime * 5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
