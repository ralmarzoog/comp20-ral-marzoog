// Your JavaScript code here...

function parse() {
    request = new XMLHttpRequest();

    request.open("GET", "http://messagehub.herokuapp.com/messages.json", true);
    request.onreadystatechange = parseData;
    request.send();
}

function parseData() {
    if (request.readyState == 4 && request.status == 200) {
        resp = JSON.parse(request.responseText);
        messagesDiv = document.getElementById("messages");
        for (var i = 0; i < resp.length; i++) {
            var toAdd = "<p>" + resp[i]["content"] + " - " + resp[i]["username"] + "</p>";
            messagesDiv.innerHTML += toAdd;
        }
    }
}

