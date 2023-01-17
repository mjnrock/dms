import { CogIcon, DocumentIcon, ListBulletIcon, PhotoIcon, PlusIcon, RectangleGroupIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Modal } from "semantic-ui-react";

import { useState } from "react";
import { useNodeEvent } from "./../useNodeEvent";

import Base64 from "../../../../util/Base64";

import { Item as SysItem } from "./../../systems/class/Item";
import { ItemGroup as SysItemGroup } from "./../../systems/class/ItemGroup";

import { Item as ItemJS } from "./../../lib/Item";
import { ItemGroup as ItemGroupJS } from "./../../lib/ItemGroup";
import { ItemChecklist as ItemChecklistJS } from "./../../lib/custom/ItemChecklist";
import { ItemImage as ItemImageJS } from "../../lib/custom/ItemImage";

import Components from "./../../components/package";

import ComponentJSX from "./ecs/package";

import { Canvas } from "./Canvas";

import { TaskBar } from "./Taskbar";

const Wrapper = ({ className, x, y, children, ...rest }) => {
	return (
		<div className={ className } style={ { top: y, left: x } } { ...rest }>
			<div className={ `` }>
				{ children }
			</div>
		</div>
	);
};

export function ItemImage({ item, override, showTaskBar, onAction, className } = {}) {
	const { } = useNodeEvent("update", item);
	const [ width, setWidth ] = useState(500);
	const [ height, setHeight ] = useState(300);
	const [ alignment, setAlignment ] = useState("center");

	return (
		<>
			<ComponentJSX component="markdown" item={ item } type={ "title" } override={ override } className={ `mb-2` } />
			{
				item.shared.image && item.shared.image.canvas ? (
					<>
						<Canvas
							className={ `m-auto` }
							canvas={ item.shared.image.canvas }
							width={ width }
							height={ height }
						/>
						{
							showTaskBar ? (
								<div className={ `flex flex-row justify-center mt-2 font-mono` }>
									<input type="number" className={ `text-center` } value={ width } onChange={ e => setWidth(e.target.value) } />
									<input type="number" className={ `text-center` } value={ height } onChange={ e => setHeight(e.target.value) } />
								</div>
							) : null
						}
					</>
				) : (
					<div className={ `border-2 border-solid rounded shadow cursor-pointer border-violet-200 hover:bg-violet-100 hover:shadow-md mb-4 select-none` }>
						<label htmlFor={ item.id + "-upload" } className="cursor-pointer">
							<input
								className="hidden"
								type="file"
								id={ item.id + "-upload" }
								accept="image/*"
								onChange={ e => {
									Base64.DecodeFile(e.target.files[ 0 ]).then((canvas) => {
										SysItem.addComponent(item, `image`, Components.Image, {
											canvas: canvas,
										});

										onAction("update-component", item);

										e.target.value = null;
									});
								} }
							/>
							<PhotoIcon className="w-10 h-10 mx-auto mt-4 cursor-pointer text-violet-400" />
							<div className="mb-4 text-sm italic text-center cursor-pointer text-violet-300">Upload an Image</div>
						</label>
					</div>
				)
			}
			<ComponentJSX component="markdown" item={ item } type={ "content" } override={ override } />
			{
				showTaskBar ? (
					<TaskBar item={ item } onAction={ onAction } />
				) : null
			}
		</>
	);
};

export function ItemChecklist({ item, override, showTaskBar, onAction } = {}) {
	return (
		<>
			<div className="flex flex-row">
				<ComponentJSX component="status" item={ item } />
				<ComponentJSX component="markdown" item={ item } type={ "title" } override={ override } />
			</div>
			<ComponentJSX component="checklist" item={ item } override={ override } />
			{
				showTaskBar ? (
					<TaskBar item={ item } onAction={ onAction } />
				) : null
			}
		</>
	);
};

export function ItemGroup({ item, override, showTaskBar, showChecklist, onAction } = {}) {
	return (
		<>
			<ComponentJSX component="markdown" item={ item } type={ "title" } override={ override } />
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
						{/* <GroupItemTaskBar item={ item } onAction={ onAction } attr={ { showChecklist } } /> */ }
						<TaskBar item={ item } onAction={ onAction } attr={ { showChecklist } } />
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
	} else if(item instanceof ItemImageJS || item.shared.image) {
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
					<ComponentJSX component="status" item={ item } />
					<ComponentJSX component="markdown" item={ item } type={ "content" } override={ override } />
				</div>
				{
					showTaskBar ? (
						<TaskBar item={ item } onAction={ onAction } attr={ { showChecklist } } />
					) : null
				}
			</>
		);
	}

	//FIXME: Overall this works well, but some of the jsx components don't update properly after a node is deleted
	return (
		<Wrapper className={ classNames + ` mt-2 p-2 rounded border border-l-4 border-solid ` + css } { ...rest }>
			<Modal
				onClose={ () => setShowConfig(false) }
				onOpen={ () => setShowConfig(true) }
				open={ showConfig }
			>
				<div className={ `flex flex-col p-4 select-none` }>
					<div
						className={ `p-2 border border-solid border-neutral-200 font-mono text-neutral-600 text-center rounded shadow-sm cursor-copy active:bg-emerald-50 active:border-emerald-200 hover:shadow hover:bg-neutral-50` }
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

					<div className={ `flex flex-row gap-2 mt-4` }>
						{
							Object.entries(Components).filter(([ k, v ]) => ![ `acomponent` ].includes(k.toLowerCase())).map(([ key, value ]) => {
								let color = key.toLowerCase() in item.shared ? `emerald` : `neutral`,
									hoverColor = color === `emerald` ? `rose` : `emerald`;

								return (
									<button
										key={ key }
										className={ `flex-1 p-2 font-mono border border-solid rounded shadow-sm text-neutral-700 bg-${ color }-50 hover:bg-${ hoverColor }-100 border-${ color }-300 hover:border-${ hoverColor }-400 hover:text-${ hoverColor }-400 hover:shadow` }
										onClick={ e => {
											if(key.toLowerCase() in item.shared) {
												SysItem.removeComponent(item, key.toLowerCase());

												onAction("delete-component", item);
											} else {
												SysItem.addComponent(item, key.toLowerCase(), value, {});

												onAction("add-component", item);
											}
										} }>
										{ key }
									</button>
								);
							})
						}
					</div>

					<div className={ `flex flex-row gap-2 mt-8` }>
						{
							Array.from(item.tokens).map(token => (
								<div
									key={ token }
									className={ `p-1 rounded border border-solid border-sky-400 bg-sky-100 text-sky-800 hover:border-sky-500 hover:bg-sky-200 hover:text-sky-900 font-mono text-xs cursor-copy active:bg-emerald-50 active:border-emerald-200` }
									onClick={ e => {
										navigator.clipboard.writeText(token);
									} }
								>
									{ token }
								</div>
							))
						}
					</div>
				</div>
			</Modal>

			{ jsx }
		</Wrapper>
	);
};

export default Item;