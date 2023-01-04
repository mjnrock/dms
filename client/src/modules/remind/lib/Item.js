import { Node } from "./Node";

export class Item extends Node {
	constructor ({ ...rest } = {}) {
		super({ ...rest });

		this.shared.item = {};
	}

	static Factory(qty = 1, { ...rest } = {}) {
		const items = [];

		for (let i = 0; i < qty; i++) {
			items.push(new this({ ...rest }));
		}

		return items;
	}
};

export default Item;