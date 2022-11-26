import { Tag } from "./Tag";
import { TagUint8 as TagUint8Class } from "./../../lib/dms/tags/TagUint8";

export function TagUint8({ tag, isEditing = false } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<input
					type="number"
					value={ v }
					min={ TagUint8Class.MIN_VALUE }
					max={ TagUint8Class.MAX_VALUE }
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

export default TagUint8;