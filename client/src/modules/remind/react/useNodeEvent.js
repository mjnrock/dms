import { useState, useEffect } from "react";

export function useNodeEvent(event, node, effect) {
	const [ refresh, setRefresh ] = useState({ emitter: node, prop: null, current: null, previous: null });

	useEffect(() => {
		let fn = ({ prop, current, previous }) => {
			if(effect) {
				effect({ emitter: node, prop, current, previous });
			}

			setRefresh({ emitter: node, prop, current, previous });
		};

		node.events.on(event, fn);

		return () => {
			node.events.off(event, fn);
		};
	}, []);

	return refresh;
};

export default useNodeEvent;