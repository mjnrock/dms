export const Name = `item`;

export function Create({ ...rest } = {}) {
	return {
		title: null,
		content: ``,
		position: 0,

		...rest,
	};
};

export function Attach(item, { ...rest } = {}) {
	item.shared[ Name ] = Create({ ...rest });

	return item;
};

export default {
	Create,
	Attach,
};