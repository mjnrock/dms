import Tags from "./../tags/package";

/**
 * NOTE: Transformations that reorganize children into parent-child relationships will, in general,
 * **nullify** the data from the (copied) parent tag, as that data can be reconstituted from the resulting
 * associations that the transformation explicates (e.g. hierarchy associations).
 */
export class Transformer {
	/**
	 * This is largely a helper function for more complex transformations, but it can be used to
	 * create an N-length array of all tags and their children, ordered by the root tag and traversing
	 * all children, then back to the next-highest-level tag after root, and so on.
	 */
	public static FlattenTagStructure(
		tag: Tags.ATag,
		array: Array<Tags.ATag> = [],
	): Array<Tags.ATag> {
		if(tag instanceof Tags.TagCompound || tag instanceof Tags.TagList) {
			array.push(tag);

			for(const child of tag.getValue()) {
				array = this.FlattenTagStructure(child, array);
			}
		} else if(tag instanceof Tags.ATag) {
			array.push(tag);
		}

		return array;
	}

	/**
	 * This is one of the base serialization functions, that other serlization functions will use
	 * to facilitate the serialization of the tag.  In child-holding tags, the tags will
	 * recursively call their internal .toObject() to serialize the children.
	 */
	public static ToObject(tag: Tags.ATag): object {
		return tag.toObject();
	}

	/**
	 * Under the hood, all tags will first be converted into their respective objects, and then
	 * serialized into a string using JSON.stringify().
	 */
	public static ToString(tag: Tags.ATag): string {
		return tag.toString();
	}

	/**
	 * This will create a hierarchy table for a given tag.
	 *
	 * NOTE: **All** tags containg children will be copied and have their values removed, as that data
	 * becomes redundant when organized into a hierarchy.
	 */
	public static ToHierarchy(
		tag: Tags.ATag,
		array: Array<object> = [],
		parentID: any = null,
	): Array<object> {
		let ID = array.length + 1;

		array.push({
			id: ID,
			pid: parentID,
			tag:
				tag instanceof Tags.TagCompound || tag instanceof Tags.TagList
					? tag.copy(true, true)
					: tag,
		});

		if(tag instanceof Tags.TagCompound || tag instanceof Tags.TagList) {
			for(let child of tag.getValue()) {
				array = Transformer.ToHierarchy(child, array, ID);
			}
		}

		return array;
	}

	/**
	 * This will create a schema table for a given tag.  This is subtly different than the heirarchy
	 * table in that it provides a more complete representation of the tag's structure, and some extra
	 * information about the tag that helps with depth analysis.
	 *
	 * NOTE: **All** tags containg children will be copied and have their values removed, as that data
	 * becomes redundant when organized into a hierarchy.
	 */
	public static ToSchema(
		tag: Tags.ATag,
		array: Array<object> = [],
		parentID: any = null,
		parent: any = null,
	): Array<object> {
		let ID = array.length + 1;

		const schema = {
			id: ID,
			pid: parentID,
			depth: `${ parent != null ? `${ parent.depth }.` : "" }${ ID }`,
			namespace: `${ parent != null ? `${ parent.namespace }.` : ""
				}${ tag.getName() }`,
			tag:
				tag instanceof Tags.TagCompound || tag instanceof Tags.TagList
					? tag.copy(true, true)
					: tag,
		};

		array.push(schema);

		if(tag instanceof Tags.TagCompound || tag instanceof Tags.TagList) {
			let lastEntry = array[ array.length - 1 ];
			for(let nextTag of tag.getChildren()) {
				array = Transformer.ToSchema(nextTag, array, ID, lastEntry);
			}
		}

		return array;
	}
}

export default Transformer;
