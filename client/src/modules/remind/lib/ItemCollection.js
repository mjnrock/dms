import { Item } from "./Item";

export class ItemCollection extends Item {
	constructor ({ state = {}, ...rest } = {}) {
		super({ ...rest });

		this.state = {
			registry: {},
			factory: {},
			systems: {},
			components: {},

			...state,
		};
	}
};

export default ItemCollection;