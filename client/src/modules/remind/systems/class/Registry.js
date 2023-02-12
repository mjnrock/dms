import { dispatch } from "../ASystem";
import { toObject } from "../ASystem";

export const Registry = {
	$: {
		toState(item) {
			let obj = [];

			for(let [ key, value ] of item.state.entries()) {
				obj.push(`@${ value.id }`);
			}

			return obj;
		},
	},
};

export default Registry;