var ndarray = require('ndarray');
var mesher = require('../voxel/mesher');
var THREE = require('three');

var BlockModel = function() {
  this.dim = 16;
  this.chunks = {};
  this.object = null;
  this._dirty = false;
};

BlockModel.prototype = {
  start: function() {
    this.material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    this.updateMesh();
    // this.material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000
    // });
  },

  tick: function() {
    if (this._dirty) {
      this.updateMesh();
      this._dirty = false;
    }
  },

  set: function(x, y, z, b) {
    var chunk = this._getChunkForCoord(x, y, z);
    var origin = chunk.origin;
    chunk.map.set(x - origin.x, y - origin.y, z - origin.z, b);
    chunk._dirty = true;
    this._dirty = true;
  },

  _getChunkForCoord: function(x, y, z) {
    var x = Math.floor(x / this.dim) * this.dim;
    var y = Math.floor(y / this.dim) * this.dim;
    var z = Math.floor(z / this.dim) * this.dim;
    var id = [x, y, z].join(',');
    if (this.chunks[id] !== undefined) {
      return this.chunks[id];
    }

    return this.chunks[id] = {
      origin: new THREE.Vector3(x, y, z),
      map: ndarray([], [this.dim, this.dim, this.dim]),
      needsUpdate: false
    };
  },

  updateMesh: function() {
    for (var id in this.chunks) {
      var chunk = this.chunks[id];
      if (!chunk._dirty) {
        continue;
      }
      var map = chunk.map;
      var origin = chunk.origin;

      if (!!chunk.geometry) chunk.geometry.dispose();
      if (!!chunk.object) chunk.object.parent.remove(chunk.object);

      var result = mesher(map.data, map.shape);
      var geometry = new THREE.Geometry();
      geometry.vertices = result.vertices.map(function(v) {
        return new THREE.Vector3(v[0], v[1], v[2]);
      });
      geometry.faces = result.faces.map(function(f) {
        return new THREE.Face3(f[0], f[1], f[2]);
      })

      geometry.computeFaceNormals();

      var objMesh = new THREE.Mesh(geometry, this.material);
      this.object.add(objMesh);
      // this.object.add(new THREE.FaceNormalsHelper(objMesh));

      chunk.geometry = geometry;
      chunk.object = objMesh;
      objMesh.position.copy(chunk.origin);
      chunk._dirty = false;
    }
  },

  pointToCoord: function(point) {
    return point.clone();
  },

  dispose: function() {
    this.geometry.dispose();
    this.material.dispose();
  }
};

module.exports = BlockModel;