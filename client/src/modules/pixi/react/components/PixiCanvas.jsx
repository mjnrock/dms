import React, { useEffect, useRef } from "react";

export function PixiCanvas({ pixi, view, ...rest } = {}) {
	const canvasRef = useRef(null);

	useEffect(() => {
		const ref = canvasRef.current;

		ref.appendChild(pixi.renderer.view);

		pixi.container = ref;
		pixi.resizeToViewport();
		
		return () => {
			pixi.container = window;
			ref.removeChild(pixi.renderer.view);
		}
	}, []);

	return (
		<div ref={ canvasRef } { ...rest } />
	);
}

export default PixiCanvas;