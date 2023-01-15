import { Item } from "./../Item";

import ComponentChecklist from "./../../components/Checklist";

export class ItemChecklist extends Item {
	constructor ({ state, ...rest } = {}) {
		super({ ...rest });

		ComponentChecklist.Attach(this, { ...(rest.shared || {}).checklist });

		this.tokens.add(`@remind:item-checklist`);
	}
};

export default ItemChecklist;