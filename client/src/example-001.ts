let schema = {
	terrain: {
		type: "string",
		weight: "int8",
		edgeMask: "uint8",
	},
	entity: {
		type: "string",
		geo: {
			x: "int16",
			y: "int16",
			z: "int16",
		},
		physics: {
			velocity: {
				x: "int16",
				y: "int16",
				z: "int16",
			},
			acceleration: {
				x: "int16",
				y: "int16",
				z: "int16",
			},
		},
		model: {
			shape: {
				type: "string",
				radius: "uint16",
				offset: {
					x: "int16",
					y: "int16",
					z: "int16",
				},
			},
			render: {
				canvas: "canvas",
				sprinte: [ "class", "PixiJS.Sprite" ],
			},
		}
	}
};

let state = {
	terrain: [
		{
			type: "water",
			weight: 3,
			edgeMask: 0,
		},
		{
			type: "dirt",
			weight: 1,
			edgeMask: 0,
		},
		{
			type: "grass",
			weight: 1,
			edgeMask: 0,
		},
	],
	entity: {
		Squirrel: {
			geo: {
				x: 0,
				y: 0,
				z: 0,
				facing: 0,
			},
			physics: {
				velocity: {
					x: 0,
					y: 0,
					z: 0,
				},
				acceleration: {
					x: 0,
					y: 0,
					z: 0,
				},
			},
			model: {
				shape: {
					type: "circle",
					radius: 1,
					offset: {
						x: 0,
						y: 0,
						z: 0,
					},
				},
				texture: {
					canvas: null,	//# HTMLCanvasElement
					sprite: null, 	//# PixiJS.Sprite
				},
			},
		},
	}
};