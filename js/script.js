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
let temporizador;

function pararTemporizador()
{
	clearInterval(temporizador);
}

function retornarPrimeiroJogador()
{
	return Math.round( Math.random() );
}

function realizarVarreduraVH(e, status = 0, p = 0, direcao = 'H')
{
	let soma = 0;
	let i, n;
	let x, y;
	let res;
	
	for(i=0; i<3; i++)
	{
		x = (direcao == 'H') ? i : p;
		y = (direcao == 'H') ? p : i;		
		
		if (tabuleiro[y][x] == "") 
		{
			n = (direcao == 'H') ? x : y;		
		}	
		soma += (tabuleiro[y][x] == e) ? 10 : 0;
	}	
	
	if( n != null && n != undefined )
	{	
		let c = (direcao == 'H') ? n : p;
		let l = (direcao == 'H') ? p : n;	
	
		res = new Array(soma, l, c);
	}
	else
	{
		res = [];
	}	
	
	if(status == 1)
	{
		res = [soma];
	}	
	
	return res;
}	

function realizarVarreduraCruzada(e, status = 0, direcao = "toDireita")
{
	let soma = 0;
	let i, n;
	let x, y, c;
	let res;
	
	for(i=0; i<3; i++)
	{
		if(direcao == "toEsquerda")
		{
			c = 2 - i;
		}	
		x = (direcao == "toDireita") ? i : c;
		
		if (tabuleiro[i][x] == "") 
		{
			n = x;
			y = i;
		}	
		soma += (tabuleiro[i][x] == e) ? 10 : 0;
	}	
	
	if( n != null && n != undefined )
	{	
		res = new Array(soma, y, n);
	}
	else
	{
		res = [];
	}		
	
	if(status == 1)
	{
		res = [soma];
	}	
	
	return res;
}


function realizarVarreduraProsseguirJogo()
{
	let soma = 0;
	let flag = false;
	let x, y;
	let res;
	
	for(y=0; y<3; y++)
	{
		for(x=0; x<3; x++)
		{	
			if (tabuleiro[y][x] == "") 
			{
				flag = true;
				break;	
			}	
		}	
		if( flag )
		{
			break;
		}	
	}
	
	soma = flag ? 0 : 30;
	
	return new Array(soma, 0, 0);
}

function verificarSituacaoJogo(e, status = 0, opcao = 0)
{
	let resultado;
	let value;

	value = verificarStatusJogo(e, status, opcao);
	
	if(value[0] || opcao == 8)
	{
		if(opcao == 8 && value[0])	
		{
			resultado = 3;
		}	
		else if( value[0] )
		{
			resultado = (e == '0') ? 0 : 1;
		}
		else
		{		
			resultado = 2;
		}	
		
		return resultado;
	}
	else if(opcao == 8)
	{
		return resu
	}	
	else
	{	
		opcao++;
		return verificarSituacaoJogo(e, status, opcao);
		
	}	
}


function verificarStatusJogo(e, status = 0, opcao = 0)
{
	let res;
	
	switch(opcao)
	{
		case 0: res = realizarVarreduraVH(e, status);
				break;
		case 1: res = realizarVarreduraVH(e, status, 1);
				break;
		case 2: res = realizarVarreduraVH(e, status, 2);
				break;
		case 3: res = realizarVarreduraVH(e, status, 0, 'V');
				break;
		case 4: res = realizarVarreduraVH(e, status, 1, 'V');
				break;
		case 5: res = realizarVarreduraVH(e, status, 2, 'V');
				break;
		case 6: res = realizarVarreduraCruzada(e, status, 'toDireita');
				break;
		case 7: res = realizarVarreduraCruzada(e, status, 'toEsquerda');
				break;
		case 8: res = realizarVarreduraProsseguirJogo();
				break;
	}

	let soma = res[0];	
	let l = res[1];
	let c = res[2];	

	if(continuarJogando)
	{	
		continuarJogando = (soma != 30);
	}	
	
	return new Array( (soma == 30), soma, l, c );
	
}

/*
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
*/

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


function verificarJogoJogador(value)
{
	let resultado;

	
	let p = new Array();
	let l, c, i;

	for (i=0; i<8; i++)
	{	

		resultado = verificarStatusJogo(value, 0, i);
	
		if( resultado[1] == 20 )
		{
			l = resultado[2];
			c = resultado[3];
			p = [l, c];		
			
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

function realizarJogadaEletronica()
{
	let resultado;
	
	let i, j;
	let jogadorA = [];
	let jogadorB = [];

	if(nivel > 0)
	{	
		jogadorA = verificarJogoJogador('X');
		if(nivel > 1)
		{
			jogadorB = verificarJogoJogador('0');			
		}
		
		resultado = (jogadorB.length > 0) ? jogadorB : jogadorA;
		
		if( resultado.length > 0)
		{
			return new Array('S', resultado[0], resultado[1]);
		}	
	}

	do
	{
		i = Math.round( Math.random() * 2 );
		j = Math.round( Math.random() * 2 );		
	}	
	while( (tabuleiro[i][j] != "") );
		
	return new Array('S', i, j);
}


function realizarJogadaJogadorEletronico()
{
	let jogadaFeita = "N";
	let marcarDiv;
	let name;
	let i, j;
	
	if(continuarJogando && (jogador == jogadorEletronico))
	{	
		jogadaFeita = realizarJogadaEletronica();
	
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
	res = verificarSituacaoJogo(value, 1);
	if( res != 2 )
	{
		if(res == 3)
		{
			resultadoJogo.innerHTML = 'Empate';
		}	
		else
		{
			resultadoJogo.innerHTML = 'Ganhador: ';
			resultadoJogo.innerHTML += (res == 0) ? 'Jogador Eletroncio' : nomeJogador;											
		}	
		continuarJogando = false;
		pararTemporizador();
	}
	else
	{
		resultadoJogo.innerHTML = '';		
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
	resultadoJogo.innerHTML = '';			
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
	if(temporizador != null || temporizador == undefined)
	{
		pararTemporizador();
	}	
	
	temporizador = setInterval(realizarJogadaJogadorEletronico, tempoJogadorEletronico);
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