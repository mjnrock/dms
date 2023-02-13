import { Item } from "./Item";

export class ItemGroup extends Item {
	static Token = `#remind:item-group`;

	constructor ({ state, parent = null, children = [], ...rest } = {}) {
		super({ ...rest });

		this.state = state || {
			parent,
			children,
		};

		this.tokens.add(ItemGroup.Token);
	}
};

export default ItemGroup;