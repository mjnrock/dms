import { Tag } from "./Tag";

export function TagString({ tag, isEditing = false } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<input
					className="p-1 basis-10/12"
					type="text"
					value={ v }
					onChange={ e => t.update(e.target.value) }
				/>
			) }
			view={ (t, v) => {
				return (
					<div className="basis-10/12">{ v }</div>
				);
			} }
		/>
	);
};

export default TagString;