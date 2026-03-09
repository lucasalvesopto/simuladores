





function initInstructions(){
	
	//console.log(vars.aa[0][3]);
	
	document.getElementById("instructionsAll").innerHTML = 
			
                '<div id="instructionOverlay" style="display:none;"></div>'+

                '<div id="instructionModalContainer" style="display:none;">'+
                    '<div id="instructionText"></div>'+
                    '<div id="instructionControls">'+
                        '<div id="instructionExit">Próximo</div>'+
                        '<div id="instructionSkip">Fechar</div>'+
                    '</div>'+
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
			
			
				/* Images removed for minimal tutorial */
				//for (var i = 0; i < instructionImageOrder.length; i++){
				//	document.getElementsByClassName("instructionImage")[instructionImageOrder[i]].style.display = "none";
				//}
			
				//console.log(instructionImageOrder[currentInstructionPage]);
				
				//document.getElementsByClassName("instructionImage")[instructionImageOrder[currentInstructionPage]].style.display = "block";
				document.getElementById("instructionText").innerHTML = data.instructionText[currentInstructionPage];
			
			} else {
				document.getElementById("instructionsAll").style.display = "none";
                document.getElementById("instructionModalContainer").style.display = "none";
				currentInstructionPage = 0;
				document.getElementById("toolContainer_new").style.display = "block";
				//document.getElementsByClassName("instructionImage")[0].style.display = "block";
				//document.getElementsByClassName("instructionImage")[4].style.display = "none";
				document.getElementById("instructionText").innerHTML = data.instructionText[0];
			}
			
		}
	}						
												
	
	
	
	function instructionClose(){
		
		return function(){
			
				document.getElementById("instructionsAll").style.display = "none";
                document.getElementById("instructionModalContainer").style.display = "none";
				currentInstructionPage = 0;
				document.getElementById("toolContainer_new").style.display = "block";
				//document.getElementsByClassName("instructionImage")[0].style.display = "block";
				//document.getElementsByClassName("instructionImage")[4].style.display = "none";
				document.getElementById("instructionText").innerHTML = data.instructionText[0];
				
		}
	}
	
	
	
	if (document.getElementById("helpButton")){
		document.getElementById("helpButton").addEventListener("click", function(){
			// Show container
            document.getElementById("instructionModalContainer").style.display = "block";
            document.getElementById("instructionModalContainer").style.setProperty("display", "block", "important");
            
            // Text
            document.getElementById("instructionText").style.display = "block";
			document.getElementById("instructionText").innerHTML = data.instructionText[0];
			
			// Buttons
			document.getElementById("instructionExit").style.display = "flex";
			document.getElementById("instructionSkip").style.display = "flex";
			
            // Reset page
            currentInstructionPage = 0;
	    });
	}
	
	
	
}//END: initInstructions









