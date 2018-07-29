import ManagerEvent from './ManagerEvent.js'

export default class EventManager {
	constructor () {
		this.dispose();
	}
	
	_findEventListener (type, handler) {
		if (!this._listeners[type]) return null;
		return this._listeners[type].find(listener => listener.handler === handler);
	}
	
	dispatchEvent (type, data = {}) {
		let event = new ManagerEvent(type, data);
		
		if (type !== '__dispatchEvent__')
			if (!this.dispatchEvent('__dispatchEvent__', { event })) return event;
		
		if (this._listeners[type]) this._listeners[type].forEach(listener => {
			if (listener.options.prevent) event.preventDefault();
			if (listener.options.once) this.removeEventListener(type, listener.handler);
			listener.handler.call(listener.options.scope || this, event, this.removeEventListener.bind(this, type, listener.handler));
		});
		
		return event;
	}
	
	hasEventListener (type, handler) {
		return !!this._findEventListener(type, handler);
	}
	
	addEventListener (type, handler, options = {}) {
		if (!this.dispatchEvent('__addListener__', { type, handler, options })) return false;
		
		if (!this._listeners[type]) this._listeners[type] = new Array();
		
		let listener = this._findEventListener(type, handler);
		if (listener) listener.options = options;
		else this._listeners[type].push({ handler, options });
		
		return true;
	}
	
	removeEventListener (type, handler) {
		if (!this.dispatchEvent('__removeListener__', { type, handler })) return false;
		
		if (!this._listeners[type]) return true;
		
		if (!handler) {
			handler = type;
			if (typeof handler == 'function')
				for (let type in this._listeners)
					this.removeEventListener(type, handler);
			else if (typeof type == 'string')
				delete this._listeners[type];
		} else this._listeners[type] = this._listeners[type].filter(listener => listener.handler !== handler);
		
		return true;
	}
	
	on (type, handler, scope) {
		type = type.trim().replace(/\s+/g, ' ');
		
		if (type.includes(' ')) {
			let results = new Object();
			type.split(' ').forEach(type => results[type.split('.')[0]] = this.on(type, handler, scope));
			return results;
		}
		
		let options;
		[ type, ...options ] = type.split('.');
		
		if (typeof handler == 'function') {
			let once = false,
			    prevent = false;
			
			options.forEach(option => {
				switch (option) {
					case 'once': once = true; break;
					case 'prevent': prevent = true; break;
					default: console.warn('EventManager: Unknown option: ' + option);
				}
			});
			
			return this.addEventListener(type, handler, { once, prevent, scope });
		} else {
			let data = handler;
			return this.dispatchEvent(type, data);
		}
	}
	
	off (type, handler) {
		type = type.trim().replace(/\s+/g, ' ');
		
		if (type.includes(' ')) {
			let results = new Object();
			type.split(' ').forEach(type => results[type.split('.')[0]] = this.off(type, handler));
			return results;
		}
		
		type = type.split('.')[0];
		
		return this.removeEventListener(type, handler);
	}
	
	dispose () {
		this._listeners = new Object();
	}
}