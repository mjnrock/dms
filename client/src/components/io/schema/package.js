import { EnumTagType } from "./../../../lib/dms/tags/Tag";

import { Schema } from "./Schema";

/**
 * If you need something more specific, create a custom view or edit component and return it in the render functions below.
 */
export const TypeToProps = new Map([
	[ EnumTagType.ANY, {
		edit: (t, dtype, { css } = {}) => (<div className={ css }>{ dtype.toString() }</div>),
		view: (t, dtype, { css } = {}) => (<div className={ css }>{ dtype.toString() }</div>),
	} ],

	[ EnumTagType.STRING, {
		edit: (t, dtype, { css } = {}) => (<input className={ css } type="text" value={ dtype } onChange={ e => t.update(e.target.value) } />),
		view: (t, dtype, { css } = {}) => (<div className={ css }>{ dtype }</div>),
	} ],
	[ EnumTagType.INT8, {
		edit: (t, dtype, { css } = {}) => (<input
			className={ css }
			type="number"
			value={ dtype }
			min={ -128 }
			max={ 127 }
			step={ 1 }
			onChange={ e => t.update(e.target.value) }
		/>),
		view: (t, dtype, { css } = {}) => (<div className={ css }>{ dtype }</div>),
	} ],
	[ EnumTagType.UINT8, {
		edit: (t, dtype, { css } = {}) => (<input
			className={ css }
			type="number"
			value={ dtype }
			min={ 0 }
			max={ 255 }
			step={ 1 }
			onChange={ e => t.update(e.target.value) }
		/>),
		view: (t, dtype, { css } = {}) => (<div className={ css }>{ dtype }</div>),
	} ],
	[ EnumTagType.BOOLEAN, {
		edit: (t, dtype, { css } = {}) => (<input
			className={ css }
			type="checkbox"
			checked={ dtype }
			onChange={ e => t.update(e.target.checked) }
		/>),
		view: (t, dtype, { css } = {}) => (<div className={ css }>{ dtype }</div>),
	} ],
	[ EnumTagType.CHARACTER, {
		edit: (t, dtype, { css } = {}) => (<input
			className={ css }
			type="text"
			value={ dtype }
			onChange={ e => t.update(e.target.value) }
		/>),
		view: (t, dtype, { css } = {}) => (<div className={ css }>{ dtype }</div>),
	} ],
	[ EnumTagType.ARRAY, {
		edit: (t, dtype, { css, isEditing } = {}) => (t.state.map(t => Factory(t, { key: t.id, isEditing }))),
		view: (t, dtype, { css, isEditing } = {}) => (t.state.map(t => Factory(t, { key: t.id, isEditing }))),
	} ],
	[ EnumTagType.GROUP, {
		edit: (t, dtype, { css, isEditing } = {}) => (t.state.map(t => Factory(t, { key: t.id, isEditing }))),
		view: (t, dtype, { css, isEditing } = {}) => (t.state.map(t => Factory(t, { key: t.id, isEditing }))),
	} ],
	[ EnumTagType.NAMESPACE, {
		edit: (t, dtype, { css, isEditing } = {}) => (t.state.map(t => Factory(t, { key: t.id, isEditing }))),
		view: (t, dtype, { css, isEditing } = {}) => (t.state.map(t => Factory(t, { key: t.id, isEditing }))),
	} ],
]);

export const EnumTypeColor = new Map([
	[ EnumTagType.ANY, `gray-200` ],
	[ EnumTagType.ARRAY, `gray-200` ],
	[ EnumTagType.BOOLEAN, `purple-200` ],
	[ EnumTagType.CHARACTER, `orange-200` ],
	[ EnumTagType.GROUP, `gray-400` ],
	[ EnumTagType.NAMESPACE, `neutral-600` ],
	[ EnumTagType.INT8, `blue-200` ],
	[ EnumTagType.STRING, `red-200` ],
	[ EnumTagType.UINT8, `teal-200` ],
]);

/**
 * Dynamically determines the appropriate JSX component to use, based on the `dtype` property of @tag.
 */
export function Factory(tag, props = {}) {
	let { view, edit } = TypeToProps.get(tag.dtype) || TypeToProps.get(EnumTagType.ANY);

	let isGroupingTag = [ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype);
	return (
		<div key={ tag.id } className={ `flex ${ isGroupingTag ? "flex-col mt-4" : "flex-row" } m-2 border-2 border-gray-400 border-solid rounded` }>
			<div  className={ `p-0 mt-auto mb-auto mr-0 font-mono font-bold text-center align-middle bg-${ EnumTypeColor.get(tag.dtype) } basis-2/12 ${ tag.dtype === EnumTagType.NAMESPACE ? `text-white` : `` }` }>{ tag.alias }</div>
			{
				isGroupingTag
					? <Schema tag={ tag } view={ view } edit={ edit } { ...props } />
					: <Schema tag={ tag } view={ view } edit={ edit } css={ `hover:border-2 hover:border-${ EnumTypeColor.get(tag.dtype) } hover:border-solid hover:rounded hover:m-[-2px] pl-2 basis-10/12` } { ...props } />
			}
		</div>
	);
};

export default {
	Schema,

	TypeToProps,
	Factory,
};