function init() {
	var canvas = document.getElementById("game_canvas");
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		var img = new Image();
		img.addEventListener("load", function() {
			ctx.drawImage(img, 320, 0, 460, 140, 0, 0, 460, 140);
			ctx.drawImage(img, 80, 0, 20, 20, 115, 91, 20, 20);
		}, false);

		img.src = 'pacman10-hp-sprite.png';
	} else {
		alert("Sorry; your browser doesn't support canvas!")
	}
}

