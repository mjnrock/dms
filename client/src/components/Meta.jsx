import { Bars3Icon, ChevronDownIcon, ChevronRightIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { EnumTagType } from "../lib/dms/tags/Tag";
import { useState } from "react";
import { useEffect } from "react";

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
						<div key={ `${ key }:${ tag.id }` } className={ `flex flex-row` }>
							<code className={ `basis-1/2` }>{ key }</code>
							<div className="basis-1/2">
								<input className={ `mr-4 ml-4` } type="radio" name={ `${ key.toLowerCase() }:${ tag.id }` } value="1" checked={ value } onChange={ e => updateSetting(key, true, value) } />
								<label>On</label>

								<input className={ `mr-4 ml-4` } type="radio" name={ `${ key.toLowerCase() }:${ tag.id }` } value="0" checked={ !value } onChange={ e => updateSetting(key, false, value) } />
								<label>Off</label>
							</div>
						</div>
					);
				})
			}
		</div>
	);
}

function InfoBar({ tag }) {
	const [ mode, setMode ] = useState("simple");	// String version of "isExpanded", allowing for more nuanced states

	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);
	magnitude += 100;

	function editAlias(alias) {
		tag.alias = alias;
	}

	return (
		<div className="flex flex-col">
			<div className="flex flex-row p-2">
				<div className="pr-2">
					<Bars3Icon className={ `w-6 h-6 text-${ color }-400 cursor-grab` } />
				</div>
				<input className={ `basis-1/2` } value={ tag.alias } onChange={ e => editAlias(e.target.value) } />
				<input className={ `basis-1/2 font-mono font-bold text-${ color }-${ magnitude }` } value={ tag.dtype } readOnly={ true } />
				<div className="pl-2">
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
		</div>
	);
}

export function Meta({ tag }) {
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
			<InfoBar tag={ tag } />
			<>
				{
					[ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype)
						? tag.state.map((child, index) => {
							return (
								<Meta key={ `meta:${ child.id }` } tag={ child } />
							);
						})
						: null
				}
			</>
		</div>
	);
};

export default Meta;