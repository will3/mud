var Runner = require('../runner');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Runner', function() {

  it('should start component once', function() {
    var runner = new Runner();
    var component = {
      start: function() {}
    };
    var obj = {};
    var mock = sinon.mock(component);
    runner.attach(obj, component);
    mock.expects('start').once();

    runner.tick();
    runner.tick();

    mock.verify();
  });

  it('should tick component', function() {
    var runner = new Runner();
    var component = {
      tick: function() {}
    };
    var obj = {};
    var mock = sinon.mock(component);
    runner.attach(obj, component);

    mock.expects('tick');

    runner.tick();

    mock.verify();
  });

  it('should lateTick after all components ticked', function() {
    var runner = new Runner();

    var token = 0;
    var tickToken, lateTickToken;

    var component1 = {
      tick: function() {
        tickToken = token;
        token++;
      }
    };
    var component2 = {
      lateTick: function() {
        lateTickToken = token;
        token++;
      }
    };

    var obj = {};
    runner.attach(obj, component1);
    runner.attach(obj, component2);

    runner.tick();

    expect(lateTickToken).to.be.gt(tickToken);
  });

  describe('#dettach', function() {
    it('should dispose component when dettached', function() {
      var runner = new Runner();
      var obj = {};
      var component = {
        dispose: function() {}
      };
      runner.attach(obj, component);

      var mock = sinon.mock(component);
      mock.expects('dispose');

      runner.dettach(obj, component);

      mock.verify();
    });

    it('should dispose all components when no component is specified', function() {
      var runner = new Runner();
      var obj = {};
      var component1 = {
        dispose: function() {}
      };
      var component2 = {
        dispose: function() {}
      };
      var mock1 = sinon.mock(component1);
      var mock2 = sinon.mock(component2);
      runner.attach(obj, component1);
      runner.attach(obj, component2);

      mock1.expects('dispose');
      mock2.expects('dispose');

      runner.dettach(obj);

      mock1.verify();
      mock2.verify();
    });
  });

  describe('#dispose', function() {
    it('should dispose all components attached', function() {
      var runner = new Runner();
      var obj1 = {};
      var obj2 = {};
      var component1 = {
        dispose: function() {}
      };
      var component2 = {
        dispose: function() {}
      };
      var mock1 = sinon.mock(component1);
      var mock2 = sinon.mock(component2);
      runner.attach(obj1, component1);
      runner.attach(obj2, component2);

      mock1.expects('dispose');
      mock2.expects('dispose');

      runner.dispose();

      mock1.verify();
      mock2.verify();    });
  });

});