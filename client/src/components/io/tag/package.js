import { EnumTagType } from "./../../../lib/dms/tags/Tag";

import { Tag } from "./Tag";

/**
 * If you need something more specific, create a custom view or edit component and return it in the render functions below.
 */
export const TypeToProps = new Map([
	[ EnumTagType.ANY, {
		edit: (t, v, { css } = {}) => (<div className={ css }>{ v.toString() }</div>),
		view: (t, v, { css } = {}) => (<div className={ css }>{ v.toString() }</div>),
	} ],

	[ EnumTagType.STRING, {
		edit: (t, v, { css } = {}) => (<input className={ css } type="text" value={ v } onChange={ e => t.update(e.target.value) } />),
		view: (t, v, { css } = {}) => (<div className={ css }>{ v }</div>),
	} ],
	[ EnumTagType.INT8, {
		edit: (t, v, { css } = {}) => (<input
			className={ css }
			type="number"
			value={ v }
			min={ -128 }
			max={ 127 }
			step={ 1 }
			onChange={ e => t.update(e.target.value) }
		/>),
		view: (t, v, { css } = {}) => (<div className={ css }>{ v }</div>),
	} ],
	[ EnumTagType.UINT8, {
		edit: (t, v, { css } = {}) => (<input
			className={ css }
			type="number"
			value={ v }
			min={ 0 }
			max={ 255 }
			step={ 1 }
			onChange={ e => t.update(e.target.value) }
		/>),
		view: (t, v, { css } = {}) => (<div className={ css }>{ v }</div>),
	} ],
	[ EnumTagType.BOOLEAN, {
		edit: (t, v, { css } = {}) => (<input
			className={ css }
			type="checkbox"
			checked={ v }
			onChange={ e => t.update(e.target.checked) }
		/>),
		view: (t, v, { css } = {}) => (<div className={ css }>{ v ? "true" : "false" }</div>),
	} ],
	[ EnumTagType.CHARACTER, {
		edit: (t, v, { css } = {}) => (<input
			className={ css }
			type="text"
			value={ v }
			onChange={ e => t.update(e.target.value) }
		/>),
		view: (t, v, { css } = {}) => (<div className={ css }>{ v }</div>),
	} ],
	[ EnumTagType.ARRAY, {
		edit: (t, v, { css, isEditing } = {}) => (v.map(t => <Factory tag={ t } key={ t.id } isEditing={ isEditing } />)),
		view: (t, v, { css, isEditing } = {}) => (v.map(t => <Factory tag={ t } key={ t.id } isEditing={ isEditing } />)),
	} ],
	[ EnumTagType.GROUP, {
		edit: (t, v, { css, isEditing } = {}) => (v.map(t => <Factory tag={ t } key={ t.id } isEditing={ isEditing } />)),
		view: (t, v, { css, isEditing } = {}) => (v.map(t => <Factory tag={ t } key={ t.id } isEditing={ isEditing } />)),
	} ],
	[ EnumTagType.NAMESPACE, {
		edit: (t, v, { css, isEditing } = {}) => (v.map(t => <Factory tag={ t } key={ t.id } isEditing={ isEditing } />)),
		view: (t, v, { css, isEditing } = {}) => (v.map(t => <Factory tag={ t } key={ t.id } isEditing={ isEditing } />)),
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
export function Factory({ tag, ...props }) {
	let { view, edit } = TypeToProps.get(tag.dtype) || TypeToProps.get(EnumTagType.ANY);

	let isGroupingTag = [ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype);
	return (
		<div key={ `tag:${ tag.id }` } className={ `flex ${ isGroupingTag ? "flex-col mt-4" : "flex-row" } m-2 border-2 border-gray-400 border-solid rounded` }>
			<div className={ `basis-2/12 p-0 mt-auto mb-auto mr-0 font-mono font-bold text-center align-middle bg-${ EnumTypeColor.get(tag.dtype) } ${ tag.dtype === EnumTagType.NAMESPACE ? `text-white` : `` }` }>{ tag.alias }</div>
			{
				isGroupingTag
					? <Tag tag={ tag } view={ view } edit={ edit } { ...props } />
					: <Tag tag={ tag } view={ view } edit={ edit } css={ `hover:border-2 hover:border-${ EnumTypeColor.get(tag.dtype) } hover:border-solid hover:rounded hover:m-[-2px] pl-2 basis-10/12` } { ...props } />
			}
		</div>
	);
};

export default {
	Tag,

	TypeToProps,
	Factory,
};