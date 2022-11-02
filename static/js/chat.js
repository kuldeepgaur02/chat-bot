// Collapsible
var coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");

    var content = this.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

function getTime() {
  let today = new Date();
  hours = today.getHours();
  minutes = today.getMinutes();

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let time = hours + ":" + minutes;
  return time;
}

eval_qs = [
  "How do you feel your day is going today ?",
  "What do you think about movies ?",
  "What best describes the emotion you feel towards life in general?",
  "Alright, and what is your opinion on your favorite singer,whomever you like ?",
];

// Gets the first message
function firstBotMessage() {
  let firstMessage = "Hello how are you doing today?";
  document.getElementById("botStarterMessage").innerHTML =
    '<p class="botText"><span>' + firstMessage + "</span></p>";

  let time = getTime();

  $("#chat-timestamp").append(time);
  document.getElementById("userInput").scrollIntoView(false);
}

firstBotMessage();

// Retrieves the response
count = 0;
async function getHardResponse(userText) {
  let botLoader = '<p class="botTextLoader botText"><span></span></p>';

  $("#chatbox").append(botLoader);
  $("#textInput").prop("disabled", true);

  let { preset, ans } = await getBotResponse(userText);

  $("p").remove(".botTextLoader");
  $("#textInput").prop("disabled", false);

  displayBotResponse(ans);
  console.log(ans);
  if (!preset) {
    displayBotResponse(eval_qs[count]);
    count += 1;
  }

  // document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

//Gets the text input from the input box and processes it
function getResponse() {
  let userText = $("#textInput").val();

  if (userText == "") {
    return;
  }

  displayUserResponse(userText);

  setTimeout(() => {
    getHardResponse(userText);
  }, 1000);
}

// Handles sending text via button clicks
// function buttonSendText(sampleText) {
//     let userHtml = '<p class="userText"><span>' + sampleText + '</span></p>';

//     $("#textInput").val("");
//     $("#chatbox").append(userHtml);
//     document.getElementById("chat-bar-bottom").scrollIntoView(true);

//     // Uncomment this if you want the bot to respond to this buttonSendText event
//     setTimeout(() => {
//         getHardResponse(sampleText);
//     }, 1000)
// }

function sendButton() {
  getResponse();
}

function heartButton() {
  displayUserResponse("❤️");

  displayBotResponse("😍");
}

function displayBotResponse(text) {
  let botHtml = '<p class="botText"><span>' + text + "</span></p>";
  setTimeout(() => {
    $("#chatbox").append(botHtml);
  }, 1000);
  document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

function displayUserResponse(text) {
  let userHtml = '<p class="userText"><span>' + text + "</span></p>";

  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  document.getElementById("chat-bar-bottom").scrollIntoView(true);
}
// Press enter to send a message
$("#textInput").keypress(function (e) {
  let checkempty = $("#textInput").val();
  if (checkempty != "" && e.which == 13) {
    getResponse();
  }
});
