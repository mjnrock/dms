export const Name = `rendercomponent`;

export const EnumRenderType = {
	//IDEA: Should we just use `flex` or `grid`?
	// ELEMENT: `element`,
	// CONTAINER: `container`,
	FLEX: `flex`,
	GRID: `grid`,
};

export function SchemaCell({ w, rw, h, rh, jsx = () => null, css = {} } = {}) {
	return {
		w,
		rw,
		h,
		rh,
		jsx,
		css,
	};
};

export function Create({ ...rest } = {}) {
	return {
		type: EnumRenderType.FLEX,
		schema: [],
		item: null,

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