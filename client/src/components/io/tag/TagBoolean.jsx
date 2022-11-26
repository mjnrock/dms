import { Tag } from "./Tag";

export function TagBoolean({ tag, isEditing = false } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<select value={ v.toString() } onChange={ e => t.update(e.target.value === "true" ? true : false) }>
					<option value={ "true" }>true</option>
					<option value={ "false" }>false</option>
				</select>
			) }
			view={ (t, v) => (
				<div>{ v ? "T" : "F" }</div>
			) }
		/>
	);
};

export default TagBoolean;