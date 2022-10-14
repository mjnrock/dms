import { DataToNode } from "../lib/node/controllers/DataToNode";
import Node from "./../lib/node/package";

const node = Node.NumberNode.INT8.create({
	data: 127,
	events: {
		meow: () => {
			console.log("meow");
		},
	},
});

// const node = DataToNode({
// 	cat: [ "text", "meow" ],
// 	meows: {
// 		poof: [ "number", 1 ],
// 		lemao: [ "number", 27, "int8" ],
// 	},
// });

console.log(node.data);

node.events.emit("meow");
node.emit("meow");
node.dispatch("meow");

export function Default() {
	return (
		<div>DMS</div>
	);
};

export default Default;

//TODO: Make a System that breaks down the data into a tree structure below and performs operations on it.
// {
// 	$type: "data" | "node" | "schema" | "registry" | "factory" | "system",
// 	$ref: "UUID",
// 	...key-value pairs
// }