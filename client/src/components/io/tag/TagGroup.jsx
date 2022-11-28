//TODO: Imlpement a drag and drop feature for child tags
//* Implement List and ListItem wrapper components so isolate the dnd logic
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Tag } from "./Tag";
import { Factory } from "./package";

export function TagGroup({ tag, isEditing = false } = {}) {
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
					<DndProvider backend={ HTML5Backend }>
						{
							v.map(t => Factory(t, { key: t.id, isEditing }))
						}
					</DndProvider>
				);
			} }
		/>
	);
};

export default TagGroup;