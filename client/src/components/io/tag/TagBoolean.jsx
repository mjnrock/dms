import { Tag } from "./Tag";

export function TagBoolean({ tag, isEditing = false, css = "" } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<select className={ css } value={ v.toString() } onChange={ e => t.update(e.target.value === "true" ? true : false) }>
					<option value={ "true" }>true</option>
					<option value={ "false" }>false</option>
				</select>
			) }
			view={ (t, v) => (
				<div className={ css }>{ v ? "T" : "F" }</div>
			) }
		/>
	);
};

export default TagBoolean;