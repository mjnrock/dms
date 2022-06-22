import { Domains } from "../db";
import { DomainModel } from "../model";

/**
 * GraphQL Resolvers
 **/
export const resolvers = {
	Query: {
		getDomains: (root: any) => {
			return new Promise((resolve, reject) => {
				Domains.find((err: any, domains: DomainModel[]) => {
					if (err) reject(err);
					else resolve(domains);
				});
			});
		},
		findADomain: (root: any, domain: any) => {
			return new Promise((resolve, reject) => {
				Domains.findOne(
					{ uuid: domain.uuid },
					(err: any, domain: DomainModel) => {
						if (err) reject(err);
						else resolve(domain);
					},
				);
			});
		},
	},
	Mutation: {
		addDomain: (root: any, { domain }) => {
			const { ...rest } = domain;
			const newDomain = new Domains({ ...rest });

			return new Promise((resolve, reject) => {
				newDomain.save((err: any, domain: DomainModel) => {
					if (err) reject(err);
					else resolve(domain);
				});
			});
		},
	},
};
