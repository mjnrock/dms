import { Tag } from "./Tag";

export function MetaTag({ tag, isEditing = false, verbose = false } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<div>To be implemented...</div>
			) }
			view={ (t, v) => (
				<pre>
					{ JSON.stringify(t.toObject(verbose), null, 2) }
				</pre>
			) }
		/>
	);
};

export default MetaTag;