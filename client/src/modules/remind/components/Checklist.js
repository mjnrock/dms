export const Name = `checklist`;

//FIXME: There is currently no proper way to serialize this, so the .list property is not saved correctly.
export function Create({ ...rest } = {}) {
	return {
		title: "",
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