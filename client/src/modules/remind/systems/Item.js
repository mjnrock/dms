import { dispatch } from "./ASystem";

export const Item = {
	update(emitter, markdown) {
		emitter.shared.item.markdown = markdown;

		dispatch(emitter, "update", emitter.shared.item.markdown);

		return emitter;
	},
};

export default Item;