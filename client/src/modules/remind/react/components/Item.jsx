import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useState } from "react";
import { useNodeEvent } from "./../useNodeEvent";

import { Status as SysStatus } from "../../systems/Status";
import { Item as SysItem } from "../../systems/class/Item";
import { ItemGroup as SysItemGroup } from "./../../systems/class/ItemGroup";

import { Item as ItemJS } from "./../../lib/Item";
import { ItemGroup as ItemGroupJS } from "./../../lib/ItemGroup";

export function Item({ item }) {
	const [ baseItem, setBaseItem ] = useState(item);
	const [ editMode, setEditMode ] = useState(false);
	const { } = useNodeEvent("update", baseItem);

	function onCompleteEvent(e) {
		let next = SysStatus.toggle(baseItem);

		// setItem(new Item(next));
		setBaseItem(next);
	}

	function onMarkdownEvent(e) {
		let next = SysItem.update(baseItem, e.target.value);

		// setItem(new Item(next));
		setBaseItem(next);
	}

	function enableEditMode() {
		if(!editMode) {
			setEditMode(!editMode);
		}
	}

	if(baseItem instanceof ItemGroupJS) {
		return (
			<div className={ `p-2 rounded border border-solid border-black w-full` }>
				{
					baseItem.state.children.map((child, index) => {
						return (
							<div key={ index }>
								<Item item={ child } />
							</div>
						)
					})
				}
				<div className="flex flex-row">
					<button onClick={ e => {
						let next = new ItemJS();

						SysItemGroup.addChild(baseItem, next);

						setBaseItem(baseItem);
					} }>Add Item</button>

					<button onClick={ e => {
						let next = new ItemGroupJS();

						SysItemGroup.addChild(baseItem, next);

						setBaseItem(baseItem);
					} }>Add Group Item</button>
				</div>
			</div>
		);
	}

	return (
		<div className={ `p-2 rounded border border-solid border-black w-full` }>
			<div className="flex flex-row">
				<div className="basis-1/12">
					<div className={ `${ item.get("complete") ? `bg-green-600` : `bg-red-600` }` } onClick={ onCompleteEvent }>&nbsp;</div>
				</div>
				<div className="basis-11/12" onClick={ enableEditMode }>
					{
						editMode
							? (
								<>
									<textarea
										className={ `w-full border border-solid rounded border-black min-h-[150px]` }
										value={ item.shared.item.markdown }
										onChange={ onMarkdownEvent }
										onBlur={ e => setEditMode(false) }
										onKeyUp={ e => {
											if(e.key === "Escape") {
												setEditMode(false);
											}
										} }
									/>
								</>
							) : (
								<ReactMarkdown children={ item.shared.item.markdown } remarkPlugins={ [ remarkGfm ] } />
							)
					}
				</div>
			</div>
			{/* <pre>
				{
					JSON.stringify(item.toObject(), null, 2)
				}
			</pre> */}
		</div>
	);
};

export default Item;