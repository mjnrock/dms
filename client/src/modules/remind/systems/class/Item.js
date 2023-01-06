import { dispatch } from "./../ASystem";

export const Item = {
	update(emitter, data = {}) {
		emitter.shared.item = {
			...emitter.shared.item,
			...data,
		};

		dispatch(emitter, "update", emitter.shared.item);

		return emitter;
	},
	setContent(emitter, content) {
		emitter.shared.item.content = content;

		dispatch(emitter, "update", emitter.shared.item.content);

		return emitter;
	},
	setTitle(emitter, title) {
		emitter.shared.item.title = title;

		dispatch(emitter, "update", emitter.shared.item.title);

		return emitter;
	},
};

export default Item;