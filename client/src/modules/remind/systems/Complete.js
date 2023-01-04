import { dispatch } from "./ASystem";

export const Complete = {
	update(emitter, value) {
		emitter.shared.complete = value;

		dispatch(emitter, "update", emitter.shared.complete);

		return emitter;
	},
	toggle(emitter) {
		emitter.shared.complete = !emitter.shared.complete;

		dispatch(emitter, "update", emitter.shared.complete);

		return emitter;
	},
};

export default Complete;