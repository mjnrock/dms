import { useContext, useState, useEffect } from "react";
import Base64 from "./../../../../util/Base64";

import { useNodeEvent } from "../useNodeEvent";

import { Checklist as SysChecklist } from "../../systems/Checklist";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import ComponentChecklistItem from "../../components/templates/ChecklistItem";
import { CheckIcon, EyeIcon, EyeSlashIcon, MinusIcon } from "@heroicons/react/24/outline";
import { MarkdownEditor } from "./MarkdownEditor";

export function Image({ item, override, ...rest } = {}) {
	const { emitter } = useNodeEvent("update", item);
	const canvas = useRef(null);

	useEffect(() => {
		if(!canvas.current) {
			return;
		}

		Base64.Decode(item.shared.image.data).then(cvs => {
			canvas.current.width = cvs.width;
			canvas.current.height = cvs.height;

			const ctx = canvas.current.getContext("2d");
	
			ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

			ctx.drawImage(cvs, 0, 0, cvs.width, cvs.height);
		});
	}, [ item.shared.image.data ]);

	return (
		<div ref={ canvas } className="w-full h-full" />
	);
};

export default Image;