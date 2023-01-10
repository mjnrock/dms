import { dispatch } from "./ASystem";

export const View = {
	update(emitter, data = {}) {
		emitter.state = {
			...emitter.state,
			...data,
		};

		dispatch(emitter, "update", emitter.state);

		return emitter;
	},
	setOffset(emitter, x, y) {
		emitter.state.offset = {
			x,
			y,
		};

		dispatch(emitter, "update", emitter.state.offset);

		return emitter;
	},
	setSize(emitter, width, height) {
		emitter.state.size = {
			width,
			height,
		};

		dispatch(emitter, "update", emitter.state.size);

		return emitter;
	},
	setPosition(emitter, x, y) {
		emitter.state.x = x;
		emitter.state.y = y;

		dispatch(emitter, "update", emitter.state);

		return emitter;
	},

	findMember(emitter, nodeOrId) {
		return emitter.state.members.find(nodeOrId);
	},
	addMember(emitter, node) {
		emitter.state.members.register(node);

		dispatch(emitter, "update", emitter.state.members);

		return emitter;
	},
	removeMember(emitter, nodeOrId) {
		emitter.state.members.unregister(nodeOrId);

		dispatch(emitter, "update", emitter.state.members);

		return emitter;
	},
	categorize(emitter, alias, value) {
		if(Array.isArray(value)) {
			// Is a pool
			if(emitter.state.members.state.has(alias)) {
				emitter.state.members.addToPool(alias, value);
			} else {
				emitter.state.members.register(value);
				emitter.state.members.setPool(alias, value);
			}
		} else {
			// Is an alias
			emitter.state.members.register(value);
			emitter.state.members.addAlias(alias, value);
		}
	}
};

export default View;