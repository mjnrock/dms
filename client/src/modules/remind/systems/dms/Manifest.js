import { dispatch } from "./../ASystem";
import { Name } from "../../components/dms/Manifest";
import Node from "../../lib/Node";

export const Helper = {
	register(emitter, type, data = {}, broadcast = false) {
		for(let [ key, value ] of Object.entries(data)) {
			emitter.shared[ Name ][ type ][ key ] = value;
		}

		if(broadcast) {
			dispatch(emitter, "update", emitter.shared[ Name ]);
		}

		return emitter;
	},
};

export const Manifest = {
	Name,

	update(emitter, data = {}) {
		console.log(data);
		emitter.shared[ Name ] = {
			...emitter.shared[ Name ],
			...data,
		};

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},

	register(emitter, ...nodes) {
		for(let node of nodes) {
			if(node instanceof Node) {
				emitter.shared[ Name ].data.register(node);
			}
		}

		dispatch(emitter, "update", emitter.shared[ Name ]);

		return emitter;
	},
	compRegister(emitter, data = {}) {
		return Helper.register(emitter, "Components", data, true);
	},
	sysRegister(emitter, data = {}) {
		return Helper.register(emitter, "Systems", data, true);
	},
	jsxRegister(emitter, data = {}) {
		return Helper.register(emitter, "JSX", data, true);
	},
	modelRegister(emitter, data = {}) {
		return Helper.register(emitter, "Models", data, true);
	},
	nodeRegister(emitter, data = {}) {
		return Helper.register(emitter, "Nodes", data, true);
	},
	version(emitter, version) {
		if(version === true) {
			/* Increment the build number */
			let [ m, n, b ] = emitter.shared[ Name ].meta.version.split(`.`);
			emitter.shared[ Name ].meta.version = `${ m }.${ n }.${ ++b }`;
		} else if(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/.test(version)) {
			emitter.shared[ Name ].meta.version = version;
		}

		return emitter;
	},
};

export default Manifest;