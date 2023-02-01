export const Name = `DMS:Container`;

export const EnumMode = {
	VIEW: `view`,
	EDIT: `edit`,
};
export const EnumType = {
	GRID: `grid`,
	FLEX: `flex`,
};

export function Create({ ...rest } = {}) {
	return {
		mode: EnumMode.VIEW,
		type: EnumType.GRID,
		schema: [ 1, 1, {} ],

		...rest,
	};
};

export function Attach(item, { ...rest } = {}) {
	item.shared[ Name ] = Create({ ...rest });

	return item;
};

export default {
	Name,
	Create,
	Attach,
};