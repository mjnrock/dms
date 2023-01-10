import { dispatch } from "./ASystem";

export const Name = `viewport`;

export const Viewport = {
	update(emitter, data = {}) {
		emitter.shared[ Name ] = {
			...emitter.shared[ Name ],
			...data,
		};

		dispatch(emitter, "update", emitter.shared[ Name]);

		return emitter;
	},
	setViewId(emitter, viewId) {
		emitter.shared[ Name ].vid = viewId;

		dispatch(emitter, "update", emitter.shared[ Name ].vid);

		return emitter;
	},
	setType(emitter, type) {
		emitter.shared[ Name ].type = type;

		dispatch(emitter, "update", emitter.shared[ Name ].type);

		return emitter;
	},
	setX(emitter, x) {
		emitter.shared[ Name ].x = x;

		dispatch(emitter, "update", emitter.shared[ Name ].x);

		return emitter;
	},
	setY(emitter, y) {
		emitter.shared[ Name ].y = y;

		dispatch(emitter, "update", emitter.shared[ Name ].y);

		return emitter;
	},
	setNode(emitter, node) {
		emitter.shared[ Name ].node = node;

		dispatch(emitter, "update", emitter.shared[ Name ].node);

		return emitter;
	},
};

export default Viewport;