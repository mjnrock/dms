import { useState, useEffect } from "react";

/**
 * Create a wrapper component that handles a dynamic edit/view and controls
 * a component's value with update listeners.
 */
export function Schema({ tag, isEditing = false, view, edit, ...props } = {}) {
	const [ dtype, setDtype ] = useState(tag.dtype);

	useEffect(() => {
		let fn = () => setDtype(tag.dtype);
		tag.events.on("update", fn);

		return () => tag.events.off("update", fn);
	}, []);

	if(isEditing) {
		return edit(tag, dtype, { isEditing, ...props });
	}

	return view(tag, dtype, { isEditing, ...props });
}

export default Schema;