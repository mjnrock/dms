import React from "react";

// import Node from "../../lib/node/package";

export function NumberNode({ node, isEditing = false } = {}) {
	if(isEditing) {
		function onChange(e) {
			node.emit("change", e.target.value);
		}

		return (
			<div>
				<div style={ { fontWeight: "bold" } }>
					{
						node.meta.alias
					}
				</div>
				<div>
					{ /* TODO: Change the step based on meta type, and constrain by min/max */ }
					<input type="number" value={ node.data } onChange={ onChange } />
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