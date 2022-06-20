"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const data_1 = require("./data");
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
function startApolloServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const configurations = {
            // Note: You may need sudo to run on port 443
            production: { ssl: true, port: 443, hostname: "kiszka.com" },
            development: { ssl: false, port: 4000, hostname: "localhost" },
        };
        const environment = process.env.NODE_ENV || "production";
        const config = configurations[environment];
        const server = new apollo_server_express_1.ApolloServer({
            typeDefs: data_1.typeDefs,
            resolvers: data_1.resolvers,
            csrfPrevention: true,
            cache: "bounded",
        });
        yield server.start();
        const app = (0, express_1.default)();
        server.applyMiddleware({ app });
        // Create the HTTPS or HTTP server, per configuration
        let httpServer;
        if (config.ssl) {
            // Assumes certificates are in a .ssl folder off of the package root.
            // Make sure these files are secured.
            httpServer = https_1.default.createServer({
                key: fs_1.default.readFileSync(`./ssl/kiszka.key`),
                cert: fs_1.default.readFileSync(`./ssl/kiszka.crt`),
            }, app);
        }
        else {
            httpServer = http_1.default.createServer(app);
        }
        yield new Promise(resolve => httpServer.listen({ port: config.port }, resolve));
        console.log("🚀 Server ready at", `http${config.ssl ? "s" : ""}://${config.hostname}:${config.port}${server.graphqlPath}`);
        return { server, app };
    });
}
startApolloServer();
