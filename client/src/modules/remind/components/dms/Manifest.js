import { v4 as uuid } from "uuid";
//TODO: This Component "version" outpaced the other Components -- if they're still in use at time of reading this, they should be updated to match this one
import { Registry } from "../../lib/Registry";

export const Name = `DMS:Manifest`;

export function Create({ data, meta, ...rest } = {}) {
	return {
		Systems: {},
		Components: {},
		Models: {},
		Nodes: {},
		JSX: {},

		data: new Registry(data),
		meta: {
			id: uuid(),
			version: `0.0.1`,
			timestamp: Date.now(),

			...meta,
		},

		...rest,
	};
};

export function Attach(item, { ...rest } = {}) {
	item.shared[ Name ] = Create({ ...rest });

	return item;
};

export default {
	Name,
	Create,
	Attach,

	AsEntry: (asArray = false) => (asArray ? [ Name, Create() ] : { [ Name ]: Create() }),
};