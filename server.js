const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const client = new Client();
// Get QR code to scan WhatsAPP
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});
client.on("ready", () => {
  console.log("Client is ready!");
});

/*client.on("message", (message) => {
  console.log(message.body);
});*/

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion(message) {
  if (message.toLowerCase() === "who are you?") {
    return "My name is Arpit,";
  } else {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      max_tokens: 200,
    });
    return completion.data.choices[0].text;
  }
}

client.on("message", (message) => {
  if (message.body.startsWith("#")) {
    runCompletion(message.body.substring(1)).then((result) =>
      message.reply(result)
    );
  }
});

// List of data for automatic reply
/*var data = [
  { id: 1, received: "Hello", reply: "Hi" },
  { id: 2, received: "hello", reply: "Hi" },
  { id: 3, received: "Sorry", reply: "No problem" },
  { id: 4, received: "sorry", reply: "No problem" },
  {
    id: 5,
    received: "Can we have a call?",
    reply:
      "Please leave a voice message. Let us connect in an hour. Kind Reards, Arpit Mishra",
  },
  { id: 6, received: "Bye", reply: "See Ya!" },
  {
    id: 7,
    received: "bye",
    reply: "Okay then,see you later!" || "Laters Gaters!",
  },
  {
    default:
      "Please leave a voice message. Let us connect in an hour. Kind Reards, Arpit Mishra",
  },
];*/
/*client.on("message", (message) => {
  var selectedData = data.find((msg) => {
    if (msg.received === message.body) {
      return true;
    }
  });
  var sourceMsg, targetMsg;
  if (
    selectedData &&
    Object.keys(selectedData).length !== 0 &&
    selectedData.constructor === Object
  ) {
    sourceMsg = selectedData.received;
    targetMsg = selectedData.reply;
  }
  // test data
  // const sourceMsg = 'Hello';
  // const targetMsg = 'I am occupied at present. You can leave me SMS here, will call you shortly.';
  // send message
  if (message.body === sourceMsg) {
    message.reply(targetMsg);
  } else {
    message.reply(data.default);
  }
});
*/

client.initialize();
