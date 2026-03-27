
window.onload = function(){
		
	init();
	
	initInstructions();
	
	initMenu();
	
	initScale();
	
};


//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°



document.addEventListener('touchmove', function(event) {
  event.preventDefault();
});





function init(){	
		
	
	// VARIABLES /////////////////////////////////////////////
	vars.aa = [
		//patient Rx:
		[0,0,0.25,-20,20,"stop"],
		[1,0,0.25,-6,6,"stop"],
		[2,90,5,5,180,"loop"],
		[3,0,0.5,0,2,"stop"],
		//tools:
		[4,0,0.25,-20,20,"stop"],
		[5,0,0.25,-6,6,"stop"],
		[6,90,5,5,180,"loop"],
		[7,0,0.25,0,20,"stop"],
		[8,0,0.25,0,6,"stop"],
		[9,90,5,5,180,"loop"],
		[10,90,5,5,180,"loop"],
		//reflection:
		[11,0,5,-150,150,"px"],
		[12,90,5,5,180,"loop"]
		//[ arrayOrder, currentDisplayNum, increment, min, max, stopOrLoop ]
	];
	
	var aaOrig = [];
	
	// this is to reset all
	for (var i = 0; i < vars.aa.length; i++){
		aaOrig.push(vars.aa[i][1]);
	}
	
	
	//var dm = 70;
	
	//var dim = [[560,310],[200,200],[8*dm,3*dm]];
	//var dim = [[560,310],[200,200],[400,150,-100,25]];
	//var dim = [[560,310],[200,200],[800,300,-300,-50]];
	//var dim = [[560,310],[200,200],[1600,600,-700,-200]];
	var dim = [[560,310],[200,200],[3200,1200,-1500,-500]];
	
	document.getElementById("lightBeamContainer").style.width = dim[1][0] +"px";
	document.getElementById("lightBeamContainer").style.height = dim[1][1] +"px";
	document.getElementById("lightBeam").style.width = dim[2][1] +"px";
	document.getElementById("lightBeam").style.height = dim[2][0] +"px";
	document.getElementById("lightBeam").style.top = dim[2][2] +"px";
	document.getElementById("lightBeam").style.left = dim[2][3] +"px";
	
	//console.log(dim[2][2], dim[2][3]);
	
	//console.log(document.getElementById("lightBeam").offsetLeft);
		
	var plusMode = true;
	
	var rotang = 0;
	var rotang2 = rotang+0;
	var beamRefCont = dim[1][0];
	//var beamRefCont = document.getElementById("lightBeamContainer").offsetWidth;
	var margin = 25;
	var ecx = dim[0][0]/2-beamRefCont/2;
	var ecy = dim[0][1]/2-beamRefCont/2;
	var beamHeight = 600;
	var pixelMultiplier = 30;//PC screenshots = 22 pixels width for 1
	var dragging = false;
	var arrowPress = false;
	var symb = "";
	var degr = "";
	var currentPreset = 0;
	var retOpacity;
	var streakOpacity;
	
	
	
	
	
	
	
	
	
	
	// INIT FUNCTIONS /////////////////////////////////////////////
	resetAll(data.start);//preset #
	
	function resetAll(a){
		
		if (a!==undefined){
			if (a!=="tabReset"){
            
			for (var i = 0; i < data.preset[0][1].length-2; i++){
				vars.aa[i][1] = data.preset[a][1][i];
				if (data.preset[a][1][data.preset[0][1].length-2]==="m"){
					plusMode = true;
				} else{
					plusMode = false;
				}
                
			}
			document.getElementById("goal").innerHTML = data.preset[a][1][12];
				
			} else if (a==="tabReset"){
				for (var i = 4; i < data.preset[0][1].length-3; i++){
				vars.aa[i][1] = aaOrig[i];
			}
			//document.getElementById("goal").innerHTML = data.preset[a][1][12];
			}
		} else{
			for (var i = 0; i < vars.aa.length; i++){
				vars.aa[i][1] = aaOrig[i];
			}
		}
		
		
		
		
		
			
		decimalPositioning();
	
		calcFormula();
	
		lensInvisible();
	
		lensNums();
	
		toggleMode(plusMode);
	
		centerBeam();
		rotateBeam();
		resizeReflection();
	
		displayReflectInfo();
		
		if (a!==undefined && a!=="tabReset"){
		document.getElementsByClassName("preset")[a].style.backgroundColor = "#FFF";
		}
		
		retFade();
		
		updateSymbols();
	}
	
	updateSymbols();
	
	function updateSymbols(){
		//console.log(aa[0][1]);
		if (vars.aa[0][1] > 0){
			document.getElementsByClassName("inputField_new")[0].innerHTML = "+"+vars.aa[0][1].toFixed(2);
		}
		if (vars.aa[1][1] > 0){
			document.getElementsByClassName("inputField_new")[1].innerHTML = "+"+vars.aa[1][1].toFixed(2);
		}
		if (vars.aa[3][1] > 0){
			document.getElementsByClassName("inputField_new")[3].innerHTML = "+"+vars.aa[3][1].toFixed(2);
		}
		if (vars.aa[7][1] > 0){
			document.getElementsByClassName("inputField_new")[7].innerHTML = "-"+vars.aa[7][1].toFixed(2);
		}
		if (vars.aa[4][1] > 0){
			document.getElementsByClassName("inputField_new")[4].innerHTML = "+"+vars.aa[4][1].toFixed(2);
		}
		if (vars.aa[8][1] > 0){
			document.getElementsByClassName("inputField_new")[8].innerHTML = "-"+vars.aa[8][1].toFixed(2);
		}
		if (vars.aa[5][1] > 0){
			document.getElementsByClassName("inputField_new")[5].innerHTML = "+"+vars.aa[5][1].toFixed(2);
		}
	}
	
	//document.getElementsByClassName("num")[cont].innerHTML = symb+current.toFixed(dec)+degr;

	
	//clickedArrow(incr,minn,maxn,type,range,cont)
	
	var pf = 1;
    
	document.getElementsByClassName("newRefractive")[0].addEventListener("mousedown", function(){
        
        document.getElementById("errorInfoIcon").style.display = "none";
        document.getElementsByClassName("ftitle")[0].style.color = "#888";
        
        for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
            document.getElementsByClassName("finput")[i].style.border = "1px solid #CCC";
        }
        
        
        document.getElementById("patientFlash").style.display = "block";
        
        requestAnimationFrame(reflexFade);
        
        function reflexFade(){
            
            pf-=0.05;
            
            document.getElementById("patientFlash").style.opacity = pf;
            
            if (pf>0){
            requestAnimationFrame(reflexFade);
            } else {
                pf = 1;
                document.getElementById("patientFlash").style.display = "none";
            }
            
        }
        
        
        //document.getElementsByClassName("ftitle")[0].style.color = "#777";
        
        document.getElementsByClassName("ftitle")[0].innerHTML = "insira o erro refrativo:";
        document.getElementById("coverInputs").style.display = "none";
        document.getElementById("coverCheckAnswer").style.display = "block";
        document.getElementsByClassName("refractAnswer")[0].style.display = "none";
        document.getElementById("miniAnswerContainer").style.display = "none";
        
        
        
        for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
            document.getElementsByClassName("finput")[i].value="";
            document.getElementsByClassName("finput")[i].style.fontSize = "20px";
            document.getElementsByClassName("finput")[i].style.backgroundColor = "#FFF";
        }
        
        //console.log("clicked 'new error', sphere = " + data.preset[3][1][0] + ", cyl = " + data.preset[1][1][1] + ", cyl ang = " + data.preset[1][1][2]);
        //console.log(vars.aa[10][1]
        //data.preset[0][3][0] = 13;
        
        /////////////////////////////////////////////////////////////////////////////
        var incr = getRandomInt(0,2);
        if (incr<1){incr=-1;};
        data.preset[3][1][0] = (getRandomInt(0,20) + getRandomInt(0,4)*0.25) * incr;
        
        /////////////////////////////////////////////////////////////////////////////
        incr = getRandomInt(0,2);
        if (incr<1){incr=-1;};
        data.preset[3][1][1] = (getRandomInt(0,6) + getRandomInt(0,4)*0.25) * incr;
        
        /////////////////////////////////////////////////////////////////////////////
        data.preset[3][1][2] = getRandomInt(1,37)*5;
        
        // HERE
        
        /////////////////////////////
        
        // ALWAYS TWO CORRECT ANSWERS
        // if incorrect, check if reversing set results in a match
        // if it does:
        // - display "correct"
        // - switch top/bottom positions and colors of numbers
        // if it doesn't, continue as before
        
        /////////////////////////////
        
        
        
        // HERE - TEST //
        
        //data.preset[3][1][0] = -3.00;
        //data.preset[3][1][1] = -1.00;
        //data.preset[3][1][2] = 90;
        
        /*
        console.log(data.preset[3][1][0], data.preset[3][1][1], data.preset[3][1][2],
                    data.preset[3][1][3], data.preset[3][1][4], data.preset[3][1][5]);
        */
        
        /*
        setInterval(function(){
        data.preset[3][1][2] = getRandomInt(1,37)*5;
        console.log(data.preset[3][1][2]);
        },200);
        */
        
        //console.log([data.preset[3][1][0], data.preset[3][1][1], data.preset[3][1][2], data.preset[3][1][0]+data.preset[3][1][1], data.preset[3][1][1]*-1]);

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        }

        
        
        
        
        
        //console.log(data.preset[3][1][0]);
        
        
        //data.preset[3][1][0] = 10.25;// -20 to +20   in  0.25 increments
        //data.preset[3][1][1] = -4.75;// -6  to +6    in  0.25 increments
        //data.preset[3][1][2] =    65;//  5  to  180  in  5    increments
        
        resetAll(data.random);
        
        
        
        //data.preset[1][1][0] = 1;
        
        // 1. console log three patient values
        // 2. change sphere power value to +1.00
        // 3. have the patient eye update accordingly
        
        //clickedArrow(vars.aa[0][2],vars.aa[0][3],vars.aa[0][4],vars.aa[0][5],"max",0);
        
    });
    
    
    document.getElementById("errorInfoIcon").addEventListener("mousedown", function(){
        
        document.getElementById("errorInfoBox").style.display = "block";
    
    });
    
    
    
    
    /*
    console.log(document.getElementsByClassName("formulaNum_new").length);
    for (var i = 0; i < document.getElementsByClassName("formulaNum_new").length; i++){
        document.getElementsByClassName("formulaNum_new")[i].addEventListener("focusout", function(){
            
            //for (var ii = 0; ii < document.getElementsByClassName("finput").length; ii++){
                
            //}
            
            console.log(i);
            
            
            console.log(document.getElementsByClassName("finput")[0].value);
            console.log(document.getElementsByClassName("finput")[1].value);
            console.log(document.getElementsByClassName("finput")[2].value);
            console.log(document.getElementsByClassName("finput")[3].value);
            console.log(document.getElementsByClassName("finput")[4].value);
            console.log(document.getElementsByClassName("finput")[5].value);
            
            
            //if (){
            //    document.getElementById("coverCheckAnswer").style.display = "none";
            //}
            
        //});
    //}
    */
    for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
		document.getElementsByClassName("finput")[i].addEventListener("mousedown", closeErrorInfoBox());
	}
    
    document.getElementById("closeErrorX").addEventListener("mousedown", closeErrorInfoBox());
    
    function closeErrorInfoBox(){
		
        return function(){
            
            document.getElementById("errorInfoBox").style.display = "none";
            
        }
        
    }
			
    
    
    for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
		document.getElementsByClassName("finput")[i].addEventListener("keypress", focusOutFunction(i));
	}
	
	
	
	function focusOutFunction(a){
		
        
        
		return function(){
			
            var u = true;
            
            for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
                            
                if (document.getElementsByClassName("finput")[i].value==="_"){
                    u = false;
                }
            }
            
            
            
            
            
            if (u){
                document.getElementById("coverCheckAnswer").style.display = "none";
            }
            
            
            
		}
	}
    
    
    var userAnswerArray = [];
    
    var fieldError = [];
    
    document.getElementsByClassName("fcheck")[0].addEventListener("mousedown", function(){
        
        fieldError = [0,0,0,0,0,0];
        
        for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
            document.getElementsByClassName("finput")[i].style.border = "1px solid #CCC";
            document.getElementsByClassName("finput")[i].value = document.getElementsByClassName("finput")[i].value.replace("°", "");
            //document.getElementsByClassName("finput")[i].value = Number(document.getElementsByClassName("finput")[i].value);
        }
        
        
        for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
            if (isNaN(document.getElementsByClassName("finput")[i].value)){
                fieldError[i] = 1;
            }
            if (document.getElementsByClassName("finput")[i].value===""){
                fieldError[i] = 1;
            }
            if (document.getElementsByClassName("finput")[i].value===" "){
                fieldError[i] = 1;
            }
            if (document.getElementsByClassName("finput")[i].value==="  "){
                fieldError[i] = 1;
            }
            if (document.getElementsByClassName("finput")[i].value==="   "){
                fieldError[i] = 1;
            }
            if (i==0 || i===3){
                if (document.getElementsByClassName("finput")[i].value < -20 || document.getElementsByClassName("finput")[i].value > 20){
                    fieldError[i] = 1;
                }
            }
            if (i==1 || i===4){
                if (document.getElementsByClassName("finput")[i].value < -6 || document.getElementsByClassName("finput")[i].value > 6){
                    fieldError[i] = 1;
                }
            }
            if (i==2 || i===5){
                if (document.getElementsByClassName("finput")[i].value < 0 || document.getElementsByClassName("finput")[i].value > 180){
                    fieldError[i] = 1;
                }
            }
        }
        
        
        
        
        
        // look at field #1
        // is it not a number?
        // is it blank?
        // is it less than -20 or greater than 20?
        // fieldError[0] = 1;
        
        // look at field #2
        // is it not a number?
        // is it blank?
        // is it less than -6 or greater than 6?
        // fieldError[0] = 1;
        
        // 3,4,5,6...
        
        var inputError = false;
                
        if (fieldError.reduce((a, b) => a + b, 0) > 0){
            inputError = true;
        }
        
        //console.log("checking answer");
        //document.getElementsByClassName("ftest")[0].style.top = "85px";
        
        //document.getElementsByClassName("ftitle")[0].style.color = "#EEE";
        //document.getElementsByClassName("newRefractive")[0].innerHTML = "new error";
        document.getElementsByClassName("ftitle")[0].innerHTML = "";   //"your answer:";
        
        if (inputError){
            
            document.getElementsByClassName("ftitle")[0].innerHTML = "campos contêm erros";
            document.getElementsByClassName("ftitle")[0].style.color = "#C00";
            document.getElementById("errorInfoIcon").style.display = "block";
            
            
            for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
                
                if (fieldError[i]===1){
                    document.getElementsByClassName("finput")[i].style.border = "1px solid #C00";
                }
                
            }
            
            /*
            for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
                
                document.getElementsByClassName("finput")[i].style.border = "1px solid #C00";
                
                if (isNaN(document.getElementsByClassName("finput")[i].value)){
                    document.getElementsByClassName("finput")[i].style.border = "1px solid #C00";
                }
                
                if (document.getElementsByClassName("finput")[i].value===""){
                    document.getElementsByClassName("finput")[i].style.border = "1px solid #C00";
                }
                
            }
            */
        
        
        }
        // DO SAME AS BEFORE ////////
        else {
        
            document.getElementById("errorInfoIcon").style.display = "none";
            
            document.getElementById("coverInputs").style.display = "block";
            document.getElementById("coverInputs").style.opacity = 0;
            document.getElementById("coverCheckAnswer").style.display = "block";
            document.getElementById("miniAnswerContainer").style.display = "block";
        
        
        
        for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
            
            document.getElementsByClassName("finput")[i].style.backgroundColor = "#EEE";
            //document.getElementsByClassName("finput")[i].style.border = "1px solid #AAA";
            // if end of string has ° symbol, remove it

            //console.log(document.getElementsByClassName("finput")[i].value.charAt(length-1));
            document.getElementsByClassName("finput")[i].value = document.getElementsByClassName("finput")[i].value.replace("°", "");
            userAnswerArray[i] = Number(document.getElementsByClassName("finput")[i].value);
            
            if (isNaN(userAnswerArray[i])){
                //document.getElementsByClassName("finput")[i].value = "";
            }
            
            
            
        }
        
        
        
        
        //console.log(userAnswerArray);
        
        //var invalidInput = "invalid entry";
        
        if (isNaN(userAnswerArray[2])){
            //document.getElementsByClassName("finput")[2].value = invalidInput;
            //document.getElementsByClassName("finput")[2].style.fontSize = "12px";
        } else {
            document.getElementsByClassName("finput")[2].value = userAnswerArray[2] + "°";
        }
        
        if (isNaN(userAnswerArray[5])){
            //document.getElementsByClassName("finput")[5].value = invalidInput;
            //document.getElementsByClassName("finput")[5].style.fontSize = "12px";
        } else {
            document.getElementsByClassName("finput")[5].value = userAnswerArray[5] + "°";
        }
        
        var refDec = [0,1,3,4];
        
        for (var i = 0; i < refDec.length; i++){
            if (isNaN(userAnswerArray[refDec[i]])){
                //document.getElementsByClassName("finput")[refDec[i]].value = invalidInput;
                //document.getElementsByClassName("finput")[refDec[i]].style.fontSize = "12px";
            } else {
                document.getElementsByClassName("finput")[refDec[i]].value = userAnswerArray[refDec[i]].toFixed(2);
                if (userAnswerArray[refDec[i]] > 0){
                    document.getElementsByClassName("finput")[refDec[i]].value = "+" + userAnswerArray[refDec[i]].toFixed(2);
                }
            }
        }
        
        
        
        //document.getElementsByClassName("finput")[1].value = parseInt(document.getElementsByClassName("finput")[1].value).toFixed(2);
        //document.getElementsByClassName("finput")[3].value = parseInt(document.getElementsByClassName("finput")[3].value).toFixed(2);
        //document.getElementsByClassName("finput")[4].value = parseInt(document.getElementsByClassName("finput")[4].value).toFixed(2);
        
        //console.log("userAnswerArray: ", userAnswerArray[0],userAnswerArray[1],userAnswerArray[2]);
        //console.log("userAnswerArray: ", userAnswerArray[3],userAnswerArray[4],userAnswerArray[5]);
        
        var minDeg = data.preset[3][1][2]-90;
        if (minDeg<5){minDeg = minDeg + 180;}
        
        var correctAnswerArray = [data.preset[3][1][0], data.preset[3][1][1], data.preset[3][1][2], data.preset[3][1][0]+data.preset[3][1][1], data.preset[3][1][1]*-1, minDeg];
        
        //console.log("correctAnswerArray: ", correctAnswerArray[0],correctAnswerArray[1],correctAnswerArray[2]);
        //console.log("correctAnswerArray: ", correctAnswerArray[3],correctAnswerArray[4],correctAnswerArray[5]);
        
        
        document.getElementsByClassName("refractAnswer")[0].style.display = "block";
        

        var miniAnswerArray = [];

        if (userAnswerArray[0]===correctAnswerArray[0]&&
            userAnswerArray[1]===correctAnswerArray[1]&&
            userAnswerArray[2]===correctAnswerArray[2]&&
            userAnswerArray[3]===correctAnswerArray[3]&&
            userAnswerArray[4]===correctAnswerArray[4]&&
            userAnswerArray[5]===correctAnswerArray[5]){
            
            document.getElementsByClassName("refractAnswer")[0].style.backgroundColor = "#70C130";
            document.getElementsByClassName("refractAnswer")[0].innerHTML = "correto";
            
            
            miniAnswerArray[0] = correctAnswerArray[0].toFixed(2);
            miniAnswerArray[1] = correctAnswerArray[1].toFixed(2);
            miniAnswerArray[2] = correctAnswerArray[3].toFixed(2);
            miniAnswerArray[3] = correctAnswerArray[4].toFixed(2);
            
            for (var i = 0; i < miniAnswerArray.length; i++){
                if (miniAnswerArray[i]>0){
                    miniAnswerArray[i] = "+" + miniAnswerArray[i];
                }
            }
            
            document.getElementsByClassName("miniAnswer")[0].innerHTML = miniAnswerArray[0];
            document.getElementsByClassName("miniAnswer")[1].innerHTML = miniAnswerArray[1];
            document.getElementsByClassName("miniAnswer")[3].innerHTML = miniAnswerArray[2];
            document.getElementsByClassName("miniAnswer")[4].innerHTML = miniAnswerArray[3];
            
            document.getElementsByClassName("miniAnswer")[2].innerHTML = correctAnswerArray[2]+"°";
            document.getElementsByClassName("miniAnswer")[5].innerHTML = correctAnswerArray[5]+"°";
            
            
            
            
            
            
            
        } else if (userAnswerArray[0]===correctAnswerArray[3]&&
            userAnswerArray[1]===correctAnswerArray[4]&&
            userAnswerArray[2]===correctAnswerArray[5]&&
            userAnswerArray[3]===correctAnswerArray[0]&&
            userAnswerArray[4]===correctAnswerArray[1]&&
            userAnswerArray[5]===correctAnswerArray[2]){
            
            document.getElementsByClassName("refractAnswer")[0].style.backgroundColor = "#70C130";
            document.getElementsByClassName("refractAnswer")[0].innerHTML = "correto";
            
            miniAnswerArray[0] = correctAnswerArray[3].toFixed(2);
            miniAnswerArray[1] = correctAnswerArray[4].toFixed(2);
            miniAnswerArray[2] = correctAnswerArray[0].toFixed(2);
            miniAnswerArray[3] = correctAnswerArray[1].toFixed(2);
            
            for (var i = 0; i < miniAnswerArray.length; i++){
                if (miniAnswerArray[i]>0){
                    miniAnswerArray[i] = "+" + miniAnswerArray[i];
                }
            }
            
            
            document.getElementsByClassName("miniAnswer")[0].innerHTML = miniAnswerArray[0];
            document.getElementsByClassName("miniAnswer")[1].innerHTML = miniAnswerArray[1];
            document.getElementsByClassName("miniAnswer")[3].innerHTML = miniAnswerArray[2];
            document.getElementsByClassName("miniAnswer")[4].innerHTML = miniAnswerArray[3];
            
            document.getElementsByClassName("miniAnswer")[2].innerHTML = correctAnswerArray[5]+"°";
            document.getElementsByClassName("miniAnswer")[5].innerHTML = correctAnswerArray[2]+"°";
            
            
            
            
        } else {
        
            document.getElementsByClassName("refractAnswer")[0].style.backgroundColor = "#C00";
            document.getElementsByClassName("refractAnswer")[0].innerHTML = "incorreto";
            
            miniAnswerArray[0] = correctAnswerArray[0].toFixed(2);
            miniAnswerArray[1] = correctAnswerArray[1].toFixed(2);
            miniAnswerArray[2] = correctAnswerArray[3].toFixed(2);
            miniAnswerArray[3] = correctAnswerArray[4].toFixed(2);
            
            for (var i = 0; i < miniAnswerArray.length; i++){
                if (miniAnswerArray[i]>0){
                    miniAnswerArray[i] = "+" + miniAnswerArray[i];
                }
            }
            
            document.getElementsByClassName("miniAnswer")[0].innerHTML = miniAnswerArray[0];
            document.getElementsByClassName("miniAnswer")[1].innerHTML = miniAnswerArray[1];
            document.getElementsByClassName("miniAnswer")[3].innerHTML = miniAnswerArray[2];
            document.getElementsByClassName("miniAnswer")[4].innerHTML = miniAnswerArray[3];
            
            document.getElementsByClassName("miniAnswer")[2].innerHTML = correctAnswerArray[2]+"°";
            document.getElementsByClassName("miniAnswer")[5].innerHTML = correctAnswerArray[5]+"°";
            
        }
        
        
        
        
        
        
        //document.getElementsByClassName("miniAnswer")[2].innerHTML = correctAnswerArray[2]+"°";
        //document.getElementsByClassName("miniAnswer")[5].innerHTML = correctAnswerArray[5]+"°";
        
        
        /*
        for (var i = 0; i < refDec.length; i++){
            //document.getElementsByClassName("miniAnswer")[refDec[i]].innerHTML = correctAnswerArray[refDec[i]].toFixed(2);
            if (correctAnswerArray[refDec[i]] > 0){
                document.getElementsByClassName("miniAnswer")[refDec[i]].innerHTML = "+" + correctAnswerArray[refDec[i]].toFixed(2);
            }
        }
        */
        
        
        }// END: if (!inputError)
        
        
        // HERE:
        
        
        
        
    });
    
    
	
	
	// EVENTS /////////////////////////////////////////////
	for (var i = 0; i < document.getElementsByClassName("arrowSet_new").length; i++){
		document.getElementsByClassName("arrowSet_new")[i].children[0].addEventListener("mousedown", clickedArrow(vars.aa[i][2],vars.aa[i][3],vars.aa[i][4],vars.aa[i][5],"max",i));
		document.getElementsByClassName("arrowSet_new")[i].children[1].addEventListener("mousedown", clickedArrow(vars.aa[i][2],vars.aa[i][3],vars.aa[i][4],vars.aa[i][5],"min",i));
		
		// old:
		if (document.getElementsByClassName("arrowSet_new")[i].children.length >3){
			//console.log(document.getElementsByClassName("arrowSet_new")[i].children.length);
			document.getElementsByClassName("arrowSet_new")[i].children[3].addEventListener("mousedown", clickedArrow(90,undefined,undefined,undefined,undefined,i));
			document.getElementsByClassName("arrowSet_new")[i].children[4].addEventListener("mousedown", clickedArrow(180,undefined,undefined,undefined,undefined,i));
		}
		//
	}
	
	var lightDegreeArray = [45,90,135,180,150];
	
	for (var i = 0; i < lightDegreeArray.length; i++){
		document.getElementsByClassName("lightDegreeButton_new")[i].addEventListener("mousedown", clickedDegree(lightDegreeArray[i],i));
	}
	
	
	
	function clickedDegree(a, b){
		
		return function(){
			
            
            if (b<4){
                vars.aa[10][1] = a;
            } else {
                vars.aa[10][1] = vars.aa[10][1] + 45;
                if (vars.aa[10][1]>180){
                    vars.aa[10][1] = vars.aa[10][1] - 180;
                }
            }
			centerBeam();
			rotateBeam();
			resizeReflection();
			
			document.getElementsByClassName("inputField_new")[10].innerHTML = vars.aa[10][1]+"°";
			
			retFade();
		}
	}
	
	
    
    // not being used:
	for (var i = 0; i < document.getElementsByClassName("toolTab_new").length; i++){
		document.getElementsByClassName("toolTab_new")[i].addEventListener("mousedown", clickedTab(i));
	}
	
	function clickedTab(i){
		
		return function(){
			
		resetAll("tabReset");
		
		if (i===1){plusMode = true;} else{plusMode = false;}
		toggleMode(plusMode);
		
		};
	}
	
    
    
    
    
    
    
    
    /////////////////////////////////////////////////////////////////////////////////////
    
    var testOpen = false;
    
    document.getElementById("testTab").addEventListener("mousedown", function(){
		
		toggleTestPanel("test");
				
	});
    
    document.getElementById("exploreTab").addEventListener("mousedown", function(){
		
		toggleTestPanel("explore");
				
	});
    
    function toggleTestPanel(a){
		
        if (a==="test"){
            document.getElementById("coverInputs").style.opacity = 1;
            document.getElementById("testPanel").style.display = "block";
            document.getElementById("coverButtons").style.display = "block";
            document.getElementsByClassName("answerUnder")[0].style.display = "block";
            document.getElementById("coverInputs").style.display = "block";
            document.getElementById("coverCheckAnswer").style.display = "block";
            document.getElementsByClassName("refractAnswer")[0].style.display = "none";
            for (var i = 0; i < document.getElementsByClassName("finput").length; i++){
                document.getElementsByClassName("finput")[i].value="_";
            }
            document.getElementById("miniAnswerContainer").style.display = "none";
            document.getElementById("exploreTab").style.backgroundColor = "#DDD";
            document.getElementById("exploreTab").style.border = "0px";
            document.getElementById("testTab").style.backgroundColor = "#EEE";
            document.getElementById("testTab").style.border = "0px";
            //document.getElementById("testPanelButton").innerHTML = "close test";
            //testOpen = true;
            
        } else {
        
            document.getElementById("testPanel").style.display = "none";
            document.getElementById("coverButtons").style.display = "none";
            document.getElementsByClassName("answerUnder")[0].style.display = "none";
            
            document.getElementById("exploreTab").style.backgroundColor = "#EEE";
            document.getElementById("exploreTab").style.border = "0px";
            document.getElementById("testTab").style.backgroundColor = "#DDD";
            document.getElementById("testTab").style.border = "0px";
            
            //document.getElementById("testPanelButton").innerHTML = "open test";
            //testOpen = false;
            
        }
		
	}
    
    
    
    
    
    
    /////////////////////////////////////////////////////////////////////////////////////





	
	document.getElementById("resetButton_new").addEventListener("mousedown", function(){
		for (var ii = 0; ii < document.getElementsByClassName("preset").length; ii++){
				document.getElementsByClassName("preset")[ii].style.backgroundColor = "#CCC";
			}
		resetAll();
				
	});
	
	document.getElementById("lightBeamContainer").addEventListener("mousedown", function(){
		dragging = true;
	});
	
	///////////////////////////////////////////////////////////////////////////////////
	document.getElementById("lightBeamContainer").addEventListener("touchstart", function(){
		dragging = true;
	});
	///////////////////////////////////////////////////////////////////////////////////
	document.getElementById("lightBeamContainer").addEventListener("touchmove", function(e){
		//console.log(dragging);
		//console.log((e.changedTouches[0].pageX/data.perc)-beamRefCont/2-margin+"px", (e.changedTouches[0].pageY/data.perc)-beamRefCont/2-margin+"px");
		gah(e.changedTouches[0].pageX, e.changedTouches[0].pageY, "t");
	});
	///////////////////////////////////////////////////////////////////////////////////
	document.getElementById("lightBeamContainer").addEventListener("touchend", function(){
		dragging = false;
	});
	
	
	for (var i = 0; i < document.getElementsByClassName("preset").length; i++){
		document.getElementsByClassName("preset")[i].id="preset"+i;
		document.getElementsByClassName("preset")[i].addEventListener("mousedown", function(){
			currentPreset = parseInt(this.id.substring(6));
			resetAll(currentPreset);
			for (var ii = 0; ii < document.getElementsByClassName("preset").length; ii++){
				document.getElementsByClassName("preset")[ii].style.backgroundColor = "#CCC";
			}
			document.getElementsByClassName("preset")[currentPreset].style.backgroundColor = "#FFF";
			updateSymbols();
		});
	}
	
	window.addEventListener("mouseup",function(){
		dragging = false;
		arrowPress = false;
	});
	
	//requestAnimationFrame(reflexFade);
	
	var currentClientX;
	var currentClientY;
	
	/*
	function reflexFade(){
		var eyeContW = dim[0][0];
		var eyeContH = dim[0][1];
		
		var retOpacity;
	
		var refW = vars.aa[11][1]/pixelMultiplier;
			
		if (vars.aa[11][1] < -4 || vars.aa[11][1] > 4){
			retOpacity = 0;
		}
		if (vars.aa[11][1] < -2 || vars.aa[11][1] > 2){
			retOpacity = 0.25;
		}
		if (vars.aa[11][1] < 0 || vars.aa[11][1] > 0){
			retOpacity = 0.5;
		}
		if (vars.aa[11][1]===0){
			retOpacity = 1;
		}
		
		document.getElementById("retina").style.opacity = retOpacity - (Math.abs(currentClientX-margin-eyeContW/2) + Math.abs(currentClientY-margin-eyeContH/2))*0.01;
		
		requestAnimationFrame(reflexFade);
	}
	*/
	
	var refW;
	
	window.addEventListener("mousemove",function(e){
		
		gah(e.clientX, e.clientY,"m");
		
	});
	
	
	
	function gah(a,b,c){
		
		//console.log(a,b,c);
		
		if (dragging){
		
		document.getElementById("lightBeamContainer").style.left = (a/data.perc)-beamRefCont/2-margin+"px";
		document.getElementById("lightBeamContainer").style.top = (b/data.perc)-beamRefCont/2-margin+"px";
		
		if (vars.aa[11][1] > 0){
			document.getElementById("reflectionContainer").style.left = "auto";
			document.getElementById("reflectionContainer").style.top = "auto";
			document.getElementById("reflectionContainer").style.right = (a/data.perc)-beamRefCont/2-margin+"px";
			document.getElementById("reflectionContainer").style.bottom = (b/data.perc)-beamRefCont/2-margin+"px";
		} else {
			document.getElementById("reflectionContainer").style.left = (a/data.perc)-beamRefCont/2-margin+"px";
			document.getElementById("reflectionContainer").style.top = (b/data.perc)-beamRefCont/2-margin+"px";
			document.getElementById("reflectionContainer").style.right = "auto";
			document.getElementById("reflectionContainer").style.bottom = "auto";
		}
	
		var mdx = document.getElementById("eyeContainer").offsetWidth/2;
		var mdy = document.getElementById("eyeContainer").offsetHeight/2;
			
		eyeContW = dim[0][0];
		eyeContH = dim[0][1];
		
		retFade();
		
		var distFactor = (Math.abs((a/data.perc)-margin-eyeContW/2) + Math.abs((b/data.perc)-margin-eyeContH/2));

		document.getElementById("retina").style.opacity = retOpacity - distFactor * 0.005;
		document.getElementById("reflectionContainer").style.opacity = streakOpacity - distFactor * 0.01;
			
		}//END: if dragging
		}
	
	
	/*
	document.getElementById("startButtonContainer").addEventListener("click", function(){
		document.getElementById("menuContainer").style.display = "none";
	});
	*/
	
	
	//////////////////////////////////////////////////////////
	// FUNCTIONS /////////////////////////////////////////////
	function clickedArrow(incr,minn,maxn,type,range,cont){
        
		return function(){
			
            
            
			var timerDone = false;
			
			arrowPress = true;
			
			execCode();
			
			var timer = setTimeout(function(){
				timerDone = true;
			},400);
				
			
			requestAnimationFrame(mouseStillDown);
			
			function mouseStillDown(){
			
			if (timerDone){
				execCode();
			}
						
			if (arrowPress){
				requestAnimationFrame(mouseStillDown);
			}
			
		}
		
		function execCode(){
			
			var current = vars.aa[cont][1];
			
			if (minn!==undefined){
			
				var mm = minn;
				if (range==="max"){mm = maxn};
				var dec = 0;
				if (type==="stop"){dec = 2};
						
				//document.getElementsByClassName("num")[cont].innerHTML = 'hi';
			
				if (range==="max"){
					if (current < maxn){
						current = current + incr;
					} else if (current === maxn && type === "loop"){
						current = minn;
					}
				}
				
				if (range==="min"){
					if (current > minn){
						current = current - incr;
					} else if (current === minn && type === "loop"){
						current = maxn;
					}
				}
			
			} else {
				
				current = incr;
				
			}
			
			vars.aa[cont][1] = current;
			
			symb = "";
			degr = "";
			
			//console.log(cont);
			
			if (current>0){
				if ([0,1,3,4,5].indexOf(cont) > -1){
					symb = "+";
				}
		//	} else if (current>0){
				if ([7,8].indexOf(cont) > -1){
					symb = "-";
				}
			}
			if ([2,10,9,6].indexOf(cont) > -1){
				degr = "°";
			}
			
			//console.log("-> "+cont, "-> "+current);
			document.getElementsByClassName("inputField_new")[cont].innerHTML = symb+current.toFixed(dec)+degr;
			
			//formula
			calcFormula();
			
			lensNums();
			
			displayReflectInfo();
			
			centerBeam();
			rotateBeam();
			resizeReflection();
			
			retFade();
			
			}//---
			
			//change opacity of ret
			
			
			
			
			
		};//END: return function
		
	}//END: function clickedArrow	
	
	function retFade(){
		
		var error = vars.aa[11][1];
		
		var maxOpacity = 0.75;
		var correctedOpacity = 0.8;
		
		// Se não estiver arrastando, escondemos o reflexo completamente
		// Isso evita que a neutralização seja vista apenas mudando as lentes sem mover o retinoscópio
		if (!dragging) {
			document.getElementById("retina").style.opacity = 0;
			document.getElementById("reflectionContainer").style.opacity = 0;
			return;
		}

		// Opacidade da retina (brilho de fundo) - máximo na neutralização
		retOpacity = maxOpacity / (1 + Math.abs(error) * 0.5);
		
		if (Math.abs(error) < 0.1){
			retOpacity = correctedOpacity;
		}
		
		document.getElementById("retina").style.opacity = retOpacity;
		
		// Opacidade da faixa (streak) - mais nítida perto da neutralização
		streakOpacity = 1.0 / (1 + Math.abs(error) * 0.2);
		
		document.getElementById("reflectionContainer").style.opacity = streakOpacity;
	}
	
	
	//////////////////////////////////////////////////////////
	function toggleMode(a){
		/*
		for (var i = 0; i < document.getElementsByClassName("tool").length; i++){
			//document.getElementsByClassName("tool")[i].style.opacity = "1";
			document.getElementsByClassName("tool")[i].style.display = "block";
		}
		*/
		// MINUS:
		if (!a){
			
			document.getElementsByClassName("toolInputContainer_new")[0].style.bottom = "0px";
			document.getElementsByClassName("toolInputContainer_new")[0].style.display = "block"
			document.getElementsByClassName("toolInputContainer_new")[1].style.bottom = "-110px";
			document.getElementsByClassName("toolInputContainer_new")[1].style.display = "none"
			document.getElementsByClassName("toolTab_new")[0].style.backgroundColor = "#70c130";
			document.getElementsByClassName("toolTab_new")[1].style.backgroundColor = "#CCC";
			
			/*
			document.getElementById("toggleKnob").style.backgroundColor = "#090";
			document.getElementById("toggleKnob").style.top = "7px";
			//document.getElementsByClassName("tool")[0].style.opacity = "0.1";
			//document.getElementsByClassName("tool")[3].style.opacity = "0.1";
			//document.getElementsByClassName("tool")[4].style.opacity = "0.1";
			document.getElementsByClassName("tool")[0].style.display = "block";
			document.getElementsByClassName("tool")[3].style.display = "block";
			document.getElementsByClassName("tool")[4].style.display = "block";
			*/
		// PLUS:
		} else{
			
			document.getElementsByClassName("toolInputContainer_new")[0].style.bottom = "-110px";
			document.getElementsByClassName("toolInputContainer_new")[0].style.display = "none"
			document.getElementsByClassName("toolInputContainer_new")[1].style.bottom = "0px";
			document.getElementsByClassName("toolInputContainer_new")[1].style.display = "block";
			document.getElementsByClassName("toolTab_new")[0].style.backgroundColor = "#CCC";
			document.getElementsByClassName("toolTab_new")[1].style.backgroundColor = "#C00";
			//document.getElementById("toolContainer_new").style.backgroundColor = "#ECC";
			/*
			document.getElementById("toggleKnob").style.backgroundColor = "#C00";
			document.getElementById("toggleKnob").style.top = "44px";
			//document.getElementsByClassName("tool")[1].style.opacity = "0.1";
			//document.getElementsByClassName("tool")[5].style.opacity = "0.1";
			//document.getElementsByClassName("tool")[6].style.opacity = "0.1";
			document.getElementsByClassName("tool")[1].style.display = "block";
			document.getElementsByClassName("tool")[5].style.display = "block";
			document.getElementsByClassName("tool")[6].style.display = "block";
			*/
		}
		
	}
		
	
	
	//////////////////////////////////////////////////////////
	function decimalPositioning(){
		for (var i = 0; i < document.getElementsByClassName("inputField_new").length; i++){
			if (vars.aa[i][5]==="stop"){
				document.getElementsByClassName("inputField_new")[i].innerHTML = vars.aa[i][1].toFixed(2);
			} else {
				//console.log(vars.aa[i][1]);
				document.getElementsByClassName("inputField_new")[i].innerHTML = vars.aa[i][1].toFixed(0)+"°";
			}
		}
	}
	
	
	//////////////////////////////////////////////////////////
	function calcFormula(){// <-- formula table (no effect on main equation)
		
		var ang2;
		
		if (vars.aa[2][1]+90 <= 180){
			ang2 = vars.aa[2][1]+90;
		} else {
			ang2 = Math.abs(90-vars.aa[2][1]);
		}
		
		var fn = [];
				
		fn[0] = vars.aa[0][1].toFixed(2);
		fn[1] = vars.aa[1][1].toFixed(2);
		fn[2] = vars.aa[2][1]+"°";
		fn[3] = (vars.aa[0][1]+vars.aa[1][1]).toFixed(2);
		fn[4] = (vars.aa[1][1]*-1).toFixed(2);
		fn[5] = ang2+"°";
		
		// ABOVE is user input
        
        //fn[0] = -6.25;
		//fn[1] = 0.50;
		//fn[2] = 20+"°";
		//fn[3] = -5.75;
		//fn[4] = -0.50;
		//fn[5] = 110+"°";
        
		
		for (var i = 0; i < fn.length; i++){
			if (fn[i]>0){
				fn[i]="+"+fn[i];
			}
			document.getElementsByClassName("formulaNum_new")[i].innerHTML = fn[i];
		}
        
        //console.log(fn[0] + " / " + fn[1] + " / " + fn[2] + " / " + 
        //            fn[3] + " / " + fn[4] + " / " + fn[5]);
        
        /*
        console.log(vars.aa[0][1] + " / " + vars.aa[1][1] + " / " + vars.aa[2][1] + " / " + 
                    vars.aa[3][1] + " / " + vars.aa[4][1] + " / " + vars.aa[5][1]);       
        */
        
	}
	
	
	
	//////////////////////////////////////////////////////////
	function lensInvisible(){
		for (var i = 0; i < document.getElementsByClassName("lens").length; i++){
			document.getElementsByClassName("lens")[i].style.display = "none";
		}
	}
	
	
	
	//////////////////////////////////////////////////////////
	function lensNums(){
		var la = [
		vars.aa[7][1].toFixed(2),//sm
		vars.aa[4][1].toFixed(2),//sp
		vars.aa[8][1].toFixed(2),//cm
		vars.aa[5][1].toFixed(2),//cp
		vars.aa[10][1],//la
		vars.aa[9][1],//cma
		vars.aa[6][1]//cpa
		];
		//tools
		document.getElementsByClassName("lensNum")[0].innerHTML = "-"+la[0];//sm
		document.getElementsByClassName("lensNum")[1].innerHTML = "+"+la[1];//sp
		document.getElementsByClassName("lensNum")[2].innerHTML = "-"+la[2];//cm
		document.getElementsByClassName("lensNum")[4].innerHTML = "+"+la[3];//cp
		document.getElementsByClassName("lensNum")[3].innerHTML = la[5]+"°";//cma
		document.getElementsByClassName("lensNum")[5].innerHTML = la[6]+"°";//cpa
			
		for (var i = 0; i < document.getElementsByClassName("lens").length; i++){
			document.getElementsByClassName("lens")[i].style.display = "none";
			
			// if any are +, show them
			//if (la[i]>0){
			//	document.getElementsByClassName("lens")[i].style.display = "block";
			//}
			
		}
		
		if (la[1]>0){
			document.getElementsByClassName("lens")[1].style.display = "block";
			document.getElementsByClassName("lensNum")[1].innerHTML = "+"+la[1];
		}
		if (la[1]<0){
			document.getElementsByClassName("lens")[0].style.display = "block";
			document.getElementsByClassName("lensNum")[0].innerHTML = la[1];
		}
		if (la[3]>0){
			document.getElementsByClassName("lens")[3].style.display = "block";
			document.getElementsByClassName("lensNum")[3].innerHTML = "+"+la[3];
			document.getElementsByClassName("lensNum")[5].innerHTML = la[6]+"°";//cpa
		}
		if (la[3]<0){
			document.getElementsByClassName("lens")[2].style.display = "block";
			document.getElementsByClassName("lensNum")[2].innerHTML = la[3];
			document.getElementsByClassName("lensNum")[3].innerHTML = la[6]+"°";//cpa
		}
		
			
		document.getElementById("lens2Rect").style.transform = "rotate("+(la[6]+90)*-1+"deg)";
		document.getElementById("lens3Rect").style.transform = "rotate("+(la[6]+90)*-1+"deg)";
		
	}
	
	
	
	//////////////////////////////////////////////////////////
	function displayReflectInfo(){
		var mot;
		if (Math.abs(vars.aa[11][1]) < 0.05){mot="neutro"}
		else if (vars.aa[11][1] > 0){mot="contra"}
		else if (vars.aa[11][1] < 0){mot="a favor"}
		document.getElementById("refMotion").innerHTML = "Movimento: "+mot;
	}
	
	
	var retOpacity;
	var eyeContH;
	var eyeContW;
	
	// OUTPUT 3: MOTION
	//////////////////////////////////////////////////////////
	function centerBeam(){
		document.getElementById("lightBeamContainer").style.top = ecy+"px"
		document.getElementById("lightBeamContainer").style.left = ecx+"px"
				
		if (vars.aa[11][1] > 0){
			document.getElementById("reflectionContainer").style.top = ecy+"px"
			document.getElementById("reflectionContainer").style.left = ecx+"px"
			document.getElementById("reflectionContainer").style.right = "auto";
			document.getElementById("reflectionContainer").style.bottom = "auto";
		} else {
			document.getElementById("reflectionContainer").style.left = "auto";
			document.getElementById("reflectionContainer").style.top = "auto";
			document.getElementById("reflectionContainer").style.bottom = ecy+"px"
			document.getElementById("reflectionContainer").style.right = ecx+"px"
		}
		
		
		
	}
	
	
	// OUTPUT 1: ROTATION
	//////////////////////////////////////////////////////////
	function rotateBeam(){
		
		//var lightBeamDegree = 180-parseInt(vars.aa[6][1])+90;
		var lightBeamDegree = vars.aa[10][1];
		
		//if (lightBeamDegree>){	
		//}
		
		//var lightBeamDegree = vars.aa[6][1];
		
		//console.log("lightBeamDegree = "+lightBeamDegree);
		//console.log("vars.aa[6][1] = "+vars.aa[6][1]);
		
		//var patientRxDegree = vars.aa[2][1]-90;
		var patientRxDegree = vars.aa[2][1];
		
		var lbd = lightBeamDegree;
		lbd -= 90;
		lbd *= -1;
		
		document.getElementById("lightBeam").style.transform = "rotate("+lbd+"deg)";
		
		//document.getElementById("lightBeam").style.transform = "rotate("+135+"deg)";
		
		//console.log(lbd);
				
		var angleSegSum = 171;//1+2+3...+18
		var realSeg = 90/angleSegSum;
		
		var angleArray = [];
		
		/*
		for (var i = 0; i < 36; i++){
			angleArray.push(5);
		}
		*/
		
		
		var angleArray = [
			
			9.473684211,
			8.947368421,
			8.421052632,
			7.894736842,
			7.368421053,
			6.842105263,
			6.315789474,
			5.789473684,
			5.263157895,
			4.736842105,
			4.210526316,
			3.684210526,
			3.157894737,
			2.631578947,
			2.105263158,
			1.578947368,
			1.052631579,
			0.5263157895,
			//18
			//-------------
			//18
			0.5263157895,
			1.052631579,
			1.578947368,
			2.105263158,
			2.631578947,
			3.157894737,
			3.684210526,
			4.210526316,
			4.736842105,
			5.263157895,
			5.789473684,
			6.315789474,
			6.842105263,
			7.368421053,
			7.894736842,
			8.421052632,
			8.947368421,
			9.473684211];
		
		/*
		var angleArray = [
			
			9.5, 9, 8.5,
			8, 7.5, 7, 6.5, 6, 5.5, 5, 
			4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 
			1, 1.5, 
			2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 
			7, 7.5, 8, 8.5, 9, 9.5];
		*/
		
		
		//var aye = Math.abs(vars.aa[6][1]-vars.aa[2][1]+90)/5;///number of segments: 1 2 3 4 5 6 7
		//console.log(aye);
		//var aTotal = 0;
		
		// if 
		//for (var i = 0; i < aye; i++){// angle
		//	aTotal = aTotal+angleArray[i];
		//}
		
		//console.log("aTotal = " + aTotal);
		
		//if light beam > 90d of Rx
		
		//console.log(patientRxDegree, lightBeamDegree);
		
		
		//var modpn = 1;//-1
		
		//var someCondition = true;//if lightbeam
		
		//if (someCondition){
		//var modpn = -1;
		//}
		
		//console.log(aTotal);
		//if (aTotal===0){
			//aTotal=90;
		//}
		
		//var dg = 0;
		
		//document.getElementById("reflection").style.transform = "rotate("+((aTotal*modpn)-vars.aa[2][1])+"deg)";
		//document.getElementById("reflection").style.transform = "rotate("+((aTotal*modpn)-vars.aa[2][1])+"deg)";
		
		//document.getElementById("reflection").style.transform = "rotate("+dg+"deg)";
		
		// what is the angle of the light beam
		// that is the starting point, reflection is calculated against that (relative, not absolute)
		// what is the angle difference between 21 & 61
		
		//var df = vars.aa[6][1]-vars.aa[2][1];
		
		//if (df>90){
		//	df = (180-df)*-1;
		//}
		
		//df = df/5;
		
		//make beam = angle of light beam
		//document.getElementById("reflection").style.transform = "rotate("+lightBeamDegree+"deg)";
		
		
		//console.log(vars.aa[1][1]);
		
		if (vars.aa[1][1]!==0){
		
		var df = lightBeamDegree - patientRxDegree;//difference
		var lb = lightBeamDegree;
		
		var rf;//reflection rotation
		
		var md = 2;
		
		if(df>135){
			rf = (lb+(df-45)/5+27)+((-(df-45)/5-36)*2)+72-(df-180)/md;
		} else {
			if(df<-135){
				rf = (lb+(df-45)/5+27)+((-(df-45)/5-36)*2)-(df+180)/md;
			} else {
				if(df<-45){
					rf = lb+(df-45)/5+27-(-90/md-(df)/md);
				} else {
					if(df>45){
						rf = lb+(df-45)/5-9-(90-df)/md;
					} else {
						rf = lb-(df/5)-(df)/md;
					}
				}
			}
		}
		
		} else {
			rf = vars.aa[10][1];
		}
		
		
		var rf2 = rf;
		rf2 -= 90;
		rf2 *= -1;
				
		document.getElementById("reflection").style.transform = "rotate("+rf2+"deg)";
		
		vars.aa[12][1] = rf;
		
		//if (vars.aa[1][1]===0){vars.aa[12][1] = lightBeamDegree};
		
		//console.log(lb, patientRxDegree, df, rf);
		
		//console.log("diff = ", df);
		
		//document.getElementById("reflection").style.transform = "rotate("+df+"deg)";
		
		
		//document.getElementById("reflection").style.transform = "rotate("+((aTotal*modpn)-vars.aa[2][1])+"deg)";
		
		// 175 should equal 5
		// 170 should equal 10
		// 165 should equal 15
		// 160 should equal 20
		// 155 should equal 25
		
		// HERE
				
		//console.log("rotate(", aTotal,"*", modpn+")-", vars.aa[2][1], ")+deg");
		//console.log((aTotal*modpn)-vars.aa[2][1]);
		//aTotal = 80.5, 90, 80.5
		// if aTotal greater than 90,
		
		
		//document.getElementById("reflection").style.transform = "rotate("+(180-parseInt(vars.aa[12][1])+90)+"deg)";
	}
	
	
	// OUTPUT 2: WIDTH
	//////////////////////////////////////////////////////////
	function resizeReflection(){
		
		var PS=vars.aa[0][1],//patient sphere
			PC=vars.aa[1][1],//patient cylinder
			PA=vars.aa[2][1],//patient angle
			WD=vars.aa[3][1],//working distance
			LA=vars.aa[10][1];//light angle

		var S_lens, C_lens, A_lens;
		
		if (!plusMode){
			// Container 0: Lentes Positivas
			S_lens = vars.aa[4][1];
			C_lens = vars.aa[5][1];
			A_lens = vars.aa[6][1];
		} else {
			// Container 1: Lentes Negativas
			S_lens = vars.aa[7][1] * -1;
			C_lens = vars.aa[8][1] * -1;
			A_lens = vars.aa[9][1];
		}
		
		// Cálculo da potência no meridiano de movimento (perpendicular à fenda)
		// Se a fenda está em LA, o movimento é em LA+90.
		var p_rad = (LA + 90 - PA) * Math.PI / 180;
		var V_patient = PS + PC * Math.pow(Math.sin(p_rad), 2);
		
		var l_rad = (LA + 90 - A_lens) * Math.PI / 180;
		var V_lens = S_lens + C_lens * Math.pow(Math.sin(l_rad), 2);
		
		// Erro refrativo para a retinoscopia: V_lens - V_patient - WD
		// (Neutralização quando V_lens = V_patient + WD)
		var TotalError = V_lens - V_patient - WD;
		
		vars.aa[11][1] = TotalError;
		
		// Largura visual: inversamente proporcional ao valor absoluto do erro
		// Erro 0 = Largura máxima (~180px com pixelMultiplier 30)
		var visualWidthFactor = 6 / (1 + Math.abs(TotalError) * 2);
		var visualWidth = visualWidthFactor * pixelMultiplier;
		
		var newBeamHeight = 600;
		document.getElementById("reflection").style.top = (newBeamHeight - beamRefCont)/2*-1+"px";
		document.getElementById("reflection").style.left = (beamRefCont - visualWidth)/2+"px";
		document.getElementById("reflection").style.width = visualWidth+"px";
		document.getElementById("reflection").style.height = newBeamHeight+"px";
	}
	
	
	
	/*
		document.getElementById("checkData").addEventListener("mouseup", function(){
			this.innerHTML = "";
			this.innerHTML = vars.aa[3][1];
			//for(var i = 0; i < vars.aaOrig.length; i++){
			//	this.innerHTML = this.innerHTML + vars.aaOrig[i] + "<br/>";
			//}
		});
	*/
	
	var inta = setInterval(function(){

		calcFormula();
		resizeReflection();
		displayReflectInfo();
		document.getElementById("refWidth").innerHTML = "Erro (D): "+vars.aa[11][1].toFixed(2);
		document.getElementById("refAngle").innerHTML = "Ângulo: "+vars.aa[12][1];
		//document.getElementById("startCover").style.display = "none";
		
		document.getElementById("checkData").innerHTML = "";
		//document.getElementById("checkData").innerHTML = "midpoint = "+ 4;
		
		},100);
	
	
	
		

}//END: init()






