import { Domains } from "../db";
/**
 * GraphQL Resolvers
 **/
export const resolvers = {
    Query: {
        getDomains: (root) => {
            return new Promise((resolve, reject) => {
                Domains.find((err, domains) => {
                    if (err)
                        reject(err);
                    else
                        resolve(domains);
                });
            });
        },
        findADomain: (root, domain) => {
            return new Promise((resolve, reject) => {
                Domains.findOne({ uuid: domain.uuid }, (err, domain) => {
                    if (err)
                        reject(err);
                    else
                        resolve(domain);
                });
            });
        },
    },
    Mutation: {
        addDomain: (root, { domain }) => {
            const { ...rest } = domain;
            const newDomain = new Domains({ ...rest });
            return new Promise((resolve, reject) => {
                newDomain.save((err, domain) => {
                    if (err)
                        reject(err);
                    else
                        resolve(domain);
                });
            });
        },
    },
};
