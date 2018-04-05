

function Game(){
	this.width = 500;
	this.height = 500;
	this.sizeX = 4;
	this.sizeY = 4;
	this.spaceX = 10;
	this.spaceY = 10;
	this.tileWidth = (this.width-this.spaceX*(this.sizeX+1))/this.sizeX;
	this.tileHeight = (this.height-this.spaceY*(this.sizeY+1))/this.sizeY;
	
	this.grid = new Array(this.sizeX*this.sizeY);
	
	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	
	this.tickCount = 0;
	this.firstFrame = 0;
	this.animations = [];
	this.animating = false;
	this.walls = [];
	this.maxWalls = 4;
	
	this.player = null;
	this.AddRandomTile("food");
	this.AddRandomTile("player");
	for(var w = 0; w < this.maxWalls; w++){
		this.AddRandomTile("wall");
	}
	this.justAddedWall = true;
	
	if(!window.localStorage.getItem("max-score")){
		window.localStorage.setItem("max-score", 0);
	}
	this.score = 0;
	this.scoreView = document.getElementsByTagName("h1")[0];
	this.scoreView.innerHTML = "Score: "+this.score;
	this.maxScore = window.localStorage.getItem("max-score");
	this.maxScoreView = document.getElementsByTagName("h1")[1];
	this.maxScoreView.innerHTML = "Max Score: "+this.maxScore;
}

Game.prototype.Update = function(){
	var grid       = this.grid,
		player     = this.player,
		sizeX      = this.sizeX,
		sizeY      = this.sizeY,
		tileWidth  = this.tileWidth,
		tileHeight = this.tileHeight,
		spaceX     = this.spaceX,
		spaceY     = this.spaceY,
		animations = this.animations,
		food       = this.food;
	
	/*if(this.firstFrame === 0){
		Input.SwipeQueue = [];
		this.fistFrame++;
	}
	console.log(Input.SwipeQueue);*/

	if(!this.animating){
		if(Input.IsKeyJustPressed(39) || Input.SwipeQueue[0] === "right"){
			Input.SwipeQueue = [];
			var posX = player.x;
			while(!grid[(posX+1)+player.y*sizeX] && posX < sizeX-1){
				posX++;
			}
			
			//If it actually moved, create an animation
			if(posX !== player.x){
				this.animating = true;
				this.tickCount++;
				this.justAddedWall = false;
				animations.push({
					who: player,
					what: "xx",
					from: player.x*tileWidth+(player.x+1)*spaceX,
					to: posX*tileWidth+(posX+1)*spaceX,
					futureX: posX,
					futureY: player.y
				});
				grid[player.x+player.y*sizeX] = undefined;
				player.x = posX;
			}
		}
		else if(Input.IsKeyJustPressed(37) || Input.SwipeQueue[0] === "left"){
			Input.SwipeQueue = [];
			var posX = player.x;
			while(!grid[(posX-1)+player.y*sizeX] && posX > 0){
				posX--;
			}
			
			//If it actually moved, create an animation
			if(posX !== player.x){
				this.animating = true;
				this.tickCount++;
				this.justAddedWall = false;
				animations.push({
					who: player,
					what: "xx",
					from: player.x*tileWidth+(player.x+1)*spaceX,
					to: posX*tileWidth+(posX+1)*spaceX,
					futureX: posX,
					futureY: player.y
				});
				grid[player.x+player.y*sizeX] = undefined;
				player.x = posX;
			}
		}
		else if(Input.IsKeyJustPressed(38) || Input.SwipeQueue[0] === "up"){
			Input.SwipeQueue = [];
			var posY = player.y;
			while(!grid[(player.x)+(posY-1)*sizeX] && posY > 0){
				posY--;
			}
			
			//If it actually moved, create an animation
			if(posY !== player.y){
				this.animating = true;
				this.tickCount++;
				this.justAddedWall = false;
				animations.push({
					who: player,
					what: "yy",
					from: player.y*tileHeight+(player.y+1)*spaceY,
					to: posY*tileHeight+(posY+1)*spaceY,
					futureX: player.x,
					futureY: posY
				});
				grid[player.x+player.y*sizeX] = undefined;
				player.y = posY;
			}
		}
		else if(Input.IsKeyJustPressed(40) || Input.SwipeQueue[0] === "down"){
			Input.SwipeQueue = [];
			var posY = player.y;
			while(!grid[(player.x)+(posY+1)*sizeX] && posY < sizeY-1){
				posY++;
			}
			
			//If it actually moved, create an animation
			if(posY !== player.y){
				this.animating = true;
				this.tickCount++;
				this.justAddedWall = false;
				animations.push({
					who: player,
					what: "yy",
					from: player.y*tileHeight+(player.y+1)*spaceY,
					to: posY*tileHeight+(posY+1)*spaceY,
					futureX: player.x,
					futureY: posY
				});
				grid[player.x+player.y*sizeX] = undefined;
				player.y = posY;
			}
		}
	}
	
	for(var a = 0; a < animations.length; a++){
		var anim = animations[a];
		
		anim.who[anim.what] += (anim.to-anim.from)/10.0;
		if(Math.abs(anim.who[anim.what]-anim.to) < 2.0){
			anim.who[anim.what] = anim.to;
			grid[anim.futureX+anim.futureY*sizeX] = anim.who;
			animations.splice(a, 1);
			a--;
		}
	}
	
	if(animations.length === 0){
		this.animating = false;
	}
	
	if(!this.animating && this.tickCount !== 0 && !this.justAddedWall && this.tickCount % 1 == 0){
		this.AddRandomTile("wall");
		this.justAddedWall = true;
	}
	
	if((player.x === food.x && player.y === food.y) || this.Overlap(player, food)){
		this.score++;
		this.scoreView.innerHTML = "Score: "+this.score;
		if(this.score > this.maxScore){
			this.maxScore = this.score;
			this.maxScoreView.innerHTML = "Max Score: "+this.maxScore;
			window.localStorage.setItem("max-score", this.maxScore);
		}
		this.AddRandomTile("food");
	}
	
	Input.Update(this.canvas);
}

Game.prototype.Overlap = function(a, b){
	var tw = this.tileWidth,
		th = this.tileHeight;

	if(a.xx+tw <= b.xx || b.xx+tw <= a.xx) return false;
	if(a.yy+th <= b.yy || b.yy+th <= a.yy) return false;
	return true;
}

Game.prototype.AddRandomTile = function(type){
	var grid       = this.grid,
		sizeX      = this.sizeX,
		sizeY      = this.sizeY,
		tileWidth  = this.tileWidth,
		tileHeight = this.tileHeight,
		spaceX     = this.spaceX,
		spaceY     = this.spaceY,
		food       = this.food || {x:-1, y:-1};
	
	var tile = {
		x: -1,
		y: -1
	};
	
	//Find an empty tile
	do {
		tile.x = Math.floor(Math.random()*sizeX);
		tile.y = Math.floor(Math.random()*sizeY);
	}while(grid[tile.x+tile.y*sizeX] || (tile.x === food.x && tile.y === food.y));
	
	grid[tile.x+tile.y*sizeX] = tile;
	
	if(type === "player"){
		tile.color = "lightgreen";
		this.player = tile;
		this.player.xx = tile.x*tileWidth+(tile.x+1)*spaceX;
		this.player.yy = tile.y*tileHeight+(tile.y+1)*spaceY;
	}
	else if(type === "wall"){
		tile.color = "grey";
		this.walls.push(tile);
		if(this.walls.length > this.maxWalls){
			var wall = this.walls[0];
			grid[wall.x+wall.y*sizeX] = undefined;
			this.walls.splice(0, 1);
		}
	}
	else if(type === "food"){
		grid[tile.x+tile.y*sizeX] = undefined;
		tile.color = "lightblue";
		this.food = tile;
		this.food.xx = tile.x*tileWidth+(tile.x+1)*spaceX;
		this.food.yy = tile.y*tileHeight+(tile.y+1)*spaceY;
	}
}

Game.prototype.Render = function(){
	var ctx        = this.ctx,
		grid       = this.grid,
		w          = this.width,
		h          = this.height,
		sizeX      = this.sizeX,
		sizeY      = this.sizeY,
		spaceX     = this.spaceX,
		spaceY     = this.spaceY,
		tileWidth  = this.tileWidth,
		tileHeight = this.tileHeight,
		player     = this.player,
		food       = this.food;
	
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, w, h);
	
	for(var y = 0; y < sizeY; y++){
		for(var x = 0; x < sizeX; x++){
			var tile = grid[x+y*sizeX],
				xx   = (x+1)*spaceX + x*tileWidth,
				yy   = (y+1)*spaceY + y*tileHeight;

			if(tile){
				//Draw tile if there is one
				ctx.fillStyle = tile.color;
				ctx.fillRect(xx, yy, tileWidth, tileHeight);
			}
			else {
				//Draw background tile if there is no tile
				ctx.fillStyle = "lightgrey";
				ctx.fillRect(xx, yy, tileWidth, tileHeight);
			}
		}
	}
	
	ctx.fillStyle = player.color;
	ctx.fillRect(player.xx, player.yy, tileWidth, tileHeight);
	
	ctx.fillStyle = food.color;
	ctx.fillRect(food.xx, food.yy, tileWidth, tileHeight);
}


var game, restartView;

//document.addEventListener("deviceready", function(){
	game = new Game();
	document.body.appendChild(game.canvas);
	
	restartView = document.getElementsByTagName("h2")[0];
	restartView.addEventListener("click", function(e){
		game.canvas.remove();
		game = new Game();
		document.body.appendChild(game.canvas);
	});
	
	window.requestAnimationFrame(Loop);
//}, false);

function Loop(){
	game.Update();
	game.Render();
	
	window.requestAnimationFrame(Loop);
}