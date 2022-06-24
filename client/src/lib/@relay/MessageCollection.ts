import { v4 as uuid } from "uuid";
import { Message } from "./Message";

export class MessageCollection {
	public id: string;
	public messages: Map<number, Set<Message>>;

	constructor() {
		this.id = uuid();
		this.messages = new Map();
	}

	public add(message: Message) {
		const key = Date.now();
		const entry = this.messages.get(key);
		
		if (!entry) {
			this.messages.set(key, new Set());
		} else {
			entry.add(message);
		}

		return this;
	}
	public addMany(messages: Message[]) {
		messages.forEach(message => this.add(message));

		return this;
	}
	public remove(message: Message) {
		const key = Date.now();
		const entry = this.messages.get(key);
		
		if (!entry) {
			return false;
		} else {
			return entry.delete(message);
		}
	}
	public removeMany(messages: Message[]) {
		messages.forEach(message => this.remove(message));

		return this;
	}
	public removeAll() {
		this.messages.clear();

		return this;
	}

	public get(ts: number): Message[] {
		const entry = this.messages.get(ts);

		if (!entry) {
			return [];
		} else {
			return Array.from(entry);
		}
	}
	public getSince(ts: number, inclusive: boolean = false): Message[] {
		const messages: Message[] = [];

		this.messages.forEach((entry: Set<Message>, key) => {
			if((inclusive && +key >= ts) || (!inclusive && +key > ts)) {
				entry.forEach((message: Message) => {
					messages.push(message);
				});
			}
		});

		return messages;
	}
	public getBetween(start: number, end: number): Message[] {
		const messages: Message[] = [];

		this.messages.forEach((entry: Set<Message>, key: number) => {
			if (+key >= start && +key <= end) {
				entry.forEach((message: Message) => {
					messages.push(message);
				});
			}
		});

		return messages;
	}
	public getByProp(property: string, value: any): Message[] {
		const messages: Message[] = [];

		this.messages.forEach((entry: Set<Message>) => {
			entry.forEach((message: Message) => {
				// @ts-ignore
				if (message[ property ] === value) {
					messages.push(message);
				}
			});
		});

		return messages;
	}
	public getByFilter(filter: (message: Message) => boolean): Message[] {
		const messages: Message[] = [];

		this.messages.forEach((entry: Set<Message>) => {
			entry.forEach((message: Message) => {
				if (filter(message) === true) {
					messages.push(message);
				}
			});
		});

		return messages;
	}


	public toObject() {
		const obj = {
			id: this.id,
			messages: {},
		};

		this.messages.forEach((messages, key) => {
			// @ts-ignore
			obj.messages[ key ] = Array.from(messages).map(message => message.toObject());
		});

		return obj;
	}
	public toJson(): string {
		return JSON.stringify(this.toObject());
	}
	public toString(): string {
		return this.toJson();
	}

	public static From(obj: any): MessageCollection {
		const collection = new MessageCollection();

		obj.messages.forEach((messages: {}, key: number) => {
			// @ts-ignore
			collection.messages.set(key, new Set(messages.map(message => {
				const msg = Message.From(message);
				msg.id = message.id;

				return msg;
			})));
		});

		return collection;
	}
	public static FromJson(json: string): MessageCollection {
		return this.From(JSON.parse(json));
	}
	public static FromString(str: string): MessageCollection {
		return this.FromJson(str);
	}
};

export default MessageCollection;