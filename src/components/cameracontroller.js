var keycode = require('keycode');
var THREE = require('three');
var assert = require('assert');

var CameraController = function() {
  var mousehold = false;
  var lastX = 0;
  var lastY = 0;
  var rotation = new THREE.Euler();

  rotation.order = 'YXZ';

  var mousemove, mousedown, mouseup, mouseenter, mouseleave, keydown, keyup;

  this.camera = null;
  this.rotateSpeed = 0.01;
  this.target = new THREE.Vector3();
  this.distance = 100;
  this.zoomRate = 1.1;

  var clamp = function(value, min, max) {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  };

  this.updatePosition = function() {
    var position = this.target.clone()
      .add(new THREE.Vector3(0, 0, 1).applyEuler(rotation).setLength(this.distance));
    this.camera.position.copy(position);
    this.camera.lookAt(this.target);
  };

  this.start = function() {
    assert(!!this.camera);

    var self = this;
    mousemove = function(e) {
      if (mousehold) {
        rotation.y += (e.clientX - lastX) * self.rotateSpeed;
        rotation.x += (e.clientY - lastY) * self.rotateSpeed;
        rotation.x = clamp(rotation.x, -Math.PI / 2, Math.PI / 2);
        self.updatePosition();
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    mousedown = function() {
      mousehold = true;
    };

    mouseup = function() {
      mousehold = false;
    };

    mouseenter = function() {
      mousehold = false;
    };

    mouseleave = function() {
      mousehold = false;
    };

    keydown = function(e) {
      var key = keycode(e);
      if (key === '=') {
        self.distance /= self.zoomRate;
      }
      if (key === '-') {
        self.distance *= self.zoomRate;
      }
    };

    keyup = function(e) {
      var key = keycode(e);
    };

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mousedown', mousedown);
    window.addEventListener('mouseup', mouseup);
    window.addEventListener('mouseenter', mouseenter);
    window.addEventListener('mouseleave', mouseleave);
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
  };

  this.tick = function() {
    this.updatePosition();
  };

  this.dispose = function() {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mousedown', mousedown);
    window.removeEventListener('mouseup', mouseup);
    window.removeEventListener('mouseenter', mouseenter);
    window.removeEventListener('mouseleave', mouseleave);
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('keyup', keyup);
  };
};

module.exports = CameraController;