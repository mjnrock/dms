import { dispatch } from "./ASystem";

export const Markdown = {
	update(emitter, markdown) {
		emitter.state = markdown;

		dispatch(emitter, "update", emitter.state);

		return emitter;
	},
};

export default Markdown;