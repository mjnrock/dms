"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const db_1 = require("../db");
/**
 * GraphQL Resolvers
 **/
exports.resolvers = {
    Query: {
        getDomains: (root) => {
            return new Promise((resolve, reject) => {
                db_1.Domains.find((err, domains) => {
                    if (err)
                        reject(err);
                    else
                        resolve(domains);
                });
            });
        },
        findADomain: (root, domain) => {
            return new Promise((resolve, reject) => {
                db_1.Domains.findOne({ uuid: domain.uuid }, (err, domain) => {
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
            const rest = __rest(domain, []);
            const newDomain = new db_1.Domains(Object.assign({}, rest));
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
