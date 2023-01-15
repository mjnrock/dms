import React, { useEffect, useRef } from "react";

export function Canvas({ canvas, width, height, className, containerClassName, ...rest }) {
	const container = useRef(null);

	useEffect(() => {
		container.current.innerHTML = "";

		canvas.className = className;

		let tempCanvas = document.createElement("canvas"),
			ctx = tempCanvas.getContext("2d");

		tempCanvas.width = width || canvas.width;
		tempCanvas.height = height || canvas.height;

		ctx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

		canvas.width = tempCanvas.width;
		canvas.height = tempCanvas.height;

		ctx = canvas.getContext("2d");

		ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

		container.current.append(canvas);
	}, [ container, canvas ]);

	return (
		<div ref={ container } className={ containerClassName } />
	)
}

export default Canvas;