
$( document ).ready(function() {


// VARIABLES ///////////////////////////////////

var mode = {overlay:false, numGuide:false, explore:true, simult:false};

var canvas1 = $("#canvas1")[0];
var ctx1 = canvas1.getContext("2d");

var canvas2 = $("#canvas2")[0];
var ctx2 = canvas2.getContext("2d");

var canvas3 = $("#canvas3")[0];
var ctx3 = canvas3.getContext("2d");

var canvas4 = $("#canvas4")[0];
var ctx4 = canvas4.getContext("2d");


var scene = {w:900,h:430};
canvas1.width = scene.w;
canvas1.height = scene.h;
canvas2.width = scene.w;
canvas2.height = scene.h;
canvas3.width = scene.w;
canvas3.height = scene.h;
canvas4.width = scene.w;
canvas4.height = scene.h;


var d = 0.5,
	p = 0.01,
	n = -1;

var cycleVar;
var cycleInterval = 20;// 20


var dataOutput = [];
for (i = 0; i < 21; i++){
	dataOutput.push("-");
}

var desktop = true;

var ps = [];
var pImageCount = 50;//number of images

var posX;
var posY;

var diop = {inc:5, limit:80, main:20}

var numInc = 3;

var coverObj = {x:30,y:20,w:200,h:200,drag:false,location:"",num:{x:{o:0,c:0},y:{o:0,c:0}}, movement:"U", toggle:"on", image:7}
var prismObj = {x:700,y:250,w:150,h:150,drag:false,location:"",num:{x:{o:0,c:0,fake:0},y:{o:0,c:0,fake:0}},degrees:0,anim:false,rotation:"left",axis:"X",speed:5, toggle:"on", image:8, clicked:false}
var prism2Obj = {x:200,y:260,w:150,h:150,drag:false,location:"",num:{x:{o:0,c:0,fake:0},y:{o:0,c:0,fake:0}},degrees:0,anim:false,rotation:"left",speed:5, toggle:"on", image:8, clicked:false}
var targetObj = {x:420,y:120,w:130,h:570,drag:false,location:"",num:{x:{o:0,c:0,perc:0},y:{o:0,c:0,perc:0}}, toggle:"on", image:0}
var eyeOD = {x:300,y:220,r:70,dom:false,num:{x:{o:0,c:0,end:0},y:{o:0,c:0,end:0}},firstItem:"C",range:{pos:diop.limit,neg:diop.limit*n}}
var eyeOS = {x:600,y:220,r:70,dom:false,num:{x:{o:0,c:0,end:0},y:{o:0,c:0,end:0}},firstItem:"C",range:{pos:diop.limit,neg:diop.limit*n}}
var eyeCenterOD = {x:325,y:215,r:5}
var eyeCenterOS = {x:575,y:215,r:5}
var patient;

targetObj.x = scene.w*d - targetObj.w*d*d;
targetObj.y = scene.h*d - targetObj.w*d*d;



prismObj.num.x.o = diop.main;
prismObj.num.x.c = diop.main;
prismObj.num.x.fake = diop.main;

coverObj.num.x.c = coverObj.num.x.o;



var origPosX;
var origPosY;
var origObjX;
var origObjY;


var currentAxis = "";




var menu = {instructSeq:[[1,6,5,2,3,4],[1,7,2,3,4]],
			instructState:0, instructNum:0, instructLength:0,
			creditToggle:true};



var quiz = {complete:false, score:0,
			userInputText:[[],[],[],[],[]],
			answerText:[[],[],[],[],[]],
			redBG:"#FB9", greenBG:"#DE8",
			menuOpen:false
			}


for (var v = 0; v < 5; v++){
	for (var m = 0; m < 2; m++){
		quiz.userInputText[v][m] = 0;
	}
	for (var m = 2; m < 6; m++){
		quiz.userInputText[v][m] = "N/A";
	}
}



var loadInt = 0;


var cm;// combination of characters defined by various factors (RRRC- is OD dom Y horiz)

var ex = { // expression library reference
	x:{od:0,os:0},
	y:{od:0,os:0}
}

var label;

// im = increment match
var im = {bef:{c:{x:0,y:0},d:{x:0,y:0}},aft:{c:{x:0,y:0},d:{x:0,y:0}}};

var expressionLib = [[],[]];

var centerToEyeRatio = 0.6;

var altCoverTest = {lastLoc:"", keepLoc:"", altTimerRunning:false, altInc:0,
					showDevTimerRunning:false, hideDevTimerRunning:false,
					showDevInc:0, hideDevInc:0}


var screenScaling = {minScreen:650, scaleValue:0, bodyWidth:900, bodyHeight:600,
					bodyTopMargin:0, bodyLeftMargin:0, saveWindowHeight:0}


var idList = ["custom_tropia_X_add","custom_tropia_X_sub","custom_tropia_Y_add","custom_tropia_Y_sub","custom_phoria_X_add","custom_phoria_X_sub","custom_phoria_Y_add","custom_phoria_Y_sub","disableAxisCover","tool_prism_add","tool_prism_sub","patientPrev","patientNext","submitButton","diagnose","continueScore","toggle_dominant","toggle_target","toggle_occluder","simult_toggle","toggle_prism","rotate_prism","closeQuizMenu","quiz_arrowUp_diop1","quiz_arrowDown_diop1","quiz_arrowUp_diop2","quiz_arrowDown_diop2","quizEyeButton1","quizEyeButton2","quizConditionButton1","quizConditionButton2","left1button","right1button","none1button","left2button","right2button","none2button","exo1button","eso1button","hyper1button","hypo1button","noneC1button","exo2button","eso2button","hyper2button","hypo2button","noneC2button","menuReviewButton","menuTestButton","helpButton","homeButton","testResetButton","instructStart","instructNext","instructSkip","instructVideo","instructExit"];
var bindString;


if (desktop){
	bindString = "click";
} else {
	bindString = "touchstart";
}






// INITIAL EVENTS //////////////////////////////////

var sdVar = setInterval(displayScreenDimensions, 500);

checkDevice();

preloadImages(
	"images/target_stick.png",//--0
	"images/n_eye.png",//--1  <---------------------- man eyes
	"images/point_OS.png",//--2
	"images/point_OD.png",//--3
	"images/dot_OS.png",//--4
	"images/dot_OD.png",//--5
	"images/n_face_sm.png",//--6
	"images/n_cover.png",//--7
	"images/prism.png",//--8
	"images/prismRotateOn.png",//--9
	"images/lines.png",//--10,
	"images/empty.png",//--11
	"images/n_eye_kid.png",//--12  <----------------- kid eyes
	"images/n_face_sm_kid.png",//--13
	"images/empty.png",//--14
	"images/prismRotateOff.png",//--15
	"images/n_eye_plain.png",//--16  <--------------- plain eyes
	"images/n_face_sm_plain.png",//--17
	"images/targetOn.png",//--18
	"images/targetOff.png",//--19
	"images/empty.png",//--20
	"images/empty.png",//--21
	"images/occluderOn.png",//--22
	"images/occluderOff.png",//--23
	"images/arrows.png",//--24,
	"images/empty.png",//--25
	"images/empty.png",//--26
	"images/prismOn.png",//--27
	"images/prismOff.png",//--28
	"images/n_eye_girl.png",//--29  <---------------- girl eyes
	"images/n_face_sm_girl.png",//--30
	"images/simultOn.png",//--31
	"images/simultOff.png",//--32
	"images/empty.png",//--33
	"images/empty.png",//--34
	"images/empty.png",//--35
	"images/empty.png",//--36
	"images/incorrectMark.png",//--37
	"images/correctMark.png",//--38
	"images/overlay1.png",//--39
	"images/overlay2.png",//--40
	"images/overlay3.png",//--41
	"images/overlay4.png",//--42
	"images/overlay5.png",//--43
	"images/overlay6.png",//--44
	"images/overlay7.png",//--45
	"images/overlaySimBG.jpg",//--46
	"images/overlaySimBG2.jpg",//--47
	"images/moduleTitle.png",//--48
	"images/lightReflex.png"//--49  <---------------- light reflex
	);

ps[pImageCount-1].onload = function(){
	patientSetup();
	resetDom();
	resetCircNum();
	
	//cycleVar = setInterval(function(){
	//	cycle();
	//	}, cycleInterval);
	window.requestAnimationFrame(cycle);
	
	$("#loadCover").hide();
	
};


$("#input_diopters").text(diop.main);

resetPrism();


// for desktop //////////////////

if (desktop){

	$(document).mouseup(function(e){checkClickCloseConditionMenu(e)});

} else {// do nothing
}


// for mobile devices //////////////////
 
 document.getElementById("canvas4").addEventListener('touchmove', function(e){
  posX = e.changedTouches[0].pageX - (($(window).width() - scene.w) * d);
  posY = e.changedTouches[0].pageY - (($(window).height() - 600) * d);
  
  if (window.innerHeight < screenScaling.minScreen){
	  posX = e.changedTouches[0].pageX/screenScaling.scaleValue;
	  posY = e.changedTouches[0].pageY/screenScaling.scaleValue;
  }
	
  userMove();
 }, false);
 
 document.getElementById("canvas4").addEventListener('touchstart', function(e){
  posX = e.changedTouches[0].pageX - (($(window).width() - scene.w) * d);
  posY = e.changedTouches[0].pageY - (($(window).height() - 600) * d);
  
  if (window.innerHeight < screenScaling.minScreen){
	  posX = e.changedTouches[0].pageX/screenScaling.scaleValue;
	  posY = e.changedTouches[0].pageY/screenScaling.scaleValue;
  }
  
  userDown();
 }, false);
 
 document.getElementById("canvas4").addEventListener('touchend', function(e){
  posX = e.changedTouches[0].pageX - (($(window).width() - scene.w) * d);
  posY = e.changedTouches[0].pageY - (($(window).height() - 600) * d);
  
  if (window.innerHeight < screenScaling.minScreen){
	  posX = e.changedTouches[0].pageX/screenScaling.scaleValue;
	  posY = e.changedTouches[0].pageY/screenScaling.scaleValue;
  }
  
  userUp();
 }, false);











for (var i=0; i<idList.length;i++){
	
	$("#"+idList[i]).bind(bindString, function(){
		
		if (this.id==="custom_tropia_X_add"){custom_tropia_X_add()};
		if (this.id==="custom_tropia_X_sub"){custom_tropia_X_sub()};
		if (this.id==="custom_tropia_Y_add"){custom_tropia_Y_add()};
		if (this.id==="custom_tropia_Y_sub"){custom_tropia_Y_sub()};
		
		if (this.id==="custom_phoria_X_add"){custom_phoria_X_add()};
		if (this.id==="custom_phoria_X_sub"){custom_phoria_X_sub()};
		if (this.id==="custom_phoria_Y_add"){custom_phoria_Y_add()};
		if (this.id==="custom_phoria_Y_sub"){custom_phoria_Y_sub()};
		
		if (this.id==="disableAxisCover"){custom_switchAxis()};
		
		if (this.id==="tool_prism_add"){tool_prism_add()};
		if (this.id==="tool_prism_sub"){tool_prism_sub()};
		
		if (this.id==="patientPrev"){patientPrev()};
		if (this.id==="patientNext"){patientNext()};
		if (this.id==="submitButton"){patientNext()};
		if (this.id==="diagnose"){diagnose()};
		if (this.id==="continueScore"){closeScore()};
		
		if (this.id==="toggle_dominant"){domClick()};
		if (this.id==="toggle_target"){toggleTarget()};
		if (this.id==="toggle_occluder"){prismObj.clicked = false, toggleCover()};
		if (this.id==="simult_toggle"){toggleSimult()};
		if (this.id==="toggle_prism"){prismObj.clicked = true, togglePrism()};
		if (this.id==="rotate_prism"){prismRotate()};
		
		if (this.id==="closeQuizMenu"){call_closeQuizMenu(e)};
		if (this.id==="quiz_arrowUp_diop1"){call_quiz_arrowUp_diop1()};
		if (this.id==="quiz_arrowDown_diop1"){call_quiz_arrowDown_diop1()};
		if (this.id==="quiz_arrowUp_diop2"){call_quiz_arrowUp_diop2()};
		if (this.id==="quiz_arrowDown_diop2"){call_quiz_arrowDown_diop2()};
		if (this.id==="quizEyeButton1"){call_quizEyeButton1()};
		if (this.id==="quizEyeButton2"){call_quizEyeButton2()};
		if (this.id==="quizConditionButton1"){call_quizConditionButton1()};
		if (this.id==="quizConditionButton2"){call_quizConditionButton2()};
		
		if (this.id==="left1button"){call_left1()};
		if (this.id==="right1button"){call_right1()};
		if (this.id==="none1button"){call_none1()};
		if (this.id==="left2button"){call_left2()};
		if (this.id==="right2button"){call_right2()};
		if (this.id==="none2button"){call_none2()};
		if (this.id==="exo1button"){call_exo1()};
		if (this.id==="eso1button"){call_eso1()};
		if (this.id==="hyper1button"){call_hyper1()};
		if (this.id==="hypo1button"){call_hypo1()};
		if (this.id==="noneC1button"){call_noneC1()};
		if (this.id==="exo2button"){call_exo2()};
		if (this.id==="eso2button"){call_eso2()};
		if (this.id==="hyper2button"){call_hyper2()};
		if (this.id==="hypo2button"){call_hypo2()};
		if (this.id==="noneC2button"){call_noneC2()};
		
		if (this.id==="menuReviewButton"){openReview()};
		if (this.id==="menuTestButton"){openTest()};
		if (this.id==="helpButton"){openHelp()};
		
		if (this.id==="homeButton"){goHome()};
		if (this.id==="testResetButton"){testReset()};
		
		if (this.id==="instructStart"){instructNext()};
		if (this.id==="instructNext"){instructNext()};
		if (this.id==="instructSkip"){instructSkip()};
		if (this.id==="instructVideo"){instructVideo()};
		if (this.id==="instructExit"){instructSkip()};
	});
}







$('body').on('touchmove', function(event) {
  event.preventDefault();
});


$("#canvas4").bind('mousemove' , function(e){
	userMove(e);
});
$("#canvas4").bind('mousedown' , function(){
	userDown();
});
$("#canvas4").bind('mouseup' , function(){
	userUp();
});


//document.addEventListener('mouseup', clickDocument);
document.getElementById("startButton").addEventListener('mouseup', clickCredit);
document.getElementById("creditButtonNew").addEventListener('mouseup', clickCredit);










// MAIN FUNCTIONS //////////////////////////////////

function preloadImages() {
	for (i = 0; i < preloadImages.arguments.length; i++) {
		ps[i] = new Image();
		ps[i].src = preloadImages.arguments[i];
	}
}


function cycle() {
	
	moveItems();
	
	drawShapes();
	
	determineLocations();
	
	determineAltCover();
	
	calcTarget();
	
	calcCover();
	
	calcFirstItem();
	
	calcNumbers();
	
	calcEyeCenter();
	
	identifyCondition();
	
	updateList();
	
	window.requestAnimationFrame(cycle);
	
}


function resetPrism(){
	if (prismObj.rotation==="left"){
		prismObj.num.x.o = prismObj.num.x.fake*n;
		prismObj.num.y.o = 0;
		
	} else if (prismObj.rotation==="up"){
		prismObj.num.x.o = 0;
		prismObj.num.y.o = prismObj.num.x.fake;
		
	} else if (prismObj.rotation==="right"){
		prismObj.num.x.o = prismObj.num.x.fake;
		prismObj.num.y.o = 0;
		
	} else if (prismObj.rotation==="down"){
		prismObj.num.x.o = 0;
		prismObj.num.y.o = prismObj.num.x.fake*n;
	}
	
	prismObj.num.x.c = prismObj.num.x.o;
	prismObj.num.y.c = prismObj.num.y.o;
}


function resetDom(){
	
	if (patient.deviation.dominant[patient.num]==="R"){
		
		eyeOD.dom = true;
		eyeOS.dom = false;
		eyeOD.num.x.o = 0;
		eyeOD.num.y.o = 0;
		
		eyeOS.num.x.o = patient.deviation.m.x[patient.num];
		eyeOS.num.y.o = patient.deviation.m.y[patient.num];
		
		$("#dom_OD").css("background-color","#FFF");
		$("#dom_OS").css("background-color","#CCC");
		$("#dom_OD").css("color","#000");
		$("#dom_OS").css("color","#DDD");
		
	} else if (patient.deviation.dominant[patient.num]==="L"){
		
		eyeOD.dom = false;
		eyeOS.dom = true;
		eyeOS.num.x.o = 0;
		eyeOS.num.y.o = 0;
		
		//console.log(patient.deviation.m.y[patient.num]);
		
		eyeOD.num.x.o = patient.deviation.m.x[patient.num]*n;
		eyeOD.num.y.o = patient.deviation.m.y[patient.num];
		
		$("#dom_OD").css("background-color","#CCC");
		$("#dom_OS").css("background-color","#FFF");
		$("#dom_OD").css("color","#DDD");
		$("#dom_OS").css("color","#000");
	}
}



function resetCircNum(){
	eyeOD.num.x.c = eyeOD.num.x.o;
	eyeOD.num.y.c = eyeOD.num.y.o;
	eyeOS.num.x.c = eyeOS.num.x.o;
	eyeOS.num.y.c = eyeOS.num.y.o;
}








function userMove(e){
	
	// FOR CENTERED MODULE:
	posX = e.clientX - (($(window).width() - scene.w) * d);
	posY = e.clientY - (($(window).height() - 600) * d);
	
	if (window.innerHeight < screenScaling.minScreen){
		posX = e.clientX/screenScaling.scaleValue;
		posY = e.clientY/screenScaling.scaleValue;
	}

}




function userDown(){
	
	if (posX > coverObj.x && posY > coverObj.y && posX < coverObj.x + coverObj.w && posY < coverObj.y + coverObj.h){
		if (coverObj.toggle==="on"){
			origPosX = posX;
			origPosY = posY;
			origObjX = coverObj.x;
			origObjY = coverObj.y;
			coverObj.drag = true;
			prismObj.drag = false;
			targetObj.drag = false;
			prism2Obj.drag = false;
		}
	}
	if (posX > prismObj.x && posY > prismObj.y && posX < prismObj.x + prismObj.w && posY < prismObj.y + prismObj.h){
		if (prismObj.toggle==="on"){
			origPosX = posX;
			origPosY = posY;
			origObjX = prismObj.x;
			origObjY = prismObj.y;
			coverObj.drag = false;
			prismObj.drag = true;
			targetObj.drag = false;
			prism2Obj.drag = false;
		}
	}
	if (posX > targetObj.x && posY > targetObj.y && posX < targetObj.x + targetObj.w*d && posY < targetObj.y + targetObj.h){
		if (targetObj.toggle==="on"){
			origPosX = posX;
			origPosY = posY;
			origObjX = targetObj.x;
			origObjY = targetObj.y;
			coverObj.drag = false;
			prismObj.drag = false;
			targetObj.drag = true;
			prism2Obj.drag = false;
		}
	}
	/*
	if (posX > prism2Obj.x && posY > prism2Obj.y && posX < prism2Obj.x + prism2Obj.w && posY < prism2Obj.y + prism2Obj.h){
		if (prism2Obj.toggle==="on"){
			origPosX = posX;
			origPosY = posY;
			origObjX = prism2Obj.x;
			origObjY = prism2Obj.y;
			coverObj.drag = false;
			prismObj.drag = false;
			targetObj.drag = false;
			prism2Obj.drag = true;
		}
	}
	*/

}

function userUp(){
	coverObj.drag = false;
	prismObj.drag = false;
	targetObj.drag = false;
	prism2Obj.drag = false;
}







function domClick(){
	
	if (patient.deviation.dominant[patient.num]==="R"){
		patient.deviation.dominant[patient.num] = "L";
		resetDom();
		
	} else if (patient.deviation.dominant[patient.num]==="L"){
		patient.deviation.dominant[patient.num] = "R";
		resetDom();
	}

}













function closeInstructions(){
	$("#instructions").css("display","none");
	$("#closeInstructions").css("display","none");
}

function closeLevels(){
	$("#levelsBG").css("display","none");
}

function resetInputFields(){
	$("#inputFieldX").text(patient.deviation.m.x[patient.num]);
	$("#inputFieldX_h").text(patient.deviation.l.x[patient.num]);
	$("#inputFieldY").text(patient.deviation.m.y[patient.num]);
	$("#inputFieldY_h").text(patient.deviation.l.y[patient.num]);
}
	
function custom_tropia_X_add(){
	// less than 80
	if (patient.deviation.m.x[patient.num] < diop.limit){
		// add 5
		patient.deviation.m.x[patient.num] = patient.deviation.m.x[patient.num] + diop.inc;
		// if > 80, make it 80
		if (patient.deviation.m.x[patient.num] > diop.limit){
			patient.deviation.m.x[patient.num] = diop.limit;
		}
		// if tropia + phoria > 80, remove 5 from phoria
		if (patient.deviation.m.x[patient.num] + patient.deviation.l.x[patient.num] > diop.limit){
			patient.deviation.l.x[patient.num] = patient.deviation.l.x[patient.num] - diop.inc;
		}
		// if tropia is more than 0 and phoria is less than 0
		if (patient.deviation.m.x[patient.num] > 0 && patient.deviation.l.x[patient.num] < 0){
			patient.deviation.l.x[patient.num] = 0;
		}
		resetInputFields();
		resetDom();
	}
}
function custom_tropia_X_sub(){
	
	if (patient.deviation.m.x[patient.num] > diop.limit*n){
		patient.deviation.m.x[patient.num] = patient.deviation.m.x[patient.num] - diop.inc;
		if (patient.deviation.m.x[patient.num] < diop.limit*n){
			patient.deviation.m.x[patient.num] = diop.limit*n;
		}
		if (patient.deviation.m.x[patient.num] + patient.deviation.l.x[patient.num] < diop.limit*n){
			patient.deviation.l.x[patient.num] = patient.deviation.l.x[patient.num] + diop.inc;
		}
		if (patient.deviation.m.x[patient.num] < 0 && patient.deviation.l.x[patient.num] > 0){
			patient.deviation.l.x[patient.num] = 0;
		}
		resetInputFields();
		resetDom();
	}
}
function custom_tropia_Y_add(){
	
	if (patient.deviation.m.y[patient.num] < diop.limit*d){
		patient.deviation.m.y[patient.num] = patient.deviation.m.y[patient.num] + diop.inc;
		if (patient.deviation.m.y[patient.num] > diop.limit*d){
			patient.deviation.m.y[patient.num] = diop.limit*d;
		}
		if (patient.deviation.m.y[patient.num] + patient.deviation.l.y[patient.num] > diop.limit*d){
			patient.deviation.l.y[patient.num] = patient.deviation.l.y[patient.num] - diop.inc;
		}
		if (patient.deviation.m.y[patient.num] > 0 && patient.deviation.l.y[patient.num] < 0){
			patient.deviation.l.y[patient.num] = 0;
		}
		resetInputFields();
		resetDom();
	}
	
}
function custom_tropia_Y_sub(){
	
	if (patient.deviation.m.y[patient.num] > diop.limit*n*d){
		patient.deviation.m.y[patient.num] = patient.deviation.m.y[patient.num] - diop.inc;
		if (patient.deviation.m.y[patient.num] < diop.limit*n*d){
			patient.deviation.m.y[patient.num] = diop.limit*n*d;
		}
		if (patient.deviation.m.y[patient.num] + patient.deviation.l.y[patient.num] < diop.limit*n*d){
			patient.deviation.l.y[patient.num] = patient.deviation.l.y[patient.num] + diop.inc;
		}
		if (patient.deviation.m.y[patient.num] < 0 && patient.deviation.l.y[patient.num] > 0){
			patient.deviation.l.y[patient.num] = 0;
		}
		resetInputFields();
		resetDom();
	}
}
function custom_phoria_X_add(){
	
	if (patient.deviation.l.x[patient.num] < diop.limit){
		patient.deviation.l.x[patient.num] = patient.deviation.l.x[patient.num] + diop.inc;
		if (patient.deviation.l.x[patient.num] > diop.limit){
			patient.deviation.l.x[patient.num] = diop.limit;
		}
		if (patient.deviation.m.x[patient.num] + patient.deviation.l.x[patient.num] > diop.limit){
			patient.deviation.m.x[patient.num] = patient.deviation.m.x[patient.num] - diop.inc;
		}
		if (patient.deviation.l.x[patient.num] > 0 && patient.deviation.m.x[patient.num] < 0){
			patient.deviation.m.x[patient.num] = 0;
		}
		resetInputFields();
		resetDom();
	}
}
function custom_phoria_X_sub(){
	
	if (patient.deviation.l.x[patient.num] > diop.limit*n){
		patient.deviation.l.x[patient.num] = patient.deviation.l.x[patient.num] - diop.inc;
		if (patient.deviation.l.x[patient.num] < diop.limit*n){
			patient.deviation.l.x[patient.num] = diop.limit*n;
		}
		if (patient.deviation.m.x[patient.num] + patient.deviation.l.x[patient.num] < diop.limit*n){
			patient.deviation.m.x[patient.num] = patient.deviation.m.x[patient.num] + diop.inc;
		}
		if (patient.deviation.l.x[patient.num] < 0 && patient.deviation.m.x[patient.num] > 0){
			patient.deviation.m.x[patient.num] = 0;
		}
		resetInputFields();
		resetDom();
	}
}
function custom_phoria_Y_add(){
	
	if (patient.deviation.l.y[patient.num] < diop.limit*d){
		patient.deviation.l.y[patient.num] = patient.deviation.l.y[patient.num] + diop.inc;
		if (patient.deviation.l.y[patient.num] > diop.limit*d){
			patient.deviation.l.y[patient.num] = diop.limit*d;
		}
		if (patient.deviation.m.y[patient.num] + patient.deviation.l.y[patient.num] > diop.limit*d){
			patient.deviation.m.y[patient.num] = patient.deviation.m.y[patient.num] - diop.inc;
		}
		if (patient.deviation.l.y[patient.num] > 0 && patient.deviation.m.y[patient.num] < 0){
			patient.deviation.m.y[patient.num] = 0;
		}
		resetInputFields();
		resetDom();
	}
	
}
function custom_phoria_Y_sub(){
	
	if (patient.deviation.l.y[patient.num] > diop.limit*n*d){
		patient.deviation.l.y[patient.num] = patient.deviation.l.y[patient.num] - diop.inc;
		if (patient.deviation.l.y[patient.num] < diop.limit*n*d){
			patient.deviation.l.y[patient.num] = diop.limit*n*d;
		}
		if (patient.deviation.m.y[patient.num] + patient.deviation.l.y[patient.num] < diop.limit*n*d){
			patient.deviation.m.y[patient.num] = patient.deviation.m.y[patient.num] + diop.inc;
		}
		if (patient.deviation.l.y[patient.num] < 0 && patient.deviation.m.y[patient.num] > 0){
			patient.deviation.m.y[patient.num] = 0;
		}
		resetInputFields();
		resetDom();
	}
}



function tool_prism_add(){
	if (prismObj.toggle==="on"){
	if (prismObj.num.x.fake < diop.limit){
		//console.log(prismObj.num.x.fake);
		prismObj.num.x.fake = prismObj.num.x.fake + diop.inc;
		if (prismObj.num.x.fake > diop.limit){
			prismObj.num.x.fake = diop.limit;
		}
		$("#input_diopters").text(prismObj.num.x.fake);
		resetPrism();
	}
	}
}

function tool_prism_sub(){
	if (prismObj.toggle==="on"){
	if (prismObj.num.x.fake > 5){
		prismObj.num.x.fake = prismObj.num.x.fake - diop.inc;
		if (prismObj.num.x.fake < 5){
			prismObj.num.x.fake = 5;
		}
		$("#input_diopters").text(prismObj.num.x.fake);
		resetPrism();
	}
	}
}


function prismRotate(){
	if (prismObj.toggle==="on"){
	if (!prismObj.anim){
		if (prismObj.rotation==="left"){
			prismObj.rotation = "up";
			prismObj.axis = "Y";
		} else if (prismObj.rotation==="up"){
			prismObj.rotation = "right";
			prismObj.axis = "X";
		} else if (prismObj.rotation==="right"){
			prismObj.rotation = "down";
			prismObj.axis = "Y";
		} else if (prismObj.rotation==="down"){
			prismObj.rotation = "left";
			prismObj.axis = "X";
		}
		resetPrism();
		prismObj.anim = true;
	}
	}
}


function toggleSimult(){
	if (coverObj.toggle==="on" && prismObj.toggle==="on"){
	if (mode.simult){
		$("#simult_toggle").css("background-image", "url(images/simultOff.png)");
		mode.simult = false;
		coverObj.x = 30;
		coverObj.y = 20;
		prismObj.x = 700;
		prismObj.y = 250;
	} else {// turn simult on
		$("#simult_toggle").css("background-image", "url(images/simultOn.png)");
		mode.simult = true;
		coverObj.x = 30;
		coverObj.y = 120;
		prismObj.x = 700;
		prismObj.y = 150;
	}
	}
	
}




function openPatientLevels(){
	$("#levelsBG").css("display","block");
}

function patientNext(){
	//console.log(patient.num + " to " + parseInt(patient.num+1));
	patient.num++;// works sometimes <---??????
	if (patient.num > patient.count){
		patient.num = 1;
	}
	if (!quiz.complete){
		if (patient.num === patient.count){
			$("#diagnose").css("display","block");
			$("#submitButton").css("display","none");
		}
	}
	resetInputFields();
	resetDom();
	//canvasCoverAnim = true;
	$("#patientQuizState").text(patient.num);
	$("#patientN").text(patient.num);
	//populateQuiz();
	disableAxis();
	//setSelectorState();
	resetQuizFields();
	if (quiz.complete){
		addCorrectAnswerColor();
	}
	
}
function patientPrev(){
	patient.num--;
	if (patient.num < 1){
		patient.num = patient.count;
	}
	resetInputFields();
	resetDom();
	//canvasCoverAnim = true;
	$("#patientQuizState").text(patient.num);
	$("#patientN").text(patient.num);
	//populateQuiz();
	disableAxis();
	//setSelectorState();
	resetQuizFields();
	if (quiz.complete){
		addCorrectAnswerColor();
	}
	
}


function resetQuizFields(){
	
	$("#quizDiopterInput1").text(quiz.userInputText[patient.num][0]);
	$("#quizDiopterInput2").text(quiz.userInputText[patient.num][1]);
	$("#quizEyeField1").text(quiz.userInputText[patient.num][2]);
	$("#quizEyeField2").text(quiz.userInputText[patient.num][3]);
	$("#quizConditionField1").text(quiz.userInputText[patient.num][4]);
	$("#quizConditionField2").text(quiz.userInputText[patient.num][5]);
	//$("#quizDiopterInput1").text(patient.quizDeviation.m[patient.num]);
	//$("#quizDiopterInput2").text(patient.quizDeviation.l[patient.num]);
	//$("#quizEyeField1").text(patient.userInputArray[patient.num][0]);
	//$("#quizEyeField2").text(patient.userInputArray[patient.num][1]);
	//$("#quizConditionField1").text(patient.userInputArray[patient.num][2]);
	//$("#quizConditionField2").text(patient.userInputArray[patient.num][3]);
}




function disableAxis(){
	if (patient.deviation.m.y[patient.num]===0 && patient.deviation.l.y[patient.num]===0){
		$("#disableAxisCover").css("left","153px");
		currentAxis = "X";
	} else if (patient.deviation.m.x[patient.num]===0 && patient.deviation.l.x[patient.num]===0){
		$("#disableAxisCover").css("left","83px");
		currentAxis = "Y";
	}
}

function custom_switchAxis(){
	if (currentAxis==="X"){
		currentAxis = "Y";
		patient.deviation.m.y[patient.num] = patient.deviation.m.x[patient.num];
		patient.deviation.l.y[patient.num] = patient.deviation.l.x[patient.num];
		if (patient.deviation.m.y[patient.num] > diop.limit*d){
			patient.deviation.m.y[patient.num] = diop.limit*d;
		}
		if (patient.deviation.m.y[patient.num] < diop.limit*d*n){
			patient.deviation.m.y[patient.num] = diop.limit*d*n;
		}
		if (patient.deviation.l.y[patient.num] > diop.limit*d){
			patient.deviation.l.y[patient.num] = diop.limit*d;
		}
		if (patient.deviation.l.y[patient.num] < diop.limit*d*n){
			patient.deviation.l.y[patient.num] = diop.limit*d*n;
		}
		patient.deviation.m.x[patient.num] = 0;
		patient.deviation.l.x[patient.num] = 0;
		
		$("#disableAxisCover").css("left","83px");
		resetInputFields();
		resetDom();
	} else {
		currentAxis = "X";
		patient.deviation.m.x[patient.num] = patient.deviation.m.y[patient.num];
		patient.deviation.l.x[patient.num] = patient.deviation.l.y[patient.num];
		patient.deviation.m.y[patient.num] = 0;
		patient.deviation.l.y[patient.num] = 0;
		$("#disableAxisCover").css("left","153px");
		resetInputFields();
		resetDom();
	}
}




/*
function diagnose(){
	$("#closeQuizBottom").css("display","block");
	$("#closeQuiz").css("display","block");
	$("#quizBG").css("display","block");
	populateQuiz();
}
*/

function closeQuiz(){
	$("#closeQuizBottom").css("display","none");
	$("#closeQuiz").css("display","none");
	$("#quizBG").css("display","none");
	checkQuizComplete();
}

function closeQuizBottom(){
	$("#closeQuizBottom").css("display","none");
	$("#closeQuiz").css("display","none");
	$("#quizBG").css("display","none");
}
	

/*
function changePatient(){
	if (patient.num===0){
		patient.num = 1;
		patient.image.face = 6;
		patient.image.eye = 1;
	} else if (patient.num===1){
		patient.num = 2;
		patient.image.face = 13;
		patient.image.eye = 12;
	} else if (patient.num===2){
		patient.num = 3;
		patient.image.face = 30;
		patient.image.eye = 29;
	} else if (patient.num===3){
		patient.num = 0;
		patient.image.face = 17;
		patient.image.eye = 16;
	}
}
*/


function toggleTarget(){
	if (targetObj.toggle==="on"){
		$("#toggle_target").css("background-image", "url(images/targetOff.png)");
		$("#toggle_target").css("background-color", "#777");
		targetObj.toggle="off";
		targetObj.image = 14;
	} else {
		$("#toggle_target").css("background-image", "url(images/targetOn.png)");
		$("#toggle_target").css("background-color", "#FFF");
		targetObj.toggle="on";
		targetObj.image = 0;
	}
}


function toggleCover(){
	if (coverObj.toggle==="on"){
		$("#toggle_occluder").css("background-image", "url(images/occluderOff.png)");
		$("#toggle_occluder").css("background-color", "#777");
		coverObj.toggle="off";
		coverObj.image = 14;
		if (mode.simult && !prismObj.clicked){togglePrism()};
	} else {
		$("#toggle_occluder").css("background-image", "url(images/occluderOn.png)");
		$("#toggle_occluder").css("background-color", "#FFF");
		coverObj.toggle="on";
		coverObj.image = 7;
		if (mode.simult && !prismObj.clicked){togglePrism()};
	}
	simultIconCheck();
}

function simultIconCheck(){
	if (coverObj.toggle==="off" || prismObj.toggle==="off"){
		$("#simult_toggle").css("background-image", "url(images/simultInactive.png)");
	}
	if (coverObj.toggle==="on" && prismObj.toggle==="on"){
		if (mode.simult){
			$("#simult_toggle").css("background-image", "url(images/simultOn.png)");
		} else {
			$("#simult_toggle").css("background-image", "url(images/simultOff.png)");
		}
	}
}

function togglePrism(){
	if (prismObj.toggle==="on"){
		$("#toggle_prism").css("background-image", "url(images/prismOff.png)");
		$("#rotate_prism").css("background-image", "url(images/prismRotateOff.png)");
		$("#input_diopters").css("color", "#666");
		$("#input_diopters").css("border-color", "#777");
		$("#input_diopters").css("background-color", "#777");
		$("#prismSetBG").css("background-color", "#777");
		$("#input_diopters").css("box-shadow","none");
		$("#input_diopters").css("background-image", "url(images/arrowsOff.png)");
		prismObj.toggle = "off";
		prismObj.image = 14;
		if (mode.simult && prismObj.clicked){toggleCover()};
	} else {
		$("#toggle_prism").css("background-image", "url(images/prismOn.png)");
		$("#rotate_prism").css("background-image", "url(images/prismRotateOn.png)");
		$("#input_diopters").css("color", "#000");
		$("#input_diopters").css("border-color", "#666");
		$("#input_diopters").css("background-color", "#FFF");
		$("#prismSetBG").css("background-color", "#FFF");
		$("#input_diopters").css("box-shadow","inset 0 0 1px 1px #BBB");
		$("#input_diopters").css("background-image", "url(images/arrows.png)");
		prismObj.toggle = "on";
		prismObj.image = 8;
		if (mode.simult && prismObj.clicked){toggleCover()};
	}
	simultIconCheck();
}


function checkDevice(){
	
	if ( /Android|iPad|iPhone/i.test(navigator.userAgent)){
		//console.log("iPad");
		desktop = false;
	}
}

















//////////////////////////////////////////////////////////////////////////////////
// PatSetup.js ///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////



function patientSetup(){
		
	patient = {
		count:3,
		num:1,
		image:{ face:[17,6,13,30,36], eye:[16,1,12,29,35] },
		deviation:{ m:{x:[0,0,0,0,0],y:[0,0,0,0,0]}, l:{x:[0,0,0,0,0],y:[0,0,0,0,0]}, dominant:["R","R","R","R","R"] },
		quizDeviation:{ m:[0,0,0,0,0], l:[0,0,0,0,0], dominant:["","","","",""] },
		quizInputArray:[[0,0,0,0,"N"],[0,0,0,0,"N"],[0,0,0,0,"N"],[0,0,0,0,"N"],[0,0,0,0,"N"]],
		userInputArray:[["N/A","N/A","N/A","N/A"],["N/A","N/A","N/A","N/A"],["N/A","N/A","N/A","N/A"],["N/A","N/A","N/A","N/A"],["N/A","N/A","N/A","N/A"]],
		quizMatch:["match","match","match","match","match"]
	}
	
	if (!mode.explore){
		
		randomizeDeviations();// <-- doesn't cause the error
		
	}
	
	/*
	patient.deviation.m.x[1] = 0;//35, 0
	patient.deviation.m.y[1] = 0;//0, 20
	patient.deviation.l.x[1] = 0;//20, 0
	patient.deviation.l.y[1] = 0;//0, 15
	patient.deviation.dominant[1] = "L";//L, L
	
	patient.deviation.m.x[2] = 0;
	patient.deviation.m.y[2] = 0;
	patient.deviation.l.x[2] = 0;
	patient.deviation.l.y[2] = 0;
	patient.deviation.dominant[2] = "R";
	
	patient.deviation.m.x[3] = 0;
	patient.deviation.m.y[3] = 40;//<-- this causes the error in [1]
	patient.deviation.l.x[3] = 0;
	patient.deviation.l.y[3] = 0;
	patient.deviation.dominant[3] = "R";
	*/
	
	
	// 35, 0, 20, 0, L = causes error every time
	//patient.deviation.dominant[1] = "R";//
	// ERROR ISOLATED TO "L" OF FIRST PATIENT
	// AFTER RESETTING EVERY TIME.
	// AND SOMETIMES AFTER BROWSER REFRESH
	// TEMP SOLUTION => FORCING "R" DOMINANCE FOR FIRST PATIENT IN TEST
	//console.log("patient.deviation.m.x[1] = " + patient.deviation.m.x[1]);
	//console.log("patient.deviation.m.y[1] = " + patient.deviation.m.y[1]);
	//console.log("patient.deviation.l.x[1] = " + patient.deviation.l.x[1]);
	//console.log("patient.deviation.l.y[1] = " + patient.deviation.l.y[1]);
	
	
	
	$("#inputFieldX").text(patient.deviation.m.x[1]);
	$("#inputFieldY").text(patient.deviation.m.y[1]);
	$("#inputFieldX_h").text(patient.deviation.l.x[1]);
	$("#inputFieldY_h").text(patient.deviation.l.y[1]);
	
	
	if (mode.overlay){
	//patient.num=0, patient.image.face= 17, patient.image.eye= 16;
	patient.num=0;
	//$("#testBox").css("display","block");
	mode.numGuide = true;
	$(".arrow").css("background-color","#0F0");
	$(".arrow").css("border","solid");
	$(".arrow").css("border-color","#F0F");
	$(".arrow").css("border-width","1px");
	$(".arrow").css("opacity","0.5");
	$("#closeQuizMenu").css("background-color","#FF0");
	$("#bar1").css("background-color","#FF0");
	$("#barA").css("background-color","#0F0");
	$("#bar2").css("background-color","#FC0");
	$("#bar3").css("background-color","#0FF");
	
	$("#inputFieldX").text(patient.deviation.m.x[0]);
	$("#inputFieldY").text(patient.deviation.m.y[0]);
	$("#inputFieldX_h").text(patient.deviation.l.x[0]);
	$("#inputFieldY_h").text(patient.deviation.l.y[0]);

	}
	
	
	if (!mode.explore){
		$("#panel1").css("top","440px");
		//$("#panel1").show();
		$("#panel2").css("top","610px");
		//$("#panel2").hide();
		$("#panel4").css("top","440px");
		//$("#panel4").show();
		$("#panel5").css("top","610px");
		//$("#panel5").hide();
	} else {
		$("#panel1").css("top","610px");
		//$("#panel1").hide();
		$("#panel2").css("top","440px");
		//$("#panel2").show();
		$("#panel4").css("top","610px");
		//$("#panel4").hide();
		$("#panel5").css("top","440px");
		//$("#panel5").show();
	}
	

	
	disableAxis();

}


// 92% = 5:48

function randomizeDeviations(){
	
	for (var i = 1; i < patient.count+1; i++){
		
		//console.log(i);
	//patient.deviation.m.x[1] = 60;

	//console.log(Math.ceil(Math.random() * 16));
	
	//patient.deviation.dominant[1] = "L";
	
	
	var random50 = Math.ceil(Math.random() * 2);
	
	// pick a number for m and l first
	var axis;
	
	if (random50===1){
		axis = "X";
	} else {
		axis = "Y";
	}
	
	var xyMod;
	
	if (axis==="X"){
		xyMod = 16;
	} else {
		xyMod = 8;
	}
	
	var tropia = 100;
	var phoria = 100;
	
	//generateMLnums();
	
	//function generateMLnums(){
	while (tropia + phoria > xyMod * 5){
		tropia = Math.ceil(Math.random() * xyMod) * 5;
		phoria = Math.ceil(Math.random() * xyMod) * 5;
	}
	
	
	//}
	
	//if (tropia + phoria > xyMod * 5){
	//	console.log(xyMod*5)
	//	generateMLnums(); // if tropia + phoria exceeds limit (X 80 or Y 40)
	//}
	
	
	
	var posNeg;
	
	random50 = Math.ceil(Math.random() * 2);
	
	if (random50===1){
		posNeg = 1;
	} else {
		posNeg = -1;
	}
	
	tropia = tropia * posNeg;
	phoria = phoria * posNeg;
	
	
	//console.log(tropia, phoria);
	
	// next... determine whether it's M/L, M, or L
	
	var random33 = Math.ceil(Math.random() * 3);
	
	if (random33===1){
		phoria = 0;
	} else if (random33===2){
		tropia = 0;
	} else {
		// do nothing - allow both
	}
		
	if (axis==="X"){
		patient.deviation.m.x[i] = tropia;
		patient.deviation.l.x[i] = phoria;
	} else {
		patient.deviation.m.y[i] = tropia;
		patient.deviation.l.y[i] = phoria;
	}
	
	// decide dominant:
	random50 = Math.ceil(Math.random() * 2);
	
	if (random50===1){
		patient.deviation.dominant[i] = "L";
	} else {
		patient.deviation.dominant[i] = "R";
	}
	
	}
	
}
































function instructNext(){
	
	menu.instructNum++;
	
	if (menu.instructNum<2){
		instructButtonsHide();
		$("#instructNext").show();
		menu.instructLength = menu.instructSeq[menu.instructState].length;
	}
	
	if (menu.instructSeq[menu.instructState][menu.instructNum]===7){
		$("#screenshotContainer").css("background-image","url(images/overlaySimBG2.jpg)");
	} else {
		$("#screenshotContainer").css("background-image","url(images/overlaySimBG.jpg)");
	}
	
	if (menu.instructState===1){
		$("#screenshotContainer").css("background-image","url(images/overlaySimBG2.jpg)");
	}
	
	if (menu.instructNum < menu.instructLength){
		$("#overlayContainer").css("background-image","url(images/overlay"+menu.instructSeq[menu.instructState][menu.instructNum]+".png)");
	} else {
		$("#instructContainer").hide();
	}
	
}

function instructSkip(){
	$("#instructContainer").hide();
}
function instructVideo(){
	window.open("video/_videoTutorial.mp4", "_blank");
}



function openReview(){
	//console
	menu.instructState = 0;
	menu.instructNum = 0;
	$("#overlayContainer").css("background-image","url(images/overlay1.png)");
	$("#screenshotContainer").css("background-image","url(images/overlaySimBG.jpg)");
	
	instructButtonsHide();
	$("#instructStart").show();
	$("#instructSkip").show();
	
	$("#instructContainer").show();
	///////////////////////
	mode.explore = true;
	
	patientSetup();
	resetDom();
	resetCircNum();
	
	$("#menuContainer").hide();
	$("#modeText").text("Explore Mode");
	$("#modeText").css("color","#659fd5");
}
function openTest(){
	menu.instructState = 1;
	menu.instructNum = 0;
	$("#overlayContainer").css("background-image","url(images/overlay1.png)");
	$("#screenshotContainer").css("background-image","url(images/overlaySimBG2.jpg)");
	
	instructButtonsHide();
	$("#instructStart").show();
	$("#instructSkip").show();
	
	$("#instructContainer").show();
	///////////////////////
	mode.explore = false;
	
	
	//clearInterval(cycleVar);
	
	patientSetup();
	resetDom();
	resetCircNum();//<-- solves it..
	
	
	//cycleVar = setInterval(function(){
	//	cycle();
	//	}, cycleInterval);
	
	
	//console.log("eyeCenterOS.x = " + eyeCenterOS.x);
	$("#menuContainer").hide();
	$("#modeText").text("Test Mode");
	$("#modeText").css("color","#f2c75c");
	
}
function openHelp(){
	menu.instructNum = 0;
	$("#overlayContainer").css("background-image","url(images/overlay1.png)");
	$("#screenshotContainer").css("background-image","url(images/overlaySimBG.jpg)");
	
	instructButtonsHide();
	$("#instructStart").show();
	$("#instructVideo").show();
	
	$("#instructContainer").show();
	///////////////////////
	// NO CHANGE TO SIM
}



function instructButtonsHide(){
	$("#instructStart").hide();
	$("#instructNext").hide();
	$("#instructSkip").hide();
	$("#instructVideo").hide();
}

//function closeHelp(){
//	$("#instructContainer").hide();
//}



function goHome(){
	
	// RESET INITIAL VARIABLES TO ORIGINAL
	$("#menuContainer").show();
	
	//dominant = "OD";
	coverObj = {x:30,y:20,w:200,h:200,drag:false,location:"",num:{x:{o:0,c:0},y:{o:0,c:0}}, movement:"U"}
	prismObj = {x:700,y:250,w:150,h:150,drag:false,location:"",num:{x:{o:0,c:0,fake:0},y:{o:0,c:0,fake:0}},degrees:0,anim:false,rotation:"left",axis:"X",speed:5}
	prism2Obj = {x:0,y:0,w:150,h:150,drag:false,location:"",num:{x:{o:0,c:0,fake:0},y:{o:0,c:0,fake:0}},degrees:0,anim:false,rotation:"left",speed:5}
	targetObj = {x:420,y:120,w:130,h:570,drag:false,location:"",num:{x:{o:0,c:0,perc:0},y:{o:0,c:0,perc:0}}}
	eyeOD = {x:300,y:220,r:70,dom:false,num:{x:{o:0,c:0,end:0},y:{o:0,c:0,end:0}},firstItem:"C",range:{pos:diop.limit,neg:diop.limit*n}}
	eyeOS = {x:600,y:220,r:70,dom:false,num:{x:{o:0,c:0,end:0},y:{o:0,c:0,end:0}},firstItem:"C",range:{pos:diop.limit,neg:diop.limit*n}}
	eyeCenterOD = {x:325,y:215,r:5}
	eyeCenterOS = {x:575,y:215,r:5}
	
	targetObj.x = scene.w*d - targetObj.w*d*d;
	targetObj.y = scene.h*d - targetObj.w*d*d;

	diop.main = 20;

	prismObj.num.x.o = diop.main;
	prismObj.num.x.c = diop.main;
	prismObj.num.x.fake = diop.main;
	$("#input_diopters").text(diop.main);

	coverObj.num.x.c = coverObj.num.x.o;

	resetPrism();
	
	patient.deviation.dominant[patient.num] = "L"; // <- event toggles to opposite
	domClick();
	
	resetCircNum();
	
	coverObj.toggle="on"; // <- event toggles to opposite, then toggles to opposite again (simult)
	targetObj.toggle="off"; // <- event toggles to opposite
	prismObj.toggle="off"; // <- event toggles to opposite
	mode.simult = true; // <- event toggles to opposite
	prismObj.clicked = true;
	
	toggleTarget();
	toggleCover();
	togglePrism();
		
	toggleSimult();
	//location.reload();
	
	
	
	$("#testResetButton").hide();
	$("#panel5").css("left","370px");
	$("#patientN").text(1);
	
	$("#quizDiopterInput1").text(0);
	$("#quizDiopterInput2").text(0);
	
	$("#quizEyeField1").text("N/A");
	$("#quizEyeField2").text("N/A");
	
	$("#quizConditionField1").text("N/A");
	$("#quizConditionField2").text("N/A");
	
	$("#submitButton").css("display","block");
	$("#diagnose").css("display","none");
	
	$("#scoreBG").css("display", "none");
	
	quiz.complete = false;
	
	// FINISHED QUIZ PANEL REFRESH STYLES ///////////////////////////
	
	$("#patientNext").css("display","none");
	$("#patientPrev").css("display","none");
	
	$("#quizDiopterInput1").css("backgroundImage","url(images/arrows.png)");
	$("#quizDiopterInput2").css("backgroundImage","url(images/arrows.png)");
	
	$("#quizEyeButton1").css("top","25px");
	$("#quizEyeButton2").css("top","70px");
	$("#quizConditionButton1").css("top","25px");
	$("#quizConditionButton2").css("top","70px");
	
	$("#quiz_arrowUp_diop1").css("top","18px");
	$("#quiz_arrowDown_diop1").css("top","43px");
	$("#quiz_arrowUp_diop2").css("top","68px");
	$("#quiz_arrowDown_diop2").css("top","93px");
	
	$("#quizEyeField1").css("border-color", "#666");
	$("#quizEyeField2").css("border-color", "#666");
	$("#quizEyeField1").css("box-shadow", "inset 0 0 1px 1px #BBB");
	$("#quizEyeField2").css("box-shadow", "inset 0 0 1px 1px #BBB");

	$("#quizConditionField1").css("border-color", "#666");
	$("#quizConditionField2").css("border-color", "#666");
	$("#quizConditionField1").css("box-shadow", "inset 0 0 1px 1px #BBB");
	$("#quizConditionField2").css("box-shadow", "inset 0 0 1px 1px #BBB");

	$("#quizDiopterInput1").css("border-color", "#666");
	$("#quizDiopterInput2").css("border-color", "#666");
	$("#quizDiopterInput1").css("box-shadow", "inset 0 0 1px 1px #BBB");
	$("#quizDiopterInput2").css("box-shadow", "inset 0 0 1px 1px #BBB");
	
	$("#quizEyeField1").css("background-color", "#FFF");
	$("#quizEyeField2").css("background-color","#FFF");
	$("#quizConditionField1").css("background-color","#FFF");
	$("#quizConditionField2").css("background-color","#FFF");
	$("#quizDiopterInput1").css("background-color","#FFF");
	$("#quizDiopterInput2").css("background-color","#FFF");
	
	quiz.answerText = [[],[],[],[],[]];
	quiz.userInputText = [[],[],[],[],[]];
	
	for (var v = 0; v < 5; v++){
		for (var m = 0; m < 2; m++){
			quiz.userInputText[v][m] = 0;
		}
		for (var m = 2; m < 6; m++){
			quiz.userInputText[v][m] = "N/A";
		}
	}
	
	
	
	
	$("#helpButton").show();
	
	////////////////////////////////////////////////////////////////
}



function testReset(){
	
	loadPatients();// fake loading screen
	goHome();// reset variables
	openTest();// mode.explore = false; patientSetup();
	instructSkip();// skip instruction screen
	
}




function loadPatients(){
	$("#loadPatientsCover").css("display","block");
	
	setTimeout(function(){
		 $("#loadPatientsCover").css("display","none");
	}, 1000);
		
}





















//////////////////////////////////////////////////////////////////////////////////
// Credit.js /////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////



function clickCredit(event){
	
	
	if (menu.creditToggle){
		menu.creditToggle = false;
		element = document.getElementById("creditContainer");
		element.style.display = "none";
		element = document.getElementById("creditButtonNew");
		element.style.display = "block";
	} else {
		menu.creditToggle = true;
		element = document.getElementById("creditContainer");
		element.style.display = "block";
		element = document.getElementById("creditButtonNew");
		element.style.display = "none";
	}
	
	
}





















//////////////////////////////////////////////////////////////////////////////////
// Quiz.js ///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////





function diagnose(){
		
	
	quiz.complete = true;
	
	checkAnswerMatch();
	
	
}



function checkAnswerMatch(){
	
	var foundCorrect = 0;
	
	for (var i=1;i<4;i++){
		
			if (quiz.userInputText[i][0]===quiz.answerText[i][0]){
				foundCorrect = foundCorrect + 1;
			}
			if (quiz.userInputText[i][1]===quiz.answerText[i][1]){
				foundCorrect = foundCorrect + 1;
			}
			if (quiz.userInputText[i][2]===quiz.answerText[i][2]){
				foundCorrect = foundCorrect + 1;
			}
			if (quiz.userInputText[i][3]===quiz.answerText[i][3]){
				foundCorrect = foundCorrect + 1;
			}
			if (quiz.userInputText[i][4]===quiz.answerText[i][4]){
				foundCorrect = foundCorrect + 1;
			}
			if (quiz.userInputText[i][5]===quiz.answerText[i][5]){
				foundCorrect = foundCorrect + 1;
			}
			
			if (foundCorrect===6){
				quiz.score = quiz.score + 1;
			}
			foundCorrect = 0;
		
		
	}
	
	
	
	$("#scoreBG").css("display", "block");
	$("div#scoreNumber").text(quiz.score + "/" + patient.count);
	
	quiz.score = 0;
	
	// FADE OUT INPUT FIELDS:
	$("#quizEyeField1").css("border-color", "#DDD");
	$("#quizEyeField2").css("border-color", "#DDD");
	$("#quizEyeField1").css("box-shadow", "none");
	$("#quizEyeField2").css("box-shadow", "none");
	$("#quizConditionField1").css("border-color", "#DDD");
	$("#quizConditionField2").css("border-color", "#DDD");
	$("#quizConditionField1").css("box-shadow", "none");
	$("#quizConditionField2").css("box-shadow", "none");
	$("#quizDiopterInput1").css("border-color", "#DDD");
	$("#quizDiopterInput2").css("border-color", "#DDD");
	$("#quizDiopterInput1").css("box-shadow", "none");
	$("#quizDiopterInput2").css("box-shadow", "none");
	
	addCorrectAnswerColor();

}




	
	
	
function addCorrectAnswerColor(){
	
	$("#quizEyeField1").css("background-color",quiz.redBG);
	$("#quizEyeField2").css("background-color",quiz.redBG);
	$("#quizConditionField1").css("background-color",quiz.redBG);
	$("#quizConditionField2").css("background-color",quiz.redBG);
	$("#quizDiopterInput1").css("background-color",quiz.redBG);
	$("#quizDiopterInput2").css("background-color",quiz.redBG);
	
	if (quiz.userInputText[patient.num][0]===quiz.answerText[patient.num][0]){
		$("#quizDiopterInput1").css("background-color",quiz.greenBG);
	}
	if (quiz.userInputText[patient.num][1]===quiz.answerText[patient.num][1]){
		$("#quizDiopterInput2").css("background-color",quiz.greenBG);
	}
	if (quiz.userInputText[patient.num][2]===quiz.answerText[patient.num][2]){
		$("#quizEyeField1").css("background-color",quiz.greenBG);
	}
	if (quiz.userInputText[patient.num][3]===quiz.answerText[patient.num][3]){
		$("#quizEyeField2").css("background-color",quiz.greenBG);
	}
	if (quiz.userInputText[patient.num][4]===quiz.answerText[patient.num][4]){
		$("#quizConditionField1").css("background-color",quiz.greenBG);
	}
	if (quiz.userInputText[patient.num][5]===quiz.answerText[patient.num][5]){
		$("#quizConditionField2").css("background-color",quiz.greenBG);
	}
	if (quiz.userInputText[patient.num][0]===0){
		$("#quizDiopterInput1").text(" ");
	}
	if (quiz.userInputText[patient.num][1]===0){
		$("#quizDiopterInput2").text(" ");
	}
	if (quiz.userInputText[patient.num][2]==="N/A"){
		$("#quizEyeField1").text(" ");
	}
	if (quiz.userInputText[patient.num][3]==="N/A"){
		$("#quizEyeField2").text(" ");
	}
	if (quiz.userInputText[patient.num][4]==="N/A"){
		$("#quizConditionField1").text(" ");
	}
	if (quiz.userInputText[patient.num][5]==="N/A"){
		$("#quizConditionField2").text(" ");
	}
	
}
	
	
	



function call_quiz_arrowUp_diop1(){
	if (patient.quizDeviation.m[patient.num] < diop.limit){
		patient.quizDeviation.m[patient.num] = patient.quizDeviation.m[patient.num] + diop.inc;
	} else {
		patient.quizDeviation.m[patient.num] = diop.limit;
	}
	updateQuizInputFields();
}
function call_quiz_arrowDown_diop1(){
	if (patient.quizDeviation.m[patient.num] > 0){
		patient.quizDeviation.m[patient.num] = patient.quizDeviation.m[patient.num] - diop.inc;
	} else {
		patient.quizDeviation.m[patient.num] = 0;
	}	
	updateQuizInputFields();
}

function call_quiz_arrowUp_diop2(){
	if (patient.quizDeviation.l[patient.num] < diop.limit){
		patient.quizDeviation.l[patient.num] = patient.quizDeviation.l[patient.num] + diop.inc;
	} else {
		patient.quizDeviation.l[patient.num] = diop.limit;
	}
	updateQuizInputFields();
}
function call_quiz_arrowDown_diop2(){
	if (patient.quizDeviation.l[patient.num] > 0){
		patient.quizDeviation.l[patient.num] = patient.quizDeviation.l[patient.num] - diop.inc;
	} else {
		patient.quizDeviation.l[patient.num] = 0;
	}	
	updateQuizInputFields();
}

function call_quizEyeButton1(){
	closeAllMenus();
	quiz.menuOpen = true;
	//document.addEventListener('touchstart', function(e){testE(e)}, false);
	$("#quizEyeMenu1").css("display","block");
	//$("#closeQuizMenu").css("top","-440px");
}
function call_quizEyeButton2(){
	closeAllMenus();
	quiz.menuOpen = true;
	//document.addEventListener('touchstart', function(e){testE(e)}, false);
	$("#quizEyeMenu2").css("display","block");
	//$("#closeQuizMenu").css("top","-440px");
	//$("#patch").css("display","block");
}
function call_quizConditionButton1(){
	closeAllMenus();
	quiz.menuOpen = true;
	//document.addEventListener('touchstart', function(e){testE(e)}, false);
	$("#quizConditionMenu1").css("display","block");
	//$("#closeQuizMenu").css("top","-440px");
}
function call_quizConditionButton2(){
	closeAllMenus();
	quiz.menuOpen = true;
	//document.addEventListener('touchstart', function(e){testE(e)}, false);
	$("#quizConditionMenu2").css("display","block");
	//$("#closeQuizMenu").css("top","-440px");
}
function call_closeQuizMenu(){
	if (!quiz.complete){
	// closes all menus first
	//$("#closeQuizMenu").css("top","2000px");
	closeAllMenus();
	//$("#patch").css("display","none");
	
	$("#quizEyeField1").text(patient.userInputArray[patient.num][0]);
	$("#quizEyeField2").text(patient.userInputArray[patient.num][1]);
	$("#quizConditionField1").text(patient.userInputArray[patient.num][2]);
	$("#quizConditionField2").text(patient.userInputArray[patient.num][3]);
	
	quiz.userInputText[patient.num][2] = patient.userInputArray[patient.num][0];
	quiz.userInputText[patient.num][3] = patient.userInputArray[patient.num][1];
	quiz.userInputText[patient.num][4] = patient.userInputArray[patient.num][2];
	quiz.userInputText[patient.num][5] = patient.userInputArray[patient.num][3];
	
	//styleBlankFields();
	}
	
}

function closeAllMenus(){
	$("#quizEyeMenu1").css("display","none");
	$("#quizEyeMenu2").css("display","none");
	$("#quizConditionMenu1").css("display","none");
	$("#quizConditionMenu2").css("display","none");
}



function call_left1(){
	patient.userInputArray[patient.num][0] = "Left";
	call_closeQuizMenu();
}
function call_right1(){
	patient.userInputArray[patient.num][0] = "Right";
	call_closeQuizMenu();
}
function call_none1(){
	patient.userInputArray[patient.num][0] = "N/A";
	call_closeQuizMenu();
}
function call_left2(){
	patient.userInputArray[patient.num][1] = "Left";
	call_closeQuizMenu();
}
function call_right2(){
	patient.userInputArray[patient.num][1] = "Right";
	call_closeQuizMenu();
}
function call_none2(){
	patient.userInputArray[patient.num][1] = "N/A";
	call_closeQuizMenu();
}
function call_eso1(){
	patient.userInputArray[patient.num][2] = "Esotropia";
	call_closeQuizMenu();
}
function call_exo1(){
	patient.userInputArray[patient.num][2] = "Exotropia";
	call_closeQuizMenu();
}
function call_hyper1(){
	patient.userInputArray[patient.num][2] = "Hypertropia";
	call_closeQuizMenu();
}
function call_hypo1(){
	patient.userInputArray[patient.num][2] = "Hypotropia";
	call_closeQuizMenu();
}
function call_noneC1(){
	patient.userInputArray[patient.num][2] = "N/A";
	call_closeQuizMenu();
}
function call_eso2(){
	patient.userInputArray[patient.num][3] = "Esophoria";
	call_closeQuizMenu();
}
function call_exo2(){
	patient.userInputArray[patient.num][3] = "Exophoria";
	call_closeQuizMenu();
}
function call_hyper2(){
	patient.userInputArray[patient.num][3] = "Hyperphoria";
	call_closeQuizMenu();
}
function call_hypo2(){
	patient.userInputArray[patient.num][3] = "Hypophoria";
	call_closeQuizMenu();
}
function call_noneC2(){
	patient.userInputArray[patient.num][3] = "N/A";
	call_closeQuizMenu();
}




function updateQuizInputFields(){
	
	$("#quizDiopterInput1").text(patient.quizDeviation.m[patient.num]);
	$("#quizDiopterInput2").text(patient.quizDeviation.l[patient.num]);
	
	// APPLY THIS TO OTHER FOUR...
	quiz.userInputText[patient.num][0] = patient.quizDeviation.m[patient.num];
	quiz.userInputText[patient.num][1] = patient.quizDeviation.l[patient.num];
	
}







function checkClickCloseConditionMenu(e){
	// only works on desktop (click outside menu to close it)
	if (quiz.menuOpen){
		var container = $("#quizEyeMenu1");//<--can be anything off screen

 	   if (!container.is(e.target) // if the target of the click isn't the container...
    	    && container.has(e.target).length === 0) // ... nor a descendant of the container
    	{
    	    //console.log("didn't click quizEyeMenu1");
			call_closeQuizMenu();
    	}
	}
	
}

function closeScore(){
	
	$("#patientNext").css("display","block");
	$("#patientPrev").css("display","block");
	
	$("#quizDiopterInput1").css("backgroundImage","none");
	$("#quizDiopterInput2").css("backgroundImage","none");
	
	$("#scoreBG").css("display","none");
	$("#submitButton").css("display","none");
	$("#diagnose").css("display","none");
	$("#quizEyeButton1").css("top","1000px");
	$("#quizEyeButton2").css("top","1000px");
	$("#quizConditionButton1").css("top","1000px");
	$("#quizConditionButton2").css("top","1000px");
	
	$("#quiz_arrowUp_diop1").css("top","1000px");
	$("#quiz_arrowDown_diop1").css("top","1000px");
	$("#quiz_arrowUp_diop2").css("top","1000px");
	$("#quiz_arrowDown_diop2").css("top","1000px");
	
	
	for (var l=1;l<patient.count+1;l++){
	if (patient.quizDeviation.m[l] === 999){
		patient.quizDeviation.m[l] = 0;
	}
	if (patient.quizDeviation.l[l] === 999){
		patient.quizDeviation.l[l] = 0;
	}
	}
	
	// bring review panels up...
	//$("#panel2").css("top","10px");
	//$("#panel2").css("left","385px");
	$("#panel5").css("top","10px");
	$("#panel5").css("left","735px");
	
	//addCorrectMark();
	
	$("#helpButton").hide();
	
	// RE-STYLE BLANK FIELDS
	//styleBlankFields();
	
	$("#testResetButton").show();	
	
}



function addCorrectMark(){
	//console.log(patient.quizMatch[patient.num]);
	if (patient.quizMatch[patient.num]==="scored"){
		$("#correctMark").css("display","block");
		$("#incorrectMark").css("display","none");
	} else {
		$("#correctMark").css("display","none");
		$("#incorrectMark").css("display","block");
	}
}


















//////////////////////////////////////////////////////////////////////////////////
// Draw.js ///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////





function drawShapes(){
	
	//loadInt++;
	//if (loadInt===3){
	//	$("#loadingCover").css("display", "none");
	//}
	ctx1.clearRect(0,0,scene.w,scene.h);
	ctx2.clearRect(0,0,scene.w,scene.h);
	ctx3.clearRect(0,0,scene.w,scene.h);
	ctx4.clearRect(0,0,scene.w,scene.h);

	ctx1.drawImage(ps[patient.image.eye[patient.num]],eyeCenterOD.x-180,eyeCenterOD.y-180,360,360);//OD eye
	ctx1.drawImage(ps[patient.image.eye[patient.num]],eyeCenterOS.x-180,eyeCenterOS.y-180,360,360);//OS eye
	ctx1.drawImage(ps[patient.image.face[patient.num]],0,0,canvas1.width,canvas1.height);//face	
	
	// LIGHT REFLEX:
	if (prismObj.location!=="L"){
		if (!prismObj.anim){
			ctx2.drawImage(ps[49],300-180,215-180,360,360);//OD eye
		}
		ctx2.drawImage(ps[49],600-180,215-180,360,360);//OS eye
	}
	if (prismObj.location!=="R"){
		ctx2.drawImage(ps[49],300-180,215-180,360,360);//OD eye
		if (!prismObj.anim){
			ctx2.drawImage(ps[49],600-180,215-180,360,360);//OS eye
		}
	}
	
	
	
		
	//ctx3.drawImage(ps[coverObj.image],coverObj.x,coverObj.y,200,510);//cover
	//ctx3.drawImage(ps[targetObj.image],targetObj.x,targetObj.y,targetObj.w,targetObj.h);//target
	
	//ctx3.drawImage(canvas2, 0, 0, scene.w, scene.h);
	
	//console.log($("#disableAxisCover").index())
	// PRISM REFRACTION ///////////////////////////////////
	
	//$("#canvas2").css("top", prismObj.y+7);
	//$("#canvas2").css("left", prismObj.x+15);
	//$("#canvas3").css("top", prismObj.y+30);
	//$("#canvas3").css("left", prismObj.x+40);
	
	//ctx2.drawImage(canvas1, 0, 0, scene.w, scene.h);
	

	///////////////////////////////////
	
	if (prismObj.anim){ // IF ANIMATE
		
		prismObj.degrees = prismObj.degrees + prismObj.speed;
		////////////////////////////////////////
		ctx3.save();
    	// positioning:
		ctx3.translate(prismObj.x+(prismObj.w*d),prismObj.y+(prismObj.h*d));
    	// rotate:
		ctx3.rotate(Math.PI/180*prismObj.degrees);
    	ctx3.drawImage(ps[prismObj.image],prismObj.w*d*n,prismObj.h*d*n,prismObj.w,prismObj.h);
    	
		//ctx3.rect(prismObj.w*d*n,prismObj.h*d*n,prismObj.w,prismObj.h);
		//ctx3.stroke();
		
		ctx3.restore();
		////////////////////////////////////////
		
		////////////////////////////////////////
		if (prismObj.rotation==="left"){
			if (prismObj.degrees === 360){
				prismObj.anim = false;
				prismObj.degrees = 0;
			}
		} else if (prismObj.rotation==="up"){
			if (prismObj.degrees === 90){
				prismObj.anim = false;
			}
		} else if (prismObj.rotation==="right"){
			if (prismObj.degrees === 180){
				prismObj.anim = false;
			}
		} else if (prismObj.rotation==="down"){
			if (prismObj.degrees === 270){
				prismObj.anim = false;
			}
		}
	} else { // IF NO ANIMATE
		if (prismObj.rotation==="left"){
			
			ctx3.drawImage(ps[prismObj.image],prismObj.x,prismObj.y,prismObj.w,prismObj.h);
			
			//prism
		} else {
			ctx3.save();
    		ctx3.translate(prismObj.x+(prismObj.w*d),prismObj.y+(prismObj.h*d));
    		ctx3.rotate(Math.PI/180*prismObj.degrees);
    		ctx3.drawImage(ps[prismObj.image],prismObj.w*d*n,prismObj.h*d*n,prismObj.w,prismObj.h);
    		ctx3.restore();
		}
	}
	
	
	var diopMod = -1;
	//				
	if (!prismObj.anim){
	if (prismObj.rotation==="left"){
	ctx3.drawImage(	canvas1,
					(prismObj.x+15),//+(prismObj.num.x.fake*diopMod)),
					prismObj.y+7,
					prismObj.w-18,
					prismObj.h-10,
					(prismObj.x+15),
					prismObj.y+7,
					prismObj.w-18,
					prismObj.h-10);
	}
	if (prismObj.rotation==="up"){
	ctx3.drawImage(	canvas1,
					(prismObj.x+3),
					prismObj.y+15,//+(prismObj.num.x.fake*diopMod),
					prismObj.w-10,
					prismObj.h-18,
					(prismObj.x+3),
					prismObj.y+15,
					prismObj.w-10,
					prismObj.h-18);
	}
	if (prismObj.rotation==="right"){
	ctx3.drawImage(	canvas1,
					(prismObj.x+7),//-(prismObj.num.x.fake*diopMod)),
					prismObj.y+3,
					prismObj.w-18,
					prismObj.h-10,
					(prismObj.x+7),
					prismObj.y+3,
					prismObj.w-18,
					prismObj.h-10);
	}
	if (prismObj.rotation==="down"){
	ctx3.drawImage(	canvas1,
					(prismObj.x+7),
					prismObj.y+2,//-(prismObj.num.x.fake*diopMod),
					prismObj.w-10,
					prismObj.h-18,
					(prismObj.x+7),
					prismObj.y+2,
					prismObj.w-10,
					prismObj.h-18);
	}
	}
	
	var lightReflexMod = 0.7;
	
	if (!prismObj.anim){
	if (prismObj.rotation==="left"){
	ctx3.drawImage(	canvas2,
					(prismObj.x+15),
					prismObj.y+7,
					prismObj.w-18,
					prismObj.h-10,
					(prismObj.x+15),
					prismObj.y+7,
					prismObj.w-18,
					prismObj.h-10);
	}
	if (prismObj.rotation==="up"){
	// console.log(diopMod);
	ctx3.drawImage(	canvas2,
					(prismObj.x+3),
					prismObj.y+15,
					prismObj.w-10,
					prismObj.h-18,
					(prismObj.x+3),
					prismObj.y+15,
					prismObj.w-10,
					prismObj.h-18);
	}
	if (prismObj.rotation==="right"){
	ctx3.drawImage(	canvas2,
					(prismObj.x+7),
					prismObj.y+3,
					prismObj.w-18,
					prismObj.h-10,
					(prismObj.x+7),
					prismObj.y+3,
					prismObj.w-18,
					prismObj.h-10);
	}
	if (prismObj.rotation==="down"){
	ctx3.drawImage(	canvas2,
					(prismObj.x+7),
					prismObj.y-0,
					prismObj.w-10,
					prismObj.h-18,
					(prismObj.x+7),
					prismObj.y+0,
					prismObj.w-10,
					prismObj.h-18);
	}
	
	
	
	} else {
		ctx3.drawImage(canvas2,1,1,1,1);
	}
	
	
	// DRAW ONLY IF IN the square
	//console.log(diopMod);
	//ctx3.drawImage(ps[49],300-180+5*diopMod,215-180,360,360);//OD eye
	//ctx3.drawImage(ps[49],600-180+5*diopMod,215-180,360,360);//OS eye
	
	
	/*
	ctx3.rect(		(prismObj.x+15),
					prismObj.y+7,
					prismObj.w-18,
					prismObj.h-10);
	ctx3.stroke();
	*/
	
	//ctx3.drawImage(canvas2, 0, 0, scene.w, scene.h);
	// canvas4: all in canvas2 plus prism graphic
	//ctx4.drawImage(canvas2, 0, 0, scene.w, scene.h);
	//ctx4.drawImage(ps[prism2Obj.image], prism2Obj.x, prism2Obj.y);
	// canvas4: add swatch from canvas 3 over prism
	//ctx4.drawImage(canvas3, (prism2Obj.x+15+(prismObj.num.x.fake*diopMod)),prism2Obj.y+7,prism2Obj.w-18,prism2Obj.h-10, (prism2Obj.x+15),prism2Obj.y+7,prism2Obj.w-18,prism2Obj.h-10);
	
	ctx3.drawImage(ps[coverObj.image],coverObj.x,coverObj.y,200,510);//cover
	ctx3.drawImage(ps[targetObj.image],targetObj.x,targetObj.y,targetObj.w,targetObj.h);//target
	
	
	
	
	
	
		
	
	if (mode.numGuide){
		
	ctx4.lineWidth = 6;
	
	if (patient.deviation.dominant[patient.num]==="R"){
		ctx4.strokeStyle="#000000";
		ctx4.fillStyle="#000000";
	} else if (patient.deviation.dominant[patient.num]==="L"){
		ctx4.strokeStyle="#FFFFFF";
		ctx4.fillStyle="#FFFFFF";
	} else if (patient.deviation.dominant[patient.num]==="A"){
		ctx4.strokeStyle="#666666";
		ctx4.fillStyle="#666666";
	}
	ctx4.beginPath();
	ctx4.arc(eyeOD.x,eyeOD.y,eyeOD.r,0,2*Math.PI);
	ctx4.stroke();
	ctx4.font="60px Helvetica";
	ctx4.fillText(eyeOD.num.x.c,eyeOD.x-40,eyeOD.y-145);
	ctx4.fillText(eyeOD.num.y.c,eyeOD.x-40,eyeOD.y-90);
	ctx4.font="20px Helvetica";
	ctx4.fillText("R",eyeOD.x+55,eyeOD.y-45);
	
	if (patient.deviation.dominant[patient.num]==="L"){
		ctx4.strokeStyle="#000000";
		ctx4.fillStyle="#000000";
	} else if (patient.deviation.dominant[patient.num]==="R"){
		ctx4.strokeStyle="#FFFFFF";
		ctx4.fillStyle="#FFFFFF";
	} else if (patient.deviation.dominant[patient.num]==="A"){
		ctx4.strokeStyle="#666666";
		ctx4.fillStyle="#666666";
	}
	ctx4.beginPath();
	ctx4.arc(eyeOS.x,eyeOS.y,eyeOS.r,0,2*Math.PI);
	ctx4.stroke();
	ctx4.font="60px Helvetica";
	ctx4.fillText(eyeOS.num.x.c,eyeOS.x-40,eyeOS.y-145);
	ctx4.fillText(eyeOS.num.y.c,eyeOS.x-40,eyeOS.y-90);
	ctx4.font="20px Helvetica";
	ctx4.fillText("L",eyeOS.x+55,eyeOS.y-45);
	
	ctx4.strokeStyle="#FF00FF";
	ctx4.fillStyle="#FF00FF";
	ctx4.beginPath();
	ctx4.arc(coverObj.x+coverObj.w*d,coverObj.y+coverObj.h*d,coverObj.w*d,0,2*Math.PI);
	ctx4.stroke();	
	ctx4.font="60px Helvetica";
	ctx4.fillText(coverObj.num.x.c,coverObj.x+20,coverObj.y+70);
	ctx4.fillText(coverObj.num.y.c,coverObj.x+20,coverObj.y+125);
	ctx4.font="20px Helvetica";
	ctx4.fillText("A",coverObj.x+60,coverObj.y+20);
	ctx4.lineWidth = 2;
	ctx4.strokeRect(coverObj.x+coverObj.w*d,coverObj.y-100,0,coverObj.h+200);
	ctx4.strokeRect(coverObj.x-100,coverObj.y+coverObj.h*d,coverObj.w+200,0);
	
	
	ctx4.lineWidth = 6;
	ctx4.strokeStyle="#0099FF";
	ctx4.fillStyle="#0099FF";
	ctx4.strokeRect(prismObj.x,prismObj.y,prismObj.w,prismObj.h);
	ctx4.lineWidth = 2;
	// prism base as stroke:
	
	if (prismObj.rotation==="left"){
		ctx4.strokeRect(prismObj.x,prismObj.y,20,prismObj.h);
	}
	if (prismObj.rotation==="up"){
		ctx4.strokeRect(prismObj.x,prismObj.y,prismObj.w,20);
	}
	if (prismObj.rotation==="right"){
		ctx4.strokeRect(prismObj.x+130,prismObj.y,20,prismObj.h);
	}
	if (prismObj.rotation==="down"){
		ctx4.strokeRect(prismObj.x,prismObj.y+130,prismObj.w,20);
	}
	ctx4.font="60px Helvetica";
	ctx4.fillText(prismObj.num.x.c,prismObj.x+20,prismObj.y+70);
	ctx4.fillText(prismObj.num.y.c,prismObj.x+20,prismObj.y+125);
	ctx4.font="20px Helvetica";
	ctx4.fillText("B",prismObj.x+120,prismObj.y+30);
	
	ctx4.strokeRect(prismObj.x+prismObj.w*d,prismObj.y-100,0,prismObj.h+200);
	ctx4.strokeRect(prismObj.x-100,prismObj.y+prismObj.h*d,prismObj.w+200,0);
	
	
	
	// FIXATION STICK
	
	ctx4.strokeStyle="#00FF00";
	ctx4.fillStyle="#00FF00";
	ctx4.lineWidth = 6;
	ctx4.strokeRect(targetObj.x,targetObj.y,targetObj.w*d,targetObj.h);
	ctx4.font="60px Helvetica";
	ctx4.fillText(targetObj.num.x.c,targetObj.x+10,targetObj.y+100);
	ctx4.fillText(targetObj.num.y.c,targetObj.x+10,targetObj.y+155);
	ctx4.font="20px Helvetica";
	ctx4.fillText("C",targetObj.x+5,targetObj.y-10);
	ctx4.lineWidth = 2;
	
	
	
	
	
	ctx4.strokeStyle="#000000";
	ctx4.fillStyle="#000000";
	ctx4.beginPath();
	ctx4.arc(eyeCenterOD.x,eyeCenterOD.y,eyeCenterOD.r,0,2*Math.PI);
	ctx4.fill();
	
	// LEFT EYE DOT
	ctx4.strokeStyle="#000000";
	ctx4.fillStyle="#FF00FF";
	ctx4.beginPath();
	ctx4.arc(eyeCenterOS.x,eyeCenterOS.y,eyeCenterOS.r,0,2*Math.PI);
	ctx4.fill();
	
	var yu = 125;
	var yd = 375;
	var ym = 175;
	
	
	ctx4.strokeStyle="#FF0000";
	ctx4.beginPath();
	ctx4.moveTo(eyeOD.x+eyeOD.range.neg*centerToEyeRatio,yu);
	ctx4.lineTo(eyeOD.x+eyeOD.range.neg*centerToEyeRatio,yd);
	ctx4.moveTo(eyeOD.x+eyeOD.range.pos*centerToEyeRatio,yu);
	ctx4.lineTo(eyeOD.x+eyeOD.range.pos*centerToEyeRatio,yd);
	ctx4.moveTo(eyeOS.x+eyeOS.range.neg*centerToEyeRatio,yu);
	ctx4.lineTo(eyeOS.x+eyeOS.range.neg*centerToEyeRatio,yd);
	ctx4.moveTo(eyeOS.x+eyeOS.range.pos*centerToEyeRatio,yu);
	ctx4.lineTo(eyeOS.x+eyeOS.range.pos*centerToEyeRatio,yd);
	ctx4.stroke();
	
	ctx4.strokeStyle="#FFCC00";
	ctx4.beginPath();
	ctx4.moveTo(eyeOD.x+eyeOD.num.end*centerToEyeRatio,yu);
	ctx4.lineTo(eyeOD.x+eyeOD.num.end*centerToEyeRatio,yd);
	ctx4.moveTo(eyeOS.x+eyeOS.num.end*centerToEyeRatio,yu);
	ctx4.lineTo(eyeOS.x+eyeOS.num.end*centerToEyeRatio,yd);
	ctx4.stroke();
		
	
	ctx4.fillStyle="#FF0000";
	ctx4.font="45px Courier";
	ctx4.fillText(cm,scene.w-283,65);
	
	
	
	
	
	ctx4.fillStyle="#000000";
	ctx4.font="30px Courier";
	var domDraw;
	var prismOver;
	var axis;
	var pRot;
	
	if (eyeOD.dom){domDraw = "OD"}
	else {domDraw = "OS"}
	
	if (cm){
		if (domDraw==="OD" && cm.substr(2,1)==="R"){
		prismOver = "dom";
		} else if (domDraw==="OS" && cm.substr(2,1)==="R"){
		prismOver = "non";
		} else if (domDraw==="OD" && cm.substr(2,1)==="L"){
		prismOver = "non";
		} else if (domDraw==="OS" && cm.substr(2,1)==="L"){
		prismOver = "dom";
		} else {
		prismOver = "   ";
		}
	}
	
	if (coverObj.num.x.o !== 0){
		axis = "X";
	} else {
		axis = "Y";
	}
	
	if (prismObj.rotation==="left" || prismObj.rotation==="right"){
		pRot = "horiz";
	}
	if (prismObj.rotation==="up" || prismObj.rotation==="down"){
		pRot = "vert";
	}
	
	
	//ctx4.fillText(domDraw + " " + prismOver + " " + axis + " " + pRot,scene.w-230,110);
	
	
	}
	
	//ctx4.fillStyle="#000000";
	//ctx4.font="30px Courier";
	//ctx4.fillText(label,scene.w-70,30);


	
}



















//////////////////////////////////////////////////////////////////////////////////
// CalcShapes.js /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////





function moveItems(){
	
	if (coverObj.drag){
		coverObj.x = posX - (origPosX - origObjX);
		coverObj.y = posY - (origPosY - origObjY);
	}
	
	if (prismObj.drag){
		prismObj.x = posX - (origPosX - origObjX);
		prismObj.y = posY - (origPosY - origObjY);
	}
	
	if (targetObj.drag){
		targetObj.x = posX - targetObj.w*d*d;
		targetObj.y = posY - targetObj.w*d*d;
	}
	if (prism2Obj.drag){
		prism2Obj.x = posX - (origPosX - origObjX);
		prism2Obj.y = posY - (origPosY - origObjY);
	}
	
	if (mode.simult){
		
		if (prismObj.drag){
			coverObj.y = prismObj.y - (coverObj.h*d-prismObj.h*d);
			coverObj.x = scene.w - (prismObj.x+prismObj.w*d)-coverObj.w*d;
		}
		if (coverObj.drag){
			prismObj.y = coverObj.y - (prismObj.h*d-coverObj.h*d);
			prismObj.x = scene.w - (coverObj.x+coverObj.w*d)-prismObj.w*d;
		}
		
	}
}
















//////////////////////////////////////////////////////////////////////////////////
// CalcSqa.js ////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


function calcCover(){
	
	if (patient.deviation.dominant[patient.num]==="R"){
		coverObj.num.x.o = eyeOS.num.x.o*n;
		coverObj.num.y.o = eyeOS.num.y.o*n;
	} else if (patient.deviation.dominant[patient.num]==="L"){
		coverObj.num.x.o = eyeOD.num.x.o*n;
		coverObj.num.y.o = eyeOD.num.y.o*n;
	}
	
	coverObj.num.x.c = coverObj.num.x.o;
	coverObj.num.y.c = coverObj.num.y.o;
	
}













//////////////////////////////////////////////////////////////////////////////////
// CalcFirstItem.js //////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


function calcFirstItem(){
	
	// if no items are over right eye...
	
		// if cover goes over right eye
		// first item is cover
		
		// if prism goes over right eye
		// eyeOD.firstItem = P
	
	// if second item goes over eye
		// no change to firstItem
	
	if (coverObj.location==="R" && prismObj.location!=="R" && eyeOD.firstItem!=="P"){
		eyeOD.firstItem = "C";
	}
	
	if (coverObj.location!=="R" && prismObj.location==="R"){
		eyeOD.firstItem = "P";
	}
	
	if (coverObj.location==="L" && prismObj.location!=="L" && eyeOS.firstItem!=="P"){
		eyeOS.firstItem = "C";
	}
	
	if (coverObj.location!=="L" && prismObj.location==="L"){
		eyeOS.firstItem = "P";
	}
	
	if (coverObj.location==="-" && prismObj.location==="-"){
		eyeOD.firstItem = "C";
		eyeOS.firstItem = "C";
	}
}














//////////////////////////////////////////////////////////////////////////////////
// CalcTarget.js /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////



function calcTarget(){
	
	if (targetObj.drag){
				
		targetObj.num.x.c = posX;
		targetObj.num.y.c = posY;
		
		targetObj.num.x.perc = 1/scene.w*posX;
		targetObj.num.x.c = Math.round(diop.limit*2*targetObj.num.x.perc-diop.limit);
		
		targetObj.num.y.perc = 1/scene.h*posY;
		targetObj.num.y.c = Math.round(diop.limit*targetObj.num.y.perc-diop.limit*d)*n;
		
	}
	
}

















//////////////////////////////////////////////////////////////////////////////////
// CalcNum.js ////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////



 



function calcNumbers(){	
	//HERE2
	//if (hidden){
		// phoria DEVIATION REVEALED: (through alternate cover test or hover)
		if (coverObj.movement==="A" && !mode.simult){
			if (patient.deviation.dominant[patient.num]==="R"){
				// if unhide latency
				eyeOS.num.x.o = patient.deviation.m.x[patient.num] + patient.deviation.l.x[patient.num];
				eyeOS.num.y.o = patient.deviation.m.y[patient.num] + patient.deviation.l.y[patient.num];
				//eyeOD.num.y.o = 13;
			}
			if (patient.deviation.dominant[patient.num]==="L"){
				eyeOD.num.x.o = patient.deviation.m.x[patient.num]*n + patient.deviation.l.x[patient.num]*n;
				eyeOD.num.y.o = patient.deviation.m.y[patient.num] + patient.deviation.l.y[patient.num];
			}
		// phoria DEVIATION NOT REVEALED:
		} else if (coverObj.movement==="U" || coverObj.movement==="A" && mode.simult){
			if (patient.deviation.dominant[patient.num]==="R"){
				eyeOS.num.x.o = patient.deviation.m.x[patient.num];
				eyeOS.num.y.o = patient.deviation.m.y[patient.num];
			}
			if (patient.deviation.dominant[patient.num]==="L"){
				eyeOD.num.x.o = patient.deviation.m.x[patient.num]*n;
				eyeOD.num.y.o = patient.deviation.m.y[patient.num];
			}
		}
	//}
	
	var simMode;
	var deviationAxis;
	
	if (mode.simult){
		simMode = "S";
		/*
		if (coverObj.num.x.o !== 0){
			deviationAxis = "x";
		}
		if (coverObj.num.y.o !== 0){
			deviationAxis = "y";
		}
		if (coverObj.num.x.o === 0 && coverObj.num.y.o === 0){
			deviationAxis = "-";
		}
		
		if (coverObj.location==="-" && prismObj.location==="-"){
			deviationAxis = "-";
		}
		*/
	} else {
		simMode = "A";
		//deviationAxis = "-";
	}
		
		// no longer determined by simMode:
		if (coverObj.num.x.o !== 0){
			deviationAxis = "x";
		}
		if (coverObj.num.y.o !== 0){
			deviationAxis = "y";
		}
		if (coverObj.num.x.o === 0 && coverObj.num.y.o === 0){
			deviationAxis = "-";
		}
		if (coverObj.location==="-" && prismObj.location==="-"){
			deviationAxis = "-";
		}
	
	
	
	cm = patient.deviation.dominant[patient.num] + prismObj.axis + simMode + deviationAxis + "." +
		 coverObj.location + prismObj.location + eyeOD.firstItem + eyeOS.firstItem;
	
	if (coverObj.location === "R" && prismObj.location === "L" || coverObj.location === "L" && prismObj.location === "R" || coverObj.location === "-" && prismObj.location === "-") {
		cm = cm.substr(0,7);
		cm = cm + "--";
	}
	
	if (coverObj.location === "R" && prismObj.location !== "L" || coverObj.location === "-" && prismObj.location === "R"){
		cm = cm.substr(0,8);
		cm = cm + "-";
	}
	
	if (coverObj.location === "L" && prismObj.location !== "R" || coverObj.location === "-" && prismObj.location === "L"){
		var scm = cm.substr(8,9);
		cm = cm.substr(0,7);
		cm = cm + "-" + scm;
	}
	
	/*
	0-eyeOS.num.x.o,
	1-eyeOS.num.x.o + coverObj.num.x.o,
	2-eyeOS.num.x.o + prismObj.num.x.o,
	3-eyeOS.num.x.o - prismObj.num.x.o,
	4-eyeOD.num.x.o + prismObj.num.x.o + (coverObj.num.x.o - prismObj.num.x.o),
	5-eyeOD.num.x.o + (coverObj.num.x.o + prismObj.num.x.o),
	6-eyeOD.num.x.o + (coverObj.num.x.o - prismObj.num.x.o),
	7-eyeOD.num.x.o + mathSign.x * (Math.abs(eyeOD.num.x.o) - Math.abs(prismObj.num.x.o)), // 7
	8-eyeOD.num.x.o + mathSign.x * (Math.abs(eyeOS.num.x.o) - Math.abs(prismObj.num.x.o)) // 8

	
	0 = orig
	1 = orig + cover
	2 = orig + prism
	3 = orig - prism
	4 = orig + prism + (cover - prism)
	5 = orig + (cover + prism)
	6 = orig + (cover - prism)
	7 = orig + (prism sign) * (difference between orig absolute & prism absolute)
	8 = orig + (prism sign) * (difference between opposite orig absolute & prism absolute)
	*/
	
	// cm = patient.deviation.dominant[patient.num] + prismObj.axis + simMode + deviationAxis + "." +
	//	    coverObj.location + prismObj.location + eyeOD.firstItem + eyeOS.firstItem;
	
	ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0;
	// HERE
	//////////////////////////////////////////////////////////////////////////////////////
	if (cm==="RXA-.----" || cm==="LXA-.----"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};

	if (cm==="RXA-.R-C-" || cm==="LXA-.L--C"){ ex.x.od=1, ex.x.os=1, ex.y.od=0, ex.y.os=0};
	if (cm==="RXA-.L--C" || cm==="LXA-.R-C-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RXA-.-RP-" || cm==="LXA-.-L-P"){ ex.x.od=0, ex.x.os=3, ex.y.od=0, ex.y.os=0};
	if (cm==="RXA-.-L-P" || cm==="LXA-.-RP-"){ ex.x.od=0, ex.x.os=2, ex.y.od=0, ex.y.os=0};

	if (cm==="RXA-.RL--" || cm==="LXA-.LR--"){ ex.x.od=6, ex.x.os=4, ex.y.od=0, ex.y.os=0};
	if (cm==="RXA-.LR--" || cm==="LXA-.RL--"){ ex.x.od=0, ex.x.os=3, ex.y.od=0, ex.y.os=0};

	if (cm==="RXA-.RRC-" || cm==="LXA-.LL-C"){ ex.x.od=1, ex.x.os=1, ex.y.od=0, ex.y.os=0};
	if (cm==="RXA-.LL-C" || cm==="LXA-.RRC-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RXA-.RRP-" || cm==="LXA-.LL-P"){ ex.x.od=5, ex.x.os=1, ex.y.od=0, ex.y.os=0};
	if (cm==="RXA-.LL-P" || cm==="LXA-.RRP-"){ ex.x.od=0, ex.x.os=2, ex.y.od=0, ex.y.os=0};

	if (cm==="RXA-.R-P-" || cm==="LXA-.L--P"){ ex.x.od=0, ex.x.os=1, ex.y.od=0, ex.y.os=0};
	if (cm==="RXA-.L--P" || cm==="LXA-.R-P-"){ ex.x.od=0, ex.x.os=2, ex.y.od=0, ex.y.os=0};
	//-------------------------------------------------------------------------------------
	//if (cm==="RXAx.----" || cm==="LXAx.----"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};

	if (cm==="RXAx.R-C-" || cm==="LXAx.L--C"){ ex.x.od=1, ex.x.os=1, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAx.L--C" || cm==="LXAx.R-C-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAx.-RP-" || cm==="LXAx.-L-P"){ ex.x.od=0, ex.x.os=3, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAx.-L-P" || cm==="LXAx.-RP-"){ ex.x.od=0, ex.x.os=2, ex.y.od=0, ex.y.os=0};

	if (cm==="RXAx.RL--" || cm==="LXAx.LR--"){ ex.x.od=6, ex.x.os=4, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAx.LR--" || cm==="LXAx.RL--"){ ex.x.od=0, ex.x.os=3, ex.y.od=0, ex.y.os=0};

	if (cm==="RXAx.RRC-" || cm==="LXAx.LL-C"){ ex.x.od=1, ex.x.os=1, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAx.LL-C" || cm==="LXAx.RRC-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAx.RRP-" || cm==="LXAx.LL-P"){ ex.x.od=5, ex.x.os=1, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAx.LL-P" || cm==="LXAx.RRP-"){ ex.x.od=0, ex.x.os=2, ex.y.od=0, ex.y.os=0};

	if (cm==="RXAx.R-P-" || cm==="LXAx.L--P"){ ex.x.od=0, ex.x.os=1, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAx.L--P" || cm==="LXAx.R-P-"){ ex.x.od=0, ex.x.os=2, ex.y.od=0, ex.y.os=0};
	//-------------------------------------------------------------------------------------
	//if (cm==="RXAy.----" || cm==="LXAy.----"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};

	if (cm==="RXAy.R-C-" || cm==="LXAy.L--C"){ ex.x.od=0, ex.x.os=0, ex.y.od=1, ex.y.os=1};
	if (cm==="RXAy.L--C" || cm==="LXAy.R-C-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAy.-RP-" || cm==="LXAy.-L-P"){ ex.x.od=0, ex.x.os=3, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAy.-L-P" || cm==="LXAy.-RP-"){ ex.x.od=0, ex.x.os=2, ex.y.od=0, ex.y.os=0};

	if (cm==="RXAy.RL--" || cm==="LXAy.LR--"){ ex.x.od=3, ex.x.os=0, ex.y.od=4, ex.y.os=6};
	if (cm==="RXAy.LR--" || cm==="LXAy.RL--"){ ex.x.od=0, ex.x.os=3, ex.y.od=0, ex.y.os=0};

	if (cm==="RXAy.RRC-" || cm==="LXAy.LL-C"){ ex.x.od=0, ex.x.os=0, ex.y.od=1, ex.y.os=1};
	if (cm==="RXAy.LL-C" || cm==="LXAy.RRC-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RXAy.RRP-" || cm==="LXAy.LL-P"){ ex.x.od=5, ex.x.os=1, ex.y.od=1, ex.y.os=1};
	if (cm==="RXAy.LL-P" || cm==="LXAy.RRP-"){ ex.x.od=0, ex.x.os=2, ex.y.od=0, ex.y.os=0};

	if (cm==="RXAy.R-P-" || cm==="LXAy.L--P"){ ex.x.od=0, ex.x.os=0, ex.y.od=1, ex.y.os=1};//yd01
	if (cm==="RXAy.L--P" || cm==="LXAy.R-P-"){ ex.x.od=0, ex.x.os=2, ex.y.od=0, ex.y.os=0};
	//-------------------------------------------------------------------------------------
	if (cm==="RXS-.----" || cm==="LXS-.----"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RXS-.RL--" || cm==="LXS-.LR--"){ ex.x.od=0, ex.x.os=2, ex.y.od=0, ex.y.os=0};
	if (cm==="RXS-.LR--" || cm==="LXS-.RL--"){ ex.x.od=2, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RXSx.RL--" || cm==="LXSx.LR--"){ ex.x.od=0, ex.x.os=7, ex.y.od=0, ex.y.os=0};
	if (cm==="RXSx.LR--" || cm==="LXSx.RL--"){ ex.x.od=8, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RXSy.RL--" || cm==="LXSy.LR--"){ ex.x.od=0, ex.x.os=2, ex.y.od=1, ex.y.os=1};//yd01
	if (cm==="RXSy.LR--" || cm==="LXSy.RL--"){ ex.x.od=2, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	if (cm==="RYA-.----" || cm==="LYA-.----"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};

	if (cm==="RYA-.R-C-" || cm==="LYA-.L--C"){ ex.x.od=0, ex.x.os=0, ex.y.od=1, ex.y.os=1};
	if (cm==="RYA-.L--C" || cm==="LYA-.R-C-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RYA-.-RP-" || cm==="LYA-.-L-P"){ ex.x.od=0, ex.x.os=0, ex.y.od=3, ex.y.os=3};//yd03--ok
	if (cm==="RYA-.-L-P" || cm==="LYA-.-RP-"){ ex.x.od=0, ex.x.os=0, ex.y.od=3, ex.y.os=3};//yd02--4/25

	if (cm==="RYA-.RL--" || cm==="LYA-.LR--"){ ex.x.od=0, ex.x.os=0, ex.y.od=6, ex.y.os=6};//ys46
	if (cm==="RYA-.LR--" || cm==="LYA-.RL--"){ ex.x.od=0, ex.x.os=0, ex.y.od=3, ex.y.os=3};//yd03

	if (cm==="RYA-.RRC-" || cm==="LYA-.LL-C"){ ex.x.od=0, ex.x.os=0, ex.y.od=1, ex.y.os=1};
	if (cm==="RYA-.LL-C" || cm==="LYA-.RRC-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RYA-.RRP-" || cm==="LYA-.LL-P"){ ex.x.od=0, ex.x.os=0, ex.y.od=1, ex.y.os=1};//yd51
	if (cm==="RYA-.LL-P" || cm==="LYA-.RRP-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};//ys20

	if (cm==="RYA-.R-P-" || cm==="LYA-.L--P"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=1};//----
	if (cm==="RYA-.L--P" || cm==="LYA-.R-P-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};//ys20
	//-------------------------------------------------------------------------------------
	//if (cm==="RYAx.----" || cm==="LYAx.----"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	//NEW
	if (cm==="RYAx.R-C-" || cm==="LYAx.L--C"){ ex.x.od=1, ex.x.os=1, ex.y.od=0, ex.y.os=0};
	if (cm==="RYAx.L--C" || cm==="LYAx.R-C-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RYAx.-RP-" || cm==="LYAx.-L-P"){ ex.x.od=0, ex.x.os=0, ex.y.od=3, ex.y.os=3};//yd03--ok
	if (cm==="RYAx.-L-P" || cm==="LYAx.-RP-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};//yd02--4/25

	if (cm==="RYAx.RL--" || cm==="LYAx.LR--"){ ex.x.od=4, ex.x.os=6, ex.y.od=3, ex.y.os=3};//ys03
	if (cm==="RYAx.LR--" || cm==="LYAx.RL--"){ ex.x.od=0, ex.x.os=0, ex.y.od=3, ex.y.os=3};//yd03

	if (cm==="RYAx.RRC-" || cm==="LYAx.LL-C"){ ex.x.od=1, ex.x.os=1, ex.y.od=0, ex.y.os=0};
	if (cm==="RYAx.LL-C" || cm==="LYAx.RRC-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RYAx.RRP-" || cm==="LYAx.LL-P"){ ex.x.od=1, ex.x.os=1, ex.y.od=1, ex.y.os=1};//yd51
	if (cm==="RYAx.LL-P" || cm==="LYAx.RRP-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};//ys20

	if (cm==="RYAx.R-P-" || cm==="LYAx.L--P"){ ex.x.od=0, ex.x.os=1, ex.y.od=0, ex.y.os=0};//----
	if (cm==="RYAx.L--P" || cm==="LYAx.R-P-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};//ys20
	//-------------------------------------------------------------------------------------
	//if (cm==="RYAy.----" || cm==="LYAy.----"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};

	if (cm==="RYAy.R-C-" || cm==="LYAy.L--C"){ ex.x.od=0, ex.x.os=0, ex.y.od=1, ex.y.os=1};
	if (cm==="RYAy.L--C" || cm==="LYAy.R-C-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RYAy.-RP-" || cm==="LYAy.-L-P"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=3};//yd03--5/5
	if (cm==="RYAy.-L-P" || cm==="LYAy.-RP-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=2};//yd02--4/28

	if (cm==="RYAy.RL--" || cm==="LYAy.LR--"){ ex.x.od=0, ex.x.os=0, ex.y.od=6, ex.y.os=4};//ys46--5/2--5/5
	if (cm==="RYAy.LR--" || cm==="LYAy.RL--"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=3};//yd03--5/9

	if (cm==="RYAy.RRC-" || cm==="LYAy.LL-C"){ ex.x.od=0, ex.x.os=0, ex.y.od=1, ex.y.os=1};
	if (cm==="RYAy.LL-C" || cm==="LYAy.RRC-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RYAy.RRP-" || cm==="LYAy.LL-P"){ ex.x.od=0, ex.x.os=0, ex.y.od=5, ex.y.os=4};//ys15--5/9--5/11
	if (cm==="RYAy.LL-P" || cm==="LYAy.RRP-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=2};//ys21--4/29

	if (cm==="RYAy.R-P-" || cm==="LYAy.L--P"){ ex.x.od=0, ex.x.os=0, ex.y.od=1, ex.y.os=1};//yd01
	if (cm==="RYAy.L--P" || cm==="LYAy.R-P-"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};//ys20
	//-------------------------------------------------------------------------------------
	if (cm==="RYS-.----" || cm==="LYS-.----"){ ex.x.od=0, ex.x.os=0, ex.y.od=0, ex.y.os=0};
	if (cm==="RYS-.RL--" || cm==="LYS-.LR--"){ ex.x.od=0, ex.x.os=0, ex.y.od=2, ex.y.os=2};//yd02
	if (cm==="RYS-.LR--" || cm==="LYS-.RL--"){ ex.x.od=0, ex.x.os=0, ex.y.od=2, ex.y.os=2};//ys02
	if (cm==="RYSx.RL--" || cm==="LYSx.LR--"){ ex.x.od=0, ex.x.os=1, ex.y.od=2, ex.y.os=2};//yd02
	if (cm==="RYSx.LR--" || cm==="LYSx.RL--"){ ex.x.od=0, ex.x.os=0, ex.y.od=2, ex.y.os=2};//ys02
	if (cm==="RYSy.RL--" || cm==="LYSy.LR--"){ ex.x.od=0, ex.x.os=0, ex.y.od=8, ex.y.os=7};//yd08
	if (cm==="RYSy.LR--" || cm==="LYSy.RL--"){ ex.x.od=0, ex.x.os=0, ex.y.od=8, ex.y.os=7};//ys07
	//////////////////////////////////////////////////////////////////////////////////////
	
		
	//---------------------------------------------------------------
	
	// reflect to other dom:<-- keep this
	if (patient.deviation.dominant[patient.num]==="L"){
		var storeODx = ex.x.od;
		ex.x.od = ex.x.os;
		ex.x.os = storeODx;
		
		var storeODy = ex.y.od;
		ex.y.od = ex.y.os;
		ex.y.os = storeODy;
	}
	
	//apply to y-axis:<-- no longer fully applicable... 
		//ex.y.od = ex.x.od;
		//ex.y.os = ex.x.os; <--- TURNED OFF
	
	
	
	calcEndPoints();
	checkRange();
	incrementCircle();	
	
	
}




function checkRange(){
	
		// X-AXIS ////////////////////////////
		if (eyeOD.num.x.end > eyeOD.range.pos){
			eyeOD.num.x.end = eyeOD.range.pos;
		}
		if (eyeOD.num.x.end < eyeOD.range.neg){
			eyeOD.num.x.end = eyeOD.range.neg;
		}

		if (eyeOS.num.x.end > eyeOS.range.pos){
			eyeOS.num.x.end = eyeOS.range.pos;
		}
		if (eyeOS.num.x.end < eyeOS.range.neg){
			eyeOS.num.x.end = eyeOS.range.neg;
		}
		
		// Y-AXIS ////////////////////////////
		if (eyeOD.num.y.end > eyeOD.range.pos*d){
			eyeOD.num.y.end = eyeOD.range.pos*d;
		}
		if (eyeOD.num.y.end < eyeOD.range.neg*d){
			eyeOD.num.y.end = eyeOD.range.neg*d;
		}

		if (eyeOS.num.y.end > eyeOS.range.pos*d){
			eyeOS.num.y.end = eyeOS.range.pos*d;
		}
		if (eyeOS.num.y.end < eyeOS.range.neg*d){
			eyeOS.num.y.end = eyeOS.range.neg*d;
		}
}


function incrementCircle(){
		
		im.bef.d.x = eyeOS.num.x.c;
		im.bef.c.x = eyeOD.num.x.c;
		im.bef.d.y = eyeOS.num.y.c;
		im.bef.c.y = eyeOD.num.y.c;
		
		// X-AXIS ////////////////////////////
		if (eyeOD.num.x.c > eyeOD.num.x.end){
			eyeOD.num.x.c = eyeOD.num.x.c - numInc;
		}
		if (eyeOS.num.x.c > eyeOS.num.x.end){
			eyeOS.num.x.c = eyeOS.num.x.c - numInc;
		}
		if (eyeOD.num.x.c < eyeOD.num.x.end){
			eyeOD.num.x.c = eyeOD.num.x.c + numInc;
		}
		if (eyeOS.num.x.c < eyeOS.num.x.end){
			eyeOS.num.x.c = eyeOS.num.x.c + numInc;
		}
		if (eyeOD.num.x.c === eyeOD.num.x.end){
		}
		if (eyeOS.num.x.c === eyeOS.num.x.end){
		}
		
		// Y-AXIS ////////////////////////////
		if (eyeOD.num.y.c > eyeOD.num.y.end){
			eyeOD.num.y.c = eyeOD.num.y.c - numInc;
		}
		if (eyeOS.num.y.c > eyeOS.num.y.end){
			eyeOS.num.y.c = eyeOS.num.y.c - numInc;
		}
		if (eyeOD.num.y.c < eyeOD.num.y.end){
			eyeOD.num.y.c = eyeOD.num.y.c + numInc;
		}
		if (eyeOS.num.y.c < eyeOS.num.y.end){
			eyeOS.num.y.c = eyeOS.num.y.c + numInc;
		}
		if (eyeOD.num.y.c === eyeOD.num.y.end){
		}
		if (eyeOS.num.y.c === eyeOS.num.y.end){
		}
		
		im.aft.c.x = eyeOD.num.x.c;
		im.aft.d.x = eyeOS.num.x.c;
		im.aft.c.y = eyeOD.num.y.c;
		im.aft.d.y = eyeOS.num.y.c;
		
		if (im.bef.c.x===im.aft.c.x){
			if (Math.abs(eyeOD.num.x.end - eyeOD.num.x.c) <= numInc){
				eyeOD.num.x.c = eyeOD.num.x.end;
			}
		}
		if (im.bef.d.x===im.aft.d.x){
			if (Math.abs(eyeOS.num.x.end - eyeOS.num.x.c) <= numInc){
				eyeOS.num.x.c = eyeOS.num.x.end;
			}
		}
		if (im.bef.c.y===im.aft.c.y){
			if (Math.abs(eyeOD.num.y.end - eyeOD.num.y.c) <= numInc){
				eyeOD.num.y.c = eyeOD.num.y.end;
			}
		}
		if (im.bef.d.y===im.aft.d.y){
			if (Math.abs(eyeOS.num.y.end - eyeOS.num.y.c) <= numInc){
				eyeOS.num.y.c = eyeOS.num.y.end;
			}
		}
		
}

function calcEndPoints(){
	
	resetExpressions();
	
	// this splits number into 4 parts
	eyeOD.num.x.end = expressionLib[0][ex.x.od] + targetObj.num.x.c;
	eyeOS.num.x.end = expressionLib[1][ex.x.os] + targetObj.num.x.c;
	eyeOD.num.y.end = expressionLib[2][ex.y.od] + targetObj.num.y.c;
	eyeOS.num.y.end = expressionLib[3][ex.y.os] + targetObj.num.y.c;
}


function resetExpressions(){
		
	// create negative or positive sign based on prism rotation, to be used in expressions
	var mathSign = {x:0,y:0};
	
	if (prismObj.num.x.o < 0){
		mathSign.x = -1;
	} else {
		mathSign.x = 1;
	}
	if (prismObj.num.y.o < 0){
		mathSign.y = -1;
	} else {
		mathSign.y = 1;
	}
	
	//subLib: calls eye movement in x & y axis, for both eyes
	//		  each expression is called every cycle (it's not 'one axis or the other')
	var subLib = [
		// 0 /////////////////////////////////////////////////////////////////////////////
		[
		eyeOD.num.x.o,
		eyeOS.num.x.o,
		eyeOD.num.y.o,
		eyeOS.num.y.o
		],
		// 1 /////////////////////////////////////////////////////////////////////////////
		[
		eyeOD.num.x.o + coverObj.num.x.o,
		eyeOS.num.x.o + coverObj.num.x.o,
		eyeOD.num.y.o + coverObj.num.y.o,
		eyeOS.num.y.o + coverObj.num.y.o
		],
		// 2 /////////////////////////////////////////////////////////////////////////////
		[
		eyeOD.num.x.o + prismObj.num.x.o,
		eyeOS.num.x.o + prismObj.num.x.o,
		eyeOD.num.y.o + prismObj.num.y.o,
		eyeOS.num.y.o + prismObj.num.y.o
		],
		// 3 /////////////////////////////////////////////////////////////////////////////
		[
		eyeOD.num.x.o - prismObj.num.x.o,
		eyeOS.num.x.o - prismObj.num.x.o,
		eyeOD.num.y.o - prismObj.num.y.o,
		eyeOS.num.y.o - prismObj.num.y.o
		],
		// 4 /////////////////////////////////////////////////////////////////////////////
		[
		eyeOD.num.x.o + prismObj.num.x.o + (coverObj.num.x.o - prismObj.num.x.o),
		eyeOS.num.x.o + prismObj.num.x.o + (coverObj.num.x.o - prismObj.num.x.o),
		eyeOD.num.y.o + prismObj.num.y.o + (coverObj.num.y.o - prismObj.num.y.o),
		eyeOS.num.y.o + prismObj.num.y.o + (coverObj.num.y.o - prismObj.num.y.o)
		],
		// 5 /////////////////////////////////////////////////////////////////////////////
		[
		eyeOD.num.x.o + (coverObj.num.x.o + prismObj.num.x.o),
		eyeOS.num.x.o + (coverObj.num.x.o + prismObj.num.x.o),
		eyeOD.num.y.o + (coverObj.num.y.o + prismObj.num.y.o),
		eyeOS.num.y.o + (coverObj.num.y.o + prismObj.num.y.o)
		],
		// 6 /////////////////////////////////////////////////////////////////////////////
		[
		eyeOD.num.x.o + (coverObj.num.x.o - prismObj.num.x.o),
		eyeOS.num.x.o + (coverObj.num.x.o - prismObj.num.x.o),
		eyeOD.num.y.o + (coverObj.num.y.o - prismObj.num.y.o),
		eyeOS.num.y.o + (coverObj.num.y.o - prismObj.num.y.o)
		],
		// 7 /////////////////////////////////////////////////////////////////////////////
		[
		eyeOD.num.x.o + mathSign.x * (Math.abs(eyeOD.num.x.o) - Math.abs(prismObj.num.x.o)),
		eyeOS.num.x.o + mathSign.x * (Math.abs(eyeOS.num.x.o) - Math.abs(prismObj.num.x.o)),
		eyeOD.num.y.o + mathSign.y * (Math.abs(eyeOD.num.y.o) - Math.abs(prismObj.num.y.o)),
		eyeOS.num.y.o + mathSign.y * (Math.abs(eyeOS.num.y.o) - Math.abs(prismObj.num.y.o))
		],
		// 8 /////////////////////////////////////////////////////////////////////////////
		[
		eyeOD.num.x.o + mathSign.x * (Math.abs(eyeOS.num.x.o) - Math.abs(prismObj.num.x.o)),
		eyeOS.num.x.o + mathSign.x * (Math.abs(eyeOD.num.x.o) - Math.abs(prismObj.num.x.o)),
		eyeOD.num.y.o + mathSign.y * (Math.abs(eyeOS.num.y.o) - Math.abs(prismObj.num.y.o)),
		eyeOS.num.y.o + mathSign.y * (Math.abs(eyeOD.num.y.o) - Math.abs(prismObj.num.y.o))
		],
		// 9 /////////////////////////////////////////////////////////////////////////////
		[
		1,
		1,
		1,
		1
		],
		// 10 /////////////////////////////////////////////////////////////////////////////
		[
		1,
		1,
		1,
		1
		],
		// 11 /////////////////////////////////////////////////////////////////////////////
		[
		1,
		1,
		1,
		1
		],
		// 12 /////////////////////////////////////////////////////////////////////////////
		[
		1,
		1,
		1,
		1
		],
		// 13 /////////////////////////////////////////////////////////////////////////////
		[
		1,
		1,
		1,
		1
		],
		// 14 /////////////////////////////////////////////////////////////////////////////
		[
		1,
		1,
		1,
		1
		],
		// 15 /////////////////////////////////////////////////////////////////////////////
		[
		1,
		1,
		1,
		1
		/*
		NOTES:
		x/y pair up in lib is legacy; separate it at some point, it's always one or the other
		x may sometimes exist in y slot
		if so, have to re-adjust elsewhere
		or is this a unique situation?
		*/
		]
	]
	
	
	// NOTE: expression on x-axis must be duplicated for y-axis for expected result
	
	expressionLib = [
		// OD-dom, X-axis
		[subLib[0][0],subLib[1][0],subLib[2][0],subLib[3][0],subLib[4][0],subLib[5][0],subLib[6][0],subLib[7][0],subLib[8][0],subLib[9][0],subLib[10][0],subLib[11][0],subLib[12][0],subLib[13][0],subLib[14][0],subLib[15][0]],
		// OS-dom, X-axis
		[subLib[0][1],subLib[1][1],subLib[2][1],subLib[3][1],subLib[4][1],subLib[5][1],subLib[6][1],subLib[7][1],subLib[8][1],subLib[9][1],subLib[10][1],subLib[11][1],subLib[12][1],subLib[13][1],subLib[14][1],subLib[15][1]],
		// OD-dom, Y-axis
		[subLib[0][2],subLib[1][2],subLib[2][2],subLib[3][2],subLib[4][2],subLib[5][2],subLib[6][2],subLib[7][2],subLib[8][2],subLib[9][2],subLib[10][2],subLib[11][2],subLib[12][2],subLib[13][2],subLib[14][2],subLib[15][2]],
		// OS-dom, Y-axis
		[subLib[0][3],subLib[1][3],subLib[2][3],subLib[3][3],subLib[4][3],subLib[5][3],subLib[6][3],subLib[7][3],subLib[8][3],subLib[9][3],subLib[10][3],subLib[11][3],subLib[12][3],subLib[13][3],subLib[14][3],subLib[15][3]]
	]

}




	
	
	



//////////////////////////////////////////////////////////////////////////////////
// CalcDots.js ///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////



function calcEyeCenter(){
		
	eyeCenterOD.x = eyeOD.num.x.c*centerToEyeRatio + 300;
	
	// DOT ERROR
	eyeCenterOS.x = eyeOS.num.x.c*centerToEyeRatio + 600;
	
	eyeCenterOD.y = eyeOD.num.y.c*centerToEyeRatio*n + 215;
	
	// DOT ERROR
	eyeCenterOS.y = eyeOS.num.y.c*centerToEyeRatio*n + 215;
	
}














//////////////////////////////////////////////////////////////////////////////////
// Location.js ///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////



function determineLocations(){
	
	
	if (coverObj.x + coverObj.w*d > 0 && coverObj.y + coverObj.h*d > 0 && coverObj.x + coverObj.w*d < scene.w && coverObj.y + coverObj.h*d < scene.h){
		coverObj.location = "-";
	}
	if (coverObj.x + coverObj.w*d > eyeOD.x-eyeOD.r && coverObj.y + coverObj.h*d > eyeOD.y-eyeOD.r && coverObj.x + coverObj.w*d < eyeOD.x+eyeOD.r && coverObj.y + coverObj.h*d < eyeOD.y+eyeOD.r){
		coverObj.location = "R";
		if (coverObj.toggle==="off"){
			coverObj.location = "-";
		}
	}
	if (coverObj.x + coverObj.w*d > eyeOS.x-eyeOS.r && coverObj.y + coverObj.h*d > eyeOS.y-eyeOS.r && coverObj.x + coverObj.w*d < eyeOS.x+eyeOS.r && coverObj.y + coverObj.h*d < eyeOS.y+eyeOS.r){
		coverObj.location = "L";
		if (coverObj.toggle==="off"){
			coverObj.location = "-";
		}
	}
	
	if (prismObj.x + prismObj.w*d > 0 && prismObj.y + prismObj.h*d > 0 && prismObj.x + prismObj.w*d < scene.w && prismObj.y + prismObj.h*d < scene.h){
		prismObj.location = "-";
	}
	if (prismObj.x + prismObj.w*d > eyeOD.x-eyeOD.r && prismObj.y + prismObj.h*d > eyeOD.y-eyeOD.r && prismObj.x + prismObj.w*d < eyeOD.x+eyeOD.r && prismObj.y + prismObj.h*d < eyeOD.y+eyeOD.r){
		prismObj.location = "R";
		if (prismObj.toggle==="off"){
			prismObj.location = "-";
		}
	}
	if (prismObj.x + prismObj.w*d > eyeOS.x-eyeOS.r && prismObj.y + prismObj.h*d > eyeOS.y-eyeOS.r && prismObj.x + prismObj.w*d < eyeOS.x+eyeOS.r && prismObj.y + prismObj.h*d < eyeOS.y+eyeOS.r){
		prismObj.location = "L";
		if (prismObj.toggle==="off"){
			prismObj.location = "-";
		}
	}

	
}













//////////////////////////////////////////////////////////////////////////////////
// AltCover.js ///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////




function determineAltCover(){
	
	
	
	
	// BREAK FUSION BY MOVING COVER QUICKLY BETWEEN EYES		
	if (coverObj.location==="-"){
		{
			if (altCoverTest.lastLoc==="R" || altCoverTest.lastLoc==="L"){
				altCoverTest.altTimerRunning = true;
				altCoverTest.keepLoc = altCoverTest.lastLoc;
			}
		}
	}
	
	if (altCoverTest.altTimerRunning){
		
		altCoverTest.altInc++;
		
		if (altCoverTest.altInc===15){//.4 sec
			altCoverTest.altInc = 0;
			altCoverTest.altTimerRunning = false;
		}
		if (coverObj.location==="L" && altCoverTest.keepLoc==="R"){
			coverObj.movement = "A";
			altCoverTest.altInc = 0;
		}
		if (coverObj.location==="R" && altCoverTest.keepLoc==="L"){
			coverObj.movement = "A";
			altCoverTest.altInc = 0;
		}
			
	}
	
	altCoverTest.lastLoc = coverObj.location;
	
	
	
	// BREAK FUSION BY PUTTING COVER OR PRISM OVER AN EYE FOR MORE THAN 2 SECONDS:
	//if (coverObj.location==="L" || coverObj.location==="R" || prismObj.location==="L" || prismObj.location==="R"){
	if (coverObj.location==="L" || coverObj.location==="R"){
		altCoverTest.showDevTimerRunning = true;	
	}
	
	if (altCoverTest.showDevTimerRunning){
		altCoverTest.hideDevTimerRunning = false;
		altCoverTest.hideDevInc = 0;
		altCoverTest.showDevInc++;
		
		
		if (altCoverTest.showDevInc===70){// 2 sec
			coverObj.movement = "A";
		}
		
	}
	
	if (coverObj.location!=="L" && coverObj.location!=="R" && prismObj.location!=="L" && prismObj.location!=="R"){
		altCoverTest.showDevTimerRunning = false;
		altCoverTest.showDevInc = 0;
		altCoverTest.hideDevTimerRunning = true;	
	}
	
	if (altCoverTest.hideDevTimerRunning){
		altCoverTest.hideDevInc++;
		
			if (altCoverTest.hideDevInc===35){// 1 sec
				coverObj.movement = "U";
			}		
	}	 
	
}










//////////////////////////////////////////////////////////////////////////////////
// ConditionID.js ////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////




function identifyCondition(){
	
	var tDomM = "", tDomL = "";
	
	var conditionList = [
	"Orthophoria",
	"Esotropia",
	"Exotropia",
	"Hypotropia",
	"Hypertropia",
	"Esophoria",
	"Exophoria",
	"Hypophoria",
	"Hyperphoria"
	]
	
	var tdm="",tcm="",tdl="",tcl="";
	
	var dim = "Δ", dil = "Δ";
	
	if (patient.deviation.dominant[patient.num]==="R"){
		tDomM = "Left", tDomL = "Left";
	} else {
		tDomM = "Right", tDomL = "Right";
	}
	
	// Esotropia...
	// if x > 5, it's an esotropia
	// if less, it's an 
	
	if (currentAxis==="X"){
		tdm = Math.abs(patient.deviation.m.x[patient.num]);
		tdl = Math.abs(patient.deviation.l.x[patient.num]);
	} else {
		tdm = Math.abs(patient.deviation.m.y[patient.num]);
		tdl = Math.abs(patient.deviation.l.y[patient.num]);
	}
	
	
	// ORTHO (NORMAL) /////
	if (patient.deviation.m.x[patient.num] === 0 && patient.deviation.m.y[patient.num] === 0){
		tdm=" ", tcm=" ", dim=" ", tDomM=" ";
	}
	if (patient.deviation.l.x[patient.num] === 0 && patient.deviation.l.y[patient.num] === 0){
		tdl=" ", tcl=" ", dil=" ", tDomL=" ";
	}
	
	
	
	// TROPIAS /////
	if (patient.deviation.m.x[patient.num] < 0){
		tcm = conditionList[1];
	}
	if (patient.deviation.m.x[patient.num] > 0){
		tcm = conditionList[2];
	}
	if (patient.deviation.m.y[patient.num] < 0){
		tcm = conditionList[3];
	}
	if (patient.deviation.m.y[patient.num] > 0){
		tcm = conditionList[4];
	}
	
	// PHORIAS /////
	if (patient.deviation.l.x[patient.num] < 0){
		tcl = conditionList[5];
	}
	if (patient.deviation.l.x[patient.num] > 0){
		tcl = conditionList[6];
	}
	if (patient.deviation.l.y[patient.num] < 0){
		tcl = conditionList[7];
	}
	if (patient.deviation.l.y[patient.num] > 0){
		tcl = conditionList[8];
	}
	
	
	$("#diopterID_tropia").text(tdm + dim + " " + tDomM);
	$("#conditionID_tropia").text(tcm);
	$("#diopterID_phoria").text(tdl + dil + " " + tDomL);
	$("#conditionID_phoria").text(tcl);
	
	
	quiz.answerText[patient.num][0] = tdm;
	quiz.answerText[patient.num][1] = tdl;
	quiz.answerText[patient.num][2] = tDomM;
	quiz.answerText[patient.num][3] = tDomL;
	quiz.answerText[patient.num][4] = tcm;
	quiz.answerText[patient.num][5] = tcl;
	
	for (var m = 0; m < 2; m++){
		if (quiz.answerText[patient.num][m]===" "){
			quiz.answerText[patient.num][m] = 0;
		}
	}
	for (var m = 2; m < 6; m++){
		if (quiz.answerText[patient.num][m]===" "){
			quiz.answerText[patient.num][m] = "N/A";
		}
	}
	
	
}













//////////////////////////////////////////////////////////////////////////////////
// DataOutput.js /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


//eyeOD.num.x.o + (coverObj.num.x.o - prismObj.num.x.o),

function updateList(){
	
	
	dataOutput[0] = 
	"eyeOS.num.y.o = " + eyeOS.num.y.o;
	dataOutput[1] = 
	"eyeOD.num.y.o = " + eyeOD.num.y.o;
	dataOutput[2] = 
	"-";
	dataOutput[3] = 
	"-";
	dataOutput[4] = 
	"-";
	dataOutput[5] = 
	"-";
	dataOutput[6] = 
	"-";
	
	dataOutput[7] = 
	"-";
	dataOutput[7+1] = 
	"-";
	dataOutput[7+2] = 
	"-";
	dataOutput[7+3] = 
	"-";
	dataOutput[7+4] = 
	"-";
	dataOutput[7+5] = 
	"-";
	dataOutput[7+6] = 
	"-";
	
	dataOutput[14] = 
	"-";
	dataOutput[14+1] = 
	"-";
	dataOutput[14+2] = 
	"-";
	dataOutput[14+3] = 
	"-";
	dataOutput[14+4] = 
	"-";
	dataOutput[14+5] = 
	"-";
	dataOutput[14+6] = 
	"-";
	
	
	
	
	for (i = 0; i < 21; i++){
		$("#list"+i).text(dataOutput[i]);
	}
	
	
		
}







function displayScreenDimensions() {
	
if (screenScaling.saveWindowHeight !== window.innerHeight){
	
    //element = document.getElementById("screenDimensions");
	//element.innerHTML = window.innerWidth + " x " + window.innerHeight;
		
	screenScaling.scaleValue = (1/screenScaling.minScreen)*window.innerHeight;
	
	screenScaling.bodyTopMargin = ((screenScaling.bodyHeight*0.5)*screenScaling.scaleValue)*-1;
	screenScaling.bodyLeftMargin = ((screenScaling.bodyWidth*0.5)*screenScaling.scaleValue)*-1;
		
	element = document.getElementById("mainContainer");
	
	
	if (window.innerHeight < screenScaling.minScreen){
		
		element.style.transform="scale(" + screenScaling.scaleValue + ")";
		element.style.MozTransform="scale(" + screenScaling.scaleValue + ")";
		element.style.webkitTransform="scale(" + screenScaling.scaleValue + ")";
	
		element.style.transformOrigin="0 0";
		element.style.MozTransformOrigin="0 0";
		element.style.webkitTransformOrigin="0 0";
		
		
		element.style.top = "0px";
		element.style.left = "0px";
		element.style.margin = "0px 0px 0px 0px";
		//element.style.top = "50%";
		//element.style.left = "50%";
		//element.style.margin = screenScaling.bodyTopMargin + "px 0px 0px " + screenScaling.bodyLeftMargin + "px";
			
	} else {
		element.style.transform="none";
		element.style.MozTransform="none";
		element.style.webkitTransform="none";
		
		element.style.top = "50%";
		element.style.left = "50%";
		element.style.margin = "-300px 0px 0px -450px";
	}
	
}
	
screenScaling.saveWindowHeight = window.innerHeight;
	
}


});






