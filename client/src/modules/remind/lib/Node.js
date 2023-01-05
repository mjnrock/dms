import { Identity } from "./Identity";
import { Events } from "./Events";

export class Node extends Identity {
	constructor ({ state = {}, shared = {}, events = [], id, tokens, eventOpts = {} } = {}) {
		super({ id, tokens });

		/**
		 * When the Node needs to hold state for itself, use this property (at any visibility level needed).
		 */
		this.state = state;

		/**
		 * A key : value pairing system, where the key should represent a unique name for a component, and the value can be anything (though would usually be complex types (e.g. objects)).
		 */
		this.shared = {};

		/**
		 * A standard event emitting system; this should use the Events class.
		 */
		if(events instanceof Events) {
			this.events = events;
		} else {
			this.events = new Events(events, eventOpts);
		}

		for(let [ component, state ] of Object.entries(shared)) {
			this.set(component, state);
		}
	}

	__parseComponent(component) {
		if(component.includes(".")) {
			let tiers = component.split(".");
			let parent = this;

			try {
				for(let tier of tiers.slice(0, -1)) {
					parent = parent[ tier ];
				}
			} catch(e) {
				return;
			}

			let key = tiers[ tiers.length - 1 ];

			return {
				parent,
				key,
			};
		} else {
			return {
				parent: this.shared,
				key: component,
			};
		}
	}
	get(component) {
		if(component.includes(".")) {
			let { parent, key } = this.__parseComponent(component);

			return parent[ key ];
		} else {
			return this.shared[ component ];
		}
	}
	set(component, state) {
		if(component.includes(".")) {
			let { parent, key } = this.__parseComponent(component);

			let oldState = parent[ key ];

			parent[ key ] = state;

			let payload = {
				emitter: this,
				component,
				previous: oldState,
				current: state,
			};

			return payload;
		} else {
			let oldState = this.shared[ component ];

			this.shared[ component ] = state;

			let payload = {
				emitter: this,
				component,
				previous: oldState,
				current: state,
			};

			return payload;
		}
	}
	remove(component) {
		if(component.includes(".")) {
			let { parent, key } = this.__parseComponent(component);

			let oldState = parent[ key ];

			delete parent[ key ];

			let payload = {
				emitter: this,
				component,
				previous: oldState,
				current: !!parent[ component ] ? parent[ component ] : null,
			};

			return payload;
		} else {
			let oldState = this.shared[ component ];

			delete this.shared[ component ];

			let payload = {
				emitter: this,
				component,
				previous: oldState,
				current: !!this.shared[ component ] ? this.shared[ component ] : null,
			};

			return payload;
		}
	}

	/**
	 * A recursive serialization method that will invoke all child .toObject() methods, if they exist
	 * within the `shared` property.  Optionally, for you can pass an `Array<string>` of component names
	 * to only serialize those components, and *ignore* all others. 
	 * 
	 * FIXME: This method does not yet recursively serialize the `state` property.
	 */
	toObject({ components = [] } = {}) {
		let obj = {
			id: this.id,
			state: typeof this.state !== "object" ? this.state : {},
			shared: {},
			events: this.events.toObject(),
		};

		if(typeof this.state === "object" && this.state.toObject) {
			obj.state = this.state.toObject();
		} else if(Array.isArray(this.state)) {
			for(let state of this.state) {
				if(state == null) {
					obj.state.push(null);
				} else if(typeof state === "object" && state.toObject) {
					obj.state.push(state.toObject());
				} else if(typeof state === "object") {
					obj.state.push({ ...state });
				} else if(typeof state === "function") {
					obj.state.push(state.toString());
				} else {
					obj.state.push(state);
				}
			}
		} else if(typeof this.state === "object") {
			for(let [ component, state ] of Object.entries(this.state)) {
				if(components.length && !components.includes(component)) {
					continue;
				}

				if(state == null) {
					state = null;
				} else if(typeof state === "object" && state.toObject) {
					state = state.toObject();
				} else if(typeof state === "object") {
					state = { ...state };
				} else if(typeof state === "function") {
					state = state.toString();
				}

				obj.state[ component ] = state;
			}
		} else if(typeof this.state === "function") {
			obj.state = this.state.toString();
		}

		for(let [ component, state ] of Object.entries(this.shared)) {
			if(components.length && !components.includes(component)) {
				continue;
			}

			if(state == null) {
				state = null;
			} else if(typeof state === "object" && state.toObject) {
				state = state.toObject();
			} else if(typeof state === "object") {
				state = { ...state };
			} else if(typeof state === "function") {
				state = state.toString();
			}

			obj.shared[ component ] = state;
		}

		return obj;
	}
	toJson() {
		return JSON.stringify(this.toObject());
	}
	toString() {
		return this.toJson();
	}
};

export default Node;