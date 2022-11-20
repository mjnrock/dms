import { TagBoolean } from "../lib/dms/tags/TagBoolean";
import { TagString } from "../lib/dms/tags/TagString";
import { TagGroup } from "../lib/dms/tags/TagGroup";

export function Default() {
	let tagBool = new TagBoolean(true, {
		alias: "boolz",
	});
	let tagStr = new TagString(123456, {
		alias: "strangs",
	});
	let tagGroup = new TagGroup([
		tagBool,
		tagStr
	], {
		alias: "gr00pz",
	});

	console.log(tagBool)
	console.log(tagStr)
	console.log(tagGroup)

	return (
		<div
			className="absolute-root"
		>
			<div>{ tagBool.name }, { tagBool.value.toString() }</div>
			<div>{ tagStr.name }, { tagStr.value }</div>
			<div>
				{ tagGroup.name }, {
					tagGroup.value.map((tag, i) => {
						return (
							<div key={ i }>
								{ tag.name }, { tag.value.toString() }
							</div>
						)
					})
				}
			</div>
		</div>
	);
};

export default Default;