import { Name as KeyStatus } from "../../../components/Status";
import { Name as KeyMarkdown } from "../../../components/Markdown";
import { Name as KeyChecklist } from "../../../components/Checklist";

import { StatusDropdown } from "./StatusDropdown";
import { MarkdownEditor } from "./MarkdownEditor";
import { Checklist } from "./Checklist";

export const ComponentMap = {
	[ KeyStatus ]: StatusDropdown,
	[ KeyMarkdown ]: MarkdownEditor,
	[ KeyChecklist ]: Checklist
};

export function Factory({ component, item, ...props }) {
	if(component in item.shared) {
		let Component = ComponentMap[ component ];
		return (
			<Component item={ item } { ...props } />
		);
	}

	return null;
};

export default Factory;