import { dispatch } from "./../ASystem";

export const ItemGroup = {
	addChild(parent, ...children) {
		parent.state.children.push(...children);

		for(let child of children) {
			child.state.parent = parent;
		}

		dispatch(parent, "update", parent.state.children);

		return parent;
	},
	removeChild(parent, ...children) {
		parent.state.children = parent.state.children.filter((child) => !children.includes(child));

		for(let child of children) {
			child.state.parent = null;
		}

		dispatch(parent, "update", parent.state.children);

		return parent;
	},
};

export default ItemGroup;