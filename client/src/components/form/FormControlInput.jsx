import { useState, useEffect } from "react";

export function FormControlInput({ tag } = {}) {
	/**
	 * Functionally, the @dataTag will be the Tag that holds the relevant data for the form control (e.g. a TagString, TagInt8, etc.).
	 */
	let [ dataTag ] = tag.value;
	/**
	 * This will be the *actual* data value for @dataTag / the form control.
	 */
	let [ value, setValue ] = useState(dataTag.value);

	useEffect(() => {
		tag.emit("change", value);
	}, [ value ]);

	//TODO: Not exhaustive.
	//IDEA: The $form selection (and accompanying state) should be refactored to use the .shared container (e.g. this.shared.form.inputType).
	let type = "text";
	if(tag.$form.config.inputType === "text") {
		type = "text";
	} else if(tag.$form.config.inputType === "number") {
		type = "number";
	}

	return (
		<input
			type={ type }
			value={ value }
			onChange={ (e) => setValue(e.target.value) }
		/>
	);
};

export default FormControlInput;