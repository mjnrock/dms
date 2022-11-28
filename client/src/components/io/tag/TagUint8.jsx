import { Tag } from "./Tag";
import { TagUint8 as TagUint8Class } from "../../../lib/dms/tags/TagUint8";

export function TagUint8({ tag, isEditing = false, css = "" } = {}) {
	return (
		<Tag
			tag={ tag }
			isEditing={ isEditing }
			edit={ (t, v) => (
				<input
					className={ css }
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
					<div className={ css }>{ v }</div>
				);
			} }
		/>
	);
};

export default TagUint8;