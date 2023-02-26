import { Identity } from "./Identity";
import { Events } from "./Events";

/**
 * NOTE: An important framing to keep in mind is that *all* event invocation is done through the `System` classes, *not* internally.
 * All methods within the Node class are solely a convenience-API for the `System` developers.
 */
export class Node extends Identity {
	static Token = `#remind:node`;
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

		this.tokens.add(Node.Token);
	}

	/**
	 * A simple helper-function that parses a @component into a @parent and @key.
	 * This is used in the namespace traversal functionality.
	 */
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
	/**
	 * Get the state of a @component, allowing the use of namespaces (e.g. "foo.bar.baz").
	 */
	get(component) {
		if(component.includes(".")) {
			let { parent, key } = this.__parseComponent(component);

			return parent[ key ];
		} else {
			return this.shared[ component ];
		}
	}
	/**
	 * When a @component is set, the @state is set to the @component, and a payload is returned.
	 * The payload is an object with the following properties:
	 * - emitter: The Node instance that emitted the event.
	 * - component: The component (key) that was set.
	 * - previous: The previous state of the component.
	 * - current: The current state of the component.
	 */
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
	/**
	 * Identical to set, but merges the @state with the existing state of the @component.
	 * When a @component is set, the @state is merged to the @component, and a payload is returned.
	 * The payload is an object with the following properties:
	 * - emitter: The Node instance that emitted the event.
	 * - component: The component (key) that was set.
	 * - previous: The previous state of the component.
	 * - current: The current state of the component.
	 */
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
	/**
	 * Invoke `delete` on the @component, and return a payload.
	 * The payload is an object with the following properties:
	 * - emitter: The Node instance that emitted the event.
	 * - component: The component (key) that was set.
	 * - previous: The previous state of the component.
	 * - current: The current state of the component.
	 */
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

	static ToObject(node) {
		return {
			...Identity.ToObject(node),
			events: Events.ToObject(node.events),
			state: { ...node.state },
			shared: { ...node.shared },
		};
	}
};

export default Node;