import leafletSetup from "./leaflet/initMap.js";
import { Client } from "./Client.js";
import { $, $C } from "./render.js";

(() => {
  async function App() {
    let wsClient = undefined;
    const serverUri =
      "wss://informatik.hs-bremerhaven.de/docker-rhess-websocket";
    const currentUser = {
      name: "Robin",
      color: "#0000FF",
    }; 

    const chatMessages = [];

    let userList = [];

    if (localStorage.getItem("username")) {
      try {
        $("usernameInput").value = JSON.parse(
          localStorage.getItem("username")
        ).name;
        handleLogin();
      } catch (error) {
        console.error("Error loading username from local storage", error);
      }
    }

    $("loginButton").addEventListener("click", handleLogin);

    $("usernameInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    });

    function randomColor() {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    function handleLogin() {
      const username = $("usernameInput").value;

      const color = randomColor();
      Client.join(serverUri, username, color)
        .then((client) => {
          currentUser.name = username;
          currentUser.color = color;
          localStorage.setItem("username", JSON.stringify(currentUser));
          $C("loginContainer").style.display = "none";
          $C("container").style.display = "flex";
          wsClient = client;

          wsClient.onchat = (from, msg) => {
            chatMessages.push({ name: from, message: msg });
            renderMessages();
          };

          wsClient.onUserListChange = (userList2) => {
            userList = userList2;
            renderUserList();
          };

          leafletSetup();
        })
        .catch((error) => {
          console.error("Error joining chat", error);
          const errorElement = $C("error");
          errorElement.style.display = "block";
          errorElement.innerHTML = "Error joining chat";
        });
    }

    $C("messagebox").innerHTML = chatMessages
      .map((message) => `<div>${message.name}: ${message.message}</div>`)
      .join("");

    $("sendbutton").addEventListener("click", handleSendMessage);

    $("messageInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleSendMessage();
      }
    });

    function handleSendMessage() {
      try {
        const message = $("messageInput").value;
        console.log("send message: ", message);
        wsClient.sendchat(message);
        $("messageInput").value = "";
      } catch (error) {
        console.error("Error sending message", error);
      }
    }

    function renderUserList() {
      console.log("renderUserList", userList);
      const users = $C("userList");
      const logoutButton = document.createElement("button");
      logoutButton.className = "logoutButton";
      logoutButton.innerText = "Ausloggen";
      logoutButton.onclick = () => {
        localStorage.removeItem("username");
        window.location.reload();
      };
      users.innerHTML =
        `<h3>Benutzer (${userList.length})</h3>` +
        userList.map((user) => `<div>${user.name}</div>`).join("") 
      users.appendChild(logoutButton);
    }

    function renderMessages() {
      const messages = $C("messagebox");
      messages.innerHTML = chatMessages
        .map(
          (message) =>
            `<div style="color:${message.color}">${message.name}: ${message.message}</div>`
        )
        .join("");
      messages.scrollTop = messages.scrollHeight;
    }
  }

  window.onload = async () => await App();
})();
