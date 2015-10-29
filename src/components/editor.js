var THREE = require('three');
var assert = require('assert');

var Editor = function() {
  var mousemove, click;
  var mouse = new THREE.Vector2();
  var coord;

  this.camera = null;
  this.blockModel = null;

  this.start = function() {
    assert(!!this.camera);

    var self = this;

    mousemove = function(e) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    click = function() {
      if (coord === null) {
        return;
      }
      console.log(Math.floor(coord.x), Math.floor(coord.y), Math.floor(coord.z));
      self.blockModel.set(Math.floor(coord.x), Math.floor(coord.y), Math.floor(coord.z), 1);
    };

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('click', click);
  };

  this.tick = function() {
    this._updateCoord();
  };

  this.dispose = function() {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('click', click);
  };

  this._updateCoord = function() {
    if (this.blockModel === null) {
      coord = null;
      return;
    }

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    var intersect = raycaster.intersectObject(this.blockModel.object, true);

    if (intersect.length === 0) {
      coord = null;
      return;
    }

    var point = intersect[0].point;
    var distance = intersect[0].distance;
    var pointOutside = point.clone()
      .sub(this.camera.position)
      .setLength(distance - 0.01)
      .add(this.camera.position);

    coord = this.blockModel.pointToCoord(pointOutside);
  };
};

module.exports = Editor;