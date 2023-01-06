import { dispatch } from "./ASystem";

export const Ref = {
	update(emitter, ref) {
		emitter.shared.ref = ref;

		dispatch(emitter, "update", emitter.shared.ref);

		return emitter;
	},
	fetch(emitter, registry) {
		const ref = emitter.shared.ref;
		if(registry instanceof Map) {
			if(ref && registry.has(ref)) {
				return registry.get(ref);
			}
		} else if(registry instanceof Object) {
			if(ref && registry[ ref ]) {
				return registry[ ref ];
			}
		} else if(registry instanceof Array || registry instanceof Set) {
			for(let item of registry) {
				if(item.id === ref) {
					return item;
				}
			}
		}

		return false;
	},
};

export default Ref;