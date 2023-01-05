import { dispatch } from "./ASystem";

export const Status = {
	update(emitter, value) {
		emitter.shared.status.complete = value;

		dispatch(emitter, "update", emitter.shared.complete);

		return emitter;
	},
	toggle(emitter) {
		emitter.shared.status.complete = !emitter.shared.status.complete.complete;

		dispatch(emitter, "update", emitter.shared.status.complete);

		return emitter;
	},
};

export default Status;