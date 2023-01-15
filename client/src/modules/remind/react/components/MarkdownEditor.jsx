import { useState, useEffect } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Item as SysItem } from "../../systems/Item";

export function MarkdownEditor({ item, type = "content", override }) {
	const [ editMode, setEditMode ] = useState(false);

	useEffect(() => {
		setEditMode(false);
	}, [ override.EscapeKey ]);

	if(type === "title") {
		return (
			<div className="flex flex-row w-full mt-2">
				{
					editMode ? (
						<>
							<input
								className="w-full p-2 text-lg text-center bg-white border border-solid rounded shadow-sm border-neutral-300 hover:shadow"
								type="text"
								value={ item.shared.item.title }
								placeholder="Add a title..."
								onBlur={ e => setEditMode(false) }
								onKeyUp={ e => {
									if(e.key === "Escape") {
										setEditMode(false);
									}
								} }
								onChange={ e => SysItem.setTitle(item, e.target.value) } />
						</>
					) : (
						<>
							<div
								className="w-full p-2 text-lg text-center border border-transparent border-solid rounded"
								onClick={ e => {
									setEditMode(!editMode);
								} }
							>
								{
									item.shared.item.title ? (
										<ReactMarkdown remarkPlugins={ [ remarkGfm ] }>{ item.shared.item.title }</ReactMarkdown>
									) : (
										<div className="text-neutral-400">Add a title...</div>
									)
								}
							</div>
						</>
					)
				}
			</div>
		);
	} else if(type === "content") {
		return (
			<div className={ `w-full pl-2 border border-transparent border-solid rounded ${ editMode ? `` : `hover:border-neutral-200` }` } onClick={ e => setEditMode(true) }>
				{
					editMode
						? (
							<>
								<textarea
									className={ `w-full pl-2 -ml-2 border border-solid rounded border-neutral-300 outline-neutral-300` }
									value={ item.shared.item.content }
									onChange={ e => SysItem.update(item, { content: e.target.value }) }
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
		);
	}

};

export default MarkdownEditor;