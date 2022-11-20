import React from "react";

// import Node from "../../lib/node/package";

export function TextNode({ node, isEditing = false } = {}) {
	const [ refresh, setRefresh ] = React.useState(0);

	React.useEffect(() => {
		const fn = (...args) => {
			setRefresh(refresh + 1);
		};

		node.events.addObject({
			update: fn,
		});

		return () => {
			node.events.off("update", fn);
		};
	}, []);

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
					<input type="text" value={ node.data } onChange={ onChange } />
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

export default TextNode;