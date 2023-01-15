import React, { useEffect, useRef } from "react";

export function Canvas({ canvas, width, height, className, containerClassName, ...rest }) {
	const container = useRef(null);

	useEffect(() => {
		container.current.innerHTML = "";


		let tempCanvas = document.createElement("canvas"),
			ctx = tempCanvas.getContext("2d");

		tempCanvas.width = width || canvas.width;
		tempCanvas.height = height || canvas.height;

		ctx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

		tempCanvas.className = className;

		container.current.append(tempCanvas);
	}, [ container, canvas, width, height ]);

	return (
		<div ref={ container } className={ containerClassName } />
	)
}

export default Canvas;