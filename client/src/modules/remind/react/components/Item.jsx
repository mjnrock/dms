import { Cog6ToothIcon, DocumentIcon, ListBulletIcon, LockClosedIcon, LockOpenIcon, PencilIcon, PlusIcon, RectangleGroupIcon, TrashIcon } from "@heroicons/react/24/outline";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useState, useEffect, useRef } from "react";
import { useNodeEvent } from "./../useNodeEvent";

import { Status as SysStatus } from "../../systems/Status";
import { Item as SysItem } from "../../systems/Item";
import { ItemGroup as SysItemGroup } from "./../../systems/class/ItemGroup";
import { Checklist as SysChecklist } from "./../../systems/Checklist";

import { Node as NodeJS } from "../../lib/Node";
import { Item as ItemJS } from "./../../lib/Item";
import { ItemGroup as ItemGroupJS } from "./../../lib/ItemGroup";
import { ItemCollection as ItemCollectionJS } from "./../../lib/ItemCollection";
import { ItemChecklist as ItemChecklistJS } from "./../../lib/custom/ItemChecklist";

import { Checklist as ChecklistJSX } from "./Checklist";
import { MarkdownEditor } from "./MarkdownEditor";
import { StatusDropdown } from "./StatusDropdown";

const Wrapper = ({ className, x, y, children, ...rest }) => {
	return (
		<div className={ className } style={ { top: y, left: x } } { ...rest }>
			<div className={ `` }>
				{ children }
			</div>
		</div>
	);
};

export function CommonTaskBarButtons({ item, onAction = () => { }, attr = {}, ...props } = {}) {
	const { showChecklist } = attr;

	return (
		<>
			{
				item.hasToken(`@remind:item-group`) ? (
					<button
						className={ `p-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-neutral-100 hover:shadow ${ item.shared.checklist ? `text-orange-200 border-orange-200` : `text-neutral-400` } ${ showChecklist ? `bg-orange-50 hover:bg-orange-100` : `` }` }
						onClick={ e => {
							let next = new ItemChecklistJS();

							SysItemGroup.addChild(item, next);

							onAction("checklist", item);
						} }>
						<ListBulletIcon className="w-4 h-4" />
					</button>
				) : null
			}

			<button
				className="p-2 ml-2 border border-solid rounded shadow-sm border-rose-300 hover:bg-rose-50 hover:border-rose-400 hover:text-rose-400 hover:shadow"
				onClick={ e => {
					SysItemGroup.removeChild(item.state.parent, item);

					onAction("delete", item);
				} }>
				<TrashIcon className="w-4 h-4 text-rose-400" />
			</button>
		</>
	);
};

export function ItemTaskBar({ item, onAction = () => { }, attr, ...props } = {}) {
	return (
		<div className="flex flex-row mt-2">
			<CommonTaskBarButtons item={ item } onAction={ onAction } attr={ attr } />
		</div>
	);
};
export function GroupItemTaskBar({ item, onAction = () => { }, attr, ...props } = {}) {
	const [ baseItem, setBaseItem ] = useState(item);

	return (
		<div className="flex flex-row mt-2">
			<button
				className="p-2 border border-blue-200 border-solid rounded shadow-sm hover:bg-blue-100 hover:shadow"
				onClick={ e => {
					let next = new ItemJS();

					SysItemGroup.addChild(baseItem, next);

					setBaseItem(baseItem);

					onAction("add-item", baseItem);
				} }>
				<DocumentIcon className="w-4 h-4 text-blue-400" />
			</button>

			<button
				className="p-2 ml-2 border border-green-200 border-solid rounded shadow-sm hover:bg-green-100 hover:shadow"
				onClick={ e => {
					let next = new ItemGroupJS();

					SysItemGroup.addChild(baseItem, next);

					setBaseItem(baseItem);

					onAction("add-group", baseItem);
				} }>
				<RectangleGroupIcon className="w-4 h-4 text-green-400" />
			</button>

			<div className={ `ml-2` } />

			<CommonTaskBarButtons item={ item } onAction={ onAction } attr={ attr } />
		</div>
	);
};

export function ItemGroup({ item, override, showTaskBar, showChecklist } = {}) {
	return (
		<>
			<MarkdownEditor item={ item } type={ "title" } override={ override } />
			{
				item.state.children.map((child, index) => {
					return (
						<div key={ index }>
							<Item item={ child } showTaskBar={ showTaskBar } override={ override } />
						</div>
					)
				})
			}
			{
				(item.shared.checklist && showChecklist) ? (
					<ChecklistJSX item={ item } attr={ { showChecklist } } />
				) : null
			}
		</>
	);
};

export function Item({ item, x, y, showTaskBar, override, ...rest }) {
	const { } = useNodeEvent("update", item);
	const [ showChecklist, setShowChecklist ] = useState(false);

	//IDEA: Ideate around how to best do this
	let classNames = ``;
	if(x != null && y != null) {
		// classNames = `absolute`;
	}

	function onAction(action, item) {
		if(action === "checklist") {
			setShowChecklist(!showChecklist);
		}
	}

	if(item instanceof ItemGroupJS) {
		return (
			<Wrapper className={ classNames + ` p-2 my-1 border border-solid rounded border-neutral-200 text-neutral-600 bg-neutral-50 shadow` } { ...rest } x={ x } y={ y }>
				<ItemGroup item={ item } showTaskBar={ showTaskBar } showChecklist={ showChecklist } override={ override } />
				{
					showTaskBar ? (
						<div className={ `mt-4` }>
							<GroupItemTaskBar item={ item } onAction={ onAction } attr={ { showChecklist } } />
						</div>
					) : null
				}
			</Wrapper>
		);
	} else if(item instanceof ItemChecklistJS) {
		return (
			<Wrapper className={ classNames + ` mt-2 p-2 text-gray-600 bg-white rounded border border-l-4 border-solid border-neutral-300 shadow-lg` } { ...rest } x={ x } y={ y }>
				<StatusDropdown
					item={ item }
					callback={ (etype, status) => {
						if(etype === "select") {
							SysStatus.setCurrent(item, status);
						}
					} }
				/>
				<MarkdownEditor item={ item } type={ "title" } override={ override } />
				<ChecklistJSX item={ item } override={ override } />
				{
					showTaskBar ? (
						<ItemTaskBar item={ item } onAction={ onAction } attr={ { showChecklist } } />
					) : null
				}
			</Wrapper>
		);
	}

	return (
		<Wrapper className={ classNames + ` mt-2 p-2 text-gray-600 bg-white rounded border border-l-4 border-solid border-neutral-300 shadow-lg` } { ...rest }>
			<div className="flex flex-row">
				<div className={ `` }>
					<StatusDropdown
						item={ item }
						callback={ (etype, status) => {
							if(etype === "select") {
								SysStatus.setCurrent(item, status);
							}
						} }
					/>
				</div>
				<MarkdownEditor item={ item } type={ "content" } override={ override } />
			</div>
			{
				showTaskBar ? (
					<ItemTaskBar item={ item } onAction={ onAction } attr={ { showChecklist } } />
				) : null
			}
		</Wrapper>
	);
};

export default Item;