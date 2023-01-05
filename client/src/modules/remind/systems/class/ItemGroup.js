import { dispatch } from "./../ASystem";

export const ItemGroup = {
	addChild(parent, ...children) {
		parent.state.children.push(...children);

		dispatch(parent, "update", parent.state.children);

		return parent;
	},
	removeChild(parent, ...children) {
		parent.state.children = parent.state.children.filter((child) => !children.includes(child));

		dispatch(parent, "update", parent.state.children);

		return parent;
	},
};

export default ItemGroup;