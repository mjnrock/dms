import { useState, useEffect } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import { Bars3Icon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

import { EnumTagType, ReverseEnumTagType } from "../lib/dms/tags/Tag";
import Builder from "../lib/dms/tags/controller/Builder";

export const EnumTypeColor = new Map([
	[ EnumTagType.ANY, [ "gray", 200 ] ],
	[ EnumTagType.ARRAY, [ "gray", 200 ] ],
	[ EnumTagType.BOOLEAN, [ "purple", 200 ] ],
	[ EnumTagType.CHARACTER, [ "orange", 200 ] ],
	[ EnumTagType.GROUP, [ "gray", 400 ] ],
	[ EnumTagType.NAMESPACE, [ "neutral", 600 ] ],
	[ EnumTagType.INT8, [ "blue", 200 ] ],
	[ EnumTagType.STRING, [ "red", 200 ] ],
	[ EnumTagType.UINT8, [ "teal", 200 ] ],
	[ EnumTagType.SCHEMA, [ "gray", 400 ] ],
]);

function DetailBar({ tag }) {
	const [ setting, setSetting ] = useState({
		IsNullable: true,
		IsNullable2: true,
	});

	function updateSetting(key, next, current) {
		setSetting({
			...setting,
			[ key ]: next,
		});
	}

	return (
		<div className={ `mb-2 p-2 flex flex-col border-2 border-solid rounded border-neutral-100 shadow-sm` }>
			{
				Object.entries(setting).map(([ key, value ]) => {
					return (
						<div key={ `${ key }:${ tag.id }` } className={ `flex flex-row mt-2` }>
							<code className={ `basis-1/2` }>{ key }</code>
							<div className="basis-1/2">
								<Button
									basic
									color={ value ? `green` : `red` }
									className={ `w-full` }
									onClick={ e => updateSetting(key, !value, value) }
								>{ value ? `Yes` : `No` }</Button>
							</div>
						</div>
					);
				})
			}
		</div>
	);
}

function InfoBar({ tag, parent }) {
	const [ mode, setMode ] = useState("simple");	// String version of "isExpanded", allowing for more nuanced states

	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);
	magnitude += 100;

	function editAlias(alias) {
		tag.alias = alias;
	}
	function editType(type) {
		parent.replaceChild(tag, Builder.Factory(type, null, {
			alias: tag.alias,
		}));
	}

	return (
		<div className="flex flex-col">
			<div className="flex flex-row">
				{/* Reorder handle icon */ }
				<div className="mt-auto mb-auto">
					<Bars3Icon className={ `w-6 h-6 text-${ color }-400 cursor-grab` } />
				</div>

				{/* Alias */ }
				<input className={ `basis-1/2 p-2` } value={ tag.alias } onChange={ e => editAlias(e.target.value) } />

				{/* Type */ }
				<div className={ `basis-1/2 mt-auto mb-auto font-mono font-bold text-${ color }-${ magnitude }` }>
					<Dropdown text={ tag.dtype }>
						<Dropdown.Menu>
							{
								Array.from(Object.values(EnumTagType)).map((option, index) => {
									let [ color, magnitude ] = EnumTypeColor.get(option);
									magnitude += 100;

									return (
										<Dropdown.Item key={ index } onClick={ () => editType(option) }>
											<div className={ `font-mono font-bold text-${ color }-${ magnitude }` }>{ option }</div>
										</Dropdown.Item>
									);
								})
							}
						</Dropdown.Menu>
					</Dropdown>
				</div>

				{/* Expand/collapse icon */ }
				<div className="mt-auto mb-auto">
					{
						mode === "simple"
							? (
								<PlusIcon className={ `w-6 h-6 text-${ color }-400 cursor-pointer` } onClick={ e => setMode("advanced") } />
							) : (
								<MinusIcon className={ `w-6 h-6 text-${ color }-400 cursor-pointer` } onClick={ e => setMode("simple") } />
							)
					}
				</div>
			</div>
			{
				mode === "advanced"
					? <DetailBar tag={ tag } />
					: null
			}
		</div >
	);
}

export function Meta({ tag, parent }) {
	const [ state, setState ] = useState({});

	useEffect(() => {
		let fn = ({ prop, current }) => {
			setState({
				...state,
				[ prop ]: current,
			});
		};

		tag.events.on("modify", fn);

		return () => {
			tag.events.off("modify", fn);
		};
	}, []);

	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);

	return (
		<div className={ `m-2 p-2 border-2 border-${ color }-200 border-solid rounded flex flex-col shadow-md` }>
			<InfoBar tag={ tag } parent={ parent } />
			<>
				{
					[ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype)
						? tag.state.map((child, index) => {
							return (
								<Meta key={ `meta:${ child.id }` } tag={ child } parent={ tag } />
							);
						})
						: null
				}
			</>
		</div>
	);
};

export default Meta;