import React from "react";

// import Node from "../../lib/node/package";

export function NumberNode({ node, isEditing = false } = {}) {
	if(isEditing) {
		return (
			<div>
				<div style={ { fontWeight: "bold" } }>
					{
						node.meta.alias
					}
				</div>
				<div>
					<input type="number" value={ node.data } />
				</div>
			</div>
		);
	}

	return (
		<div>
			<div style={ { fontWeight: "bold" } }>
				{
					node.meta.alias
				}
			</div>
			<div>
				{
					node.data
				}
			</div>
		</div>
	);
};

export default NumberNode;