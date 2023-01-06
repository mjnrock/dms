import { Node } from "./Node";

import ComponentItem from "../components/Item";
import ComponentStatus from "../components/Status";
import ComponentRef from "../components/Ref";

export class Item extends Node {
	constructor ({ ...rest } = {}) {
		super({ ...rest });

		ComponentItem.Attach(this, { ...(rest.shared || {}).item });
		ComponentStatus.Attach(this, { ...(rest.shared || {}).status });
		ComponentRef.Attach(this, { ...(rest.shared || {}).ref });

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