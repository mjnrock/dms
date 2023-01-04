import { useState, useEffect } from "react";

export function useNodeEvent(event, node, effect) {
	const [ refresh, setRefresh ] = useState(0);

	useEffect(() => {
		let fn = ({ prop, current, previous }) => {
			if(effect) {
				effect({ prop, current, previous });
			}

			setRefresh({ prop, current, previous });
		};

		node.events.on(event, fn);

		return () => {
			node.events.off(event, fn);
		};
	}, []);

	return refresh;
};

export default useNodeEvent;