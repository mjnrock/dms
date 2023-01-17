import { Node } from "./Node";

export class Item extends Node {
	constructor ({ parent = null, ...rest } = {}) {
		super({ ...rest });

		this.state = {
			...this.state,

			parent,
		};

		this.tokens.add(`@remind:item`);
	}

	static Factory(qty = 1, input = {}) {
		if(Array.isArray(qty)) {
			return qty.map(qty => this.Factory(1, qty)[ 0 ]);
		} else if(typeof qty === "object") {
			return this.Factory(1, qty);
		}

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