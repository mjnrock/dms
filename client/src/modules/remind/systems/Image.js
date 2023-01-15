import { dispatch } from "./ASystem";
import { Name } from "../components/Checklist";

export const Image = {
	update(emitter, data = {}) {
		console.log(data);
		emitter.shared[ Name ] = {
			...emitter.shared[ Name ],
			...data,
		};

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
};

export default Image;