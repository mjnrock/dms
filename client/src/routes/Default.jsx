import { useState, useEffect } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { CreateSampleTag } from "../routines/testing/CreateSampleTag";
import { Meta as MiniViewMeta } from "./../components/MiniViewMeta";
import { Meta as EditMeta } from "./../components/EditMeta";

let baseTag = CreateSampleTag();

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
		<>
			<DndProvider backend={ HTML5Backend }>
				<EditMeta tag={ tag } />
				<MiniViewMeta tag={ tag } size={ 35 } />
				<pre>
					{
						JSON.stringify(tag.toKVP(`value`), null, 2)
						// JSON.stringify(tag.toKVP(`alias`, `type`, `value`), null, 2)
					}
				</pre>
			</DndProvider>
		</>
	);
};

export default Default;