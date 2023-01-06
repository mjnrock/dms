import { Node } from "./Node";

import ComponentItem from "../components/Item";
import ComponentStatus from "../components/Status";

export class Item extends Node {
	constructor ({ item = {}, status = {}, ...rest } = {}) {
		super({ ...rest });

		this.shared.item = ComponentItem.Create({ ...item });
		this.shared.status = ComponentStatus.Create({ ...status });

		//? Related to de/serialization testing
		// this.merge("shared.item", { content: "meowzzz" });
		// this.merge("shared.item", { ...(rest.shared || {}).item });
		// this.merge("shared.status", { ...(rest.shared || {}).status });
	}

	static Factory(qty = 1, input = {}) {
		const items = [];

		for(let i = 0; i < qty; i++) {
			if(typeof input === "function") {
				items.push(new this(input(i)));
			} else {
				items.push(new this(input));
			}
		}

		return items;
	}
	static Generate(input = {}) {
		return this.Factory(1, input)[ 0 ];
	}
};

export default Item;