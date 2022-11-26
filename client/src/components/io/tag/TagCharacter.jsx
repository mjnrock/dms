import { Tag } from "./Tag";

export function TagCharacter({ tag, isEditing = false } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<input
					type="text"
					value={ v }
					onChange={ e => t.update(e.target.value) }
				/>
			) }
			view={ (t, v) => (
				<div>{ v }</div>
			) }
		/>
	);
};

export default TagCharacter;