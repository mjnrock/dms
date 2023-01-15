import { dispatch } from "../ASystem";

export const Item = {
	removeComponent(item, component) {
		delete item.shared[ component ];

		dispatch(item, "update", item.shared);

		return item;
	},
};

export default Item;