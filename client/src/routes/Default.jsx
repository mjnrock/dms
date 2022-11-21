import { FormControlInput } from "./../components/form/FormControlInput";
import { FormControl } from "./../lib/dms/form/FormControl";
import { TagString } from "./../lib/dms/tags/TagString";
import { TagInt8 } from "./../lib/dms/tags/TagInt8";

//TODO: The FormControl tag and the TagString do not presently coordinate the fact that they're both tags and that TagString isn't just a JS String.
//IDEA: This was a quick test, and may not prove to work as imagined; consider revaluating this approach and see if it needs adjustment or abandoning.

const formControl = new FormControl(
	FormControl.EnumFormControlType.INPUT,
	new TagString("meow"),
	{
		config: {
			inputType: "text",
		},
	},
);

export function Default() {
	return (
		<>
			<FormControlInput tag={ formControl } />
		</>
	);
};

export default Default;