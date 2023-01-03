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
		this.events = new Events(events, eventOpts);

		for(let [ component, state ] of Object.entries(shared)) {
			this.set(component, state);
		}
	}

	get(component) {
		return this.shared[ component ];
	}
	set(component, state) {
		let oldState = this.shared[ component ];

		this.shared[ component ] = state;

		return {
			component,
			previous: oldState,
			current: state,
		};
	}
	remove(component) {
		delete this.shared[ component ];

		return !!this.shared[ component ];
	}

	/**
	 * A recursive serialization method that will invoke all child .toObject() methods, if they exist
	 * within the `shared` property.  Optionally, for you can pass an `Array<string>` of component names
	 * to only serialize those components, and *ignore* all others. 
	 */
	toObject({ components = [] } = {}) {
		let obj = {
			id: this.id,
			state: this.state,
			shared: {},
			events: this.events.toObject(),
		};

		for(let [ component, state ] of Object.entries(this.shared)) {
			if(components.length && !components.includes(component)) {
				continue;
			}

			if(state == null) {
				state = null;
			}

			if(typeof state === "object" && state.toObject) {
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