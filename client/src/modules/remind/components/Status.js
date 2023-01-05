export const Name = `item`;

export function Create({ ...rest } = {}) {
	return {
		complete: false,

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