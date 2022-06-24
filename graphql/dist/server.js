//@ts-nocheck
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./data";
import fs from "fs";
import https from "https";
import http from "http";
async function startApolloServer() {
    const configurations = {
        production: { ssl: true, port: 443, hostname: "kiszka.com" },
        development: { ssl: false, port: 4000, hostname: "localhost" },
    };
    const environment = process.env.NODE_ENV || "production";
    const config = configurations[environment];
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: "bounded",
        // mocks: true,
    });
    await server.start();
    const app = express();
    server.applyMiddleware({
        app,
        path: "/api",
    });
    // Create the HTTPS or HTTP server, per configuration
    let httpServer;
    if (config.ssl) {
        // Assumes certificates are in a .ssl folder off of the package root.
        // Make sure these files are secured.
        httpServer = https.createServer({
            key: fs.readFileSync(`./ssl/kiszka.key`),
            cert: fs.readFileSync(`./ssl/kiszka.crt`),
        }, app);
    }
    else {
        httpServer = http.createServer(app);
    }
    await new Promise(resolve => httpServer.listen({ port: config.port }, resolve));
    console.log("🚀 Server ready at", `http${config.ssl ? "s" : ""}://${config.hostname}:${config.port}${server.graphqlPath}`);
    return { server, app };
}
startApolloServer().then(async ({ server, app }) => {
    const response = await server.executeOperation({
        //* WORKS
        // query: `query GetDomains {
        // 	getDomains {
        // 		uuid
        // 		parent
        // 		name
        // 	}
        // }`,
        //* WORKS
        // query: `mutation AddDomain {
        // 	addDomain(domain: {
        // 		uuid: "123"
        // 		parent: "84649754-293d-4631-9963-0fce5c72c4a5"
        // 		name: "TEST"
        // 	}) {
        // 		name
        // 	}
        // }`,
        //* WORKS
        // query: `mutation UpdateDomain {
        // 	updateDomain(uuid: "123", name: "ziiizkekaa") {
        // 		name
        // 	}
        // }`,
        query: `mutation DeleteDomain {
			deleteDomain(uuid: "123") {
				uuid
				name
			}
		}`,
    });
    console.log(response.data);
    // console.log([ ...response.data.getDomains ].map(o => ({ ...o })));
});
