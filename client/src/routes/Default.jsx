import * as PixiJS from "pixi.js";
import Pixi from "./../pixi/Pixi";
import { PixiCanvas } from "./../pixi/PixiCanvas";

import GroupNodeJSX from "../components/node/GroupNode";
import { DataToNode } from "../lib/node/controllers/DataToNode";

const node = DataToNode({
	cat: [ "text", "meow" ],
	meows: {
		poof: [ "number", 1 ],
		lemiao: [ "number", 27, "int8" ],
	},
});

const app = {
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

export function Default() {
	return (
		<div className="absolute-root">
			<PixiCanvas view={ app.pixi.canvas } />
			<div className="absolute-root">
				<GroupNodeJSX node={ app.state } />
			</div>
		</div>
	);
};

export default Default;