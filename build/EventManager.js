(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.EventManager = factory());
}(this, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var toArray = function (arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  };

  var ManagerEvent = function () {
  	function ManagerEvent(type, data) {
  		classCallCheck(this, ManagerEvent);

  		this.type = type;
  		this.data = data;

  		this.prevented = false;
  	}

  	createClass(ManagerEvent, [{
  		key: "preventDefault",
  		value: function preventDefault() {
  			var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  			this.prevented = !!value;
  		}
  	}]);
  	return ManagerEvent;
  }();

  var EventManager = function () {
  	function EventManager() {
  		classCallCheck(this, EventManager);

  		this.dispose();
  	}

  	createClass(EventManager, [{
  		key: '_findEventListener',
  		value: function _findEventListener(type, handler) {
  			if (!this._listeners[type]) return null;
  			return this._listeners[type].find(function (listener) {
  				return listener.handler === handler;
  			});
  		}
  	}, {
  		key: 'dispatchEvent',
  		value: function dispatchEvent(type) {
  			var _this = this;

  			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  			var event = new ManagerEvent(type, data);

  			if (type !== '__dispatchEvent__') if (!this.dispatchEvent('__dispatchEvent__', { event: event })) return event;

  			if (this._listeners[type]) this._listeners[type].forEach(function (listener) {
  				if (listener.options.prevent) event.preventDefault();
  				if (listener.options.once) _this.removeEventListener(type, listener.handler);
  				listener.handler.call(listener.options.scope || _this, event, _this.removeEventListener.bind(_this, type, listener.handler));
  			});

  			return event;
  		}
  	}, {
  		key: 'hasEventListener',
  		value: function hasEventListener(type, handler) {
  			return !!this._findEventListener(type, handler);
  		}
  	}, {
  		key: 'addEventListener',
  		value: function addEventListener(type, handler) {
  			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  			if (!this.dispatchEvent('__addListener__', { type: type, handler: handler, options: options })) return false;

  			if (!this._listeners[type]) this._listeners[type] = new Array();

  			var listener = this._findEventListener(type, handler);
  			if (listener) listener.options = options;else this._listeners[type].push({ handler: handler, options: options });

  			return true;
  		}
  	}, {
  		key: 'removeEventListener',
  		value: function removeEventListener(type, handler) {
  			if (!this.dispatchEvent('__removeListener__', { type: type, handler: handler })) return false;

  			if (!this._listeners[type]) return true;

  			if (!handler) {
  				handler = type;
  				if (typeof handler == 'function') for (var _type in this._listeners) {
  					this.removeEventListener(_type, handler);
  				} else if (typeof type == 'string') delete this._listeners[type];
  			} else this._listeners[type] = this._listeners[type].filter(function (listener) {
  				return listener.handler !== handler;
  			});

  			return true;
  		}
  	}, {
  		key: 'on',
  		value: function on(type, handler, scope) {
  			var _this2 = this;

  			type = type.trim().replace(/\s+/g, ' ');

  			if (type.includes(' ')) {
  				var results = new Object();
  				type.split(' ').forEach(function (type) {
  					return results[type.split('.')[0]] = _this2.on(type, handler, scope);
  				});
  				return results;
  			}

  			var options = void 0;

  			var _type$split = type.split('.');

  			var _type$split2 = toArray(_type$split);

  			type = _type$split2[0];
  			options = _type$split2.slice(1);


  			if (typeof handler == 'function') {
  				var once = false,
  				    prevent = false;

  				options.forEach(function (option) {
  					switch (option) {
  						case 'once':
  							once = true;break;
  						case 'prevent':
  							prevent = true;break;
  						default:
  							console.warn('EventManager: Unknown option: ' + option);
  					}
  				});

  				return this.addEventListener(type, handler, { once: once, prevent: prevent, scope: scope });
  			} else {
  				var data = handler;
  				return this.dispatchEvent(type, data);
  			}
  		}
  	}, {
  		key: 'off',
  		value: function off(type, handler) {
  			var _this3 = this;

  			type = type.trim().replace(/\s+/g, ' ');

  			if (type.includes(' ')) {
  				var results = new Object();
  				type.split(' ').forEach(function (type) {
  					return results[type.split('.')[0]] = _this3.off(type, handler);
  				});
  				return results;
  			}

  			type = type.split('.')[0];

  			return this.removeEventListener(type, handler);
  		}
  	}, {
  		key: 'dispose',
  		value: function dispose() {
  			this._listeners = new Object();
  		}
  	}]);
  	return EventManager;
  }();

  var version = "1.0.0";

  EventManager.version = version;

  return EventManager;

})));
