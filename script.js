var ctx;
var order = [];
var stepIndex = 0;

function drawSegment(colour, lit) {
	var blue = ["#00c", "#ccf", 0, Math.PI/2];
	var yellow = ["#cc0", "#ffc", Math.PI/2, Math.PI];
	var green = ["#0c0", "#cfa", Math.PI, 1.5*Math.PI];
	var red = ["#c00", "#fcc", 1.5*Math.PI, 2*Math.PI];
	
	var current;
	
	switch(colour) {
		case 0:
			current = blue;
			break;
		case 1:
			current = yellow;
			break;
		case 2:
			current = green;
			break;
		case 3:
			current = red;
			break;
	}
	
	ctx.fillStyle = lit ? current[1] : current[0];
	ctx.beginPath();
	ctx.arc(320, 240, 200, current[2], current[3]);
	ctx.lineTo(320, 240);
	ctx.closePath();
	ctx.fill();
}

function drawTop() {
	//centre
	ctx.fillStyle = "#000";
	ctx.beginPath();
	ctx.arc(320, 240, 50, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fill();
	//horizontal
	ctx.fillRect(120, 230, 400, 20);
	//vertical
	ctx.fillRect(310, 40, 20, 400);
	//logo
	var title = new Image();
	title.src = "title.png";
	$(title).on("load", function() {
		ctx.drawImage(title, 274, 230);
	});
}

function init() {
	//bg
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, 640, 480);
	//copy
	ctx.fillStyle = "#000";
	ctx.textAlign = "right";
	ctx.font = "10px Verdana";
	ctx.fillText("Copyright © 2015 Visual Archives Limited / Leon Byford", 635, 475);
	//base
	ctx.fillStyle = "#000";
	ctx.beginPath();
	ctx.arc(320, 240, 220, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fill();
	//segments
	drawSegment(0);
	drawSegment(1);
	drawSegment(2);
	drawSegment(3);
	//top
	drawTop();
}

function say() {
	var time = 0;
	$(order).each(function(i, e) {
		setTimeout(function() {
			drawSegment(e, true);
			drawTop();
			$("#sfx-"+e)[0].play();
		}, time);
		setTimeout(function() {
			init();
		}, time+500);
		time += 600;
	});
	setTimeout(function() {
		init();
	}, time);
}

$(document).on("ready", function() {
	ctx = $("#p")[0].getContext("2d");
	init();
	order.push(Math.floor(Math.random() * 4));
	say();
});

$("#p").on("click", function(e) {
	var pos = $(this).position();
	var data = ctx.getImageData(e.pageX-pos.left, e.pageY-pos.top, 1, 1).data;
	data = Array.prototype.slice.call(data, 0, 3);
	var select = null;
	switch(data.toString()) {
		case "0,0,204":
			select = 0;
			break;
		case "204,204,0":
			select = 1;
			break;
		case "0,204,0":
			select = 2;
			break;
		case "204,0,0":
			select = 3;
			break;
	}
	if (select != null) {
		drawSegment(select, true);
		drawTop();
		$("#sfx-"+select)[0].play();
		setTimeout(function() {
			init();
		}, 500);
		if (select == order[order.length - 1 - stepIndex]) {
			if (stepIndex == order.length - 1) {
				order.push(Math.floor(Math.random() * 4));
				stepIndex = 0;
				setTimeout(say, 1100);
			}
			else {
				stepIndex++;
			}
		}
		else {
			alert("game over");
			window.location = window.location;
		}
	}
});
