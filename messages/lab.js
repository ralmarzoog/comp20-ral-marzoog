// Your JavaScript code here...

function parse() {
    var req = new XMLHttpRequest();

    req.open("GET", "data.json", true);
    req.onreadystatechange = processData();
    req.send();
}

function processData() {
    if (this.readyState == 4 && this.status == 200) {
        resp = JSON.parse(this.responseText);
        
        for (var i = 0; i < resp.length; i++) {
            messages.innerHTML = "<p>" + resp[i].content + " - " + resp[i].username + "</p>";
        }
    }
}
