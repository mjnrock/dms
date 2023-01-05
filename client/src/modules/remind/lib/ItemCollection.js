import { Item } from "./Item";

export class ItemCollection extends Item {
	constructor ({ register = [], factory = {}, systems = {}, components = {}, jsx = {}, state = {}, ...rest } = {}) {
		super({ ...rest });

		this.state = {
			registry: new Map(),
			factory: {
				...factory,
			},
			systems: {
				...systems,
			},
			components: {
				...components,
			},

			/* Allow for an optional additional JSX component factory */
			jsx: {
				...jsx,
			},

			...state,
		};

		for(let item of register) {
			this.state.registry.set(item.id, item);
		}
	}

	getRegistry(asArray = false) {
		if(asArray) {
			return Array.from(this.state.registry.values());
		}

		return Object.fromEntries(this.state.registry.entries());
	}
};

export default ItemCollection;