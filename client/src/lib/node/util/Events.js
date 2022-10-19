import { Identity } from "./Identity";

export class Events extends Identity {
	constructor (events = {}, { ...rest } = {}) {
		super({ ...rest })

		this.events = new Map();

		this.addObject(events);
	}

	/**
	 * Convenience variant of << .add >> that expects an array- or object-map, instead.
	 */
	addObject(obj) {
		let iter;
		if(Array.isArray(obj)) {
			iter = obj;
		} else if(typeof obj === "object") {
			iter = Object.entries(obj);
		}

		if(iter) {
			iter.forEach(([ key, listener ]) => {
				if(Array.isArray(listener)) {
					listener.forEach(listener => this.add(key, listener));
				} else {
					this.add(key, listener);
				}
			});
		}
	}

	/**
	 * Adds a @listener to a specific @event.
	 */
	add(event, listener) {
		if(!this.events.get(event)) {
			this.events.set(event, new Set());
		}

		if(typeof listener === "function") {
			this.events.get(event).add(listener);

			return true;
		}

		return false;
	}

	//TODO: Create a << .once >> method and realign internal paradigm to handle this (e.g. emission tracking/callbacks).
	// once() {}

	/**
	 * Alias for << .add >>
	 */
	on(event, listener) {
		return this.add(event, listener);
	}
	/**
	 * Removes a @listener from a specific @event.
	 */
	off(event, listener) {
		if(this.events.has(event)) {
			return this.events.get(event).delete(listener);
		}

		return false;
	}

	/**
	 * Remove a specific-@event.
	 */
	remove(event) {
		return this.events.delete(event);
	}
	/**
	 * A "clear" method that removes all events (and listeners).
	 */
	removeAll(event) {
		this.events.get(event).clear();

		return true;
	}

	/**
	 * Has this @event been registered?
	 */
	has(event) {
		return this.events.has(event);
	}
	/**
	 * Are there any listeners at all?
	 */
	isEmpty() {
		return this.events.size === 0;
	}

	/**
	 * Emit an event to any listeners and pass any arguments to them.
	 */
	emit(event, ...args) {
		let results = [];

		if(this.events.has(event)) {
			/**
			 * Evluate the optional listeners attached to the hyper-events.
			 */
			let pre = this.events.get("*") || [],
				post = this.events.get("**") || [];

			/**
			 * Evaluate any filters that exist for that @event
			 */
			for(let filter of pre) {
				let result = filter(event, ...args);

				/**
				 * If the filter returns false, then the event is cancelled.
				 */
				if(result === false) {
					return;
				}
			}

			/**
			 * Evaluate the listeners for that @event
			 */
			this.events.get(event).forEach(listener => {
				results.push(listener(...args));
			});

			/**
			 * Evaluate any effect functions that exist for that @event
			 */
			for(let effect of post) {
				effect(event, ...args);
			}
		}

		return results.length ? results : false;
	}

	/**
	 * Shallowly recreate the Event.
	 */
	copy() {
		const copy = new Events();

		copy.events = new Map(this.events);

		return copy;
	}
};

export default Events;