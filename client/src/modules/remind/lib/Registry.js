import { Node } from "./Node";

export class Registry extends Node {
	constructor ({ state = {}, ...rest } = {}) {
		super({ ...rest });

		this.state = new Map();

		if(state instanceof Map) {
			for(let [ key, entry ] of state.entries()) {
				this.setEntry(key, entry);
			}
		} else if(state instanceof Set) {
			for(let entry of state) {
				this.register(entry);
			}
		} else if(Array.isArray(state)) {
			for(let entry of state) {
				this.register(entry);
			}
		} else if(typeof state === "object") {
			for(let [ key, entry ] of Object.entries(state)) {
				this.setEntry(key, entry);
			}
		}
		
		this.tokens.add(`#remind:registry`);
	}

	/**
	 * Use this when you want to get the *literal* value of an entry.
	 */
	getEntry(key) {
		return this.state.get(key);
	}
	/**
	 * An unopinionated way to set an entry.
	 */
	setEntry(key, value) {
		this.state.set(key, value);
	}
	/**
	 * An unopinionated way to remove an entry.
	 */
	removeEntry(key) {
		return this.state.delete(key);
	}
	/**
	 * An unopinionated way to check if an entry exists.
	 */
	hasEntry(key) {
		return this.state.has(key);
	}
	/**
	 * Use this when you want to get the *resolved* value of an entry.
	 */
	findEntry(key) {
		let entry = this.getEntry(key);

		if(entry) {
			if(entry instanceof Node) {
				return entry;
			} else if(Array.isArray(entry)) {
				return entry.map(entry => this.findEntry(entry));
			} else if(typeof entry === "string") {
				return this.findEntry(entry);
			}
		}

		return false;
	}

	/**
	 * Only allows Node instances to be registered.
	 */
	register(entry) {
		if(typeof entry === "object" && entry instanceof Node) {
			this.setEntry(entry.id, entry);
		}

		return entry;
	}
	/**
	 * Only allows Node instances to be unregistered.
	 */
	unregister(entryOrKey) {
		if(typeof entryOrKey === "object" && entryOrKey instanceof Node) {
			return this.removeEntry(entryOrKey.id);
		} else {
			return this.removeEntry(entryOrKey);
		}
	}

	/**
	 * Only allows currently registered Node instances to be aliased.
	 * This will **not** register new entries.
	 */
	addAlias(entryOrKey, ...aliases) {
		let key = entryOrKey;
		if(typeof key === "object" && key instanceof Node) {
			key = entryOrKey.id;
		}

		for(let alias of aliases) {
			if(typeof alias === "string" && typeof key === "string") {
				this.setEntry(alias, key);
			}
		}

		return key;
	}
	/**
	 * A wrapper for removeEntry.
	 */
	removeAlias(...aliases) {
		for(let alias of aliases) {
			this.removeEntry(alias);
		}
	}

	/**
	 * Only allows currently registered Node instances to be pooled.
	 */
	setPool(key, ...entriesOrKeys) {
		let pool = [];

		for(let input of entriesOrKeys) {
			if(typeof input === "string" && this.hasEntry(input) && !pool.includes(input)) {
				pool.push(input);
			} else if(input instanceof Node && !pool.includes(input.id)) {
				pool.push(input.id);
			}
		};

		this.setEntry(key, pool);

		return [ ...pool ];
	}
	/**
	 * An alias for removeEntry.
	 */
	removePool(key) {
		return this.removeEntry(key);
	}

	/**
	 * This will **not** create a new pool, only add to existing ones.
	 * It will return `false` if the pool does not exist, otherwise it will return the pool.
	 */
	addToPool(key, ...entriesOrKeys) {
		let pool = this.getEntry(key);

		if(pool) {
			for(let input of entriesOrKeys) {
				if(typeof input === "string" && this.hasEntry(input) && !pool.includes(input)) {
					pool.push(input);
				} else if(input instanceof Node && !pool.includes(input.id)) {
					pool.push(input.id);
				}
			};

			this.setEntry(key, pool);

			return [ ...pool ];
		}

		return false;
	}
	/**
	 * This will return `false` if the pool does not exist, otherwise it will return the pool.
	 */
	removeFromPool(key, ...entriesOrKeys) {
		let pool = this.getEntry(key);

		if(pool) {
			for(let input of entriesOrKeys) {
				if(typeof input === "string" && pool.includes(input)) {
					pool.splice(pool.indexOf(input), 1);
				} else if(input instanceof Node && pool.includes(input.id)) {
					pool.splice(pool.indexOf(input.id), 1);
				}
			};

			this.setEntry(key, pool);

			return [ ...pool ];
		}

		return false;
	}
}

export default Node;