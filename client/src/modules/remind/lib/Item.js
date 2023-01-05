import { Node } from "./Node";

import ComponentItem from "../components/Item";
import ComponentStatus from "../components/Status";

export class Item extends Node {
	constructor ({ item = {}, status = {}, ...rest } = {}) {
		super({ ...rest });

		this.shared.item = ComponentItem.Create({ ...item });
		this.shared.status = ComponentStatus.Create({ ...status });
	}

	static Factory(qty = 1, { ...args } = {}) {
		const items = [];

		for(let i = 0; i < qty; i++) {
			items.push(new this({ ...args }));
		}

		return items;
	}
};

export default Item;