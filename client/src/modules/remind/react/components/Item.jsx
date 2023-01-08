import { Cog6ToothIcon, ListBulletIcon, LockClosedIcon, LockOpenIcon, PencilIcon, PlusIcon, RectangleGroupIcon, TrashIcon } from "@heroicons/react/24/outline";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useState, useEffect } from "react";
import { useNodeEvent } from "./../useNodeEvent";

import { Status as SysStatus } from "../../systems/Status";
import { Item as SysItem } from "../../systems/Item";
import { ItemGroup as SysItemGroup } from "./../../systems/class/ItemGroup";
import { Checklist as SysChecklist } from "./../../systems/Checklist";

import { Item as ItemJS } from "./../../lib/Item";
import { ItemGroup as ItemGroupJS } from "./../../lib/ItemGroup";
import { ItemCollection as ItemCollectionJS } from "./../../lib/ItemCollection";
import { Node as NodeJS } from "../../lib/Node";

import { Checklist as ChecklistJSX } from "./Checklist";
import { StatusDropdown } from "./StatusDropdown";

export function Item({ item }) {
	const [ baseItem, setBaseItem ] = useState(item);
	const [ editMode, setEditMode ] = useState(false);
	const [ groupEditMode, setGroupEditMode ] = useState(false);

	// const { emitter, prop, current, previous } = useNodeEvent("update", baseItem);
	const { } = useNodeEvent("update", baseItem);

	function onCompleteEvent(e) {
		let next = SysStatus.toggle(baseItem);

		setBaseItem(next);
	}

	function onMarkdownEvent(e) {
		let next = SysItem.update(baseItem, { content: e.target.value });

		setBaseItem(next);
	}

	function enableEditMode() {
		if(!editMode) {
			setEditMode(!editMode);
		}
	}

	if(baseItem instanceof ItemGroupJS) {
		return (
			<div className={ `mt-2 pt-0 p-2 rounded border border-solid border-neutral-200 shadow-sm hover:shadow w-full` }>
				<div className="flex flex-row mt-2">
					{
						groupEditMode ? (
							<>
								<input
									className="w-full p-2 text-lg text-center border border-solid rounded shadow-sm border-neutral-300 hover:shadow"
									type="text"
									value={ baseItem.shared.item.title }
									placeholder="Add a title..."
									onBlur={ e => setGroupEditMode(false) }
									onKeyUp={ e => {
										if(e.key === "Escape") {
											setGroupEditMode(false);
										}
									} }
									onChange={ e => {
										let next = SysItem.setTitle(baseItem, e.target.value);

										setBaseItem(next);
									} } />
							</>
						) : (
							<>
								<div
									className="w-full p-2 text-lg text-center border border-transparent border-solid rounded"
									onClick={ e => {
										setGroupEditMode(!groupEditMode);
									} }
								>
									{
										baseItem.shared.item.title ? (
											<ReactMarkdown remarkPlugins={ [ remarkGfm ] }>{ baseItem.shared.item.title }</ReactMarkdown>
										) : (
											<div className="text-neutral-400">Add a title...</div>
										)
									}
								</div>
							</>
						)
					}
				</div>
				{
					baseItem.state.children.map((child, index) => {
						return (
							<div key={ index }>
								<Item item={ child } />
							</div>
						)
					})
				}
				{
					baseItem.shared.checklist ? (
						<ChecklistJSX item={ baseItem } />
					) : null
				}
				<div className="flex flex-row mt-2">
					<button
						className="p-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-green-200 hover:shadow"
						onClick={ e => {
							let next = new ItemJS();

							SysItemGroup.addChild(baseItem, next);

							setBaseItem(baseItem);
						} }>
						<PlusIcon className="w-4 h-4" />
					</button>

					<button
						className="p-2 ml-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-blue-200 hover:shadow"
						onClick={ e => {
							let next = new ItemGroupJS();

							SysItemGroup.addChild(baseItem, next);

							setBaseItem(baseItem);
						} }>
						<RectangleGroupIcon className="w-4 h-4" />
					</button>

					<button
						className="p-2 ml-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-blue-200 hover:shadow"
						onClick={ e => {
							SysChecklist.attachChecklist(baseItem);
						} }>
						<ListBulletIcon className="w-4 h-4" />
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={ `mt-2 p-2 rounded border border-solid border-neutral-200 shadow-sm hover:shadow w-full` }>
			<div className="flex flex-row">
				<div className={ `` }>
					<StatusDropdown
						item={ baseItem }
						callback={ (etype, status) => {
							if(etype === "select") {
								SysStatus.setCurrent(baseItem, status);
							}
						} }
					/>
				</div>
				<div className="w-full pl-2" onClick={ enableEditMode }>
					{
						editMode
							? (
								<>
									<textarea
										className={ `w-full border border-solid rounded border-black min-h-[150px]` }
										value={ item.shared.item.content }
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
								<>
									<ReactMarkdown children={ item.shared.item.content } remarkPlugins={ [ remarkGfm ] } />
								</>
							)
					}
				</div>
			</div>
			{
				baseItem.shared.checklist ? (
					<ChecklistJSX item={ baseItem } />
				) : (
					<div className="flex flex-row mt-2">
						<button
							className="p-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-blue-200 hover:shadow"
							onClick={ e => {
								SysChecklist.attachChecklist(baseItem);
							} }>
							<ListBulletIcon className="w-4 h-4" />
						</button>
					</div>
				)
			}
		</div>
	);
};

export default Item;