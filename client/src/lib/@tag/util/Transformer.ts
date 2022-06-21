import ATag from "../tags/ATag";
import Tags from "./../tags/package";

export class Transformer {
	public static ToObject(tag: InstanceType<typeof Tags.ATag>): object {
		return tag.toObject();
	}
	public static ToString(tag: InstanceType<typeof Tags.ATag>): string {
		return tag.toString();
	}

	public static ToSchema(tag: ATag, array: Array<any> = [], parentID: any = null, parent: any = null) {
		let ID = array.length + 1;

		const schema = {
			id: ID,
			parentId: parentID,
			route: `${parent !== null && parent !== void 0 ? `${parent.route}.` : ""}${ID}`,
			name: tag.getName(),
			path: `${parent !== null && parent !== void 0 ? `${parent.path}.` : ""}${tag.getName()}`,
			tag: tag,
		};

		array.push(schema);

		if (tag instanceof Tags.TagCompound || tag instanceof Tags.TagList) {
			let lastEntry = array[array.length - 1];
			for(let nextTag of tag.getChildren()) {
				array = Transformer.ToSchema(
					nextTag,
					array,
					ID,
					lastEntry,
				);
			}
		}

		return array;
	}
};

export default Transformer;
