export class Client {

    static join(url, name, color) {
        return new Promise(resolve => {
            const ws = new WebSocket(url);

            ws.onmessage = e => {
                const msg = JSON.parse(e.data);
                if (msg.type == "login") {
                    const user = msg.content;
                    resolve(new Client(ws, user, users));
                }
            };

            ws.onopen = () => {
                console.log("WebSocket connection opened");
                ws.send(JSON.stringify({
                    type: "login",
                    content: {
                        name: name,
                        color: color
                    }
                }));
            };
        });
    }

    constructor(ws, user) {
        this.user = user;
        this.ws = ws

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            switch (msg.type) {
                case "chat":
                    this.onchat(msg.content.user, msg.content.text)
                    break;
                case "join":
                    this.onjoin(msg.content)
                    break;
            }
        };

        ws.onclose = (event) => {
            console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    onchat(from, msg) {
        console.log("chat", from, msg);
    }

    onjoin(user) {
        console.log("join", user);
    }

}

