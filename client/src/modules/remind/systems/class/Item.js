import { Item as ItemJS } from "./../../lib/Item";
import { dispatch } from "../ASystem";

export const Item = {
	Name: ItemJS.Token,

	toObject(emitter, base = false) {
		return {
			...(base || emitter.state),
			parent: emitter.state.parent ? `@${ emitter.state.parent.id }` : null,
		};
	},

	addComponent(item, key, component, args = {}) {
		item.shared[ key ] = component.Create(args);

		dispatch(item, "update", item.shared);

		return item;
	},
	removeComponent(item, component) {
		delete item.shared[ component ];

		dispatch(item, "update", item.shared);

		return item;
	},

	toState(item) {
		let obj = {
			...item.state,
		};

		if(item.state.parent !== null && typeof item.state.parent === "object") {
			obj.parent = `@${ item.state.parent.id }`;
		} else {
			obj.parent = null;
		}

		return obj;
	},
};

export default Item;