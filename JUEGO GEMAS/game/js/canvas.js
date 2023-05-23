////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener("tick", tick);
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, instructionContainer, resultContainer, confirmContainer;
var guideline, bg, logo, buttonOk, result, shadowResult, buttonReplay, buttonFacebook, buttonTwitter, buttonWhatsapp, buttonFullscreen, buttonSoundOn, buttonSoundOff;

$.obj = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	shineContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	tilesContainer = new createjs.Container();
	tilesGuideContainer = new createjs.Container();
	tilesIconContainer = new createjs.Container();
	gameLogoContainer = new createjs.Container();
	gameScoreContainer = new createjs.Container();
	gameTimerContainer = new createjs.Container();
	gameStatusContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	confirmContainer = new createjs.Container();
	
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	bgP = new createjs.Bitmap(loader.getResult('backgroundP'));
	logo = new createjs.Bitmap(loader.getResult('logo'));
	centerReg(logo);
	logoP = new createjs.Bitmap(loader.getResult('logoP'));
	centerReg(logoP);
	
	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);	
	
	//game
	itemShine = new createjs.Bitmap(loader.getResult('itemShine'));
	centerReg(itemShine);
	itemShine.visible = false;

	itemTileSelect = new createjs.Bitmap(loader.getResult('itemTileSelect'));
	centerReg(itemTileSelect);

	itemTileBg = new createjs.Bitmap(loader.getResult('itemTileBg'));
	centerReg(itemTileBg);

	itemGameStatus = new createjs.Bitmap(loader.getResult('itemGameStatus'));
	centerReg(itemGameStatus);

	gameStatusTxt = new createjs.Text();
	gameStatusTxt.font = "45px muroregular";
	gameStatusTxt.color = '#fff';
	gameStatusTxt.textAlign = "center";
	gameStatusTxt.textBaseline='alphabetic';
	gameStatusTxt.text = '';
	gameStatusTxt.y += 15;

	gameStatusContainer.addChild(itemGameStatus, gameStatusTxt);
	gameStatusContainer.y -= 280;

	gameStatusContainer.oriX = gameStatusContainer.x;
	gameStatusContainer.oriY = gameStatusContainer.y;

	for(var n=0; n<levelSettings.assets.length; n++){
		$.obj['tile'+n] = new createjs.Bitmap(loader.getResult('itemTile'+n));
		centerReg($.obj['tile'+n]);
		$.obj['tile'+n].visible = false;
		gameContainer.addChild($.obj['tile'+n]);
	}

	itemGameLogo = new createjs.Bitmap(loader.getResult('itemGameLogo'));
	centerReg(itemGameLogo);	
	gameLogoContainer.addChild(itemGameLogo);

	gameScoreTxt = new createjs.Text();
	gameScoreTxt.font = "45px muroregular";
	gameScoreTxt.color = '#fff';
	gameScoreTxt.textAlign = "center";
	gameScoreTxt.textBaseline='alphabetic';
	gameScoreTxt.text = 0;
	gameScoreTxt.y += 15;

	gameScoreDescTxt = new createjs.Text();
	gameScoreDescTxt.font = "35px muroregular";
	gameScoreDescTxt.color = '#fff';
	gameScoreDescTxt.textAlign = "center";
	gameScoreDescTxt.textBaseline='alphabetic';
	gameScoreDescTxt.text = textDisplay.score;
	gameScoreDescTxt.y -= 50;

	itemGameStatusScore = new createjs.Bitmap(loader.getResult('itemGameStatus'));
	centerReg(itemGameStatusScore);	
	gameScoreContainer.addChild(itemGameStatusScore, gameScoreTxt, gameScoreDescTxt);

	gameTimerTxt = new createjs.Text();
	gameTimerTxt.font = "45px muroregular";
	gameTimerTxt.color = '#fff';
	gameTimerTxt.textAlign = "center";
	gameTimerTxt.textBaseline='alphabetic';
	gameTimerTxt.text = 0;
	gameTimerTxt.y += 15;

	gameTimerDescTxt = new createjs.Text();
	gameTimerDescTxt.font = "35px muroregular";
	gameTimerDescTxt.color = '#fff';
	gameTimerDescTxt.textAlign = "center";
	gameTimerDescTxt.textBaseline='alphabetic';
	gameTimerDescTxt.text = textDisplay.time;
	gameTimerDescTxt.y -= 50;

	itemGameStatusTimer = new createjs.Bitmap(loader.getResult('itemGameStatus'));
	centerReg(itemGameStatusTimer);	
	gameTimerContainer.addChild(itemGameStatusTimer, gameTimerTxt, gameTimerDescTxt);
	
	//result
	itemResult = new createjs.Bitmap(loader.getResult('itemResult'));
	itemResultP = new createjs.Bitmap(loader.getResult('itemResultP'));
	
	buttonContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonContinue);
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "35px muroregular";
	resultShareTxt.color = '#fff';
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.text = textDisplay.share;
	
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "50px muroregular";
	resultTitleTxt.color = '#fff';
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.text = textDisplay.resultTitle;

	resultScoreTxt = new createjs.Text();
	resultScoreTxt.font = "120px muroregular";
	resultScoreTxt.color = '#fff';
	resultScoreTxt.textAlign = "center";
	resultScoreTxt.textBaseline='alphabetic';
	resultScoreTxt.text = '1,000';
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonWhatsapp);
	createHitarea(buttonWhatsapp);
	
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonMusicOn = new createjs.Bitmap(loader.getResult('buttonMusicOn'));
	centerReg(buttonMusicOn);
	buttonMusicOff = new createjs.Bitmap(loader.getResult('buttonMusicOff'));
	centerReg(buttonMusicOff);
	buttonMusicOn.visible = false;
	
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonMusicOn);
	createHitarea(buttonMusicOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer = new createjs.Container();
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonMusicOn, buttonMusicOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemExit'));
	itemExitP = new createjs.Bitmap(loader.getResult('itemExitP'));
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	
	popTitleTxt = new createjs.Text();
	popTitleTxt.font = "50px muroregular";
	popTitleTxt.color = "#fff";
	popTitleTxt.textAlign = "center";
	popTitleTxt.textBaseline='alphabetic';
	popTitleTxt.text = textDisplay.exitTitle;
	
	popDescTxt = new createjs.Text();
	popDescTxt.font = "35px muroregular";
	popDescTxt.lineHeight = 45;
	popDescTxt.color = "#fff";
	popDescTxt.textAlign = "center";
	popDescTxt.textBaseline='alphabetic';
	popDescTxt.text = textDisplay.exitMessage;
	
	confirmContainer.addChild(itemExit, itemExitP, popTitleTxt, popDescTxt, buttonConfirm, buttonCancel);
	confirmContainer.visible = false;
	
	if(guide){
		guideline = new createjs.Shape();	
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	
	mainContainer.addChild(logo, logoP, buttonStart);	
	tilesContainer.addChild(itemTileBg, itemTileSelect, tilesIconContainer, gameStatusContainer, tilesGuideContainer);
	gameContainer.addChild(itemShine, gameTimerContainer, gameScoreContainer, gameLogoContainer, tilesContainer);
	resultContainer.addChild(itemResult, itemResultP, buttonContinue, resultTitleTxt, resultScoreTxt);
	
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp);
	}
	
	canvasContainer.addChild(bg, bgP, shineContainer, mainContainer, gameContainer, resultContainer, confirmContainer, optionsContainer, buttonSettings, guideline);
	stage.addChild(canvasContainer);
	
	changeViewport(viewport.isLandscape);
	resizeGameFunc();
}

function changeViewport(isLandscape){
	if(isLandscape){
		//landscape
		stageW=landscapeSize.w;
		stageH=landscapeSize.h;
		contentW = landscapeSize.cW;
		contentH = landscapeSize.cH;
	}else{
		//portrait
		stageW=portraitSize.w;
		stageH=portraitSize.h;
		contentW = portraitSize.cW;
		contentH = portraitSize.cH;
	}
	
	gameCanvas.width = stageW;
	gameCanvas.height = stageH;
	
	canvasW=stageW;
	canvasH=stageH;
	
	changeCanvasViewport();
}

function changeCanvasViewport(){
	if(canvasContainer!=undefined){
		if(viewport.isLandscape){
			bg.visible = true;
			bgP.visible = false;
			
			logo.visible = true;
			logoP.visible = false;
			
			logo.x = canvasW/2;
			logo.y = canvasW/100 * 26;
			
			buttonStart.x = canvasW/2;
			buttonStart.y = canvasH/100 * 77;
			
			//game
			tilesContainer.x = canvasW/100 * 63;
			tilesContainer.y = canvasH/2;

			gameLogoContainer.x = canvasW/100 * 25;
			gameLogoContainer.y = canvasH/100 * 30;
			gameLogoContainer.scaleX = gameLogoContainer.scaleY = 1;

			gameScoreContainer.x = canvasW/100 * 25;
			gameScoreContainer.y = canvasH/100 * 58;

			gameTimerContainer.x = canvasW/100 * 25;
			gameTimerContainer.y = canvasH/100 * 78;
			
			//result
			itemResult.visible = true;
			itemResultP.visible = false;
			
			buttonFacebook.x = canvasW/100*43;
			buttonFacebook.y = canvasH/100*57;
			buttonTwitter.x = canvasW/2;
			buttonTwitter.y = canvasH/100*57;
			buttonWhatsapp.x = canvasW/100*57;
			buttonWhatsapp.y = canvasH/100*57;
			
			buttonContinue.x = canvasW/2;
			buttonContinue.y = canvasH/100 * 70;
	
			resultShareTxt.x = canvasW/2;
			resultShareTxt.y = canvasH/100 * 50;
	
			resultTitleTxt.x = canvasW/2;
			resultTitleTxt.y = canvasH/100 * 22.5;

			resultScoreTxt.x = canvasW/2;
			resultScoreTxt.y = canvasH/100 * 42;
			
			//exit
			itemExit.visible = true;
			itemExitP.visible = false;

			buttonConfirm.x = (canvasW/2);
			buttonConfirm.y = (canvasH/100 * 57);
			
			buttonCancel.x = (canvasW/2);
			buttonCancel.y = (canvasH/100 * 70);

			popTitleTxt.x = canvasW/2;
			popTitleTxt.y = canvasH/100 * 22.5;
			
			popDescTxt.x = canvasW/2;
			popDescTxt.y = canvasH/100 * 37;
		}else{
			bg.visible = false;
			bgP.visible = true;
			
			logo.visible = false;
			logoP.visible = true;
			
			logoP.x = canvasW/2;
			logoP.y = canvasW/100 * 60;
			
			buttonStart.x = canvasW/2;
			buttonStart.y = canvasH/100 * 75;
			
			//game
			tilesContainer.x = canvasW/2;
			tilesContainer.y = canvasH/100 * 52;

			gameLogoContainer.x = canvasW/2;
			gameLogoContainer.y = canvasH/100 * 14;
			gameLogoContainer.scaleX = gameLogoContainer.scaleY = .8;

			gameScoreContainer.x = canvasW/2 - 140;
			gameScoreContainer.y = canvasH/100 * 88;
			gameScoreContainer.scaleX = gameScoreContainer.scaleY = 1;

			gameTimerContainer.x = canvasW/2 + 140;
			gameTimerContainer.y = canvasH/100 * 88;
			gameTimerContainer.scaleX = gameTimerContainer.scaleY = 1;
			
			//result
			itemResult.visible = false;
			itemResultP.visible = true;
			
			buttonFacebook.x = canvasW/100*40;
			buttonFacebook.y = canvasH/100*57;
			buttonTwitter.x = canvasW/2;
			buttonTwitter.y = canvasH/100*57;
			buttonWhatsapp.x = canvasW/100*60;
			buttonWhatsapp.y = canvasH/100*57;
			
			buttonContinue.x = canvasW/2;
			buttonContinue.y = canvasH/100 * 66;
	
			resultShareTxt.x = canvasW/2;
			resultShareTxt.y = canvasH/100 * 52;
	
			resultTitleTxt.x = canvasW/2;
			resultTitleTxt.y = canvasH/100 * 30.5;

			resultScoreTxt.x = canvasW/2;
			resultScoreTxt.y = canvasH/100 * 45;
			
			//exit
			itemExit.visible = false;
			itemExitP.visible = true;

			buttonConfirm.x = (canvasW/2);
			buttonConfirm.y = (canvasH/100 * 55);
			
			buttonCancel.x = (canvasW/2);
			buttonCancel.y = (canvasH/100 * 65);

			popTitleTxt.x = canvasW/2;
			popTitleTxt.y = canvasH/100 * 30.5;
			
			popDescTxt.x = canvasW/2;
			popDescTxt.y = canvasH/100 * 40;
		}
	}
}



/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		
		buttonSettings.x = (canvasW - offset.x) - 50;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 80;
		var nextCount = 0;
		if(curPage != 'game'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;

			if (typeof buttonMusicOn != "undefined") {
				buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				buttonMusicOn.x = buttonMusicOff.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				nextCount = 2;
			}else{
				nextCount = 1;
			}
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
		}else{
			buttonExit.visible = true;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;

			if (typeof buttonMusicOn != "undefined") {
				buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				buttonMusicOn.x = buttonMusicOff.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				nextCount = 2;
			}else{
				nextCount = 1;
			}
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*(nextCount+2));
		}
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}