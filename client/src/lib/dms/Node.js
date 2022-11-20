import { Identity } from "./util/Identity.js";
import { Events } from "./util/Events.js";

export const EnumNodeType = {
	/**
	 * Can be used to store any type of data.
	*/
	DATA: "data",
	/**
	 * Can be used to a function for execution when invoked.
	 */
	FUNCTION: "function",
};

export class Node extends Identity {
	static Type = EnumNodeType;

	constructor ({ type, state, reducers = [], events = {}, alias, meta = {}, id, tags = [] } = {}) {
		super({ id, tags });

		if(!type) {
			if(typeof state === "function") {
				type = EnumNodeType.FUNCTION;
			} else {
				type = EnumNodeType.DATA;
			}
		} else {
			this.type = type;
		}

		/**
		 * Can be any value
		 */
		this.state = state;
		/**
		 * This should be an array to allow for the same reducer to be used multiple times.
		 */
		this.reducers = Array.from(reducers);

		/**
		 * A generic event system for the node, that can be used to listen for changes to the node, or to trigger custom events.
		 */
		this.events = new Events(events);

		/**
		 * A common repository to store anything not covered by the other properties.
		 */
		this.meta = {
			...meta,
			
			alias,
			timestamp: Date.now(),
		};
	}

	get name() {
		return this.meta.alias ? `${ this.meta.alias }-${ this.id }` : this.id;
	}

	emit(event, ...args) {
		let baseArgs = { node: this, type: event };

		this.events.dispatch("*", { args, ...baseArgs });

		let result = this.events.dispatch(event, ...args);

		this.events.dispatch("**", { data: result, ...baseArgs });

		return result;
	}

	run(...args) {
		let baseArgs = { node: this, type: "@update" };

		this.events.dispatch("*", { args, ...baseArgs });

		let result = this.state;
		if(this.type === EnumNodeType.FUNCTION) {
			result = result(...args);
		} else {
			for(let reducer of this.reducers) {
				result = reducer(result, ...args);
			}

			this.state = result;
		}

		this.events.dispatch("**", { state: result, ...baseArgs });

		return result;
	}
}

export default Node;