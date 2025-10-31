import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import GUI from "lil-gui";

let followIndex = null;
const FOLLOW_SMOOTH = 0.08;

let scene, renderer;
let camera;
let info;
let grid;
let estrella,
  Planetas = [],
  Lunas = [];
let t0 = 0;
let accglobal = 0.001;
let timestamp;
let objetos = [];
let sombra = false;
let tierra;
let marte;
let sistema_solar_planetas = [
  {
    name: "mercurio",
    radio: 0.2,
    distance: 3,
    speed: 1,
    color: 0xffffff,
    f1: 1,
    f2: 1,
    texture: new THREE.TextureLoader().load("src/mercurymap.jpg"),
  },
  {
    name: "venus",
    radio: 0.3,
    distance: 4,
    speed: 0.8,
    color: 0xffffff,
    f1: 1,
    f2: 1,
    texture: new THREE.TextureLoader().load("src/venusmap.jpg"),
  },
  {
    name: "tierra",
    radio: 0.4,
    distance: 5,
    speed: 0.6,
    color: 0xffffff,
    f1: 1,
    f2: 1,
    texture: new THREE.TextureLoader().load("src/earthmap.jpg"),
  },
  {
    name: "marte",
    radio: 0.35,
    distance: 6,
    speed: 0.5,
    color: 0xffffff,
    f1: 1,
    f2: 1,
    texture: new THREE.TextureLoader().load("src/mars_1k_color.jpg"),
  },
  {
    name: "júpiter",
    radio: 1.2,
    distance: 8,
    speed: 0.4,
    color: 0xffffff,
    f1: 1,
    f2: 1,
    texture: new THREE.TextureLoader().load("src/jupitermap.jpg"),
  },
  {
    name: "saturno",
    radio: 1,
    distance: 11,
    speed: 0.3,
    color: 0xffffff,
    f1: 1,
    f2: 1,
    texture: new THREE.TextureLoader().load("src/saturnmap.jpg"),
  },
  {
    name: "urano",
    radio: 0.5,
    distance: 13,
    speed: 0.2,
    color: 0xffffff,
    f1: 1,
    f2: 1,
    texture: new THREE.TextureLoader().load("src/uranusmap.jpg"),
  },
  {
    name: "neptuno",
    radio: 0.45,
    distance: 15,
    speed: 0.1,
    color: 0xffffff,
    f1: 1,
    f2: 1,
    texture: new THREE.TextureLoader().load("src/neptunemap.jpg"),
  },
];

let lunas = [];
let sol;
/*
  Planeta(0.2, 3, 2, 0x00ff00, 1.0, 1);
  Planeta(0.3, 4, 1.8, 0xad2f17, 1.0, 1.0);
  Planeta(0.4, 5, 1.6, 0x60a852, 1.0, 1.0);
  Planeta(0.35, 6, 0.5, 0xa4b2a1, 1.0, 1.0);
  Planeta(1.2, 8, 0.4, 0xf783e2, 1.0, 1.0);
  Planeta(1, 11, 0.3, 0x00ff6d, 1.0, 1.0);
  Planeta(0.5, 13, 0.2, 0x9500ff, 1.0, 1.0);
  Planeta(0.45, 15, 0.1, 0xfff0, 1.0, 1.0);
*/

//Esfera(scene, 0, 0, 10, 2, 40, 40, 0xffffff, 0.1, tx1, txb1, txspec1);
init();
animationLoop();
const controls = new OrbitControls(camera, renderer.domElement);

function init() {
  info = document.createElement("div");
  info.style.position = "absolute";
  info.style.top = "30px";
  info.style.width = "100%";
  info.style.textAlign = "center";
  info.style.color = "#fff";
  info.style.fontWeight = "bold";
  info.style.backgroundColor = "transparent";
  info.style.zIndex = "1";
  info.style.fontFamily = "Monospace";
  info.innerHTML = "three.js - sol y planetas";
  document.body.appendChild(info);

  //Defino cámara
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, -25, 15);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let camcontrols = new OrbitControls(camera, renderer.domElement);

  sol = Estrella(2, 0xffe580);
  const Lsol = new THREE.PointLight(0xfff5cc, 1, 200); // color, intensidad, alcance
  Lsol.position.set(0, 0, 0); // justo en el Sol
  scene.add(Lsol);

  const Lamb = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(Lamb);

  for (let planeta = 0; planeta < sistema_solar_planetas.length; planeta++) {
    Planeta(
      sistema_solar_planetas[planeta].radio,
      sistema_solar_planetas[planeta].distance,
      sistema_solar_planetas[planeta].speed,
      sistema_solar_planetas[planeta].color,
      1,
      1,
      sistema_solar_planetas[planeta].texture
    );
  }

  //Luna(planeta, radio, dist, vel, col, angle)
  Luna(
    Planetas[2],
    0.04,
    0.5,
    1.5,
    0xffffff,
    Math.PI / 2,
    new THREE.TextureLoader().load("src/moon.jpeg")
  );

  Luna(
    Planetas[7],
    0.04,
    0.5,
    1.5,
    0xffffff,
    Math.PI / 2,
    new THREE.TextureLoader().load("src/moon.jpeg")
  );

  Luna(
    Planetas[5],
    0.04,
    1,
    1.5,
    0xffffff,
    Math.PI / 2,
    new THREE.TextureLoader().load("src/moon.jpeg")
  );

  Luna(
    Planetas[5],
    0.04,
    1,
    1.5,
    0xffffff,
    Math.PI / 4,
    new THREE.TextureLoader().load("src/moon.jpeg")
  );

  const gui = new GUI();
  const cameraFolder = gui.addFolder("Seguir planeta");

  const planetNames = sistema_solar_planetas.map((p) => p.name);

  const cameraParams = { planeta: "Ninguno" };

  // Control para seleccionar planeta
  cameraFolder
    .add(cameraParams, "planeta", ["Ninguno", ...planetNames])
    .name("Planeta")
    .onChange((value) => {
      if (value === "Ninguno") {
        goDefault();
      } else {
        const i = planetNames.indexOf(value);
        focusPlanetFollow(i);
      }
    });

  cameraFolder.open();

  //Inicio tiempo
  t0 = Date.now();
  //EsferaChild(objetos[0],3.0,0,0,0.8,10,10, 0x00ff00);
}

function focusPlanetFollow(i) {
  followIndex = i;
  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = true;
}

function goDefault() {
  followIndex = null;
  controls.enableRotate = true;
  controls.enablePan = true;
  controls.enableZoom = true;
  camera.position.set(0, -25, 15); // posición inicial
  controls.target.set(0, 0, 0);
  controls.update();
}

function updateCameraFollow() {
  if (followIndex === null) return;

  const planet = Planetas[followIndex];
  const planetPos = new THREE.Vector3();
  planet.getWorldPosition(planetPos);

  const r = planet.userData.dist || 1.0;
  const dir = planetPos.clone().normalize();
  const up = new THREE.Vector3(0, 0, 1);
  let side = up.clone().cross(dir).normalize();
  if (side.lengthSq() < 1e-4) side.set(1, 0, 0);

  const desiredCam = planetPos
    .clone()
    .add(dir.clone().multiplyScalar(-r * 1))
    .add(side.clone().multiplyScalar(r * 0.5))
    .add(up.clone().multiplyScalar(r));

  camera.position.lerp(desiredCam, FOLLOW_SMOOTH);
  controls.target.lerp(planetPos, FOLLOW_SMOOTH);
  controls.update();
}

function Estrella(rad, col) {
  let geometry = new THREE.SphereBufferGeometry(rad, 16, 16);
  let material = new THREE.MeshBasicMaterial({ color: col });
  estrella = new THREE.Mesh(geometry, material);
  scene.add(estrella);
}

function Planeta(radio, dist, vel, col, f1, f2, texture = undefined) {
  let geom = new THREE.SphereGeometry(radio, 10, 10);
  let mat = new THREE.MeshPhongMaterial({ color: col });
  let planeta = new THREE.Mesh(geom, mat);
  planeta.userData.dist = dist;
  planeta.userData.speed = vel;
  planeta.userData.f1 = f1;
  planeta.userData.f2 = f2;

  //Textura
  if (texture != undefined) {
    mat.map = texture;
  }

  Planetas.push(planeta);
  scene.add(planeta);

  //Dibuja trayectoria, con
  let curve = new THREE.EllipseCurve(
    0,
    0, // centro
    dist * f1,
    dist * f2 // radios elipse
  );
  //Crea geometría
  let points = curve.getPoints(50);
  let geome = new THREE.BufferGeometry().setFromPoints(points);
  let mate = new THREE.LineBasicMaterial({ color: 0xffffff });
  // Objeto
  let orbita = new THREE.Line(geome, mate);
  scene.add(orbita);
}

function Luna(planeta, radio, dist, vel, col, angle, texture = undefined) {
  var pivote = new THREE.Object3D();
  pivote.rotation.x = angle;
  planeta.add(pivote);
  var geom = new THREE.SphereGeometry(radio, 10, 10);
  var mat = new THREE.MeshBasicMaterial({ color: col });
  var luna = new THREE.Mesh(geom, mat);
  luna.userData.dist = dist;
  luna.userData.speed = vel;

  if (texture != undefined) {
    mat.map = texture;
  }

  Lunas.push(luna);
  pivote.add(luna);
}

//Bucle de animación
function animationLoop() {
  timestamp = (Date.now() - t0) * accglobal;

  requestAnimationFrame(animationLoop);

  //Modifica rotación de todos los objetos
  for (let object of Planetas) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed) *
      object.userData.f1 *
      object.userData.dist;
    object.position.y =
      Math.sin(timestamp * object.userData.speed) *
      object.userData.f2 *
      object.userData.dist;
  }

  for (let object of Lunas) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed) * object.userData.dist;
    object.position.y =
      Math.sin(timestamp * object.userData.speed) * object.userData.dist;
  }

  for (let planeta of Planetas) {
    planeta.rotation.z += 0.01;
  }

  updateCameraFollow();

  renderer.render(scene, camera);
}
