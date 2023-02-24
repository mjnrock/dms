import Node from "../../lib/Node";
import useNodeEvent from "../useNodeEvent";

/**
 * 
 * @param {*} item 
 * @param {*} index 
 * @param {*} param2 
 * @returns 
 */
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

/**
 * This is a generic cell component that can be used to render any
 * item in a `Grid` or `Flex` container. @item should be a `Node`
 * and @jsx should be a React component that will be used to render
 * the `item.shared[component]` data. @props are JSX props and will be
 * spread onto the rendered component.
 * 
 * @param {Node} item
 * @param {React.Component} jsx
 * @param {React.ComponentProps} props These will be spread onto the rendered component
 */
export function Cell({ item, jsx, ...props }) {
	const { } = useNodeEvent("update", item);

	let JSX = jsx;
	return (
		<JSX item={ item } { ...props } />
	);
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

/**
 * The @type parameter determines which layout component to use, either `Grid` or `Flex`.
 * From here, the @schema parameter is used to define the layout, being an array of
 * elements that define the layout. For `Grid`, the schema is an array of two numbers
 * that define the width and height of the grid, while the 3rd element an object that
 * uses [x,y]:JSX key-value pairs to define the JSX component to render at that position.
 * For `Flex`, the schema is an array of arrays that define the rows, with each row
 * being an array of objects that define the cell, with the `jsx` property being the
 * JSX component to render at that position, among other keys.  Finally, the @data
 * parameter is the data to be rendered, which can be a single `Node`, an array of
 * `Node`s that utilize a light schema-syntax, or a function that returns a `Node` or
 * similar array of `Node`s.
 * @param {str} type "grid" or "flex"
 * @param {array} schema An array of elements that define the layout, based on the @type
 * @param {Node|[...Node]|fn*} data The data to be rendered
 * @returns 
 */
export function Container({ type, schema, data, ...rest }) {
	if(type === "grid") {
		const [ width, height ] = schema;

		return (
			<>
				<div className="ml-2 font-mono text-xs">GRID { `[${ width } x ${ height }]` }</div>
				<Grid item={ data } schema={ schema } props={ {
					/* @props get passed to the Element JSX component */
					className: `p-1 border border-solid border-neutral-200 rounded shadow hover:bg-neutral-50 hover:border-neutral-300 overflow-clip`,
				} } { ...rest } />
			</>
		);
	} else if(type === "flex") {
		let shape = schema.map(row => row.map(cell => cell.rw || 0).join(":")).join("|");

		return (
			<>
				<div className="ml-2 font-mono text-xs">FLEX { `[${ shape }]` }</div>
				<Flex item={ data } schema={ schema } props={ {
					/* @props get passed to the Element JSX component */
					className: `p-1 border border-solid border-neutral-200 rounded shadow hover:bg-neutral-50 hover:border-neutral-300 overflow-clip`,
				} } { ...rest } />
			</>
		);
	}

	return null;
};

export default Container;