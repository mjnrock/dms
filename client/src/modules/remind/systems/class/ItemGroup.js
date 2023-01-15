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
	replaceChild(parent, oldChild, newChild) {
		const index = parent.state.children.indexOf(oldChild);

		if(index !== -1) {
			parent.state.children[index] = newChild;
			newChild.state.parent = parent;
			oldChild.state.parent = null;
		}

		dispatch(parent, "update", parent.state.children);

		return parent;
	},
	swapPosition(parent, child1, child2) {
		const index1 = parent.state.children.indexOf(child1);
		const index2 = parent.state.children.indexOf(child2);

		if(index1 !== -1 && index2 !== -1) {
			parent.state.children[index1] = child2;
			parent.state.children[index2] = child1;
		}

		dispatch(parent, "update", parent.state.children);

		return parent;
	},
};

export default ItemGroup;