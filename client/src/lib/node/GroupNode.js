import Node from "./Node";

export class GroupNode extends Node {
	constructor ({ ...node } = {}) {
		super({
			...node,

			data: new Set(),
			type: Node.EnumType.GROUP,
		});

		if(node.data) {
			for(let child of node.data) {
				this.addChild(child);
			}
		}
	}

	addChild(node) {
		this.data.add(node);

		return this;
	}
	addChildren(...nodes) {
		for(let node of nodes) {
			this.addChild(node);
		}

		return this;
	}
	removeChild(node) {
		return this.data.delete(node);
	}
	removeChildren(...nodes) {
		for(let node of nodes) {
			this.removeChild(node);
		}

		return this;
	}
};

export default GroupNode;