export class Client {
  static join(url, name, color) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type == "login") {
          const user = msg.content.currentUser;
          const userList = msg.content.userList;
          resolve(new Client(ws, user, userList));
        }
      };

      ws.onopen = () => {
        console.log("WebSocket connection opened");
        ws.send(
          JSON.stringify({
            type: "login",
            content: {
              name: name,
              color: color,
            },
          })
        );
      };

      ws.onerror = (error) => {
        reject(error);
      };
    });
  }

  constructor(ws, user, userList) {
    this.user = user;
    this.userList = userList;
    this.ws = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      switch (msg.type) {
        case "chat":
          this.onchat(msg.content.user, msg.content.text);
          break;
        case "join":
          this.onjoin(msg.content);
          break;
        case "userList":
          this.userList = msg.content;
          this.onUserListChange(this.userList);
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

  onUserListChange(userList) {
    console.log("userList", userList);
  }

  sendchat(msg) {
    try {
      this.ws.send(
        JSON.stringify({
          type: "chat",
          content: {
            text: msg,
          },
        })
      );
    } catch (error) {
      throw error;
    }
  }
}
