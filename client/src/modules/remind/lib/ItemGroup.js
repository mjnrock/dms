import { Item } from "./Item";

export class ItemGroup extends Item {
	constructor ({ state, parent = null, children = [], ...rest } = {}) {
		super({ ...rest });

		this.state = state || {
			parent,
			children,
		};
	}
};

export default ItemGroup;