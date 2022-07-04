import { Identity } from "./Identity";

export class Component extends Identity {
	public name: string;

	constructor ({ name, id, tags, next, delta, receive }: { name: string, id?: string, tags?: string[], next?: (...args: any) => Component, delta?: (state: object, ...args: any) => Component, receive?: (...args: any) => void }) {
		super({ id, tags });

		this.name = name;

		/**
		 * Provide override assignments, if any
		 */
		if(typeof next === "function") {
			this.next = next;
		}
		if(typeof delta === "function") {
			this.delta = delta;
		}
		if(typeof receive === "function") {
			this.receive = receive;
		}
	}

	/**
	 * Allow the Component to be iterated over by its key-value pairs.
	 */
	[ Symbol.iterator ]() {
		return Object.entries(this)[ Symbol.iterator ]();
	}

	/**
	 * Determine the next state of the Component, or optinally
	 * return a new Component instance.
	 */
	next(...args: any): Component {
		return this;
	}
	/**
	 * A merge-equivalent of the next() method.
	 */
	delta(state: object = {}, ...args: any): Component {
		return this;
	}

	/**
	 * Receive data from the Entity.
	 */
	receive({ namespace, event, data, state, ...rest }: { namespace?: string, event: string, data: any, state: object }): void { }
};

export default Component;