import React from "react";

import Node from "./../../lib/node/package";

import TextNode from "./TextNode";
import NumberNode from "./NumberNode";
import { useState } from "react";

//TODO: Either apply the concepts of position directly as a component prop (e.g. x, y), or extract metadata from node through standardized parlance (node.dms.position{x,y})
export function GroupNode({ node, position = {} } = {}) {
	const { x, y, w, h } = position;

	/**
	 * 1) 
	 */

	let data = Array.from(node.data);
	let css = x !== void 0 ? {
		position: "absolute",
		top: y,
		left: x,
		width: w,
		height: h,
		overflow: "hidden",
	} : {};

	console.log(css);

	return (
		<div style={ css }>
			<div style={ { fontWeight: "bold" } }>
				{
					node.meta.alias
				}
			</div>
			<div
				style={ {
					padding: 10,
					margin: 10,
					border: "1px solid black",
					borderRadius: 4,
				} }
			>
				{
					data.map(n => {
						if(n.type === Node.Node.EnumType.GROUP) {
							return <GroupNode key={ n.id } node={ n } />;
						} else if(n.type === Node.Node.EnumType.TEXT) {
							return <TextNode key={ n.id } node={ n } isEditing={ true } />;
						} else if(n.type === Node.Node.EnumType.NUMBER) {
							return <NumberNode key={ n.id } node={ n } isEditing={ true } />;
						}

						return null;
					})
				}
			</div>
		</div>
	);
};

export default GroupNode;