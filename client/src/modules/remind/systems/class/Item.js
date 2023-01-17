import { dispatch } from "../ASystem";

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
};

export default Item;