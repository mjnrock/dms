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

	getByAlias(alias, nested = true) {
		if(nested) {
			let keys = alias.split(".");

			if(keys.length > 1) {
				let [ key, ...rest ] = keys;

				let child = this.getByAlias(key);

				if(child) {
					return child.getByAlias(rest.join("."), nested);
				}
			}

			return this.getByAlias(alias, false);
		}

		for(let child of this.data) {
			if(child.meta.alias === alias) {
				return child;
			}
		}

		return false;
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