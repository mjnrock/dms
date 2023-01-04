import { useState, useEffect } from "react";

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Node } from "./../lib/Node";
import { Item } from "./../lib/Item";

import { Complete } from "./../systems/Complete";
import { Markdown } from "./../systems/Markdown";
import useNodeEvent from "../react/useNodeEvent";


const exampleMarkdown = `
A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
| 123 | 423 |
`;

const baseItem = new Item({
	state: exampleMarkdown,
	shared: {
		complete: false,
	},
});

console.log(baseItem);

export function Default() {
	const [ item, setItem ] = useState(baseItem);
	const [ editMode, setEditMode ] = useState(false);
	const { } = useNodeEvent("update", item);

	function onCompleteEvent(e) {
		let next = Complete.toggle(item);

		// setItem(new Item(next));
		setItem(next);
	}

	function onMarkdownEvent(e) {
		let next = Markdown.update(item, e.target.value);

		// setItem(new Item(next));
		setItem(next);
	}

	function enableEditMode() {
		if(!editMode) {
			setEditMode(!editMode);
		}
	}

	return (
		<div>
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
										<textarea className="w-full" value={ item.state } onChange={ onMarkdownEvent } />
										<button onClick={ e => setEditMode(false) }>Save</button>
									</>
								) : (
									<ReactMarkdown children={ item.state } remarkPlugins={ [ remarkGfm ] } />
								)
						}
					</div>
				</div>
			</div>
			<pre>
				{
					JSON.stringify(item.toObject(), null, 2)
				}
			</pre>
		</div >
	);
};

export default Default;