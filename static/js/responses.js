// import axios from 'axios'; 
// async function get_emotion(input){

// }
async function getBotResponse(input) {
    input = input.toLowerCase();

    
    // Simple responses
    if (input == "hello") {
        console.log("Hello")
        return "Hello there!";
        
    } else if (input == "goodbye") {
        return "Talk to you later!";
    }

    
    let url = 'http://127.0.0.1:7000/emotion';
    let options = {
        method : 'post',
        url : url,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data : {
            message: input
        }
    }

    let response = await axios(options);
    console.log(response);

    let responseOK = await (response && response.status === 200);
    
    if(responseOK){
        let data = response.data['emotion'];
        console.log(data);
        return 'You feel ' + data;
    }
}