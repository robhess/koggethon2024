import { WebSocketServer } from "ws";
import { User } from "./User.js";

export class Server {
    constructor(port) {
        this.users = [];
        this.wss = new WebSocketServer({ port: port });

        this.wss.on('connection', (ws) => {
            let user = null;

            ws.on('message', msg => {
                try {
                    msg = JSON.parse(msg);
                    if (!user) {
                        user = this.login(ws, msg);
                        this.users.push(user);
                    } else {
                        this.parseMessage(user, msg);
                    }
                } catch (e) {
                    console.error(e);
                }
            });

            ws.on('error', console.error);
        });
    }

    parseMessage(user, data) {

    }

    login(ws, msg) {
        if (msg.type != "login") throw "Invalid Message Type for Login";
        if (typeof msg?.content?.name != "string") "Invalid Name";
        if (typeof msg?.content?.color != "string") "Invalid Color";

        const user = new User(ws, msg.content.name, msg.content.color);
        const userData = {
            id: user.id,
            name: user.name,
            color: user.color
        };

        user.send({
            type: "login",
            content: userData
        });

        this.sendToAll({
            type: "join",
            content: userData
        });

        console.log("login", userData);
        return user;
    }

    sendToAll(msg) {
        this.users.forEach(user => user.send(msg));
    }

}