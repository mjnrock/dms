import { v4 as uuid, validate } from "uuid";
import { Message } from "./Message";
import { MessageCollection } from "./MessageCollection";
import { Subscription } from "./Subscription";
import { SubscriptionCallback } from "./Subscription";

export type ChannelConfig = {
	retainHistory?: boolean;
	maxHistory?: number;
	atMaxReplace?: boolean;
};

export class Channel {
	static MessageTrigger = `@channel`;

	public id: string;
	public tags: string[];

	protected messages: MessageCollection;
	protected subscriptions: Map<string, Subscription>;
	protected config: any;

	constructor ({ config = {}, id, tags = [] }: { config?: ChannelConfig; id?: string; tags?: string[] }) {
		this.id = id || uuid();
		this.tags = tags;

		this.messages = new MessageCollection();
		this.subscriptions = new Map();

		this.config = {
			retainHistory: false,
			maxHistory: 100,
			atMaxReplace: true,

			...config,
		};
	}

	addSubscriber(subscriber: string | any, callback: SubscriptionCallback) {
		let subscribor,
			subscribee = this.id;

		if(validate(subscriber)) {
			subscribor = subscriber;
		} else if(typeof subscriber === "object" && subscriber.id) {
			subscribor = subscriber.id;
		}

		const subscription: Subscription = new Subscription(subscribor, subscribee, callback);

		this.subscriptions.set(subscription.id, subscription);

		return subscription;
	}
	removeSubscriber(subscriber: string | Subscription) {
		for(let subscription of this.subscriptions.values()) {
			if(subscription.subscribor === subscriber) {
				return this.subscriptions.delete(subscription.id);
			} else if(subscriber instanceof Subscription && subscription.id === subscriber.id) {
				return this.subscriptions.delete(subscription.id);
			}
		}

		return false;
	}

	setMessages(messages: Message[]) {
		this.messages = new MessageCollection(messages);

		return this;
	}
	addMessage(message: Message) {
		if(this.config.retainHistory) {
			if(this.messages.size < this.config.maxHistory) {
				this.messages.add(message);

				return true;
			} else {
				if(this.config.atMaxReplace) {
					const array = [
						...this.messages.values(),
						message,
					];

					this.setMessages(array.slice(1));

					return true;
				}
			}
		}

		return false;
	}
	addMessages(...messages: Message[]) {
		for(let message of messages) {
			this.addMessage(message);
		}

		return this;
	}
	clearMessages() {
		this.messages = new MessageCollection();

		return this;
	}

	/**
	 * This will invoke the callback for each subscription directly,
	 * sending the ...args verbatim.  As such, it is not recommended to
	 * use this method for sending messages, but rather use the send()
	 * method, which uses this method to internally, but with Agency
	 * opinionated message handling.
	 */
	broadcast(message: Message) {
		for(let subscription of this.subscriptions.values()) {
			subscription.send(message);
		}

		return this;
	}
	sendTo(subscriber: string | Subscription, message: Message): boolean {
		if(typeof subscriber === "string" && validate(subscriber)) {
			const subscription = this.subscriptions.get(subscriber);

			if(subscription) {
				subscription.send(message);

				return true;
			}
		} else if(subscriber instanceof Subscription) {
			return this.sendTo(subscriber.id, message);
		}

		return false;
	}
	
	sendMessage(message: Message) {
		if(message instanceof Message) {
			/**
			 * Undergoes validation and checking against the configuration
			 */
			this.addMessage(message);

			/**
			 * Actually invoke the subscription callbacks, with optional mutators
			 */
			this.broadcast(message);
		}

		return this;
	}
	sendData(data: any, tags: string[] = []) {
		const message = new Message({
			data,
			tags,
			emitter: this.id,
		});

		return this.sendMessage(message);
	}
	send(data: any, tags?: string[]) {
		if(data instanceof Message) {
			return this.sendMessage(data);
		}

		return this.sendData(data, tags);
	}
};

export default Channel;