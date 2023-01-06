export const Name = `status`;

export function Create({ ...rest } = {}) {
	return {
		// V1
		complete: false,

		// V2
		current: null,
		options: [],

		...rest,
	};
};

export function Attach(node, { ...rest } = {}) {
	node.shared[ Name ] = Create({ ...rest });

	return node;
};

export default {
	Create,
	Attach,
};