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

	constructor ({ type, state, reducers = [], sharedReducers = {}, events = {}, alias, meta = {}, id, tags = [] } = {}) {
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
		 * A public state management repository, for use in downstream modules (e.g. state, Tag, Form).
		 */
		this.shared = new Map();
		/**
		 * Uses the set hook to assign this into .shared::"state"
		 */
		this.state = state;

		/**
		 * This should be an array to allow for the same reducer to be used multiple times.
		 */
		this.reducers = new Map();
		this.addReducers(reducers);
		this.addSharedReducers(sharedReducers);

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

		/**
		 * A default event binding that allows a call to @update to RPC the update reducer
		 */
		this.events.add("@update", (...args) => this.update(...args));
	}

	get state() {
		return this.shared.get("state");
	}
	set state(state) {
		this.shared.set("state", state);
	}
	current(module, value) {
		if(value !== void 0) {
			this.shared.set(module, value);
		}

		return this.shared.get(module);
	}

	addSharedReducer(module, reducer) {
		if(typeof reducer === "function") {
			let reducers = this.reducers.get(module) || [];

			if(!reducers.includes(reducer)) {
				reducers.push(reducer);
			}

			this.reducers.set(module, reducers);

			return true;
		}

		return false;
	}
	addSharedReducers(module, ...reducers) {
		if(typeof module === "object") {
			for(let [ mod, reducers ] of Object.entries(module)) {
				if(Array.isArray(reducers)) {
					this.addSharedReducers(mod, ...reducers);
				} else {
					this.addSharedReducer(mod, reducers);
				}
			}

			return true;
		}

		let result = false;

		for(let reducer of reducers) {
			result = this.addSharedReducer(module, reducer) || result;
		}

		return result;
	}
	removeSharedReducer(module, reducer) {
		if(typeof reducer === "function") {
			let reducers = this.reducers.get(module) || [];

			let index = reducers.indexOf(reducer);

			if(index !== -1) {
				reducers.splice(index, 1);

				this.reducers.set(module, reducers);

				return true;
			}
		}

		return false;
	}
	removeSharedReducers(module, ...reducers) {
		let result = false;

		for(let reducer of reducers) {
			result = this.removeSharedReducer(module, reducer) || result;
		}

		return result;
	}
	clearSharedReducers(module) {
		if(module === true) {
			this.reducers.clear();

			return true;
		}

		return this.reducers.delete(module);
	}

	addReducer(reducer) {
		return this.addSharedReducer("state", reducer);
	}
	addReducers(...reducers) {
		if(Array.isArray(reducers[ 0 ])) {
			reducers = reducers[ 0 ];
		}

		return this.addSharedReducers("state", ...reducers);
	}
	removeReducer(reducer) {
		return this.removeSharedReducer("state", reducer);
	}
	removeReducers(...reducers) {
		return this.removeSharedReducers("state", ...reducers);
	}

	get name() {
		return this.meta.alias ? `${ this.meta.alias }-${ this.id }` : this.id;
	}

	/**
	 * A generic event-emit function that can be used to trigger custom events, the
	 * result of which will be returned.
	 */
	emit(event, ...args) {
		if(event[ 0 ] === "@") {
			return this.sharedUpdate(event.slice(1), ...args);
		}

		let eventObject = { node: this, type: event, args };

		this.events.dispatch("*", eventObject);

		let result = this.events.dispatch(event, ...args);

		this.events.dispatch("**", { data: result, ...eventObject });

		return result;
	}

	sharedUpdate(module, ...args) {
		let reducers = this.reducers.get(module) || [];

		let next = this.shared.get(module),
			current = next;
		for(let reducer of reducers) {
			next = reducer({ node: this, current, next }, ...args);
		}

		this.shared.set(module, next);

		return next;
	}
	update(...args) {
		return this.sharedUpdate("state", ...args);
	}
}

export default Node;