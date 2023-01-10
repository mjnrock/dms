export const Name = `viewport`;

export const EnumNodeType = {
	CANVAS: `canvas`,
	REACT: `react`,
	HTML: `html`,
};

export function Create({ ...rest } = {}) {
	return {
		vid: null,
		type: EnumNodeType.REACT,
		x: 0,
		y: 0,
		node: null,

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