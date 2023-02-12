import { ItemGroup } from "./ItemGroup";
import { ComponentViewport } from "./../components/Viewport";
import { Registry } from "./Registry";

export class View extends ItemGroup {
	constructor ({ state = {}, ...rest } = {}) {
		super({ ...rest });

		this.state = {
			...(this.state || {}),

			members: new Registry(),
			offset: {
				x: 0,
				y: 0,
			},
			size: {
				width: 0,
				height: 0,
			},
			x: 0,
			y: 0,

			...state,
		};

		// state.members may be an array, instead of a Registry -- cast back to Registry
		if(Array.isArray(state.members)) {
			this.state.members = new Registry({ state: state.members });
		}

		/** At some interval/invocation, members should be categorized into cached buckets */
		ComponentViewport.Attach(this, { ...(rest.shared || {}).viewport });
		
		this.tokens.add(`#remind:view`);
	}
};

export default ItemGroup;