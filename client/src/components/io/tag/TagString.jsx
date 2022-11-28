import { Tag } from "./Tag";

export function TagString({ tag, isEditing = false, css = "" } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<input
					className={ css }
					type="text"
					value={ v }
					onChange={ e => t.update(e.target.value) }
				/>
			) }
			view={ (t, v) => {
				return (
					<div className={ css }>{ v }</div>
				);
			} }
		/>
	);
};

export default TagString;