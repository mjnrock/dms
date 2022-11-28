import { Tag } from "./Tag";
import { TagUint8 as TagUint8Class } from "../../../lib/dms/tags/TagUint8";

export function TagUint8({ tag, isEditing = false } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<input
					className="p-1 basis-10/12"
					type="number"
					value={ v }
					min={ TagUint8Class.MIN_VALUE }
					max={ TagUint8Class.MAX_VALUE }
					step={ 1 }
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

export default TagUint8;