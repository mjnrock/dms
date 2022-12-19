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
		Required: false,
		Nullable: true,
	});

	function updateSetting(key, next, current) {
		setSetting({
			...setting,
			[ key ]: next,
		});
	}

	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);
	magnitude += 100;

	return (
		<div className={ `mb-2 p-2 flex flex-col border-2 border-solid rounded border-${ color }-${ 100 } shadow-sm` }>
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
				<input className={ `basis-1/2 ml-2 p-2 focus:shadow-sm focus:outline-3 focus:outline-${ color }-${ 200 } border rounded border-transparent hover:rounded hover:border hover:border-${ color }-${ 200 } hover:rounded` } value={ tag.alias } onChange={ e => editAlias(e.target.value) } />

				{/* Type */ }
				<Dropdown text={ tag.dtype } className={ `basis-1/2 p-2 ml-2 font-mono font-bold text-${ color }-${ magnitude } hover:bg-${ color }-${ magnitude + 200 } hover:rounded` } icon={ "none" }>
					<Dropdown.Menu className={ `w-full` }>
						{
							Array.from(Object.values(EnumTagType))
							.filter(o => [ EnumTagType.ANY, EnumTagType.NAMESPACE, EnumTagType.SCHEMA ].includes(o) === false)
							.map((option, index) => {
								let [ color, magnitude ] = EnumTypeColor.get(option);
								magnitude += 100;

								return (
									<div key={ index } onClick={ () => editType(option) } className={ `p-2 font-mono font-bold text-center cursor-pointer bg-${ color }-${ 100 } text-${ color }-${ magnitude } hover:bg-${ color }-${ magnitude + 200 }` }>{ option }</div>
								);
							})
						}
					</Dropdown.Menu>
				</Dropdown>

				{/* Expand/collapse icon */ }
				<div className="mt-auto mb-auto">
					{
						mode === "simple"
							? (
								<PlusIcon className={ `w-6 h-6 text-${ color }-300 cursor-pointer` } onClick={ e => setMode("advanced") } />
							) : (
								<MinusIcon className={ `w-6 h-6 text-${ color }-300 cursor-pointer` } onClick={ e => setMode("simple") } />
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