import { useState, useEffect } from "react";
import { CreateSampleTag } from "../routines/testing/CreateSampleTag";

let baseTag = CreateSampleTag();

console.log(baseTag);

export function Default() {
	const [ tag, setTag ] = useState(baseTag);

	useEffect(() => {
		let fn = (...args) => console.log(...args);

		tag.events.on("update", fn);

		return () => {
			tag.events.off("update", fn);
		};
	}, []);

	return (
		<pre>
			{
				JSON.stringify(tag, null, 2)
			}
		</pre>
	);
};

export default Default;