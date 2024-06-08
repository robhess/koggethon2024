let idCounter = 0;

export class User {

    constructor(ws, name, color) {
        this.ws = ws;
        this.name = name;
        this.color = color;
        this.id = idCounter++;
    }

    send(msg) {
        msg = JSON.stringify(msg);
        this.ws.send(msg);
    }
}