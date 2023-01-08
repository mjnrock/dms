export const Name = `checklist`;

export function Create({ ...rest } = {}) {
	return {
		title: ``,
		list: new Map(),

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