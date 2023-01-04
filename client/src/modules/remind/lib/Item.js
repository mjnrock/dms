import { Node } from "./Node";

export class Item extends Node {
	constructor ({ ...rest } = {}) {
		super({ ...rest });
	}
};

export default Item;