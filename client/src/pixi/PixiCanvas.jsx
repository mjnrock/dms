import React, { useEffect, useRef } from "react";

export function PixiCanvas({ app, view } = {}) {
	const canvasRef = useRef(null);

	useEffect(() => {
		const ref = canvasRef.current;

		ref.appendChild(view || app.view);

		return () => {
			ref.removeChild(view || app.view);
		}
	}, []);

	return (
		<div ref={ canvasRef } />
	);
}

export default PixiCanvas;