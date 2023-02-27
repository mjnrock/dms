import { dispatch } from "./../ASystem";
import { Name } from "../../components/dms/Manifest";
import Node from "../../lib/Node";
import { Registry } from "../../lib/Registry";

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
	toRegistry(emitter) {
		return new Registry({
			state: new Map(emitter.shared[ Name ].data.state),
		});
	},
	toObject(emitter) {
		let ret = {
			...emitter.shared[ Name ],
			data: Registry.ToObject(emitter.shared[ Name ].data,
				{
					...emitter.shared[ Name ].Systems,
					// [ ItemGroup.Token ]: SysItemGroup,
					// [ Item.Token ]: SysItem,
				}
			),
		};

		let exclude = [ "data", "meta" ];
		for(let [ key, value ] of Object.entries(emitter.shared[ Name ])) {
			if(!exclude.includes(key)) {
				for(let [ sys, obj ] of Object.entries(value)) {
					ret[ key ][ sys ] = {};

					for(let [ k, v ] of Object.entries(obj)) {
						if(typeof v === "function") {
							ret[ key ][ sys ][ k ] = v.toString();
						} else {
							ret[ key ][ sys ][ k ] = v;
						}
					}
				}
			}
		}

		return ret;
	},

	update(emitter, data = {}) {
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

export default {
	...Manifest,
	Helper: {
		...Helper
	},
};