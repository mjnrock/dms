function generateSampleData(input = [], { w, h } = {}) {
	if(input === true) {
		//* Row-based flex layout
		return [
			{
				type: "row",
				rh: 2,
				children: [
					{
						type: "col",
						w: [ 1, 6 ],
					},
					{
						type: "col",
						w: [ 1, 6 ],
					},
					{
						type: "col",
						w: [ 1, 3 ],
					},
					{
						type: "col",
						w: [ 1, 3 ],
					},
				],
			},
			{
				type: "row",
				rh: 4,
				children: [],
			},
			{
				type: "row",
				rh: 1,
				children: [
					{
						type: "col",
						w: [ 1, 2 ],
					},
					{
						type: "col",
						w: [ 1, 2 ],
					},
				],
			},
		];
	} else if(input === false) {
		//* Column-based flex layout
		return [
			{
				type: "col",
				rw: 2,
				children: [
					{
						type: "row",
						h: [ 1, 6 ],
					},
					{
						type: "row",
						h: [ 1, 6 ],
					},
					{
						type: "row",
						h: [ 1, 3 ],
					},
					{
						type: "row",
						h: [ 1, 3 ],
					},
				],
			},
			{
				type: "col",
				rw: 4,
				children: [],
			},
			{
				type: "col",
				rw: 1,
				children: [
					{
						type: "row",
						h: [ 1, 2 ],
					},
					{
						type: "row",
						h: [ 1, 2 ],
					},
				],
			},
		];
	} else if(!input.length) {
		//* Grid based layout
		return Array(w * h).fill(null).map((v, i) => i + 1);
	}

	return input.toString();
}

export function Grid({ data = [], className = "", width = 0, height = 0, ...rest }) {
	let grid = [];

	for(let x = 0; x < width; x++) {
		let row = [];

		for(let y = 0; y < height; y++) {
			row.push(data[ x * height + y ] || null);
		}

		grid.push(row);
	}

	return (
		<div className={ `flex flex-row ` + className } { ...rest }>
			{
				grid.map((row, y) => {
					return (
						<div key={ y } className={ `flex flex-col grow` }>
							{
								row.map((cell, x) => {
									return (
										<div key={ x } className={ `flex justify-center items-center border border-solid border-neutral-200 rounded m-1 p-1 shadow hover:bg-neutral-50 hover:border-neutral-300` }>
											{ cell }
										</div>
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

function recurseFlexSchema(schema = []) {
	return schema.map((item, i) => {
		if(item.children && item.children.length) {
			return (
				<div className={ `flex` }>
					{ recurseFlexSchema(item.children) }
				</div>
			);
		}

		let style = {};
		if(typeof item === "object") {
			if(Array.isArray(item.w)) {
				style = {
					...style,
					flexBasis: item.w[ 0 ] / item.w[ 1 ] * 100 + "%",
				};
			} else if(typeof item.w === "number") {
				style = {
					...style,
					flexBasis: item.w + "%",
				};
			} else if(Array.isArray(item.h)) {
				style = {
					...style,
					flexBasis: item.h[ 0 ] / item.h[ 1 ] * 100 + "%",
				};
			} else if(typeof item.h === "number") {
				style = {
					...style,
					flexBasis: item.h + "%",
				};
			}
		}

		return (
			<div key={ i } style={ style } className={ `flex justify-center items-center border border-solid border-neutral-200 rounded m-1 p-1 shadow hover:bg-neutral-50 hover:border-neutral-300` }>
				Hi
			</div>
		);
	});
}

/**
 * Currently this only does row-based flex, but does have the ability
 * to be precise with its flex-basis, allowing for a grid-like layout.
 */
export function Flex({ schema = [], className = "", ...rest }) {
	return (
		<div className={ `flex flex-col` + className } { ...rest }>
			{ recurseFlexSchema(schema) }
		</div>
	);
}

export function Container({ data = [], type = "grid", w = 3, h = 3, isRowBased = true, ...rest }) {
	if(type === "grid") {
		data = generateSampleData([], { w, h });

		return (
			<Grid width={ w } height={ h } data={ data } { ...rest } />
		);
	} else if(type === "flex") {
		let schema = generateSampleData(true);

		return (
			<Flex { ...rest } schema={ schema } />
		);
	}

	return null;
};

export default Container;