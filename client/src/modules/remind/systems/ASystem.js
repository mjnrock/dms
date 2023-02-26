/**
 * Even though you can do basically this with the @emitter
 * directly, using this creates a consistent API for all
 * systems to use.
 */
export const dispatch = (emitter, event, ...args) => {
	if(emitter.events) {
		emitter.events.emit(event, ...args);
	}
};

export default {
	dispatch,
};