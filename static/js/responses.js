// This function is only for testing purposes
async function get_token() {
  let token_data = await axios({
    method: "post",
    url: "http://127.0.0.1:8000/login",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      username: "dv",
      password: "abcd",
    },
  });

  let token_go = await (token_data && token_data.status === 200);
  let access_token = null;

  if (token_go) {
    access_token = token_data.data["access"];
  }
  return access_token;
}

async function getBotResponse(input) {
  input = input.toLowerCase();

  // Simple responses
  if (input == "hello") {
    console.log("Hello");
    return "Hello there!";
  } else if (input == "goodbye") {
    return "Talk to you later!";
  }

  let token = await get_token();
  if (token == null) {
    return null;
  }

  let url = "http://127.0.0.1:8000/emotion";
  let options = {
    method: "post",
    url: url,
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      message: input,
    },
  };

  let response = await axios(options);
  console.log(response);

  let responseOK = await (response && response.status === 200);

  if (responseOK) {
    let data = response.data["emotion"];
    console.log(data);
    get_final_emotion(data, emotion_list);
    check_full_list();
    return response_list[(Math.random() * response_list.length) | 0];
  }
}

response_list = [
  "Hmmm...",
  "I feel you",
  "Alright, I understand",
  "Ok, I get you",
  "I think like you",
];

let emotion_list = [];

function get_final_emotion(current_emotion, emotion_list) {
  if (
    ["happiness", "enthusiasm", "fun", "relief", "surprise"].includes(
      current_emotion
    )
  ) {
    emotion_list.push(2);
  } else if (["sadness", "worry", "hate"].includes(current_emotion)) {
    emotion_list.push(-2);
  } else if (["love"].includes(current_emotion)) {
    emotion_list.push(4);
  } else if (["anger", "hate"].includes(current_emotion)) {
    emotion_list.push(-4);
  } else {
    emotion_list.push(0);
  }
}


function check_full_list(){
  if (emotion_list.length == 5) {
    var total = 0;
    for (var i in emotion_list) {
      total += emotion_list[i];
    }
  
    total = total / 5;
  
    $(".chat-bar-collapsible").remove();
  
    let scoremessage = "<h1>Your final score is : " + total + "</h1>";
    $("body").append(scoremessage);
  }
}

