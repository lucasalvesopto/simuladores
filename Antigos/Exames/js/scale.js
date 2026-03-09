




//SHRINK FOR MOBILE

function initScale(){
	
	var originalHeight = document.getElementById("mainContainer").offsetHeight;
	var originalWidth = document.getElementById("mainContainer").offsetWidth;
	
	
	/*
	document.getElementById("scaleContainer").innerHTML = 
		
		'<div id="scale"></div>';
	*/
	
	
	document.getElementById("mainContainer").style.transformOrigin = "0px 0px";
	var mcHeight = document.getElementById("mainContainer").offsetHeight;
	//console.log(mcHeight);
	
	
	/*
	document.getElementById("scale").addEventListener("click", function(){
		document.getElementById("scale").innerHTML = vars.aa[0][1];
	});
	*/
	
	
	requestAnimationFrame(checkWindowHeightChange);
	
	function checkWindowHeightChange(){
		
		var win1 = win2;
		
		var win2 = window.innerHeight;
		
		//if (win1!==win2){
		//	document.getElementById("scale").innerHTML = win2;
		//}
		
		data.perc = win2/mcHeight;
		
		//console.log(perc);
		
		//console.log(originalHeight, originalWidth);
		
		if (data.perc * originalWidth > window.innerWidth){
			data.perc = window.innerWidth/originalWidth;
		}
		
		//data.perc = 1.5;

		//if (screenScaling.minScreenWidth*screenScaling.scaleValue > window.innerWidth)
		//if (win2<mcHeight){
		document.getElementById("mainContainer").style.transform = "scale("+data.perc+")";
		//} else {
		//	document.getElementById("mainContainer").style.transform = "scale(1)";
		//}
		
		requestAnimationFrame(checkWindowHeightChange);
		
	}
}




