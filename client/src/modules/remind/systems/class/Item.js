import { dispatch } from "../ASystem";
import { toObject } from "../ASystem";

export const Item = {
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

	$: {
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
	},
};

export default Item;