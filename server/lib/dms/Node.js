import { v4 as uuid } from "uuid";

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

	constructor ({ type, state, reducers = [], sharedReducers = {}, events = {}, meta = {}, id, tags = [] } = {}) {
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
		 * A public location to manage named channels, where a channel represents a type of relation (e.g. "parent", "child", "next", "previous", "friend").
		 * This should be utilize analogously to events, in that there can be multiple members of that relation (channel).
		 */
		this.relations = new Map();

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

	addRelation(relation, node) {
		if(node instanceof Node) {
			let relations = this.relations.get(relation) || new Set();
			
			if(!relations.has(node)) {
				relations.add(node);
			}

			this.relations.set(relation, relations);

			return true;
		}

		return false;
	}
	addRelations(relation, ...nodes) {
		if(typeof relation === "object") {
			for(let [ rel, nodes ] of Object.entries(relation)) {
				if(Array.isArray(nodes)) {
					this.addRelations(rel, ...nodes);
				} else {
					this.addRelation(rel, nodes);
				}
			}

			return true;
		}

		let results = []

		for(let node of nodes) {
			results.push(this.addRelation(relation, node));
		}

		return results;
	}
	removeRelation(relation, node) {
		if(node instanceof Node) {
			let relations = this.relations.get(relation) || new Set();

			if(relations.has(node)) {
				return relations.delete(node);
			}
		}
		
		return false;
	}
	removeRelations(relation, ...nodes) {
		if(typeof relation === "object") {
			for(let [ rel, nodes ] of Object.entries(relation)) {
				if(Array.isArray(nodes)) {
					this.removeRelations(rel, ...nodes);
				} else {
					this.removeRelation(rel, nodes);
				}
			}

			return true;
		}

		let results = []

		for(let node of nodes) {
			results.push(this.removeRelation(relation, node));
		}

		return results;
	}

	/**
	 * This is a generic convenience method to allow a Node to leverage stored relation information of
	 * other Nodes.  In such cases, `relate` allows a passed function to receieve each Node in the relation
	 * as a parameter, alongside a customizable list of arguments.  As such, this can be used to perform
	 * any action on the related Nodes, for whatever paradigmatic reason.
	 * 
	 * NOTE: This should be considered analogous to the `map` method of an Array.
	 */
	relate(relation, fn, ...args) {
		let nodes = this.relations.get(relation) || new Set();

		let results = [];
		for(let node of nodes) {
			results.push(fn(node, ...args));
		}

		return results;
	}

	/**
	 * This doesn't have any defined purpose other than to be a convenience method for use
	 * when the Node paradigm requires signaling to another Node, for whatever reason.  This
	 * allows the Node to either send a signal directly to a specific Node, or to send a
	 * signal to all Nodes that are related to it under a given `.relation`.
	 * 
	 * NOTE: All invocations wil emit a "signal" event on the target Node/s; listen accordingly.
	 */
	signal(node, ...args) {
		if(node instanceof Node) {
			/* Signal a specified node directly */
			node.emit("signal", ...args);

			return true;
		} else if(typeof node === "string") {
			/* Signal all nodes of a relation -- internally selected via `.relations` */
			let nodes = this.relations.get(node) || new Set();

			for(let node of nodes) {
				node.emit("signal", ...args);
			}

			return true;
		}

		return false;
	}

	/**
	 * A quick convenience method to *remove all exisiting reducers* and add a trivial reducer that returns the value passed to it.
	 * If you don't want the latter behavior, then use `clearReducers` instead.
	 * 
	 * !NOTE: This exists because if a Node has no reducers, it will *always* return the **current* state, based on current `sharedUpdate` codebase.
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
	/**
	 * A convenience function for invoking state updates, specifically, as it is
	 * the most common use-case.
	 */
	update(...args) {
		return this.sharedUpdate("state", ...args);
	}
}

export default Node;