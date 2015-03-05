// Your JavaScript code here...

function parse() {
    request = new XMLHttpRequest();

    request.open("GET", "data.json", true);
    request.onreadystatechange = parseData();
    request.send();
}

function parseData() {
    if (request.readyState == 4) {
        resp = JSON.parse(request.responseText);
        for (var i = 0; i < resp.length; i++) {
            messages.innerHTML = "<p>" + resp[i].content + " - " + resp[i].username + "</p>";
        }
    }
}
