// This function is only for testing purposes
let url = "http://127.0.0.1:8000/";

let auth_token = null;

prev = -1;

const utterances = [
  ["how are you", "how is life", "how are things", "how are you doing"], //0
  ["hi", "hey", "hello", "good morning", "good afternoon"], //1
  ["what are you doing", "what is going on", "what is up", "whatsup"], //2
  ["how old are you"], //3
  ["who are you", "are you human", "are you bot", "are you human or bot"], //4
];

let decoded_token = null;



const answers = [
  [
    "Fine... how are you?",
    "Pretty well, how are you?",
    "Fantastic, how are you?",
  ], //0
  ["Hello!", "Hi!", "Hey!", "Hi there!", "Howdy"], //1
  [
    "Nothing much",
    "About to go to sleep",
    "Can you guess?",
    "I don't know actually",
  ], //2
  ["I am infinite"], //3
  ["I am just a bot", "I am a bot. What are you?"], //4
];

response_list = [
  "Hmmm...",
  "I feel you",
  "Alright, I understand",
  "Ok, I get you",
  "I think like you",
];

let emotion_list = [];

(async () => {
  let token_data = await axios({
    method: "post",
    url: url + "login",
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
    auth_token = access_token;
    decoded_token = parseJwt(auth_token);
  }
})();

async function post_emotion(input) {
  let options = {
    method: "post",
    url: url + "emotion",
    headers: {
      Authorization: "Bearer " + auth_token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      message: input,
    },
  };

  let response = await axios(options);

  let responseOK = await (response && response.status === 200);

  if (responseOK) {
    let data = response.data["emotion"];
    console.log(data);
    return data;
  } else {
    return null;
  }
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function get_preset_response(string) {
  let item;
  for (let x = 0; x < utterances.length; x++) {
    for (let y = 0; y < utterances[x].length; y++) {
      if (utterances[x][y] === string) {
        items = answers[x];
        item = items[Math.floor(Math.random() * items.length)];
        return item;
      }
    }
  }
  return null;
}

async function getBotResponse(input) {
  input = input.replace("?", "").toLowerCase();
  input = input.replace(/^[ ]+|[ ]+$/g, "");
  // Simple responses
  ans = get_preset_response(input);
  if (ans) {
    preset = true;
    return { preset, ans };
  } else if (input == "goodbye") {
    kill_chatbot();
    return null;
  }
  preset = false;
  emotion = await post_emotion(input);
  if (emotion != null) {
    get_final_emotion(emotion);
    check_full_list();
    ind = (Math.random() * response_list.length) | 0;
    while (response_list[ind] == response_list[prev]) {
      ind = (Math.random() * response_list.length) | 0;
    }
    prev = ind;
    ans = response_list[ind];
    return { preset, ans };
  }
}

function get_final_emotion(current_emotion) {
  if (
    ["happiness", "enthusiasm", "fun", "relief", "surprise"].includes(
      current_emotion
    )
  ) {
    emotion_list.push(1);
  } else if (["sadness", "worry", "hate"].includes(current_emotion)) {
    emotion_list.push(-1);
  } else if (["love"].includes(current_emotion)) {
    emotion_list.push(2);
  } else if (["anger", "hate"].includes(current_emotion)) {
    emotion_list.push(-2);
  } else {
    emotion_list.push(0);
  }
}

function check_full_list() {
  if (emotion_list.length == 5) {
    var total = 0;
    for (var i in emotion_list) {
      total += emotion_list[i];
    }
    console.log(total);
    total = total / 5;

    kill_chatbot();

    mood = null;
    if (-2 <= total < -1) {
      mood = "angry";
    } else if (-1 <= total < -0.2) {
      mood = "sad";
    } else if (-0.2 <= total < 0.2) {
      mood = "neutral";
    } else if (0.2 <= total < 1) {
      mood = "happiness";
    } else if (1 <= total < 2) {
      mood = "love";
    }

    let moodmessage = "<h1>Your final score is : " + mood + "</h1>";
    $("body").append(moodmessage);
    set_emotion(mood);
  }
}

async function set_emotion(mood) {
  let user_id = decoded_token["user_id"]
  let options = {
    method: "post",
    url: url + "mood",
    headers: {
      Authorization: "Bearer " + auth_token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      user_id: user_id,
      current_mood: mood,
    },
  };

  let response = await axios(options);

  try {
    let responseOK = await (response && response.status === 200);

    if (responseOK) {
      console.log("Mood updated");
    }
  } catch (err) {
    console.error("Unable to update mood");
  }
}

function kill_chatbot() {
  $(".chat-bar-collapsible").remove();
}
