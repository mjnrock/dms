import * as Tags from "./../tags/package";

export class Transformer {
	public static ToObject(tag: Tags.ATag): object {
		return tag.toObject();
	}
	public static ToString(tag: Tags.ATag): string {
		return tag.toString();
	}

	public static ToSchema(tag, array, parentID, parent) {
		if (array === null || array === void 0) {
			array = [];
		}
		if (parentID === void 0) {
			parentID = null;
		}

		let ID = array.length + 1;
		array.push({
			ID: ID,
			ParentID: parentID,
			Route: `${
				parent !== null && parent !== void 0 ? `${parent.Route}.` : ""
			}${ID}`,
			Key: tag.GetKey(),
			Path: `${
				parent !== null && parent !== void 0 ? `${parent.Path}.` : ""
			}${tag.GetKey()}`,
			Ordinality: tag.GetOrdinality(),
			Tag: tag,
		});

		if (tag instanceof Tag.TagCompound || tag instanceof Tag.TagList) {
			let lastEntry = array[array.length - 1];
			for (let i in tag.Value) {
				array = Transformer.ToSchema(
					tag.Value[i],
					array,
					ID,
					lastEntry,
				);
			}
		}

		return array;
	}
}

export default Transformer;
