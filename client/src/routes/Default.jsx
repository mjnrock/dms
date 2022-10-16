import { DataToNode } from "../lib/node/controllers/DataToNode";
import Node from "./../lib/node/package";

const node = DataToNode({
	cat: [ "text", "meow" ],
	meows: {
		poof: [ "number", 1 ],
		lemao: [ "number", 27, "int8" ],
	},
});

console.log(node);

export function Default() {
	return (
		<div>
			<pre>
				{
					JSON.stringify(node.toSchema(), null, 4)
				}
			</pre>

			<hr />

			<pre>
				{
					JSON.stringify(node.toObject(), null, 4)
				}
			</pre>
		</div>
	);
};

export default Default;

//TODO: Make a System that breaks down the data into a tree structure below and performs operations on it.
// {
// 	$type: "data" | "node" | "schema" | "registry" | "factory" | "system",
// 	$ref: "UUID",
// 	...key-value pairs
// }