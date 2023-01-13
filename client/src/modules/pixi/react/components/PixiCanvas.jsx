import React, { useEffect, useRef } from "react";
import * as PixiJS from "pixi.js";

export function PixiCanvas({ pixi, view, ...rest } = {}) {
	const canvasRef = useRef(null);

	//FIXME: Bring this outside of this component and use the custom Pixi class
	useEffect(() => {
		const ref = canvasRef.current;

		const app = new PixiJS.Application({ antialias: true });
		// document.body.appendChild(app.view);

		const graphics = new PixiJS.Graphics();

		// Rectangle
		graphics.beginFill(0xDE3249);
		graphics.drawRect(50, 50, 100, 100);
		graphics.endFill();

		// Rectangle + line style 1
		graphics.lineStyle(2, 0xFEEB77, 1);
		graphics.beginFill(0x650A5A);
		graphics.drawRect(200, 50, 100, 100);
		graphics.endFill();

		// Rectangle + line style 2
		graphics.lineStyle(10, 0xFFBD01, 1);
		graphics.beginFill(0xC34288);
		graphics.drawRect(350, 50, 100, 100);
		graphics.endFill();

		// Rectangle 2
		graphics.lineStyle(2, 0xFFFFFF, 1);
		graphics.beginFill(0xAA4F08);
		graphics.drawRect(530, 50, 140, 100);
		graphics.endFill();

		// Circle
		graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
		graphics.beginFill(0xDE3249, 1);
		graphics.drawCircle(100, 250, 50);
		graphics.endFill();

		// Circle + line style 1
		graphics.lineStyle(2, 0xFEEB77, 1);
		graphics.beginFill(0x650A5A, 1);
		graphics.drawCircle(250, 250, 50);
		graphics.endFill();

		// Circle + line style 2
		graphics.lineStyle(10, 0xFFBD01, 1);
		graphics.beginFill(0xC34288, 1);
		graphics.drawCircle(400, 250, 50);
		graphics.endFill();

		// Ellipse + line style 2
		graphics.lineStyle(2, 0xFFFFFF, 1);
		graphics.beginFill(0xAA4F08, 1);
		graphics.drawEllipse(600, 250, 80, 50);
		graphics.endFill();

		// draw a shape
		graphics.beginFill(0xFF3300);
		graphics.lineStyle(4, 0xffd900, 1);
		graphics.moveTo(50, 350);
		graphics.lineTo(250, 350);
		graphics.lineTo(100, 400);
		graphics.lineTo(50, 350);
		graphics.closePath();
		graphics.endFill();

		// draw a rounded rectangle
		graphics.lineStyle(2, 0xFF00FF, 1);
		graphics.beginFill(0x650A5A, 0.25);
		graphics.drawRoundedRect(50, 440, 100, 100, 16);
		graphics.endFill();

		// draw polygon
		const path = [ 600, 370, 700, 460, 780, 420, 730, 570, 590, 520 ];

		graphics.lineStyle(0);
		graphics.beginFill(0x3500FA, 1);
		graphics.drawPolygon(path);
		graphics.endFill();

		app.stage.addChild(graphics);

		ref.appendChild(app.view);
		// ref.appendChild(pixi.renderer.view);
		
		pixi.container = ref;
		pixi.resizeToViewport();
		
		return () => {
			pixi.container = window;
			ref.removeChild(app.view);
			// ref.removeChild(pixi.renderer.view);
		}
	}, []);

	return (
		<div ref={ canvasRef } { ...rest } />
	);
}

export default PixiCanvas;