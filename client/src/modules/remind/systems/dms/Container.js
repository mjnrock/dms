import { dispatch } from "./../ASystem";
import { Name } from "./../../components/dms/Container";

export const Container = {
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

export default Container;