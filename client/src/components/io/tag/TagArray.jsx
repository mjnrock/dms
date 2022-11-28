import { Tag } from "./Tag";
import { Factory } from "./package";

export function TagArray({ tag, isEditing = false } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => {
				return (
					v.map(t => Factory(t, { key: t.id, isEditing }))
				);
			} }
			view={ (t, v) => {
				return (
					v.map(t => Factory(t, { key: t.id, isEditing }))
				);
			} }
		/>
	);
};

export default TagArray;