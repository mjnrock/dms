export const Name = `ref`;

export function Create({ ...rest } = {}) {
	return {
		id: null,

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