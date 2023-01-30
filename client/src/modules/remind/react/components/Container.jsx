import Node from "../../lib/Node";
import useNodeEvent from "../useNodeEvent";

export function Cell({ item, jsx, ...props }) {
	const { } = useNodeEvent("update", item);

	let JSX = jsx;
	return (
		<JSX item={ item } { ...props } />
	);
};

export function parseItem(item, index, { current = 1, maxDepth = 10 } = {}) {
	if(item instanceof Node) {
		/* Direct node reference */
		return item;
	} else if(Array.isArray(item)) {
		if(item.some(v => Array.isArray(v))) {
			/* Condensed array form */
			let tempItem = [];
			for(let i = 0; i < item.length; i++) {
				if(Array.isArray(item[ i ])) {
					let [ count, value ] = item[ i ];

					/* Nested loop to expand array */
					for(let j = 0; j < count; j++) {
						tempItem.push(value);
					}
				} else {
					tempItem.push(item[ i ]);
				}
			}

			item = tempItem;
		}

		if(typeof index === "number") {
			/* Passed index */
			return item[ index ];
		}

		return item;
	} else if(typeof item === "function") {
		/* Function reference */

		/* Short-circuit if we've reached the max depth */
		if(current > maxDepth) {
			return null;
		}

		/* Recusively call as result could be another function */
		return parseItem(item(), index, { current: current + 1, maxDepth });
	}

	return null;
};

export function Grid({ item, schema = [], className = "", props = {}, ...rest }) {
	let grid = [],
		[ width, height, jsx ] = schema;

	for(let y = 0; y < height; y++) {
		let row = [];

		for(let x = 0; x < width; x++) {
			if(Array.isArray(jsx)) {
				row.push(jsx[ y * width + x ] || null);
			} else if(typeof jsx === "object") {
				row.push(jsx[ `${ x },${ y }` ] || null);
			}
		}

		// grid.push(row);
		grid.push(...row);
	}

	return (
		<div className={ `grid gap-1 m-1` } style={ { gridTemplateColumns: `repeat(${ width }, minmax(0, 1fr))` } } { ...rest }>
			{
				grid.map((JSX, i) => {
					if(JSX) {
						return (
							<Cell key={ i } item={ parseItem(item, i) } jsx={ JSX } { ...props } />
						);
					}

					return (
						<div key={ i } { ...props }>&nbsp;</div>
					);
				})
			}
		</div>
	);
};

/**
 * Currently this only does row-based flex, but does have the ability
 * to be precise with its flex-basis, allowing for a grid-like layout.
 */
export function Flex({ item, schema = [], className = "", props = {}, ...rest }) {
	let i = -1;

	return (
		<div className={ `flex flex-col m-1 gap-1` + className } { ...rest }>
			{
				schema.map((row, y) => {
					let weight = row.reduce((a, cell) => a + (cell.rw || 0), 0);

					return (
						<div key={ y } className={ `flex gap-1` } { ...rest }>
							{
								row.map((cell, x) => {
									++i;

									props.style = {
										flexGrow: 0,
										flexShrink: 0,
										flex: `${ (cell.rw || 0) / weight * 100 }%`,
									};

									if(cell.jsx) {
										return (
											<Cell key={ x } item={ parseItem(item, i) } jsx={ cell.jsx } { ...props } />
										);
									}

									return (
										<div key={ x } { ...props }>&nbsp;</div>
									);
								})
							}
						</div>
					);
				})
			}
		</div>
	);
};

export function Container({ item, schema, type = "grid", isRowBased = true, ...rest }) {
	if(type === "grid") {
		return (
			<Grid item={ item } schema={ schema } props={ {
				/* @props get passed to the Element JSX component */
				className: `p-1 border border-solid border-neutral-200 rounded shadow hover:bg-neutral-50 hover:border-neutral-300 overflow-clip`,
			} } { ...rest } />
		);
	} else if(type === "flex") {
		return (
			<Flex item={ item } schema={ schema } props={ {
				/* @props get passed to the Element JSX component */
				className: `p-1 border border-solid border-neutral-200 rounded shadow hover:bg-neutral-50 hover:border-neutral-300 overflow-clip`,
			} } { ...rest } />
		);
	}

	return null;
};

export default Container;