let tabuleiro = new Array();
let divTabela = new Array();
let btnNovoJogo;
let btnNomeJogador;
let item;
let resultadoJogo;
let resultadoJogadorHumano;
let resultadoJogadorEletronico;
let continuarJogando = false;
let nivel = 0;
let comboNivelJogo;
let jogador;
let jogadorLabel;
let tempoJogadorEletronico = 5000;
let jogadorEletronico = 0;
let jogadorHumano = 1;
let nomeJogador = 'Fulano';

function retornarPrimeiroJogador()
{
	return Math.round( Math.random() );
}


function statusJogo(e, iniciarLoop = 0, finalizarLoop = 4)
{
	let xTotal, yTotal;
	let x, y;	
	let soma;
	let res;
	let l, c;
	
	let totalLoop = finalizarLoop;
	let loop = iniciarLoop;

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

		for(l = y; l < yTotal; l++)
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
			
			for(c = x; c < xTotal; c++)
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
	
	if(continuarJogando)
	{	
		continuarJogando = (soma != 30);
	}	
	
	return new Array( (soma == 30), soma, loop, l, c );
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


function calcularJogadaAdversario(value)
{
	console.log('calcularJogadaAdversario');
	
	let resultado;

	
	let p = new Array();
	let l, c, i;
	let flag = 'N';

	for (i=0; i<4; i++)
	{	

		resultado = statusJogo(value, i, ++i);
		console.log('resultado: ' + resultado);		
	
		if( resultado[1] == 20 )
		{
			l = resultado[2];
			c = resultado[3];
			flag = 'S';
			switch(resultado[1])
			{
				case 0: 
						c = 2;
						break;
						
				case 1: l = 2;
						break;
						
				case 2: 
						l = 2;
						c = 2;
						break;
				
				case 3: 
						l = 0;
						c = 0;
						break;			
				default:
						flag = 'N'		
						break;
			}
			
			if( flag == 'S' )
			{	
				p = [l, c];		
			}	
			
			break;
		}	
	}	
	
	return p;
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

function jogarIntermediario()
{
	let i, j;
	let value = 'N';

	let res = calcularJogadaAdversario('X');
	console.log(res);	
	if( res.length > 0 )
	{
		return new Array('S', res[0], res[1]);
	}	

	do
	{
		i = Math.round( Math.random() * 2 );
		j = Math.round( Math.random() * 2 );		
	}	
	while( (tabuleiro[i][j] != "") );
		
	return new Array('S', i, j);

}

function jogarAvancado()
{
	return jogarIniciante();
}

function jogarIniciante()
{
	let i, j;
	let value = 'N';
	
	for(i=0; i<3; i++)
	{	
		for(j=0; j<3; j++)
		{
			if(tabuleiro[i][j] == "")
			{	
				value = "S";
				break;
			}
		}	
		
		if(value == "S")
		{
			break;
		}
	}		
	
	return new Array(value, i, j);
}


function realizarJogadaEletronica(nivel, Iniciante, Intermediario, Avancado)
{
	let resultado;
	
	if(nivel == 2)
	{
		resultado = Avancado();
	}	
	else if(nivel == 1)
	{
		resultado = Intermediario();		
	}	
	else
	{
		resultado = Iniciante();				
	}	
	
	return resultado;
}


function realizarJogadaJogadorEletronico()
{
	let jogadaFeita = "N";
	let marcarDiv;
	let name;
	let i, j;
	
	if(continuarJogando && (jogador == jogadorEletronico))
	{	
	
		jogadaFeita = realizarJogadaEletronica(nivel, 
												jogarIniciante, 
												jogarIntermediario, 
												jogarAvancado);
	
		if(jogadaFeita[0] == "S")
		{	
			i = ++jogadaFeita[1];
			j = ++jogadaFeita[2];
			name = "divl" +i.toString()+ "c" +j.toString();
			marcarDiv = document.getElementById(name);
			marcarDiv.innerHTML = "0";
			marcarRegiao(marcarDiv);
	
			exibirResultado('0');
			jogador = jogadorHumano;
		}
	}	
	
	exibirJogador();	

}

function exibirResultado(value)
{
	if( statusJogo(value)[0] )
	{
		resultadoJogo.innerHTML = 'Ganhador: ';
		resultadoJogo.innerHTML += (value == 'X') ? nomeJogador : 'Computador';		
		continuarJogando = false;
	}	
}

function divTabelaClick(e)
{
	if(continuarJogando && (jogador == jogadorHumano))
	{	
		if (this.innerHTML == "&nbsp;")
		{	
			this.innerHTML = "X";
			marcarRegiao(this);

			exibirResultado('X');
			jogador = jogadorEletronico;
		}	
	}	
	
	exibirJogador();
}

function exibirJogador()
{
	if(continuarJogando)
	{	
		jogadorLabel.innerHTML = 'Jogador a jogar : ';
		jogadorLabel.innerHTML += (jogador == jogadorEletronico) ? 'Computador' : nomeJogador;		
	}
	else	
	{
		jogadorLabel.innerHTML = '';		
	}	
}

function iniciarPrimeiraJogada()
{
	jogador = retornarPrimeiroJogador()
	exibirJogador( jogador );
	
}

function btnNomeJogadorClick()
{
	nomeJogador = prompt('Jogador, digite o seu nome', 'Fulano');
}


function iniciarNovoJogoClick()
{
	continuarJogando = true;
	limparDivs();
	inicializarTabuleiro();
	iniciarPrimeiraJogada();
	
	setInterval(realizarJogadaJogadorEletronico, tempoJogadorEletronico);
}

function comboNivelJogoChange(e)
{
	nivel = e.target.value;
	
	tempoJogadorEletronico = (nivel == 0) ? 5000 : (nivel == 1) ? 2000 : 500;
}

function atribuirEventos()
{
	let i;
	
	comboNivelJogo.addEventListener('change', comboNivelJogoChange);
	btnNovoJogo.onclick = iniciarNovoJogoClick; 				
	btnNomeJogador.onclick = btnNomeJogadorClick; 					
	
	for(let y=1; y<4; y++)
	{	
		for(let x=1; x<4; x++)
		{
			divTabela.push( document.getElementById("divl"+y+"c"+x) );	
			i = divTabela.length - 1;
			divTabela[i].onclick = divTabelaClick;
		}	
	}	
	
}


function inicializarVariaveis()
{
	btnNovoJogo 	= document.getElementById("btnNovoJogo");
	resultadoJogo 	= document.getElementById("resultadoJogo");		
	jogadorLabel	= document.getElementById("jogador");	
	comboNivelJogo	= document.getElementById("nivelJogo");			
	btnNomeJogador 	= document.getElementById("btnNomeJogador");	
	
	atribuirEventos();
}


function initialize()
{
	inicializarVariaveis();
	inicializarTabuleiro();
	limparDivs();
}

window.onload = initialize;