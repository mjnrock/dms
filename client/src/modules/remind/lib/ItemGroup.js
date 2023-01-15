import { Item } from "./Item";

export class ItemGroup extends Item {
	constructor ({ state, parent = null, children = [], ...rest } = {}) {
		super({ ...rest });

		this.state = state || {
			parent,
			children,
		};

		this.tokens.add(`@remind:item-group`);
	}

	toObject({ components = [] } = {}) {
		let obj = super.toObject({ components });

		obj.state.parent = this.state.parent ? `@${ this.state.parent.id }` : null;
		obj.state.children = this.state.children.map((item) => `@${ item.id }`);

		return obj;
	}
};

export default ItemGroup;