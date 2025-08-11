const { text } = require("stream/consumers");
const app = require("./src/app.js");
const generateResponse = require("./src/service/ai.service.js");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "http://localhost:5173",
  },
});

const chatHistory = [
  // static response
  // {
  //   role: "user",
  //   parts: [
  //     {
  //       text: "whos was president of india in 2019",
  //     },
  //   ],
  // },
  // {
  //   role: "model",
  //   parts: [
  //     {
  //       text: "The President of India in 2019 was **Ram Nath Kovind",
  //     },
  //   ],
  // },
];

io.on("connection", (socket) => {
  console.log("A User Connected");

  socket.on("disconnect", () => {
    console.log("A User Disconnnected");
  });

  //   socket.on("message", (data) => {
  //     // console.log("Message Recieved!");
  //     console.log(data);
  //   });

  // ai-message
  socket.on("ai-message", async (data) => {
    console.log("Message Recieved:", data);

    chatHistory.push({
      role: "user",
      parts: [{ text: data }],
    });

    const result = await generateResponse(chatHistory);
    // console.log("Ai-Response:", result);

    chatHistory.push({
      role: "model",
      parts: [{ text: result }],
    });

    socket.emit("ai-message-response", result);
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
