import { useState, useEffect } from "react";

import { Node } from "./../lib/Node";

const node = new Node({
	id: "1",
	tokens: [ "hello", "world" ],
	state: {
		foo: "bar"
	},
	shared: {
		geo: {
			lat: 0,
			long: 0,
		},
	},
});

console.log(node);
console.log(node.get("geo"));

export function Default() {
	return (
		<div>
			<h1>Remind</h1>
		</div>
	);
};

export default Default;