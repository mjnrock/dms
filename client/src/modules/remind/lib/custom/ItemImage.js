import { Item } from "../Item";

import ComponentImage from "../../components/Image";

export class ItemImage extends Item {
	constructor ({ state, ...rest } = {}) {
		super({ ...rest });

		ComponentImage.Attach(this, { ...(rest.shared || {}).image });

		this.tokens.add(`#remind:item-checklist`);
	}
};

export default ItemImage;