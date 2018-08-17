var ManagerEvent = function ManagerEvent (type, data) {
	this.type = type;
	this.data = data;
		
	this.prevented = false;
};
	
ManagerEvent.prototype.preventDefault = function preventDefault (value) {
		if ( value === void 0 ) value = true;

	this.prevented = !!value;
};

var EventManager = function EventManager () {
	this.dispose();
};
	
EventManager.prototype._findEventListener = function _findEventListener (type, handler) {
	if (!this._listeners[type]) { return null; }
	return this._listeners[type].find(function (listener) { return listener.handler === handler; });
};
	
EventManager.prototype.dispatchEvent = function dispatchEvent (type, data) {
		var this$1 = this;
		if ( data === void 0 ) data = {};

	var event = new ManagerEvent(type, data);
		
	if (type !== '__dispatchEvent__')
		{ if (!this.dispatchEvent('__dispatchEvent__', { event: event })) { return event; } }
		
	if (this._listeners[type]) { this._listeners[type].forEach(function (listener) {
		if (listener.options.prevent) { event.preventDefault(); }
		if (listener.options.once) { this$1.removeEventListener(type, listener.handler); }
		listener.handler.call(listener.options.scope || this$1, event, this$1.removeEventListener.bind(this$1, type, listener.handler));
	}); }
		
	return event;
};
	
EventManager.prototype.hasEventListener = function hasEventListener (type, handler) {
	return !!this._findEventListener(type, handler);
};
	
EventManager.prototype.addEventListener = function addEventListener (type, handler, options) {
		if ( options === void 0 ) options = {};

	if (!this.dispatchEvent('__addListener__', { type: type, handler: handler, options: options })) { return false; }
		
	if (!this._listeners[type]) { this._listeners[type] = new Array(); }
		
	var listener = this._findEventListener(type, handler);
	if (listener) { listener.options = options; }
	else { this._listeners[type].push({ handler: handler, options: options }); }
		
	return true;
};
	
EventManager.prototype.removeEventListener = function removeEventListener (type, handler) {
		var this$1 = this;

	if (!this.dispatchEvent('__removeListener__', { type: type, handler: handler })) { return false; }
		
	if (!this._listeners[type]) { return true; }
		
	if (!handler) {
		handler = type;
		if (typeof handler == 'function')
			{ for (var type$1 in this$1._listeners)
				{ this$1.removeEventListener(type$1, handler); } }
		else if (typeof type == 'string')
			{ delete this._listeners[type]; }
	} else { this._listeners[type] = this._listeners[type].filter(function (listener) { return listener.handler !== handler; }); }
		
	return true;
};
	
EventManager.prototype.on = function on (type, handler, scope) {
		var this$1 = this;
		var assign;

	type = type.trim().replace(/\s+/g, ' ');
		
	if (type.includes(' ')) {
		var results = new Object();
		type.split(' ').forEach(function (type) { return results[type.split('.')[0]] = this$1.on(type, handler, scope); });
		return results;
	}
		
	var options;
	(assign = type.split('.'), type = assign[0], options = assign.slice(1));
		
	if (typeof handler == 'function') {
		var once = false,
			    prevent = false;
			
		options.forEach(function (option) {
			switch (option) {
				case 'once': once = true; break;
				case 'prevent': prevent = true; break;
				default: console.warn('EventManager: Unknown option: ' + option);
			}
		});
			
		return this.addEventListener(type, handler, { once: once, prevent: prevent, scope: scope });
	} else {
		var data = handler;
		return this.dispatchEvent(type, data);
	}
};
	
EventManager.prototype.off = function off (type, handler) {
		var this$1 = this;

	type = type.trim().replace(/\s+/g, ' ');
		
	if (type.includes(' ')) {
		var results = new Object();
		type.split(' ').forEach(function (type) { return results[type.split('.')[0]] = this$1.off(type, handler); });
		return results;
	}
		
	type = type.split('.')[0];
		
	return this.removeEventListener(type, handler);
};
	
EventManager.prototype.dispose = function dispose () {
	this._listeners = new Object();
};

var version = "1.0.1";

EventManager.version = version;

export default EventManager;
