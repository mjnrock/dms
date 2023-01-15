import { Cog6ToothIcon, CogIcon, DocumentIcon, ListBulletIcon, LockClosedIcon, LockOpenIcon, PencilIcon, PhotoIcon, PlusIcon, RectangleGroupIcon, TrashIcon } from "@heroicons/react/24/outline";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Modal } from "semantic-ui-react";

import { useState, useEffect, useRef } from "react";
import { useNodeEvent } from "./../useNodeEvent";

import Base64 from "../../../../util/Base64";

import { Status as SysStatus } from "../../systems/Status";
import { Markdown as SysMarkdown } from "../../systems/Markdown";
import { Item as SysItem } from "./../../systems/class/Item";
import { ItemGroup as SysItemGroup } from "./../../systems/class/ItemGroup";
import { Checklist as SysChecklist } from "./../../systems/Checklist";
import { Image as SysImage } from "./../../systems/Image";

import { Node as NodeJS } from "../../lib/Node";
import { Item as ItemJS } from "./../../lib/Item";
import { ItemGroup as ItemGroupJS } from "./../../lib/ItemGroup";
import { ItemCollection as ItemCollectionJS } from "./../../lib/ItemCollection";
import { ItemChecklist as ItemChecklistJS } from "./../../lib/custom/ItemChecklist";
import { ItemImage as ItemImageJS } from "../../lib/custom/ItemImage";

import { Checklist as ChecklistJSX } from "./Checklist";
import { Canvas } from "./Canvas";
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
				className="p-2 ml-2 border border-gray-300 border-solid rounded shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:text-gray-400 hover:shadow"
				onClick={ e => {
					onAction("config", item);
				} }>
				<CogIcon className="w-4 h-4 text-gray-400" />
			</button>

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

			<label
				htmlFor={ item.id }
				className="p-2 ml-2 border border-solid rounded shadow-sm cursor-pointer border-violet-200 hover:bg-violet-100 hover:shadow"
			>
				<input
					className="hidden"
					type="file"
					id={ item.id }
					accept="image/*"
					onChange={ e => {
						Base64.DecodeFile(e.target.files[ 0 ]).then((canvas) => {
							console.log(canvas);
							let next = new ItemImageJS({
								shared: {
									image: {
										canvas: canvas,
									},
								},
							});

							SysItemGroup.addChild(baseItem, next);

							setBaseItem(baseItem);

							onAction("add-group", baseItem);

							e.target.value = null;
						});
					} }
				/>
				<PhotoIcon className="w-4 h-4 text-violet-400" />
			</label>

			<div className={ `ml-2` } />

			<CommonTaskBarButtons item={ item } onAction={ onAction } attr={ attr } />
		</div>
	);
};

export function ItemImage({ item, override, showTaskBar, onAction, className } = {}) {
	const [ width, setWidth ] = useState(500);
	const [ height, setHeight ] = useState(300);
	const [ alignment, setAlignment ] = useState("center");

	return (
		<>
			<MarkdownEditor item={ item } type={ "title" } override={ override } className={ `mb-2` } />
			<Canvas
				className={ `m-auto` }
				canvas={ item.shared.image.canvas }
				width={ width }
				height={ height }
			/>
			{
				showTaskBar ? (
					<div className={ `flex flex-row justify-center` }>
						<input type="number" className={ `text-center` } value={ width } onChange={ e => setWidth(e.target.value) } />
						<input type="number" className={ `text-center` } value={ height } onChange={ e => setHeight(e.target.value) } />
					</div>
				) : null
			}
			<MarkdownEditor item={ item } type={ "content" } override={ override } />
			{
				showTaskBar ? (
					<ItemTaskBar item={ item } onAction={ onAction } />
				) : null
			}
		</>
	);
};

export function ItemChecklist({ item, override, showTaskBar, onAction } = {}) {
	return (
		<>
			<div className="flex flex-row">
				{
					item.shared.status ? (
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
					) : null
				}
				<MarkdownEditor item={ item } type={ "title" } override={ override } />
			</div>
			<ChecklistJSX item={ item } override={ override } />
			{
				showTaskBar ? (
					<ItemTaskBar item={ item } onAction={ onAction } />
				) : null
			}
		</>
	);
};

export function ItemGroup({ item, override, showTaskBar, showChecklist, onAction } = {}) {
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
				showTaskBar ? (
					<div className={ `mt-4` }>
						<GroupItemTaskBar item={ item } onAction={ onAction } attr={ { showChecklist } } />
					</div>
				) : null
			}
		</>
	);
};

export function Item({ item, x, y, showTaskBar, override, ...rest }) {
	const { } = useNodeEvent("update", item);
	const [ showChecklist, setShowChecklist ] = useState(false);
	const [ showConfig, setShowConfig ] = useState(false);

	//IDEA: Ideate around how to best do this
	let classNames = ``;
	if(x != null && y != null) {
		// classNames = `absolute`;
	}

	function onAction(action, item) {
		if(action === "checklist") {
			setShowChecklist(!showChecklist);
		} else if(action === "config") {
			setShowConfig(true);
		}
	}

	let [ jsx, css ] = [ null, `text-gray-600 bg-white border-neutral-300 shadow-lg` ];
	if(item instanceof ItemGroupJS) {
		jsx = (
			<ItemGroup
				className={ classNames }
				item={ item }
				override={ override }
				showTaskBar={ showTaskBar }
				showChecklist={ showChecklist }
				onAction={ onAction }
				{ ...rest }
			/>
		);
		css = `border-neutral-200 text-neutral-600 bg-neutral-50 shadow`;
	} else if(item instanceof ItemChecklistJS) {
		jsx = (
			<ItemChecklist
				className={ classNames }
				item={ item }
				override={ override }
				showTaskBar={ showTaskBar }
				onAction={ onAction }
				{ ...rest }
			/>
		);
	} else if(item instanceof ItemImageJS) {
		jsx = (
			<ItemImage
				className={ classNames }
				item={ item }
				override={ override }
				showTaskBar={ showTaskBar }
				onAction={ onAction }
				{ ...rest }
			/>
		);
	} else {
		jsx = (
			<>
				<div className="flex flex-row">
					{
						item.shared.status ? (
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
						) : null
					}
					<MarkdownEditor item={ item } type={ "content" } override={ override } />
				</div>
				{
					showTaskBar ? (
						<ItemTaskBar item={ item } onAction={ onAction } attr={ { showChecklist } } />
					) : null
				}
			</>
		);
	}

	return (
		<Wrapper className={ classNames + ` mt-2 p-2  rounded border border-l-4 border-solid ` + css } { ...rest }>
			<Modal
				onClose={ () => setShowConfig(false) }
				onOpen={ () => setShowConfig(true) }
				open={ showConfig }
			>
				<div className={ `flex flex-col p-2 m-2 pb-0` }>
					<div
						className={ `p-2 border border-solid border-neutral-200 font-mono text-neutral-600 text-center mb-4 rounded shadow-sm cursor-copy active:bg-emerald-50 active:border-emerald-200 hover:shadow` }
						onClick={ e => {
							if(e.ctrlKey) {
								/* Copy the `ref` version of the UUID */
								navigator.clipboard.writeText(`@${ item.id }`);
							} else {
								/* Copy the UUID */
								navigator.clipboard.writeText(item.id);
							}
						} }
					>{ item.id }</div>
					{
						Object.entries(item.shared).map(([ key, value ]) => {
							return (
								<div
									key={ key }
									className={ `truncate flex flex-row border border-t-2 border-solid border-neutral-200 border-t-neutral-400 rounded mb-2 p-2 shadow hover:shadow-md` }
									onContextMenu={ e => {
										//STUB: Bind this to something more appropriate
										e.preventDefault();
										if(e.ctrlKey) {
											SysItem.removeComponent(item, key);
										}
									} }
								>
									<div className={ `w-1/2 font-bold text-neutral-700` }>
										{ key }
									</div>
									<pre className={ `w-1/2 font-mono text-neutral-600` }>
										{ JSON.stringify(value, null, 2) }
									</pre>
								</div>
							);
						})
					}
				</div>
			</Modal>

			{ jsx }
		</Wrapper>
	);
};

export default Item;