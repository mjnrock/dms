import { useContext, useState, useEffect, useRef } from "react";
import DomToImage from "dom-to-image";
import html2canvas from "html2canvas";

import { useNodeEvent } from "../useNodeEvent";

import { Item as ItemJSX } from "./Item";

import { Pixi } from "./../../../pixi/lib/Pixi";
import { PixiCanvas } from "../../../pixi/react/components/PixiCanvas";
import { Bars3Icon } from "@heroicons/react/24/outline";


export function Viewport({ item, ...rest } = {}) {
	// const domToImageRef = useRef(null);
	const [ pixi, setPixi ] = useState(new Pixi());

	//TODO: Play between the DomToImage and Html2Canvas, and see which one is better (Html2Canvas background colors are off, but DomToImage doesn't always capture full image)
	// useEffect(() => {
	// 	if(domToImageRef.current) {
	// 		// DomToImage.toPng(domToImageRef.current)
	// 		// 	.then((dataUrl) => {
	// 		// 		// pixi.loadTexture(dataUrl);
	// 		// 		var img = new Image();
	// 		// 		img.src = dataUrl;
	// 		// 		document.body.appendChild(img);
	// 		// 	})
	// 		// 	.catch((error) => {
	// 		// 		console.error("oops, something went wrong!", error);
	// 		// 	});

	// 		html2canvas(domToImageRef.current).then(function(canvas) {
	// 			console.log(canvas.toDataURL())
	// 			document.body.appendChild(canvas);
	// 		});
	// 	}
	// }, [ domToImageRef.current ]);

	/**
	 * FIXME: It's not obvious if the parent container is attaching properly, verify that
	 * The resolved width/height of the resize handler is not the same as the parent container
	 * Consider whether or not you should pass the Pixi instance to the PixiCanvas component or the view only
	 */

	let { x, y } = item.shared.viewport;

	return (
		<div className={ `p-1 m-2 relative` }>
			<PixiCanvas
				className={ `p-1 m-2 rounded border border-solid border-black absolute z-0` }
				pixi={ pixi }
			// view={ pixi.renderer.view }
			/>

			<div
				// ref={ domToImageRef }
				// className={ `absolute z-1 w-full h-full` }
			>
				<ItemJSX item={ item } x={ x } y={ y } />
			</div>
		</div>
	)
};

export default Viewport;