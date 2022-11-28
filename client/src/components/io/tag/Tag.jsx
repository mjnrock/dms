import { useState, useEffect } from "react";

/**
 * Create a wrapper component that handles a dynamic edit/view and controls
 * a component's value with update listeners.
 */
export function Tag({ tag, isEditing = false, view, edit } = {}) {
	const [ value, setValue ] = useState(tag.value);

	useEffect(() => {
		let fn = () => setValue(tag.value);
		tag.events.on("update", fn);

		return () => tag.events.off("update", fn);
	}, []);

	let val = value == null ? "" : value;
	if(isEditing) {
		return edit(tag, val);
	}

	return view(tag, val);
}

export default Tag;