"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
	type Domain {
		uuid: String
		parent: String
		name: String
	}

	type Component {
		uuid: String
		parent: String
		domain: String
		data: String
	}

	type Reducer {
		uuid: String
		parent: String
		domain: String
		fn: String
	}

	type Metadata {
		uuid: String
		ref: String
		refType: String
		namespace: String
		tags: [String]
		description: String
	}

	input DomainInput {
		uuid: String
		parent: String
		name: String
	}

	type Query {
		getDomains: [Domain]
		findADomain(uuid: String): Domain
	}

	type Mutation {
		addDomain(domain: DomainInput): Domain
	}
`;
