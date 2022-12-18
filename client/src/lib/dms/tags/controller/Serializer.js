import { EnumTagType } from "../Tag";

/**
 ** Standard Order: 
 ** 1. id
 ** 2. pid
 ** 3. alias
 ** 4. dtype
 ** 5. value
 ** 6. path
 */

const Helpers = {
	createHierarchyRow(tag, parent, index, isGroup = false) {
		return [
			tag.id,
			parent.id || null,
			tag.alias,
			tag.dtype,
			isGroup ? null : tag.state,
			index,
		];
	},
};

export const Serializer = {
	ToHierarchy: (tag, { parent = {}, index = "0" } = {}) => {
		let hierarchy = [];

		if([ EnumTagType.GROUP, EnumTagType.ARRAY, EnumTagType.NAMESPACE ].includes(tag.dtype)) {
			hierarchy.push(Helpers.createHierarchyRow(tag, parent, index, true));

			let lindex = -1;
			for(let child of tag.value) {
				lindex++;

				hierarchy = hierarchy.concat(Serializer.ToHierarchy(child, { parent: tag, index: `${ index }.${ lindex }` }));
			}
		} else {
			hierarchy.push(Helpers.createHierarchyRow(tag, parent, index));
		}

		return hierarchy;
	},
	/**
	 * This is intended to be an "Object.entries" seed-object, where each
	 * key is simply its index, according to the Standard Order.
	 */
	ToHierarchyObject: (tag) => {
		let hierarchy = Serializer.ToHierarchy(tag);

		return Object.fromEntries(hierarchy.map((h) => [ h[ 0 ], h ]));
	},
	ToHierarchyRecord: (tag) => {
		let hierarchy = Serializer.ToHierarchy(tag);

		return hierarchy.map((h) => ({
			id: h[ 0 ],
			pid: h[ 1 ],
			alias: h[ 2 ],
			dtype: h[ 3 ],
			value: h[ 4 ],
			path: h[ 5 ],
		}));
	},
	/**
	 * This is the more stereotypical "record" object, where the key is the
	 * tag's id, and the value is a key-labeled object.
	 */
	ToHierarchyRecordObject: (tag) => {
		let hierarchy = Serializer.ToHierarchyRecord(tag);

		return Object.fromEntries(hierarchy.map((h) => [ h.id, h ]));
	}
};

export default Serializer;