import { EnumTagType } from "../Tag";

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
	ToHierarchy: (tag, { parent = {}, index = 0 } = {}) => {
		let hierarchy = [];

		if([ EnumTagType.GROUP, EnumTagType.ARRAY, EnumTagType.NAMESPACE ].includes(tag.dtype)) {
			hierarchy.push(Helpers.createHierarchyRow(tag, parent, index, true));

			for(let child of tag.value) {
				index++;

				hierarchy = hierarchy.concat(Serializer.ToHierarchy(child, { parent: tag, index }));
			}
		} else {
			hierarchy.push(Helpers.createHierarchyRow(tag, parent, index));
		}

		return hierarchy;
	},
	ToHierarchyRecord: (tag, { parent = {}, index = 0 } = {}) => {
		let hierarchy = Serializer.ToHierarchy(tag, { parent, index });

		return Object.fromEntries(hierarchy.map((h) => [ h[ 0 ], h ]));
	},
};

export default Serializer;