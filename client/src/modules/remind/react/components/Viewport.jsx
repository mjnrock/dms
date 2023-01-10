import { useContext, useState, useEffect, useRef } from "react";

import { useNodeEvent } from "../useNodeEvent";

import { Item as ItemJSX } from "./Item";

import { Pixi } from "./../../../pixi/lib/Pixi";
import { PixiCanvas } from "../../../pixi/react/components/PixiCanvas";


export function Viewport({ item, ...rest } = {}) {
	const [ pixi, setPixi ] = useState(new Pixi());

	/**
	 * FIXME: It's not obvious if the parent container is attaching properly, verify that
	 * The resolved width/height of the resize handler is not the same as the parent container
	 * Consider whether or not you should pass the Pixi instance to the PixiCanvas component or the view only
	 */

	return (
		<div className={ `p-1 m-2` }>
			<div
				className={ `p-1 m-2 rounded border border-solid border-black` }
			>
				<ItemJSX item={ item } />
			</div>

			<PixiCanvas
				className={ `p-1 m-2 rounded border border-solid border-black` }
				pixi={ pixi }
			// view={ pixi.renderer.view }
			/>
		</div>
	)
};

export default Viewport;