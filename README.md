# EventManager.js

This is a simple JS library for implementing event dispatcher in objects that don't support the native one

Works in Node.js and browsers

## Usage
This library supports UMD (`EventManager.js`) and ES (`EventManager.module.js`) module systems:
```javascript
import EventManager from './EventManager.module.js'
// or
const EventManager = require('./EventManager')
```

Also this repo can be installed as NPM package: `npm i niteru/EventManager`. Then the module name is `eventmanager`:
```javascript
import EventManager from 'eventmanager'
// or
const EventManager = require('eventmanager')
```

## API
### Terminology
In examples on this page, the instance of EventManager called `EM`:
```javascript
var EM = new EventManager();
```

Example of creating a new class with EventManager methods:
```javascript
class AnotherClass extends EventManager {
	constructor () {
		super();
		this.on('created'); // dispatch event 'created'
	}
}
```

### ManagerEvent
This is the event that the handlers called with

#### Properties
- `type`: the name of dispatched event
- `data`: the data that the event was dispatched with
- `prevented`: is the event prevented. Can be changed

#### event.preventDefault(`value`)
Prevents default behaviour (or unprevents it if `value` is false)

### Options interface
The options object has three properties: `once`, `prevent` and `scope`
- `once`: specifies if the handler must be called once (if you saved a reference to options object, may be changed later so next call of the handler will call it and remove it)
- `prevent`: alias for `event.preventDefault(true)`
- `scope`: what scope should the handler be called with. Defaults to the current EventManager instance

### High-level methods
#### on(`<type: <type[.options]>[ ...]>`, `<handler>`, `[scope]`): `boolean`/`Object`
Calls `addEventListener` for specified events\
`.options` is modifiers which go to `options`
`scope` goes to `options` property `scope`\
Returns result of call or object (`{type: boolean}`) with results

**Example:**
```javascript
// calls handler for '__dispatchEvent__' only once and prevents this event only once
// and prevents removing listeners
let result = EM.on('__dispatchEvent__.once.prevent __removeListener__.prevent', console.log);
result;
/*
// All listeners are set successfully
{
	"__dispatchEvent__": true,
	"__removeListener__": true
}
*/
```

#### on(`<type: <type[.options]>[ ...]>`, `[data]`): `ManagerEvent`/`Object`
Calls `dispatchEvent` for specified events (options modifiers do nothing here)\
Returns result of call or object (`{type: ManagerEvent}`) with results

**Example:**
```javascript
let result = EM.on('test someEvent');
result;
/*
{
	"test": ManagerEvent,
	"someEvent": ManagerEvent,
}
*/
```

#### off(`<type: <type[.options]>[ ...]>`, `[handler]`): `boolean`/`Object`
Calls `removeEventListener` for specified events and handler\
Returns result of call or object (`{type: boolean}`) with results

### Low-level methods
#### addEventListener(`<type>`, `<handler>`, `[options]`): `boolean`
Adds handler for specified event type. Returns `true`/`false` if was successful/unsuccessful\
For `options` see [Options interface](#options-interface)

Also dispatches event `__addListener__` that can be prevented

#### removeEventListener(`<type>`, `[handler]`): `boolean`
Removes handler (or all handlers) of the specified event type\
Returns `true`/`false` if was successful/unsuccessful

If listener already exists, the method rewrites its options

Also dispatches event `__removeListener__` that can be prevented

#### hasEventListener(`<type>`, `<handler>`): `boolean`
Returns has the current instance the handler in specified event type

#### dispatchEvent(`<type>`, `[data]`): `ManagerEvent`
Dispatches specified event with data (available in `event.data`)

Also dispatches event `__dispatchEvent__` that can be prevented

#### dispose(): `void`
Removes all listeners from current instance

### Default events
These events can be prevented
- `__dispatchEvent__`: dispatched when another event is dispatched. `event.data` contains `event` property containing the dispatching event
- `__addLostener__`: dispatched when a listener is being added. `event.data` contains `type`, `handler` and `options`
- `__removeListener__`: dispatched when a listener is being removed. `event.data` contains `type` and `handler`

## License
MIT License (c) 2018
