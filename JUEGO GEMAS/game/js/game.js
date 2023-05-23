////////////////////////////////////////////////////////////
// GAME v1.4
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//level settings
var levelSettings = {
					score:100,
					timer:121000,
					columns:8,
					rows:8,
					tileWidth:60,
					tileHeight:60,
					assets:[
						{src:'assets/item_tile_01.png', hex:'#FF0000'},
						{src:'assets/item_tile_02.png', hex:'#FF8000'},
						{src:'assets/item_tile_03.png', hex:'#FFCE34'},
						{src:'assets/item_tile_04.png', hex:'#36D900'},
						{src:'assets/item_tile_05.png', hex:'#006DD9'},
						{src:'assets/item_tile_06.png', hex:'#BF00FF'},
						{src:'assets/item_tile_power.png', hex:'#ef60a4', power:true}
					],
					animation:{
						swap:.2,
						shift:.6,
						remove:.2
					}
}

//game text display
var textDisplay = {
					score:'SCORE',
					time:'TIME',
					gameover:'NO MORE MOVE!',
					timeend:'TIME\'s UP!',
					exitTitle:'EXIT GAME',
					exitMessage:'ARE YOU SURE YOU WANT\nTO QUIT GAME?',
					share:'SHARE YOUR SCORE',
					resultTitle:'GAME OVER',
				}

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareTitle = 'Highscore on Gems Match 3 is level [SCORE]';//social share score title
var shareMessage = '[SCORE] is mine new highscore on Gems Match 3! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0};
var gameData = {paused:true, dragCon:false, stageNum:0, moves:[], clusters:[], selectedTile: {selected:false, column:0, row:0}, currentMove:{status:false, column1:0, row1:0, column2:0, row2:0}, dragging:false, moveInterval:null, moveIndex:-1, moveDisplay:false, shineInterval:null};
var tweenData = {score:0, scoreTarget:0, resultScore:0};
var timeData = {enable:false, startDate:null, nowDate:null, timer:0, oldTimer:0};
var levelData = {x:0, y:0, columns: 8, rows:8, tileWidth:50, tileHeight:50, tiles:[]} 

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});
buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('game');
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopAudio();
		stopGame();
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});

	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('main');
	});
	
	tilesContainer.mouseChildren = false;
	/*stage.addEventListener("dblclick", function(evt) {
		toggleTileEvent(evt, 'dblclick')
	});*/

	stage.addEventListener("pressmove", function(evt) {
		toggleTileEvent(evt, 'move')
	});

	stage.addEventListener("mousedown", function(evt) {
		toggleTileEvent(evt, 'down')
	});

	stage.addEventListener("pressup", function(evt) {
		toggleTileEvent(evt, 'release')
	});

	stage.addEventListener("mouseout", function(evt) {
		toggleTileEvent(evt, 'out')
	});
}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
		break;
			
		case 'game':
			gameContainer.visible = true;
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			playSound('soundResult');
			
			tweenData.resultScore = 0;
			TweenMax.to(tweenData, 1, {resultScore:playerData.score, overwrite:true, onUpdate:function(){
				resultScoreTxt.text = addCommas(Math.round(tweenData.resultScore))
			}});
			
			saveGame(playerData.score);
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

function setupGames(){
	levelData.columns = levelSettings.columns;
	levelData.rows = levelSettings.rows;
	levelData.tileWidth = levelSettings.tileWidth;
	levelData.tileHeight = levelSettings.tileHeight;
	levelData.x = -(levelData.tileWidth * levelData.columns) / 2;
	levelData.y = -(levelData.tileHeight * levelData.rows) / 2;

	for (var i=0; i<levelData.columns; i++) {
		levelData.tiles[i] = [];
		for (var j=0; j<levelData.rows; j++) {
			levelData.tiles[i][j] = { type: 0, shift:0, new:false, power:false}
		}
	}

	gameData.tileArr = [];
	gameData.tilePowerArr = [];

	for(var n=0; n<levelSettings.assets.length; n++){
		if(levelSettings.assets[n].power){
			gameData.tilePowerArr.push(n);
		}else{
			gameData.tileArr.push(n);
		}
	}

	for (var n=0; n<20; n++) {
		createBgShine();
	}

	playMusicLoop('soundMusic');
}

function createBgShine(){
	var range = 100;

	var newShine = itemShine.clone();
	newShine.x = randomIntFromInterval(range, canvasW-range);
	newShine.y = randomIntFromInterval(range, canvasH-range);
	newShine.scaleX = newShine.scaleY = .1 * randomIntFromInterval(5, 10);
	newShine.rotation = randomIntFromInterval(0, 360);
	newShine.visible = true;
	newShine.alpha = .1 * randomIntFromInterval(1, 10);

	shineContainer.addChild(newShine);

	var shineData = {};
	shineData.speed = .1 * randomIntFromInterval(10, 20);
	shineData.alpha = .1 * randomIntFromInterval(1, 10);
	shineData.x = newShine.x + randomIntFromInterval(-10, 10);
	shineData.y = newShine.y + randomIntFromInterval(-10, 10);

	TweenMax.to(newShine, shineData.speed, {alpha:0, x:shineData.x, y:shineData.y, overwrite:true, onComplete:function(){
		shineContainer.removeChild(newShine);
		createBgShine();
	}});
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	gameData.paused = false;
	gameData.dragging = false;
	gameData.moveIndex = 0;
	gameData.moveInterval = null;
	gameData.moveDisplay = false;
	gameData.end = false;
	gameData.currentMove.status = false;

	toggleTileSelect(false);
	gameData.pierce_arr = [];

	gameStatusContainer.alpha = 0;
	timeData.countdown = levelSettings.timer;
	playerData.score = tweenData.score = 0;
	gameScoreTxt.text = 0;

	prepareGame();
	buildTiles();
	checkGameReady();
	toggleGameTimer(true);

	gameData.dragCon = true;
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
 function stopGame(){
	toggleGameTimer(false);
	toggleMoveInterval(false);
	toggleShineInterval(false);

	gameData.paused = true;
	gameData.dragCon = false;
	TweenMax.killAll(false, true, false);
}

function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * PREPARE GAME - This is the function that runs to prepare game
 * 
 */
function prepareGame(){
	gameData.preparing = true;
	prepareNextPower();

	var prepareDone = false;
	while (!prepareDone) {
		for (var i=0; i<levelData.columns; i++) {
			for (var j=0; j<levelData.rows; j++) {
				levelData.tiles[i][j].type = getRandomTile();
			}
		}
		resolveClusters();
		findMoves();
		if (gameData.moves.length > 0) {
			prepareDone = true;
		}
	}

	findMoves();
	findClusters();

	gameData.preparing = false;
	gameData.animating = false;
}

function prepareNextPower(){
	gameData.nextPower = randomIntFromInterval(5, 10);
	gameData.nextPowerCount = 0;
}

function getRandomTile() {
	var index = Math.floor(Math.random() * gameData.tileArr.length);
	return gameData.tileArr[index];
}

function getRandomPowerTile() {
	var index = Math.floor(Math.random() * gameData.tilePowerArr.length);
	return gameData.tilePowerArr[index];
}

/*!
 * 
 * RESOLVE CLUSTERS - This is the function that runs to resolve clusters
 * 
 */
function resolveClusters() {
	findClusters();
	
	while (gameData.clusters.length > 0) {
		removeClusters();
		shiftTiles();
		findClusters();
	}
}

/*!
 * 
 * FIND CLUSTERS - This is the function that runs to find clusters
 * 
 */
function findClusters() {
	gameData.clusters = [];

	var powerData = {power:false, column:0, row:0};
	if(gameData.currentMove.status){
		if(levelData.tiles[gameData.currentMove.column1][gameData.currentMove.row1].power){
			powerData.power = true;
			powerData.column = gameData.currentMove.column1;
			powerData.row = gameData.currentMove.row1;
		}

		if(levelData.tiles[gameData.currentMove.column2][gameData.currentMove.row2].power){
			powerData.power = true;
			powerData.column = gameData.currentMove.column2;
			powerData.row = gameData.currentMove.row2;
		}
	}

	if(powerData.power){
		var powerRange = 2;
		var totalArea = (powerRange * 2) + 1;
		var startRow = powerData.row - powerRange;

		for(var n=0; n<totalArea; n++){
			if(startRow >= 0 && startRow < levelData.rows){
				var startColumn = powerData.column - powerRange;
				startColumn = startColumn < 0 ? 0 : startColumn;

				var endColumn = powerData.column + powerRange;
				endColumn = endColumn > levelData.columns-1 ? levelData.columns-1 : endColumn;

				var matchlength = endColumn - startColumn;

				gameData.clusters.push({column:startColumn, row:startRow, length: matchlength+1, horizontal: true, power:true});
			}
			startRow++;
		}
	}else{
		for(var n=0; n<2; n++){
			var firstArray = levelData.rows;
			var secondArray = levelData.columns;

			if(n == 1){
				firstArray = levelData.columns;
				secondArray = levelData.rows;
			}
			
			for (var j=0; j<firstArray; j++) {
				var matchlength = 1;
				var isPower = false;
				for (var i=0; i<secondArray; i++) {
					var checkcluster = false;
					
					if (i == secondArray-1) {
						checkcluster = true;
					} else {
						if(n == 0){
							if (levelData.tiles[i][j].type == levelData.tiles[i+1][j].type &&
								levelData.tiles[i][j].type != -1) {
								matchlength += 1;
							} else {
								checkcluster = true;
							}
						}else{
							if (levelData.tiles[j][i].type == levelData.tiles[j][i+1].type &&
								levelData.tiles[j][i].type != -1) {
								matchlength += 1;
							} else {
								checkcluster = true;
							}
						}
					}
					
					if (checkcluster) {
						if (matchlength >= 3) {
							if(n == 0){
								//horizontal
								gameData.clusters.push({ column: i+1-matchlength, row:j,
												length: matchlength, horizontal: true });
							}else{
								//vertical
								gameData.clusters.push({ column: j, row:i+1-matchlength,
									length: matchlength, horizontal: false });
							}
						}
						matchlength = 1;
					}
				}
			}
		}
	}
}

/*!
 * 
 * REMOVE CLUSTERS - This is the function that runs to remove clusters
 * 
 */
function loopClusters(func) {
	for (var i=0; i<gameData.clusters.length; i++) {
		var cluster = gameData.clusters[i];
		var coffset = 0;
		var roffset = 0;
		for (var j=0; j<cluster.length; j++) {
			func(i, cluster.column+coffset, cluster.row+roffset, cluster);
			if (cluster.horizontal) {
				coffset++;
			} else {
				roffset++;
			}
		}
	}
}

function removeClusters() {
	loopClusters(function(index, column, row, cluster) {levelData.tiles[column][row].type = -1; levelData.tiles[column][row].power = false;});

	for (var i=0; i<levelData.columns; i++) {
		var shift = 0;
		for (var j=levelData.rows-1; j>=0; j--) {
			if (levelData.tiles[i][j].type == -1) {
				if(!gameData.preparing){
					removeAnimation($.obj['tile'+i+'_'+j]);
				}

				shift++;
				levelData.tiles[i][j].shift = 0;
			} else {
				levelData.tiles[i][j].shift = shift;
			}
		}
	}
}

/*!
 * 
 * FIND MOVES - This is the function that runs to find moves
 * 
 */
function findMoves() {
	gameData.moves = []
	
	for (var j=0; j<levelData.rows; j++) {
		for (var i=0; i<levelData.columns-1; i++) {
			swapTile(i, j, i+1, j);
			findClusters();
			swapTile(i, j, i+1, j);
			
			if (gameData.clusters.length > 0) {
				gameData.moves.push({column1: i, row1: j, column2: i+1, row2: j});
			}
		}
	}
	
	for (var i=0; i<levelData.columns; i++) {
		for (var j=0; j<levelData.rows-1; j++) {
			swapTile(i, j, i, j+1);
			findClusters();
			swapTile(i, j, i, j+1);
			
			if (gameData.clusters.length > 0) {
				gameData.moves.push({column1: i, row1: j, column2: i, row2: j+1});
			}
		}
	}

	for (var i=0; i<levelData.columns; i++) {
		for (var j=0; j<levelData.rows-1; j++) {
			if(levelData.tiles[i][j].power){
				if(i-1 >= 0){
					gameData.moves.push({column1: i, row1: j, column2: i-1, row2: j});
				}
				if(i+1 < levelData.columns){
					gameData.moves.push({column1: i, row1: j, column2: i+1, row2: j});
				}
				if(j-1 >= 0){
					gameData.moves.push({column1: i, row1: j, column2: i, row2: j-1});
				}
				if(j+1 < levelData.rows){
					gameData.moves.push({column1: i, row1: j, column2: i, row2: j+1});
				}
			}
		}
	}
	
	gameData.clusters = []
}

/*!
 * 
 * SHIFT TILES - This is the function that runs to shift tiles
 * 
 */
function shiftTiles() {
	for (var i=0; i<levelData.columns; i++) {
		for (var j=levelData.rows-1; j>=0; j--) {
			if (levelData.tiles[i][j].type == -1) {
				if(gameData.nextPowerCount > gameData.nextPower && gameData.tilePowerArr.length > 0){
					prepareNextPower();

					levelData.tiles[i][j].power = true;
					levelData.tiles[i][j].type = getRandomPowerTile();
				}else{
					levelData.tiles[i][j].power = false;
					levelData.tiles[i][j].type = getRandomTile();
				}

				if(!gameData.preparing){
					levelData.tiles[i][j].new = true;
					createTile(i,j,true);
				}
			} else {
				var shift = levelData.tiles[i][j].shift;
				if (shift > 0) {
					swapTile(i, j, i, j+shift);

					if(!gameData.preparing){
						shiftAnimation($.obj['tile'+i+'_'+(j+shift)], i, j+shift, shift);
					}
				}
			}
			
			levelData.tiles[i][j].shift = 0;
		}
	}

	if(!gameData.preparing){
		checkNewTiles();
	}
}

/*!
 * 
 * SWAP TILE - This is the function that runs to swap tile
 * 
 */
function swapTile(x1, y1, x2, y2) {
	var typeswap = levelData.tiles[x1][y1].type;
	levelData.tiles[x1][y1].type = levelData.tiles[x2][y2].type;
	levelData.tiles[x2][y2].type = typeswap;

	var powerswap = levelData.tiles[x1][y1].power;
	levelData.tiles[x1][y1].power = levelData.tiles[x2][y2].power;
	levelData.tiles[x2][y2].power = powerswap;

	var newswap = levelData.tiles[x1][y1].new;
	levelData.tiles[x1][y1].new = levelData.tiles[x2][y2].new;
	levelData.tiles[x2][y2].new = newswap;

	if(!gameData.preparing){
		$.obj['temptile'] = $.obj['tile'+x1+'_'+y1];
		$.obj['tile'+x1+'_'+y1] = $.obj['tile'+x2+'_'+y2];
		$.obj['tile'+x2+'_'+y2] = $.obj['temptile'];
	}
}

/*!
 * 
 * BUILD TILES - This is the function that runs to build tiles
 * 
 */
function buildTiles(){
	tilesIconContainer.removeAllChildren();

	for (var i=0; i<levelData.columns; i++) {
		for (var j=0; j<levelData.rows; j++) {
			if (levelData.tiles[i][j].type >= 0) {
				levelData.tiles[i][j].new = false;
				levelData.tiles[i][j].power = false;
				levelData.tiles[i][j].new = false;
				createTile(i,j, false);
			}
		}
	}
}

function createTile(i, j, shiftCon){
	var coord = getTilePos(i, j);

	$.obj['tile'+i+'_'+j] = $.obj['tile'+levelData.tiles[i][j].type].clone();
	$.obj['tile'+i+'_'+j].x = coord.tilex;
	$.obj['tile'+i+'_'+j].y = coord.tiley;
	$.obj['tile'+i+'_'+j].visible = true;
	$.obj['tile'+i+'_'+j].type = levelData.tiles[i][j].type;

	if(shiftCon){
		$.obj['tile'+i+'_'+j].alpha = 0;
	}
	
	tilesIconContainer.addChild($.obj['tile'+i+'_'+j]);
}

function checkNewTiles(){
	for (var i=0; i<levelData.columns; i++) {
		var coordY = -1;
		var shift = 0;
		for (var j=levelData.rows-1; j>=0; j--) {
			if ($.obj['tile'+i+'_'+j] != undefined){
				if (levelData.tiles[i][j].new) {
					levelData.tiles[i][j].new = false;

					var coord = getTilePos(i, coordY);
					$.obj['tile'+i+'_'+j].x = coord.tilex;
					$.obj['tile'+i+'_'+j].y = coord.tiley;
					$.obj['tile'+i+'_'+j].alpha = 1;
					
					if(coordY == -1){
						shift = j+1;
					}
					coordY--;
					shiftAnimation($.obj['tile'+i+'_'+j], i, j, shift);
				}
			}
		}
	}
}

/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused){
		if(timeData.enable){
			timeData.nowDate = new Date();
			timeData.elapsedTime = Math.floor((timeData.nowDate.getTime() - timeData.startDate.getTime()));
			timeData.timer = Math.floor((timeData.countdown) - (timeData.elapsedTime));
			
			if(timeData.oldTimer == -1){
				timeData.oldTimer = timeData.timer;
			}
	
			if(timeData.timer <= 0){
				//stop
				endGame(false);
			}else{				
				gameTimerTxt.text = millisecondsToTimeGame(timeData.timer);
			}
		}

		//loop pierces
		for(var n=0; n<gameData.pierce_arr.length;n++){
			var targetPierce = gameData.pierce_arr[n];			
			targetPierce.yvel += 1;
			targetPierce.rotation = Math.atan2(targetPierce.yvel, targetPierce.xvel)*180/Math.PI;
			targetPierce.x += targetPierce.xvel;
			targetPierce.y += targetPierce.yvel;

			if(targetPierce.active){
				if (targetPierce.y > 1500) {
					targetPierce.y = 1500;
					targetPierce.yvel = -targetPierce.yvel * 0.5;
					targetPierce.xvel = targetPierce.xvel * 0.5;
	
					targetPierce.active = false;
				}
			}
		}

		//remove pierces
		for(var n=0;n<gameData.pierce_arr.length;n++){
			var targetPierce = gameData.pierce_arr[n];
			if(!targetPierce.active){
				tilesGuideContainer.removeChild(targetPierce);
				gameData.pierce_arr.splice(n,1);
			}
		}


	}
}

/*!
 * 
 * GAME ANIMATE STATE - This is the function that runs for animate state
 * 
 */
function checkGameReady(){
	findClusters();
	
	if (gameData.clusters.length > 0) {
		playSound('soundScore');

		var isCombo = false;

		// Add points to the score
		for (var i=0; i<gameData.clusters.length; i++) {
			// Add extra points for longer clusters
			playerData.score += levelSettings.score * (gameData.clusters[i].length - 2);
			TweenMax.to(tweenData, 1, {score:playerData.score, overwrite:true, onUpdate:function(){
				gameScoreTxt.text = addCommas(Math.round(tweenData.score))
			}});

			if(gameData.clusters[i].power){
				isCombo = true;
			}
		}

		if(isCombo){
			playSound('soundCombo');
		}
	
		// Clusters found, remove them
		gameData.currentMove.status = false;
		gameData.removeAnimationCount = 0;
		removeClusters();
	} else {
		//ready
		findMoves();

		if (gameData.moves.length <= 0) {
			endGame(true);
		}else{
			toggleMoveInterval(true);
			toggleShineInterval(true);
		}
	}
}

function removeAnimation(obj){
	if(obj != undefined){
		var randomNum = Math.floor(Math.random()*3)+1;
		playSound('soundBreak'+randomNum);

		gameData.animating = true;
		gameData.removeAnimationCount++;

		var scaleData = 1.5;
		TweenMax.to(obj, levelSettings.animation.remove, {alpha:0, scaleX:scaleData, scaleY:scaleData, overwrite:true, onComplete:function(){
			createExplodePierce(obj);
			removeAnimationComplete();
		}});
	}
}

function removeAnimationComplete(){
	gameData.animating = false;
	gameData.removeAnimationCount--;

	if(gameData.removeAnimationCount <= 0){
		gameData.shiftAnimationCount = 0;
		shiftTiles();
	}
}

function shiftAnimation(obj, x, y, shift){
	if(obj != undefined){
		gameData.animating = true;
		gameData.shiftAnimationCount++;

		var swapSpeed = levelSettings.animation.shift;
		var coord = getTilePos(x, y);
		TweenMax.to(obj, swapSpeed, {x:coord.tilex, y:coord.tiley, overwrite:true, ease:Bounce.easeOut, onComplete:shiftAnimationComplete});
	}
}

function shiftAnimationComplete(){
	gameData.shiftAnimationCount--;

	if(gameData.shiftAnimationCount <= 0){
		gameData.animating = false;
		findClusters();
		checkGameReady();
	}
}

function swapAnimation(){
	playSound('soundSwap');

	gameData.animating = true;
	var swapA = $.obj['tile'+gameData.currentMove.column1+'_'+gameData.currentMove.row1];
	var swapB = $.obj['tile'+gameData.currentMove.column2+'_'+gameData.currentMove.row2];

	var coord1 = getTilePos(gameData.currentMove.column1, gameData.currentMove.row1);
	var coord2 = getTilePos(gameData.currentMove.column2, gameData.currentMove.row2);

	TweenMax.to(swapA, levelSettings.animation.swap, {x:coord2.tilex, y:coord2.tiley, overwrite:true, onComplete:swapAnimationComplete});
	TweenMax.to(swapB, levelSettings.animation.swap, {x:coord1.tilex, y:coord1.tiley, overwrite:true});
}

function swapAnimationComplete(){
	if(gameData.swapState == 2){
		swapTile(gameData.currentMove.column1, gameData.currentMove.row1, gameData.currentMove.column2, gameData.currentMove.row2);

		gameData.currentMove.status = true;
		findClusters();
		
		if (gameData.clusters.length > 0) {
			gameData.nextPowerCount++;
			gameData.animating = false;
			checkGameReady();
		} else {
			gameData.swapState = 3;
			swapAnimation();
		}
	}else if(gameData.swapState == 3){
		 swapTile(gameData.currentMove.column1, gameData.currentMove.row1, gameData.currentMove.column2, gameData.currentMove.row2);
		 toggleMoveInterval(true);
		 toggleShineInterval(true);
		 gameData.animating = false;
	}

	findMoves();
	findClusters();
}

/*!
 * 
 * CREATE EXPLODE - This is the function that runs to create explode
 * 
 */
function createExplodePierce(obj){
	var totalNum = randomIntFromInterval(3,8);

	for(var n=0; n<totalNum;n++){
		var newPierce =  new createjs.Shape();
		var colorHex = levelSettings.assets[obj.type].hex;

		var randomMinW = randomIntFromInterval(2, 4);
		var randomMaxW = randomIntFromInterval(5, 10);
		
		var shapePos = {
							ax:-randomIntFromInterval(randomMinW, randomMaxW),
							ay:-randomIntFromInterval(randomMinW, randomMaxW),
							bx:randomIntFromInterval(randomMinW, randomMaxW),
							by:-randomIntFromInterval(randomMinW, randomMaxW),
							cx:randomIntFromInterval(randomMinW, randomMaxW),
							cy:randomIntFromInterval(randomMinW, randomMaxW),
							dx:-randomIntFromInterval(randomMinW, randomMaxW),
							dy:randomIntFromInterval(randomMinW, randomMaxW),
		}

		newPierce.graphics.beginFill(colorHex).moveTo(shapePos.ax, shapePos.ay).lineTo(shapePos.bx, shapePos.by).lineTo(shapePos.cx, shapePos.cy).lineTo(shapePos.dx, shapePos.dy).lineTo(shapePos.ax, shapePos.ay);
		
		newPierce.x = obj.x;
		newPierce.y = obj.y;
		newPierce.shadow = new createjs.Shadow("#FFFFFF", 5, 5, 50);
		
		newPierce.xvel = booleanNum(randomIntFromInterval(5,10));
		newPierce.yvel = booleanNum(randomIntFromInterval(5,10));
		newPierce.active = true;
		
		gameData.pierce_arr.push(newPierce);
		tilesGuideContainer.addChild(newPierce);
	}
}

function booleanNum(number){
	if(randomBoolean()){
		return number	
	}else{
		return -(number);	
	}
}

/*!
 * 
 * TOGGLE MOVE INTERVAL - This is the function that runs to toggle move interval
 * 
 */
function toggleMoveInterval(con){
	if(con){
		clearInterval(gameData.moveInterval);

		if (gameData.moves.length > 0) {
			gameData.moveInterval = setInterval(displayMove, 1000);
		}
	}else{
		clearInterval(gameData.moveInterval);

		if(gameData.moves[gameData.moveIndex] != undefined){
			var swapA = $.obj['tile'+gameData.moves[gameData.moveIndex].column1+'_'+gameData.moves[gameData.moveIndex].row1];
			var swapB = $.obj['tile'+gameData.moves[gameData.moveIndex].column2+'_'+gameData.moves[gameData.moveIndex].row2];

			TweenMax.killTweensOf(swapA);
			TweenMax.killTweensOf(swapB);
			swapA.scaleX = swapA.scaleY = 1;
			swapB.scaleX = swapB.scaleY = 1;
		}
	}
}

function displayMove(){
	if(gameData.moveDisplay){
		if(gameData.moves[gameData.moveIndex] != undefined){
			var swapA = $.obj['tile'+gameData.moves[gameData.moveIndex].column1+'_'+gameData.moves[gameData.moveIndex].row1];
			var swapB = $.obj['tile'+gameData.moves[gameData.moveIndex].column2+'_'+gameData.moves[gameData.moveIndex].row2];

			animatePossibleMove(swapA)
			animatePossibleMove(swapB)
		}
	}

	if(gameData.moveDisplay){
		//gameData.moveIndex++;
		if(gameData.moveIndex > gameData.moves.length-1){
			gameData.moveIndex = 0;
		}
	}

	gameData.moveDisplay = gameData.moveDisplay == true ? false : true;
}

function animatePossibleMove(obj){
	var scaleData = 1.3;
	var scaleSpeed = .3;
	TweenMax.to(obj, scaleSpeed, {scaleX:scaleData, scaleY:scaleData, overwrite:true, onComplete:function(){
		TweenMax.to(obj, scaleSpeed, {scaleX:1, scaleY:1, overwrite:true, onComplete:function(){
			TweenMax.to(obj, scaleSpeed, {scaleX:scaleData, scaleY:scaleData, overwrite:true, onComplete:function(){
				TweenMax.to(obj, scaleSpeed, {scaleX:1, scaleY:1, overwrite:true, onComplete:function(){
					
				}});
			}});
		}});
	}});	
}

/*!
 * 
 * TOGGLE SHINE INTERVAL - This is the function that runs to toggle shine interval
 * 
 */
function toggleShineInterval(con){
	if(con){
		clearInterval(gameData.shineInterval);
		gameData.shineInterval = setInterval(displayShine, 500);
	}else{
		clearInterval(gameData.shineInterval);
	}
}

function displayShine(){
	for (var i=0; i<levelData.columns; i++) {
		for (var j=0; j<levelData.rows-1; j++) {
			if(levelData.tiles[i][j].power){
				var coord = getTilePos(i, j);
				for(var n=0; n<2; n++){
					createShine(coord);
				}
			}
		}
	}
}

function createShine(pos){
	var range = 100;

	var newShine = itemShine.clone();
	newShine.x = pos.tilex + randomIntFromInterval(-(levelData.tileWidth/3), (levelData.tileWidth/3));
	newShine.y = pos.tiley + randomIntFromInterval(-(levelData.tileHeight/3), (levelData.tileHeight/3));

	newShine.scaleX = newShine.scaleY = .1 * randomIntFromInterval(5, 10);
	newShine.rotation = randomIntFromInterval(0, 360);
	newShine.visible = true;
	newShine.alpha = .1 * randomIntFromInterval(1, 10);

	tilesGuideContainer.addChild(newShine);

	var shineData = {};
	shineData.speed = .1 * randomIntFromInterval(5, 1);
	TweenMax.to(newShine, shineData.speed, {alpha:1, overwrite:true, onComplete:function(){
		TweenMax.to(newShine, .5, {alpha:0, overwrite:true, onComplete:function(){
			tilesGuideContainer.removeChild(newShine);
		}});
	}});
}

function getTilePos(column, row) {
	var tilex = levelData.x + (column) * levelData.tileWidth;
	var tiley = levelData.y + (row) * levelData.tileHeight;
	return { tilex: tilex + (levelData.tileWidth/2), tiley: tiley + (levelData.tileHeight/2)};
}

/*!
 * 
 * TOGGLE TILE EVENTS - This is the function that runs to toggle tile events
 * 
 */
function toggleTileEvent(obj, con){
	if(!gameData.dragCon){
		return;
	}

	switch(con){
		case 'dblclick':
			var pos = tilesContainer.globalToLocal(obj.stageX, obj.stageY);
			mt = getMouseTile(pos);
			if (mt.valid) {
				levelData.tiles[mt.x][mt.y].type++;
				levelData.tiles[mt.x][mt.y].type = levelData.tiles[mt.x][mt.y].type > levelSettings.assets.length-1 ?  0 : levelData.tiles[mt.x][mt.y].type;

				tilesIconContainer.removeChild($.obj['tile'+mt.x+'_'+mt.y]);
				createTile(mt.x, mt.y, false);
			}
		break;

		case 'move':
			if (gameData.dragging && gameData.selectedTile.selected) {
				var pos = tilesContainer.globalToLocal(obj.stageX, obj.stageY);

				mt = getMouseTile(pos);
				if (mt.valid) {
					if (canSwap(mt.x, mt.y, gameData.selectedTile.column, gameData.selectedTile.row)){
						toggleMoveInterval(false);
						toggleShineInterval(false);
						mouseSwap(mt.x, mt.y, gameData.selectedTile.column, gameData.selectedTile.row);
					}
				}
			}
		break;
		
		case 'down':
			if(gameData.animating){
				return;
			}
			
			var pos = tilesContainer.globalToLocal(obj.stageX, obj.stageY);
			if (!gameData.dragging) {
				mt = getMouseTile(pos);
				
				if (mt.valid) {
					//console.log('click');
					//console.log(levelData.tiles[mt.x][mt.y].type);
					//console.log(levelData.tiles[mt.x][mt.y].power);
					
					var swapped = false;
					if (gameData.selectedTile.selected) {
						if (mt.x == gameData.selectedTile.column && mt.y == gameData.selectedTile.row) {
							gameData.selectedTile.selected = false;
							gameData.dragging = true;
							return;
						} else if (canSwap(mt.x, mt.y, gameData.selectedTile.column, gameData.selectedTile.row)){
							toggleMoveInterval(false);
							toggleShineInterval(false);
							mouseSwap(mt.x, mt.y, gameData.selectedTile.column, gameData.selectedTile.row);
							swapped = true;
						}
					}
					
					if (!swapped) {
						gameData.selectedTile.column = mt.x;
						gameData.selectedTile.row = mt.y;
						gameData.selectedTile.selected = true;

						toggleTileSelect(true, gameData.selectedTile.column, gameData.selectedTile.row);
					}
				} else {
					toggleTileSelect(false);
					gameData.selectedTile.selected = false;
				}
	
				gameData.dragging = true;
			}
		break;
		
		case 'release':
			toggleTileSelect(false);
			gameData.selectedTile.selected = false;
			gameData.dragging = false;
		break;

		case 'out':
			toggleTileSelect(false);
			gameData.selectedTile.selected = false;
			gameData.dragging = false;
		break;
	}
}

function toggleTileSelect(con, column, row){
	if(con){
		itemTileSelect.x = $.obj['tile'+column+'_'+row].x;
		itemTileSelect.y = $.obj['tile'+column+'_'+row].y;
	}

	itemTileSelect.visible = con;
}

function getMouseTile(pos) {
	var tx = Math.floor((pos.x - levelData.x) / levelData.tileWidth);
	var ty = Math.floor((pos.y - levelData.y) / levelData.tileHeight);
	
	if (tx >= 0 && tx < levelData.columns && ty >= 0 && ty < levelData.rows) {
		return {
			valid: true,
			x: tx,
			y: ty
		};
	}
	
	return {
		valid: false,
		x: 0,
		y: 0
	};
}

function canSwap(x1, y1, x2, y2) {
	if ((Math.abs(x1 - x2) == 1 && y1 == y2) ||
		(Math.abs(y1 - y2) == 1 && x1 == x2)) {
		return true;
	}
	
	return false;
}

function mouseSwap(c1, r1, c2, r2) {
	gameData.currentMove = {column1: c1, row1: r1, column2: c2, row2: r2};
	gameData.selectedTile.selected = false;
	toggleTileSelect(false);

	gameData.swapState = 2;
	swapAnimation();
}

/*!
 * 
 * END GAME - This is the function that runs to end game
 * 
 */
function endGame(con){
	if(!gameData.end){
		gameData.end = true;

		playSound('soundEnd');
		
		gameData.dragCon = false;
		toggleMoveInterval(false);
		toggleShineInterval(false);
		toggleGameTimer(false);

		if(con){
			gameStatusTxt.text = textDisplay.gameover;
		}else{
			gameStatusTxt.text = textDisplay.timeend;
		}

		gameStatusContainer.y -= 50;
		TweenMax.to(gameStatusContainer, .5, {alpha:1, y:gameStatusContainer.oriY, overwrite:true, onComplete:function(){
			TweenMax.to(gameStatusContainer, 1.5, {overwrite:true, onComplete:function(){
				goPage('result');
			}});
		}});
	}
}

/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
function toggleGameTimer(con){
	if($.editor.enable){
		return;	
	}
	
	if(con){
		timeData.startDate = new Date();
	}else{
		
	}
	timeData.enable = con;
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTimeGame(milli) {
	var milliseconds = milli % 1000;
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	
	if(seconds<10){
		seconds = '0'+seconds;  
	}
	
	if(minutes<10){
		minutes = '0'+minutes;  
	}
	
	return minutes+':'+seconds;
}
/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", playerData.score);
	text = shareMessage.replace("[SCORE]", playerData.score);
	
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}