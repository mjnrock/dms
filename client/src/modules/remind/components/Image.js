export const Name = `image`;

export function Create({ ...rest } = {}) {
	return {
		canvas: null,

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