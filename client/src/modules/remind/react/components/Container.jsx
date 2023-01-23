import Node from "../../lib/Node";

export function Cell({ item, style, children = [], className = "", ...rest }) {
	return (
		<div style={ style } className={ `flex grow ` + className } { ...rest }>
			{
				children
			}
		</div>
	);
};

export function parseItem(item, index) {
	if(item instanceof Node) {
		return item;
	} else if(Array.isArray(item)) {
		if(typeof index === "number") {
			return item[ index ];
		}

		return item;
	} else if(typeof item === "function") {
		return parseItem(item(), index);
	}

	return null;
}

export function Grid({ item, schema = [], className = "", props = {}, ...rest }) {
	let grid = [],
		[ width, height, arrJsx ] = schema;

	for(let y = 0; y < height; y++) {
		let row = [];

		for(let x = 0; x < width; x++) {
			row.push(arrJsx[ y * width + x ] || null);
		}

		grid.push(row);
	}

	return (
		<div className={ `flex flex-col ` + className } { ...rest }>
			{
				grid.map((row, y) => {
					return (
						<div key={ y } className={ `flex flex-row grow` }>
							{
								row.map((JSX, x) => {
									let test = `border border-solid border-neutral-200 rounded m-1 p-1 shadow hover:bg-neutral-50 hover:border-neutral-300`;

									let style = {
										flexBasis: 100 / width + "%",
									};

									return (
										<Cell key={ x } style={ style } className={ `justify-center items-center ` + test }>
											<JSX item={ parseItem(item, y * width + x) } { ...props } />
										</Cell>
									);
								})
							}
						</div>
					);
				})
			}
		</div >
	);
};

/**
 * Currently this only does row-based flex, but does have the ability
 * to be precise with its flex-basis, allowing for a grid-like layout.
 */
export function Flex({ item, schema = [], className = "", props = {}, ...rest }) {
	let i = -1;

	return (
		<div className={ `flex flex-col` + className } { ...rest }>
			{
				schema.map((row, y) => {
					let weight = row.reduce((a, cell) => a + (cell.rw || 0), 0);

					return (
						<div key={ y } className={ `flex` }>
							{
								row.map((cell, x) => {
									++i;

									let style = {
										flexBasis: (cell.rw / weight) * 100 + "%",
									};

									let test = `border border-solid border-neutral-200 rounded m-1 p-1 shadow hover:bg-neutral-50 hover:border-neutral-300 min-h-[32px]`;

									return (
										<Cell key={ x } style={ style } className={ `justify-center items-center ` + test }>
											<cell.jsx item={ parseItem(item, i) } { ...props } />
										</Cell>
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
			<Grid item={ item } schema={ schema } { ...rest } />
		);
	} else if(type === "flex") {
		return (
			<Flex item={ item } schema={ schema } { ...rest } />
		);
	}

	return null;
};

export default Container;