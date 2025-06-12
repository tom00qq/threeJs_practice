import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 400 });
gui.close();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

// galaxy generater
const parameter = {};
parameter.counts = 100000;
parameter.size = 0.01;
parameter.radius = 4;
parameter.branches = 5;
parameter.spin = 1;
parameter.randomness = 0.7;
parameter.randomnessPower = 3;
parameter.insideColor = "#002aff";
parameter.outsideColor = "#d704a2";

let geometry = null;
let materials = null;
let points = null;

const galaxyGenerater = () => {
  if (points != null) {
    geometry.dispose();
    materials.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  materials = new THREE.PointsMaterial({
    size: parameter.size,
    // color: parameter.color,
    vertexColors: true,
  });

  const vertices = new Float32Array(parameter.counts * 3);
  const colors = new Float32Array(parameter.counts * 3);

  const insideColor = new THREE.Color(parameter.insideColor);
  const outsideColor = new THREE.Color(parameter.outsideColor);

  for (let i = 0; i < parameter.counts; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameter.radius;

    const branchAngle =
      ((i % parameter.branches) / parameter.branches) * Math.PI * 2;

    const spinAngle = radius * parameter.spin;

    const randomX =
      Math.pow(Math.random(), parameter.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameter.randomness;

    const randomY =
      Math.pow(Math.random(), parameter.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameter.randomness;

    const randomZ =
      Math.pow(Math.random(), parameter.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameter.randomness;

    vertices[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    vertices[i3 + 1] = randomY;
    vertices[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / parameter.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  points = new THREE.Points(geometry, materials);

  scene.add(points);
};

galaxyGenerater(parameter);

// gui
gui
  .add(parameter, "counts")
  .min(0)
  .max(1000000)
  .step(10)
  .onFinishChange(() => {
    galaxyGenerater();
  });

gui
  .add(parameter, "size")
  .min(0)
  .max(0.1)
  .step(0.01)
  .onFinishChange(() => {
    galaxyGenerater();
  });

gui
  .add(parameter, "radius")
  .min(0)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    galaxyGenerater();
  });

gui
  .add(parameter, "branches")
  .min(0)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    galaxyGenerater();
  });

gui
  .add(parameter, "spin")
  .min(-5)
  .max(5)
  .step(0.01)
  .onFinishChange(() => {
    galaxyGenerater();
  });

gui
  .add(parameter, "randomness")
  .min(0)
  .max(1)
  .step(0.01)
  .onFinishChange(() => {
    galaxyGenerater();
  });

gui
  .add(parameter, "randomnessPower")
  .min(1)
  .max(5)
  .step(1)
  .onFinishChange(() => {
    galaxyGenerater();
  });

gui.addColor(parameter, "insideColor").onFinishChange(() => {
  galaxyGenerater();
});

gui.addColor(parameter, "outsideColor").onFinishChange(() => {
  galaxyGenerater();
});

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
camera.position.x = 6;
camera.position.y = 6;
camera.position.z = 6;
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

  points.rotation.y = elapsedTime * 0.5;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// 挑戰
// 1. 中間更密外部更散
// 2. 添加隨機星球材質
// 3. 多個銀河系，隨機角度

//重點
// 銀河系"拆解"成簡單的元素
// 1. 隨機分佈的頂點 ( BufferGeometry / PointMaterial / Points )
// 2. 頂點依照圓的半徑 radius 畫出一條直線分布在上 ( x = Math.random() * raduis )
// 3. 圍繞圓，產生複數的分支 branch，座標由 x,z 組成，並以弧度劃分 ( 畫出數線 0,1,2,3 ...，得知每 branch 個頂點一組共享相同弧度，組合 % 與 / 建立 0~1 再乘一圈弧度)
// 4. 分支產生彎曲 spin 效果，離圓點越遠越彎曲，加在弧度上 ( radius * spin )
// 5. 把分支上點的點添加隨機分佈性 randomness ( (Math.random() - 0.5) * randomness )
// 6. 添加分支上隨機分佈的密集度 randomnessPower，距離分支的更密集 ( 畫出半徑、分佈距離x,y軸，使用次方與小數點的特性來控制密度 Math.pow + Math.random )
// 7. 頂點顏色 verticeColor = true，使用 color lerp 做混色效果

// 數學
// 1. 餘數 % 可用作分組，0,1,2,3,4,5 搭配 % 3 可以是 0,1,2,0,1,2
// 2. 餘數 ％ 搭配除數可以建立平均分佈於 0~1 的值，0,1,2,0,1,2 搭配 / 3 可得 0,0.33,0.66,0,0.33,0.66
// 3. 平均分佈於 0~1 的值，搭配 Math.PI * 2 可以平均分配一圈的弧度

// 4. 指數用以建立遞增函數 = 一個彎曲向上得圖形 = Math.pow(Math.random(),指數)，random 數字越小，指數後離 1 越遠
