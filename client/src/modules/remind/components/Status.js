export const Name = `item`;

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

export function Attach(item, { ...rest } = {}) {
	item.shared[ Name ] = Create({ ...rest });

	return item;
};

export default {
	Create,
	Attach,
};