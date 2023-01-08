export const Name = `status`;

export function Create({ ...rest } = {}) {
	return {
		// V1
		complete: false,

		// V2
		current: `Not Started`,
		options: [
			`Not Started`,
			`In Progress`,
			`Complete`,
		],

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