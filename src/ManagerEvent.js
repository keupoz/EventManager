export default class ManagerEvent {
	constructor (type, data) {
		this.type = type;
		this.data = data;
		
		this.prevented = false;
	}
	
	preventDefault (value = true) {
		this.prevented = !!value;
	}
}