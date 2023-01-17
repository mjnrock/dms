import { useState, useEffect } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Markdown as SysMarkdown } from "../../../systems/Markdown";

export const EnumEditorType = {
	TITLE: "title",
	CONTENT: "content",
	BOTH: "both",
};

export function MarkdownEditor({ item, type = EnumEditorType.CONTENT, override, className = "", ...props }) {
	const [ editMode, setEditMode ] = useState(false);

	useEffect(() => {
		setEditMode(false);
	}, [ override.EscapeKey ]);

	if(type === EnumEditorType.BOTH) {
		return (
			<>
				<MarkdownEditor item={ item } type={ EnumEditorType.TITLE } override={ override } className={ className } />
				{
					props.children
				}
				<MarkdownEditor item={ item } type={ EnumEditorType.CONTENT } override={ override } className={ className } />
			</>
		);
	} else if(type === EnumEditorType.TITLE) {
		return (
			<div className={ `flex flex-row w-full mt-2 ` + className }>
				{
					editMode ? (
						<>
							<input
								className="w-full p-2 text-lg text-center bg-white border border-solid rounded shadow-sm border-neutral-300 hover:shadow"
								type="text"
								value={ item.shared.markdown.title }
								placeholder="Add a title..."
								onBlur={ e => setEditMode(false) }
								onKeyUp={ e => {
									if(e.key === "Escape" || e.key === "Enter") {
										setEditMode(false);
									}
								} }
								onChange={ e => SysMarkdown.setTitle(item, e.target.value) } />
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
									item.shared.markdown.title ? (
										<ReactMarkdown remarkPlugins={ [ remarkGfm ] }>{ item.shared.markdown.title }</ReactMarkdown>
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
	} else if(type === EnumEditorType.CONTENT) {
		return (
			<div className={ `min-h-[24px] mt-2 w-full pl-2 border border-transparent border-solid rounded ${ editMode ? `` : `hover:border-neutral-200` } ` + className } onClick={ e => setEditMode(true) }>
				{
					editMode
						? (
							<>
								<textarea
									className={ `w-full pl-2 -ml-2 border border-solid rounded border-neutral-300 outline-neutral-300` }
									value={ item.shared.markdown.content }
									placeholder="Add some detail..."
									onChange={ e => SysMarkdown.update(item, { content: e.target.value }) }
									onBlur={ e => setEditMode(false) }
									onKeyUp={ e => {
										if(e.key === "Escape" || (e.key === "Enter" && e.ctrlKey)) {
											setEditMode(false);
										}
									} }
								/>
							</>
						) : (
							<>
								<ReactMarkdown children={ item.shared.markdown.content } remarkPlugins={ [ remarkGfm ] } />
							</>
						)
				}
			</div>
		);
	}

};

export default MarkdownEditor;