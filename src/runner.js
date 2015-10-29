var Runner = function(params) {
  params = params || {};

  this.scene = {};
  this.tickRate = params.tickRate || 48.0;

  var self = this;
  var interval = function() {
    var dt = 1000 / self.tickRate;
    self.tick(dt);
    setTimeout(interval, dt);
  };
  interval();
};

Runner.prototype = {
  attach: function(entity, component) {
    giveId(entity);
    giveId(component);

    if (this.scene[entity._id] === undefined) {
      this.scene[entity._id] = {
        entity: entity,
        components: [component]
      }
      return;
    }

    this.scene[entity._id].components.push(component);
  },

  dettach: function(entity, component) {
    var components = this.scene[entity._id].components;

    if (components === undefined) {
      throw new Error('entity with id ' + entity._id + ' not found');
    }

    if (component === undefined) {
      for (var i = 0; i < components.length; i++) {
        if (components[i].dispose !== undefined) {
          components[i].dispose();
        }
        delete this.scene[entity._id];
      }
      return;
    }

    var index = components.indexOf(component);

    if (index === -1) {
      throw new Error('component: ' + component + ' not found in entity: ' + entity);
    }

    if (component.dispose !== undefined) {
      component.dispose();
    }
    components.slice(index, 1);
  },

  tick: function() {
    this._traverse(function(c) {
      if (!c._started) {
        if (c.start !== undefined) {
          c.start();
        }
        c._started = true;
      }
      if (c.tick !== undefined) {
        c.tick();
      }
    });

    this._traverse(function(c) {
      if (c.lateTick !== undefined) {
        c.lateTick();
      }
    });
  },

  _traverse: function(callback) {
    for (var id in this.scene) {
      var components = this.scene[id].components;
      components.forEach(function(c) {
        callback(c);
      });
    }
  },

  dispose: function() {
    this._traverse(function(c) {
      if (c.dispose !== undefined) {
        c.dispose();
      }
    });
  }
};

var guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var giveId = function(obj) {
  if (obj._id === undefined) {
    obj._id = guid();
  }
};

module.exports = Runner;