import { Item } from "./Item";
import { ItemGroup } from "./ItemGroup";

export class ItemCollection extends ItemGroup {
	constructor ({ register = [], registry, factory = {}, systems = {}, components = {}, jsx = {}, state = {}, ...rest } = {}) {
		super({ ...rest });

		this.state = {
			...this.state,

			registry: registry || new Map(),
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

		for(let [ key, value ] of Object.entries(this.state.factory)) {
			this.state.factory[ key ] = value.Factory.bind(value);
		}

		for(let item of register) {
			this.state.registry.set(item.id, item);
		}
		
		this.tokens.add(`#remind:item-collection`);
	}

	getRegistry(asArray = false) {
		if(asArray) {
			return Array.from(this.state.registry.values());
		}

		return Object.fromEntries(this.state.registry.entries());
	}

	toStateObject() {
		let obj = super.toStateObject();

		obj.registry = Array.from(this.state.registry.values()).map((item) => `@${ item.id }`);
		obj.factory = Object.fromEntries(Object.entries(this.state.factory).map(([ key, value ]) => [ key, (value.name || "").replace("bound ", "") ]));
		obj.systems = Object.fromEntries(Object.entries(this.state.systems).map(([ key, value ]) => [ key, (value.name || "").replace("bound ", "") ]));
		obj.components = Object.fromEntries(Object.entries(this.state.components).map(([ key, value ]) => [ key, (value.name || "").replace("bound ", "") ]));
		obj.jsx = Object.fromEntries(Object.entries(this.state.jsx).map(([ key, value ]) => [ key, (value.name || "").replace("bound ", "") ]));

		return obj;
	}
};

export default ItemCollection;