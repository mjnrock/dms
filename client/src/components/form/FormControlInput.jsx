import { useState, useEffect } from "react";

export function FormControlInput({ tag } = {}) {
	const [ value, setValue ] = useState(tag.value);

	useEffect(() => {
		tag.value = value;
	}, [ value ]);

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