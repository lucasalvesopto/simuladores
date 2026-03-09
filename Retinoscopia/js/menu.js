






function initMenu(){
	
	//console.log(vars.aa[0][5]);
	
	document.getElementById("menuContainer").innerHTML = 
		
				'<div id="menuBorder"></div>'+
                '<div id="menuBG">'+
                    '<div class="menuCircle" id="menuCircle1"></div>'+
                    '<div class="menuCircle" id="menuCircle2"></div>'+
                '</div>'+

                '<div id="moduleTitle">Simulador de Retinoscopia</div>'+

                '<div class="menuCopyright">© 2020 American Academy of Ophthalmology</div>'+

                '<div id="creditBoxContainer">'+
                    '<div class="creditTitle">Faruk H. Örge, MD</div>'+
                    '<div class="creditTitle">K. David Epley, MD</div>'+
                '</div>'+

                '<div id="startButtonContainer">'+
                    '<div class="startButton"></div>'+
                    '<div class="startButton">Iniciar</div>'+
                '</div>';
					
					
					


document.getElementById("startButtonContainer").addEventListener("click", function(){
	document.getElementById("menuContainer").style.display = "none";
});

if (document.getElementById("homeButton")){
document.getElementById("homeButton").addEventListener("click", function(){
		document.getElementById("menuContainer").style.display = "block";
	});

}
}


