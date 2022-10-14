import { Node } from "./Node";
import { ArrayNode } from "./ArrayNode";
import { BooleanNode } from "./BooleanNode";
import { EnumNode } from "./EnumNode";
import { FunctionNode } from "./FunctionNode";
import { GroupNode } from "./GroupNode";
import { NumberNode } from "./NumberNode";
import { ObjectNode } from "./ObjectNode";
import { TextNode } from "./TextNode";

export class NodeFactory {
	static Create(node = {}) {
		switch(node.type) {
			case Node.EnumType.ARRAY:
				return new ArrayNode(node);

			case Node.EnumType.BOOLEAN:
				return new BooleanNode(node);

			case Node.EnumType.ENUM:
				return new EnumNode(node);

			case Node.EnumType.FUNCTION:
				return new FunctionNode(node);

			case Node.EnumType.GROUP:
				return new GroupNode(node);

			case Node.EnumType.NUMBER:
				return new NumberNode(node);

			case Node.EnumType.OBJECT:
				return new ObjectNode(node);

			case Node.EnumType.TEXT:
				return new TextNode(node);

			default:
				return new Node(node);
		}
	}
};

export default {
	Node,
	ArrayNode,
	BooleanNode,
	EnumNode,
	FunctionNode,
	GroupNode,
	NumberNode,
	ObjectNode,
	TextNode,

	NodeFactory,
};