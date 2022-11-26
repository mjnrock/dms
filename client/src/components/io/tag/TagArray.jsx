import { Tag } from "./Tag";
import { Factory } from "./packaage";

export function TagArray({ tag, isEditing = false } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<div>TBI...</div>
			) }
			view={ (t, v) => {
				return (
					//FIXME: @isEditing should be controlled, as should the component-specific props (i.e. either an event emission or prop passing)
					t.state.map(t => Factory(t, { key: t.id, isEditing: true }))
				);
			}}
		/>
	);
};

export default TagArray;