var Input = {
	
	keys : new Array(256),
	
	prevKeys : new Array(256),
	
	mouse : {
		down : false,
		prevDown : false,
		x : 0,
		y : 0,
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0
	},
	
	mouseInCanvasPos : {
		x : 0,
		y : 0
	},
	
	prevMouseInCanvasPos : {
		x : 0,
		y : 0
	},
	
	SwipeQueue: [],
	
	Update : function(canvas){
		this.prevMouseInCanvasPos.x = this.mouseInCanvasPos.x;
		this.prevMouseInCanvasPos.y = this.mouseInCanvasPos.y;
		
		var canvasOffset = canvas.getBoundingClientRect();
		this.mouseInCanvasPos.x = this.mouse.x - canvasOffset.left;
		this.mouseInCanvasPos.y = this.mouse.y - canvasOffset.top;
		
		this.mouse.prevDown = this.mouse.down;
		for(var i = 0; i < 256; i++){
			this.prevKeys[i] = this.keys[i];
		}
	},
	
	IsMouseDown : function(){
		return this.mouse.down;
	},
	
	IsMouseJustDown : function(){
		return this.mouse.down && !this.mouse.prevDown;
	},
	
	GetMouseX : function(){
		return this.mouse.x;
	},
	
	GetMouseY : function(){
		return this.mouse.y;
	},
	
	IsKeyPressed : function(keyCode){
		return this.keys[keyCode];
	},
	
	IsKeyJustPressed : function(keyCode){
		return this.keys[keyCode] && !this.prevKeys[keyCode];
	},
	
}

window.addEventListener("keydown", function(e){
	Input.keys[e.keyCode] = true;
});

window.addEventListener("keyup", function(e){
	Input.keys[e.keyCode] = false;
});

window.addEventListener("mousedown", function(e){
	Input.mouse.down = true;
	Input.mouse.startX = e.pageX;
	Input.mouse.startY = e.pageY;
});
window.addEventListener("touchstart", function(e){
	Input.mouse.down = true;
	Input.mouse.startX = e.touches[0].pageX;
	Input.mouse.startY = e.touches[0].pageY;
}, false);

window.addEventListener("mouseup", function(e){
	Input.mouse.down = false;
	Input.mouse.endX = e.pageX;
	Input.mouse.endY = e.pageY;
	
	var dx = Input.mouse.endX-Input.mouse.startX,
		dy = Input.mouse.endY-Input.mouse.startY;
	if(Math.abs(dx) > Math.abs(dy)){
		if(dx > 0){
			Input.SwipeQueue.push("right");
		}
		else {
			Input.SwipeQueue.push("left");
		}
	}
	else {
		if(dy > 0){
			Input.SwipeQueue.push("down");
		}
		else {
			Input.SwipeQueue.push("up");
		}
	}
});
window.addEventListener("touchend", function(e){
	Input.mouse.down = false;
	Input.mouse.endX = Input.mouse.x;
	Input.mouse.endY = Input.mouse.y;
	
	var dx = Input.mouse.endX-Input.mouse.startX,
		dy = Input.mouse.endY-Input.mouse.startY;
	if(Math.abs(dx) > Math.abs(dy)){
		if(dx > 0){
			Input.SwipeQueue.push("right");
		}
		else {
			Input.SwipeQueue.push("left");
		}
	}
	else {
		if(dy > 0){
			Input.SwipeQueue.push("down");
		}
		else {
			Input.SwipeQueue.push("up");
		}
	}
}, false);

window.addEventListener("mousemove", function(e){
	Input.mouse.x = e.pageX;
	Input.mouse.y = e.pageY;
});
window.addEventListener("touchmove", function(e){
	Input.mouse.x = e.touches[0].pageX;
	Input.mouse.y = e.touches[0].pageY;
}, false);