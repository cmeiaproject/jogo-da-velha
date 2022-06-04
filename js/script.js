let tabuleiro = new Array();
let divTabela = new Array();
let btnNovoJogo;
let item;
let resultadoJogadorHumano;
let resultadoJogadorEletronico;
let jogando;
let nivel =0 ;

function ganhador(e)
{
	let xTotal, yTotal;
	let x, y;	
	let soma;
	let res;
	
	let totalLoop = 4;
	let loop = 0;

	// loop = 0, faz varredura linha/coluna
	// loop = 1, faz varredura coluna/linha
	
	// loop = 2, faz varredura cruzada da top-esquerda/ rodape-direita
	// loop = 3, faz varredura cruzada da top-direita/ rodape-esquerda
	
	
	while(loop < totalLoop)
	{	
		y = 0;
		x = 0;
		xTotal = 3;
		yTotal = 3;

		for(let l = y; l < yTotal; l++)
		{
			if( loop == 2 )
			{
				x = l;
				xTotal = x+1;	
			}	
			else if( loop == 3 )
			{
				xTotal = (yTotal - l);				
				x = xTotal - 1;
			}	
			
			if( (loop < 2 ) || (((loop == 2) || (loop == 3)) && (l == 0)))  
			{	
				soma = 0;
			}	
			
			for(let c = x; c < xTotal; c++)
			{
				if( loop == 1 )				
				{
					res = (tabuleiro[c][l] == e);					
				}	
				else
				{
					res = (tabuleiro[l][c] == e);					
				}	
				
				if(res)
				{
					
					soma += 10;
					if(soma == 30)
					{
						break;		
					}	
				}
			}	
			
			if(soma == 30)
			{
				loop = 10;
				break;				
			}	
			
		}
		
		loop++;
	}	
	
	if(jogando)
	{	
		jogando = (soma != 30);
	}	
	
	return (soma == 30);
	
}

function inicializarTabuleiro()
{
	tabuleiro = new Array();
	for(let y=1; y<4; y++)
	{	
		item = new Array();		
		for(let x=1; x<4; x++)
		{
			item.push("");
		}	
		tabuleiro.push(item);
	}	
	
}

function limparDivs()
{
	for(let i = 0; i < divTabela.length; i++)
	{
		divTabela[i].innerHTML = "&nbsp";
	}	
}

function marcarRegiao(e)
{
	let name = e.id;
	let valor = e.innerHTML;
	let l = name.substr(name.indexOf('l') + 1, 1); 
	let c = name.substr(name.indexOf('c') + 1, 1); 	
	
	l--;
	c--;
	tabuleiro[l][c] = valor;
}


function jogadorEletronico()
{
	let jogadaFeita = "N";
	let marcarDiv;
	let name;
	let i, j;
	
	for(i=0; i<3; i++)
	{	
		for(j=0; j<3; j++)
		{
			if(nivel == 0)
			{	
				if(tabuleiro[i][j] == "")
				{	
					jogadaFeita = "S";
					break;
				}	
			}
		}	
		if(jogadaFeita == "S")
		{
			break;
		}
	}	
	
	
	if(jogadaFeita == "S")
	{	
		i++;
		j++;
		name = "divl" +i.toString()+ "c" +j.toString();
		marcarDiv = document.getElementById(name);
		marcarDiv.innerHTML = "0";
		marcarRegiao(marcarDiv);
		
		let res = ganhador("0") ? "Ganhador" : "Perdeu";
		
		resultadoJogadorEletronico.innerHTML = "Computador " + res;				
	}
}

function divTabelaClick(e)
{
	if(jogando)
	{	
		this.innerHTML = "X";
		marcarRegiao(this);

		let res = ganhador("X") ? "Ganhador" : "Perdeu";
		resultadoJogadorHumano.innerHTML = "Jogador Humano " + res;		
		jogadorEletronico();	
	}			

}

function iniciarJogo()
{
	limparDivs();
	inicializarTabuleiro();
	jogando = true;
}

function initialize()
{
	let i;
	
	btnNovoJogo = document.getElementById("btnNovoJogo");
	resultadoJogadorHumano = document.getElementById("resultadoJogadorHumano");	
	resultadoJogadorEletronico = document.getElementById("resultadoJogadorEletronico");		
	lista = document.getElementById("lista");		
	btnNovoJogo.onclick = iniciarJogo; 	
	
	for(let y=1; y<4; y++)
	{	
		for(let x=1; x<4; x++)
		{
			divTabela.push( document.getElementById("divl"+y+"c"+x) );	
			i = divTabela.length - 1;
			divTabela[i].onclick = divTabelaClick;
		}	
	}	

	inicializarTabuleiro();
	limparDivs();
}

window.onload = initialize;