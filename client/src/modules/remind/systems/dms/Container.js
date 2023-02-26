import { dispatch } from "./../ASystem";
import { Name } from "./../../components/dms/Container";

export const Container = {
	Name,
	toObject(emitter) {
		let ret = {
			...emitter.shared[ Name ],
		};

		if(ret.type === "grid") {
			let [ w, h, coordObj ] = ret.schema,
				obj = {};

			ret.schema = [
				w,
				h,
			];

			for(let [ key, value ] of Object.entries(coordObj)) {
				obj[ key ] = value.toString();
			}

			ret.schema.push(obj);
		} else if(ret.type === "flex") {
			let o = [];

			for(let row of ret.schema) {
				let r = [];
				for(let col of row) {
					r.push({
						rw: col.rw,
						jsx: col.jsx.toString(),
					});
				}

				o.push(r);
			}

			ret.schema = o;
		}

		return ret;
	},

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