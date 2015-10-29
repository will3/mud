var THREE = require('three');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 200
);
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1D1D28);

document.body.appendChild(renderer.domElement);

var render = function() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

render();

var Runner = require('./runner');
var runner = new Runner();

var BlockModel = require('./components/blockmodel');
var blockModel = new BlockModel();
var object = new THREE.Object3D();
scene.add(object);
blockModel.object = object;
// blockModel.map.set(0, 0, 0, 1);
blockModel.set(0, 0, 0, 1);

runner.attach(scene, blockModel);

var CameraController = require('./components/cameracontroller');
var cameraController = new CameraController();
cameraController.camera = camera;
runner.attach(camera, cameraController);

var Editor = require('./components/editor');
var editor = new Editor();
editor.camera = camera;
editor.blockModel = blockModel;
runner.attach(scene, editor);

var light = new THREE.DirectionalLight(0xcccccc, 1.0);
light.position.set(0.3, 1, 0.5);
scene.add(light);

var ambient = new THREE.AmbientLight(0x666666);
scene.add(ambient);