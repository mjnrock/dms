import * as PixiJS from "pixi.js";
import Pixi from "./../pixi/Pixi";
import { PixiCanvas } from "./../pixi/PixiCanvas";

import GroupNodeJSX from "../components/node/GroupNode";
import { DataToNode } from "../lib/node/controllers/DataToNode";
import { useState } from "react";

const node = DataToNode({
	cat: [ "text", "meow" ],
	meows: {
		poof: [ "number", 1 ],
		lemiao: [ "number", 27, "int8" ],
	},
});

node.getByAlias("meows.poof").data = 65489;

/**
 * IDEA: Consolidate this event initialization into something more succinct.
 */
node.events.addObject({
	update: (...args) => {
		console.log("update", ...args);
	},
});
node.getByAlias("cat").events.addObject({
	change: (...args) => {
		node.getByAlias("cat").data = args[ 0 ];

		return node.getByAlias("cat").data;
	},
});
node.getByAlias("meows.poof").events.addObject({
	change: (...args) => {
		console.log("update", ...args);
	},
});

const app = {
	mouse: {
		x: 0,
		y: 0,
		buttons: 0,
	},
	viewport: {
		offset: {
			x: 0,
			y: 0,
		},
		scale: 1.0,
	},
	pixi: new Pixi({
		width: 500,
		height: 500,
	}),
	state: node,
};

node.dms = {
	position: {
		x: 0,
		y: 0,
	},
};

export function Default() {
	const [ state, setState ] = useState(app);

	return (
		<div
			className="absolute-root"
		>
			<GroupNodeJSX
				node={ app.state }
				position={ state.mouse }
			/>
			{/* <PixiCanvas view={ app.pixi.canvas } /> */ }
		</div>
	);
};

export default Default;