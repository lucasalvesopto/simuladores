





function initInstructions(){
	
	//console.log(vars.aa[0][3]);
	
	document.getElementById("instructionsAll").innerHTML = 
			
                '<div id="instructionOverlay"></div>'+
                '<div class="instructionImage ii0"></div>'+
                '<div class="instructionImage ii1"></div>'+
                '<div class="instructionImage ii2"></div>'+
                '<div class="instructionImage ii3"></div>'+
                '<div class="instructionImage ii4"></div>'+
                '<div class="instructionImage ii5"></div>'+
                '<div class="instructionImage ii6"></div>'+
                '<div class="instructionImage ii7"></div>'+
                '<div class="instructionImage ii8"></div>'+
                '<div class="instructionImage ii9"></div>'+
                '<div id="instructionText"></div>'+
                '<div id="instructionControls">' +
                    '<div id="instructionExit">Próximo</div>'+
                    '<div id="instructionSkip">Fechar</div>' +
                '</div>';
           
	
	
				
				
	


var instructionImageOrder = [0,1,2,3,4,5,6,7,8,9];
	
	//var instructionPage = instructionImageOrder.length;
	var currentInstructionPage = 0;
	
	document.getElementById("instructionExit").addEventListener("click", instructionImageNext());
	
	document.getElementById("instructionSkip").addEventListener("click", instructionClose());
	
	document.getElementById("instructionText").innerHTML = data.instructionText[0];
	
	
	function instructionImageNext(){
		
		return function(){
			
			
			if (currentInstructionPage < instructionImageOrder.length-1){
				currentInstructionPage++;
			
				for (var i = 0; i < instructionImageOrder.length; i++){
					document.getElementsByClassName("instructionImage")[instructionImageOrder[i]].style.display = "none";
				}
			
				//console.log(instructionImageOrder[currentInstructionPage]);
				
				document.getElementsByClassName("instructionImage")[instructionImageOrder[currentInstructionPage]].style.display = "block";
				document.getElementById("instructionText").innerHTML = data.instructionText[currentInstructionPage];
			
			} else {
				document.getElementById("instructionsAll").style.display = "none";
				currentInstructionPage = 0;
				document.getElementById("toolContainer_new").style.display = "block";
				document.getElementsByClassName("instructionImage")[0].style.display = "block";
				document.getElementsByClassName("instructionImage")[4].style.display = "none";
				document.getElementById("instructionText").innerHTML = data.instructionText[0];
			}
			
		}
	}						
												
	
	
	
	function instructionClose(){
		
		return function(){
			
				document.getElementById("instructionsAll").style.display = "none";
				currentInstructionPage = 0;
				document.getElementById("toolContainer_new").style.display = "block";
				document.getElementsByClassName("instructionImage")[0].style.display = "block";
				document.getElementsByClassName("instructionImage")[4].style.display = "none";
				document.getElementById("instructionText").innerHTML = data.instructionText[0];
				
		}
	}
	
	
	
	if (document.getElementById("helpButton")){
		document.getElementById("helpButton").addEventListener("click", function(){
			document.getElementById("instructionsAll").style.display = "block";
			
				for (var i = 0; i < instructionImageOrder.length; i++){
					document.getElementsByClassName("instructionImage")[instructionImageOrder[i]].style.display = "none";
				}
				document.getElementsByClassName("instructionImage")[instructionImageOrder[currentInstructionPage]].style.display = "block";
				document.getElementById("instructionText").innerHTML = data.instructionText[currentInstructionPage];
			
			
			document.getElementById("instructionText").innerHTML = data.instructionText[0];
			
	});
	}
	
	
	
}//END: initInstructions









