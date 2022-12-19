export function Schema({ tag, color } = {}) {
	let [ base, magnitude ] = color.split("-");

	//TODO: Add support for { view, edit, isEditing } props
	return (
		<>
			<div className={ `flex flex-row` }>
				<div className={ `basis-1/2` }>{ tag.alias }</div>
				<div className={ `basis-1/2 p-0 mt-auto mb-auto mr-0 font-mono font-bold text-center align-middle text-${ base }-${ +magnitude + 100 }` }>{ tag.dtype }</div>
			</div>
		</>
	);
}

export default Schema;