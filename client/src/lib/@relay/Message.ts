import { v4 as uuid } from "uuid";

export class Message {
	public id: string;
	public data: any;
	public emitter: any;
	public meta: any;

	constructor({ data, type, emitter, tags = [], meta = {} }: { data: any, emitter: string, type?: string, tags?: string[] | Set<string>, meta?: any }) {
		this.id = uuid();
		this.data = data;
		this.emitter = emitter;

		this.meta = {
			type: type || Array.from(tags)[ 0 ],
			tags: new Set(tags),
			
			...meta,

			timestamp: Date.now(),
		};
	}

	static From(data: any): Message {
		return new this(data);
	}
	static FromJson(json: string): Message {
		return this.From(JSON.parse(json));
	}
	static FromString(str: string): Message {
		return this.FromJson(str);
	}

	toObject() {
		return {
			...this,
		};
	}
	toJson(): string {
		return JSON.stringify(this.toObject());
	}
	toString(): string {
		return this.toJson();
	}
};

export default Message;