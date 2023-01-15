export const Name = `markdown`;

export function Create({ ...rest } = {}) {
	return {
		title: null,
		content: ``,

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