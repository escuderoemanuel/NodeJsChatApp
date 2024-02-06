const socket = io();
let username;

//! Elements
const usernameFront = document.getElementById('usernameFront')
const chatInput = document.getElementById("chatInput");
const messagesLog = document.getElementById("messagesLog");

//! Events & Socket Events
chatInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatInput.value.trim().length > 0) {
      // Send Event: user data
      socket.emit("userMessage", {
        username: username,
        message: e.target.value,
        date: new Date().toLocaleTimeString(),
      });
      e.target.value = "";
    }
  }
})


// Recive Event: new messages
socket.on("messages", ({ messages }) => {
  if (!username) return;
  messagesLog.innerHTML = '';
  messages.forEach(message => {
    messagesLog.innerHTML += `
    <div class='chatBox'>
      <p class='chatMessage'>
        <strong class='username'>[${message.date}] ${message.username}:
        </strong>
        <span class='chatMessage'>${message.message}
        </span>
      </p>
    </div >`
      ;
  })
  messagesLog.scrollTop = messagesLog.scrollHeight;
})

// Socket New User Connected
socket.on("newUserConnected", ({ newUsername }) => {
  if (!username) return;
  // Alert New User Connected
  Swal.fire({
    text: `🔔 ${newUsername} has joined the chat! `,
    toast: true,
    position: 'top-right',
    time: 2000,
  })
})



// Login
Swal.fire({
  theme: 'dark',
  title: "👋 Hey, welcome! 😉",
  text: "Enter your Username 👇",
  input: "text",
  allowOutsideClick: false,
  inputValidator: (value) => {
    if (!value) {
      return "You need to write your Username!😠";
    }
  }
}).then((result) => {
  username = result.value;
  usernameFront.innerHTML = `User: ${username}`;
  socket.emit("newUser", username);
  // Send Event Auth
  socket.emit("authenticated", { username });
});


