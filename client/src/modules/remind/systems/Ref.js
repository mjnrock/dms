import ItemCollection from "../lib/ItemCollection";
import { dispatch } from "./ASystem";

export const Ref = {
	update(emitter, uuid) {
		emitter.shared.ref = {
			id: uuid,
		};

		dispatch(emitter, "update", emitter.shared.ref);

		return emitter;
	},

	fetch(emitter, registry) {
		/* Technically pre-flight, as it will *likely* be a Map, but doesn't have to be */
		if(registry instanceof ItemCollection) {
			registry = registry.state.registry;
		}

		const ref = emitter.shared.ref.id;
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