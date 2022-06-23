import { gql } from "apollo-server-express";

export const typeDefs = gql`
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
		scope: [String]
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
		updateDomain(uuid: String, name: String): Domain
		deleteDomain(uuid: String): Domain
	}
`;
