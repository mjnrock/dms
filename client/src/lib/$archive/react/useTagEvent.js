import { useState, useEffect } from "react";

export function useTagEvent(event, tag, effect) {
	const [ refresh, setRefresh ] = useState(0);

	useEffect(() => {
		let fn = ({ prop, current, previous }) => {
			if(effect) {
				effect({ prop, current, previous });
			}

			setRefresh({ prop, current, previous });
		};

		tag.events.on(event, fn);

		return () => {
			tag.events.off(event, fn);
		};
	}, []);

	return refresh;
};

export default useTagEvent;