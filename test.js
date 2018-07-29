const EventManager = require('./build/EventManager.js');

class testClass extends EventManager {
	constructor () {
		super();
	}
}

module.exports = new testClass();