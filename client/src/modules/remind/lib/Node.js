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
		this.shared = shared;

		/**
		 * A standard event emitting system; this should use the Events class.
		 */
		if(events instanceof Events) {
			this.events = events;
		} else {
			this.events = new Events(events, eventOpts);
		}

		this.tokens.add(`#remind:node`);
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
	merge(component, state) {
		if(component.includes(".")) {
			let { parent, key } = this.__parseComponent(component);

			//? Related to de/serialization testing
			console.log(99999, parent, key)

			let oldState = parent[ key ];

			parent[ key ] = {
				...oldState,
				...state,
			};

			let payload = {
				emitter: this,
				component,
				previous: oldState,
				current: parent[ key ],
			};

			return payload;
		} else {
			let oldState = this.shared[ component ];

			this.shared[ component ] = {
				...oldState,
				...state,
			};

			let payload = {
				emitter: this,
				component,
				previous: oldState,
				current: this.shared[ component ],
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
};

export default Node;