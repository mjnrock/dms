//TODO: Imlpement a drag and drop feature for child tags
//* Implement List and ListItem wrapper components so isolate the dnd logic
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Tag } from "./Tag";
import { Factory } from "./packaage";

export function TagGroup({ tag, isEditing = false } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<div>TBI...</div>
			) }
			view={ (t, v) => {
				return (
					<DndProvider backend={ HTML5Backend }>
						{
							//FIXME: @isEditing should be controlled, as should the component-specific props (i.e. either an event emission or prop passing)
							t.state.map(t => Factory(t, { key: t.id, isEditing: true }))
						}
					</DndProvider>
				);
			} }
		/>
	);
};

export default TagGroup;