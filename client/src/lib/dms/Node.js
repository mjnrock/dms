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

/**
 * As a premise, a Node assumes that all module information (including its own state) should be publicly accessible via `.shared`.
 * That being said, state-spoeific information is trapped via get/set hooks to make manipulating "state" a bit simpler, though it
 * is still stored in the `.shared` object.
 * 
 * For a given module in `.shared`, you can either update its value by utilizing the reduction paradigm, or you can update it
 * directly via the `.shared` object or through the set-overload for `.current`.
 * 
 * Because the reduction paradigm is generalized to the concept of a module, you should treat all methods that say "shared" in them
 * as the main method (in its scope) vis-a-vis a similarly-named method without the word "shared" in it.  These are (by default)
 * really just convenience methods to make "state" manipulation a bit easier.  In other words, "state" is a module as well, and because
 * in practice it's a very common key-paradigm, "state" given a bit of special treatment.
 */
export class Node extends Identity {
	/**
	 ** An abstraction into a variable, in case a descendant should override this character for some use-case.
	 */
	static RPCCharacter = "@";

	/**
	 ** An abstraction into a variable, in case a descendant should override this character for some use-case.
	*/
	static UpdateEvent = "update";

	/**
	 * A convenience declaration so that you can invoke the enumerator directly from the Node class.
	 */
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
		 * Without being overridden, this is a get/set trap for this.shared.get("state")
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
			/**
			 * By default, the timestamp will be the creation time, though it is meant to hold the most "relevant"
			 * timestamp for that node, based on whatever the Node is being used for.
			 */
			timestamp: Date.now(),

			...meta,

			/**
			 * An optional alias for the node
			 */
			alias: alias || meta.alias,
		};

		/**
		 * A default event binding that allows a call to @update to RPC the update reducer
		 */
		this.events.add("@update", (...args) => this.update(...args));
	}

	current(module, value) {
		/**
		 * SET
		 */
		if(value !== void 0) {
			this.shared.set(module, value);
		}

		/**
		 * GET
		 */
		return this.shared.get(module);
	}
	get state() {
		return this.shared.get("state");
	}
	set state(state) {
		this.shared.set("state", state);
	}

	get name() {
		return this.meta.alias ? `${ this.meta.alias }-${ this.id }` : this.id;
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

		if(this.reducers.has(module)) {
			let size = this.reducers.get(module).length;

			/**
			 * Create a 2-stage deletion process:
			 * 	1) If there are reducers, then set the value to an empty array.
			 *  2) If there are no reducers, then delete the key.
			 */
			if(size) {
				this.reducers.set(module, []);
			} else {
				this.reducers.delete(module);
			}

			return true;
		}

		return false;
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
	clearReducers() {
		return this.clearSharedReducers("state");
	}

	/**
	 * A quick convenience method to *remove all exisiting reducers* and add a trivial reducer that returns the value passed to it.
	 * If you don't want the latter behavior, then use `clearReducers` instead.
	 * 
	 * This exists because if a Node has no reducers, it will *always* return the **current* state.
	 */
	makeTrivial() {
		this.reducers.set("state", [
			({}, value) => value,
		]);

		return this;
	}

	/**
	 * A generic wrapper function for use in the event and reduction systems.  This
	 * allows for a standardized event-object to be passed, alongside any relevant
	 * data for that specific invocation.
	 */
	payload(event, { ...rest } = {}) {
		return {
			type: event,
			emitter: this,

			...rest,
		};
	}

	/**
	 * A generic event-emit function that can be used to trigger custom events, the
	 * result of which will be returned.
	 */
	emit(event, ...args) {
		/**
		 * Allow a command character to evaluate specific pathways, instead
		 * 
		 * NOTE: Will use the descendent's prototypal value, if overridden.
		 */
		if(event[ 0 ] === this.constructor.RPCCharacter) {
			return this.sharedUpdate(event.slice(1), ...args);
		}

		this.events.dispatch("*", this.payload(event), ...args);
		let result = this.events.dispatch(event, ...args);
		this.events.dispatch("**", this.payload(event, { data: result }), ...args);

		return result;
	}

	/**
	 * For the sake of explication, this is the main reduction entry point for any module, including state.
	 * As such, even `.update` calls this method.
	 */
	sharedUpdate(module, ...args) {
		let reducers = this.reducers.get(module) || [];

		let previous = this.state,
			next = this.shared.get(module);
		for(let reducer of reducers) {
			next = reducer(this.payload(module, { current: next }), ...args);
		}

		this.shared.set(module, next);

		/**
		 * Reserve the event "update" to broadcast changes to a module's state.
		 * 
		 * NOTE: Will use the descendent's prototypal value, if overridden.
		 */
		this.emit(this.constructor.UpdateEvent, { module, current: next, previous });

		return next;
	}
	update(...args) {
		return this.sharedUpdate("state", ...args);
	}
}

export default Node;