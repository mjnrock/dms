import { Tag } from "./Tag";
import { TagInt8 as TagInt8Class } from "./../../lib/dms/tags/TagInt8";

export function TagInt8({ tag, isEditing = false } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<input
					type="number"
					value={ v }
					min={ TagInt8Class.MIN_VALUE }
					max={ TagInt8Class.MAX_VALUE }
					step={ 1 }
					onChange={ e => t.update(e.target.value) }
				/>
			) }
			view={ (t, v) => (
				<div>{ v }</div>
			) }
		/>
	);
};

export default TagInt8;