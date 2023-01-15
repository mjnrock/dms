import React from "react";
import { useContext, useState, useEffect, useRef } from "react";
import DomToImage from "dom-to-image";
import html2canvas from "html2canvas";

import { useNodeEvent } from "../useNodeEvent";

import { Item as ItemJSX } from "./Item";

import { Pixi } from "./../../../pixi/lib/Pixi";
import { PixiCanvas } from "../../../pixi/react/components/PixiCanvas";
import { Bars3Icon } from "@heroicons/react/24/outline";

export function MenuBar({ showTaskBar, setShowTaskBar, ...rest } = {}) {
	return (
		<div className={ `` }>
			<button
				className={ `p-2 rounded border border-solid ${ showTaskBar ? `bg-rose-50 border-rose-200 text-rose-300 hover:border-rose-300 hover:bg-rose-100 hover:text-rose-400` : `bg-gray-50 border-gray-300 text-gray-400 hover:border-gray-400 hover:bg-gray-100 hover:text-gray-500` }` }
				onClick={ () => setShowTaskBar(!showTaskBar) }
			>
				{ showTaskBar ? `Edit` : `View` } Mode
			</button>
		</div>
	);
};



export function Viewport({ item, ...rest } = {}) {
	const [ showTaskBar, setShowTaskBar ] = React.useState(true);
	const [ override, setOverride ] = React.useState({});

	let { x, y } = item.shared.viewport;

	useEffect(() => {
		let fn = e => {
			if(e.target.tagName !== `INPUT`) {
				e.preventDefault();
			}

			if(e.key === `Escape`) {
				setOverride({
					...override,
					EscapeKey: `${ Date.now() }:${ Math.random() }`,
				});
			}

			if(e.key === `F1`) {
				setOverride({
					...override,
					F1: `${ Date.now() }:${ Math.random() }`,
				});
			} else if(e.key === "F5") {
				window.location.reload();
			}
		};

		window.addEventListener("keydown", fn);

		return () => {
			window.removeEventListener("keydown", fn);
		};
	}, []);

	useEffect(() => {
		if(override.F1) {
			setShowTaskBar(!showTaskBar);
		}
	}, [ override.F1 ]);

	return (
		<div className={ `p-1 m-2` }>
			<div className={ `flex flex-col` }>
				<MenuBar showTaskBar={ showTaskBar } setShowTaskBar={ setShowTaskBar } />
				<ItemJSX item={ item } x={ x } y={ y } showTaskBar={ showTaskBar } override={ override } />
			</div>
		</div>
	)
};

export default Viewport;