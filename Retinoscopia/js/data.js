

window.data = [];

data = {
	perc:1,
	start:1,
    random:3,//3 = randomized
	preset:[
	//		   patRx	dist	p lens     m lens	   light  mode   notes
	[0,[      0,1,2,      3,    4,5,6,     7,8,9,      10,    "p",   "---"]],
	[1,[      0,0,90,     0,    0,0,90,    0,0,90,     90,    "p",   "---"]],
	[2,[      3,1,90,     0,    1,1,180,   0,0,90,     180,   "p",   "---"]],
    [3,[      0,0,90,     0,    0,0,90,    0,0,90,     90,    "p",   "---"]]
	],
	
		/*
	[0,[       0,0,90,      0,    0,    0,    90,   0,90,   0,90,  "m",  "match pat cyl 90 & light angle"]],
	[1,[     1,1.5,90,      0,    0,    2,    90,   0,90,   0,90,  "p",  "At 180:<br/>width: 60<br/>motion: against"]],
	[2,[     -2,-1,90,      2,    1,    0,    90,   0,90,   0,90,  "m",  "At 180:<br/>width:-60<br/>motion: with"]],
	[3,[     -2,-1,90,      0,    1,    0,    90, 1.5,90,   0,90,  "m",  "match cyl lens 90/180 result"]],
    [4,[       1,1,90,      0,    0,    0,    90,   0,90,   0,90,  "m",  "patient angle size"]],
    [5,[       1,2,90,      0,    0,    2,    90,   0,90,   1,90,  "p",  "plus cyl lens"]],
    [6,[       1,2,90,      0,    0,    1,    90,   0,90,   2,90,  "p",  "plus cyl lens"]],
	
	[7,[       1.25,1,90,      0,    0,    1,   180,   0,90,   0,90,  "p",  "---"]],
	[8,[       1,2,90,      0,    0,    1,   90,   0,90,   1,180,  "p",  "---"]],
	[9,[       2,1,180,      0,    0,    1,   180,   0,90,   1,180,  "p",  "---"]],
	[10,[      1,1,90,      0,    0,    1,   180,   0,90,   1,180,  "p",  "---"]],
	[11,[      1,2,180,      0,    0,    1,   180,   0,90,   1,180,  "p",  "---"]],
	[12,[      0,0,90,      0,    0,    0,   90,   0,90,   0,90,  "m",  "---"]],
	[13,[      0,0,90,      0,    0,    0,   90,   0,90,   0,90,  "m",  "---"]]
	]
		*/	
	
	
	
	
	
	instructionText:[
		["Passo 1: Na aba explorar, insira o erro refrativo do paciente."],
		["Passo 2: Defina a compensação da distância de trabalho. Isso se relaciona ao comprimento do seu braço ou a distância entre seu retinoscópio e o olho do paciente. Um comprimento médio é 67 cm, o que corresponde a uma compensação de +1.50 D."],
		["Passo 3: Passe o feixe de luz pelo olho para determinar movimentos 'a favor', 'contra' e 'neutralidade'."],
		["Passo 4: REFRAÇÃO CILÍNDRO POSITIVO: Determine o ângulo/eixo com o menor movimento A FAVOR. Quando a intercepção de luz se move na mesma direção do reflexo da pupila, você tem movimento A FAVOR. Neutralize este movimento adicionando força esférica. Quando a intercepção se move na direção oposta do reflexo, você tem movimento CONTRA. Subtraia força positiva até o movimento ser neutro. Quando a pupila se enche de luz e não há movimento, você está na neutralidade e determinou a força esférica."],
		["Passo 5: REFRAÇÃO CILÍNDRO POSITIVO: Agora angule a fenda 90 graus da posição anterior. Adicione força positiva ao cilindro até qualquer movimento A FAVOR ser neutralizado, ou força negativa até qualquer movimento CONTRA ser neutralizado (movimento CONTRA move-se na direção oposta da fenda de luz). Registre o eixo como a direção desta fenda final quando ela for neutralizada."],
		["Passo 6: REFRAÇÃO CILÍNDRO POSITIVO: Registre o erro refrativo, que é sua esfera neutralizadora menos sua distância de trabalho, depois seu cilindro e eixo. Exemplo: se sua distância de trabalho é 2.00 D como mostrado e o foróptero lê +3.50 + 0.75 x 90, a leitura final é: (+3.50 -2.00 = +1.50) +1.50 + 0.75 x 90."],
		["Passo 7: REFRAÇÃO CILÍNDRO NEGATIVO: Determine o ângulo/eixo com o maior movimento A FAVOR. Quando a intercepção de luz se move na mesma direção do reflexo da pupila, você tem movimento A FAVOR. Neutralize este movimento adicionando força esférica. Quando a intercepção se move na direção oposta do reflexo, você tem movimento CONTRA. Subtraia força positiva até o movimento ser neutro. Quando a pupila se enche de luz e não há movimento, você está na neutralidade e determinou a força esférica."],
		["Passo 8: REFRAÇÃO CILÍNDRO NEGATIVO: Agora angule a fenda 90 graus da posição anterior. Adicione força negativa ao cilindro até qualquer movimento CONTRA ser neutralizado, ou força positiva até qualquer movimento A FAVOR ser neutralizado (movimento CONTRA move-se na direção oposta da fenda de luz). Registre o eixo como a direção desta fenda final quando ela for neutralizada."],
		["Passo 9: REFRAÇÃO CILÍNDRO NEGATIVO: Registre o erro refrativo, que é sua esfera neutralizadora menos sua distância de trabalho, depois seu cilindro e eixo. Exemplo: se sua distância de trabalho é 2.00 D como mostrado e o foróptero lê +3.50 - 0.75 x 90, a leitura final é: (+3.50 -2.00 = +1.50) +1.50 - 0.75 x 90."],
		["Passo 10: Clique no botão 'novo paciente' na aba teste para gerar um erro refrativo aleatório. Insira os erros refrativos positivos e negativos do paciente e clique em 'conferir resposta' para comparar os resultados."]
	],
	
	
	varContainer:[]
	
	
}



	/*
	[-1,0,90,1.5,  -1,45,-2,170,"minus"],
	[ 3,0,90,1.5,  0,65,-3,120,"minus"],
	[-1.5,2,45,2,  2,160,1,20,"plus"]
	*/