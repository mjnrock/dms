import { Identity } from "./../util/Identity";
import GroupNodeJSX from "../components/node/GroupNode";
import { DataToNode } from "../lib/node/controllers/DataToNode";

const node = DataToNode({
	cat: [ "text", "meow" ],
	meows: {
		poof: [ "number", 1 ],
		lemiao: [ "number", 27, "int8" ],
	},
});

node.meta.alias = "teststs";

console.log(node.data);

export function Default() {
	return (
		<div>
			<span className="text-3xl font-bold underline">DMS</span>
			<GroupNodeJSX node={ node } />

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