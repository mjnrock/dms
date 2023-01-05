import { dispatch } from "./../ASystem";

export const Item = {
	update(emitter, content) {
		emitter.shared.item.content = content;

		dispatch(emitter, "update", emitter.shared.item.content);

		return emitter;
	},
};

export default Item;