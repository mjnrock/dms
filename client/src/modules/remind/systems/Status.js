import { dispatch } from "./ASystem";

export const Status = {
	// V1
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

	// V2
	setCurrent(emitter, value) {
		if(emitter.shared.status.options.includes(value)) {
			emitter.shared.status.current = value;

			dispatch(emitter, "update", emitter.shared.status.current);

			return emitter;
		}

		return false;
	},
	setOptions(emitter, value) {
		if(Array.isArray(value)) {
			emitter.shared.status.options = value;

			dispatch(emitter, "update", emitter.shared.status.options);

			return emitter;
		}

		return false;
	},
	addOption(emitter, value) {
		if(!emitter.shared.status.options.includes(value)) {
			emitter.shared.status.options.push(value);

			dispatch(emitter, "update", emitter.shared.status.options);

			return emitter;
		}

		return false;
	},
	removeOption(emitter, value) {
		if(emitter.shared.status.options.includes(value)) {
			emitter.shared.status.options.splice(emitter.shared.status.options.indexOf(value), 1);

			dispatch(emitter, "update", emitter.shared.status.options);

			return emitter;
		}

		return false;
	},
	hasOption(emitter, value) {
		return emitter.shared.status.options.includes(value);
	},
};

export default Status;