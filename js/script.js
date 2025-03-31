const EMPATE = 3;
const JOGADOR_HUMANO = 1;
const JOGADOR_ELETRONICO = 0;
const CONTINUAR_JOGO = 2;

let btnNovoJogo;
let btnNomeJogador;
let comboNivelJogo;
let jogadorLabel;
let resultadoJogo;

let jogador;
let temporizador;
let ganho;
let tabuleiro;

let casaTabuleiro = new Array();
let continuarJogando = false;
let nivel = 0;
let tempoJogadorEletronico = 1000;
let nomeJogador = 'Fulano';


function pararTemporizador()
{
	clearInterval(temporizador);
}

function retornarPrimeiroJogador()
{
	return Math.round( Math.random() );
}

function exibirJogador()
{
	let exibirResultado;

	if(continuarJogando)
	{
		exibirResultado	= (jogador == JOGADOR_ELETRONICO) ? 'Jogador Eletrônico' : nomeJogador;
		exibirResultado	= 'Jogador a jogar : ' + exibirResultado;
		jogadorLabel.innerHTML = exibirResultado;
	}	
}

function limparDivs()
{
	for(let casa of casaTabuleiro)
	{
		casa.style.backgroundImage = 'none';
		casa.style.backgroundSize = 'contain';		
	}	
}

function marcarCasa(casa, valor)
{
	tabuleiro[casa] = valor;
}

function inicializarTabuleiro()
{
	tabuleiro = new Array(9).fill('');

	//numeros das casas para identificar a vitoria
	ganho = [[0, 1, 2], [3, 4, 5], 
			 [6, 7, 8], [0, 3, 6], 
			 [1, 4, 7], [2, 5, 8], 
			 [0, 4, 8], [2, 4, 6]];
}

function iniciarPrimeiraJogada()
{
	jogador = retornarPrimeiroJogador()
	exibirJogador( jogador );
}


function verificarSituacaoJogo(value) //, status = 0, opcao = 0)
{
	let jogoFechado = false;

	for(let regiao of ganho)
	{
		jogoFechado = false;
		for(let casa of regiao)
		{
			jogoFechado = (tabuleiro[casa] === value);
			if(!jogoFechado)
				break;
		}	
		if(jogoFechado)
			break;
	}	

	if(jogoFechado)
		return value === '0' ? JOGADOR_ELETRONICO : JOGADOR_HUMANO
	else
		return tabuleiro.includes('') ? CONTINUAR_JOGO : EMPATE;

}

function verificarJogoJogador(value)
{
	let casa, indice = 0;
	let casas, casasPreenchidasJogador, casaProximaJogada;
	let result;

	result = {'jogadaExigida':'N', 'casa':0};

	for(let regiao of ganho)
	{
		casas = [];
		casas = [ tabuleiro[regiao[0]],
				  tabuleiro[regiao[1]],
				  tabuleiro[regiao[2]] ]; 

		casasPreenchidasJogador = casas.filter(e => e === value);		  
		if(casasPreenchidasJogador.length == 2)
		{
			casaProximaJogada = casas.filter(e => e === '');
			if(casaProximaJogada.length == 1)
			{	
				indice = casas.findIndex(e => e === '');
				casa = regiao[indice];
				result = {'jogadaExigida':'S', 'casa':casa};				
				break;
			}	
		}	
	}	

	return result;

}

function realizarJogadaEletronica()
{
	let casa;
	let jogadorA;
	let jogadorB;

	do
	{
		casa = Math.round( Math.random() * 8 );
	}	
	while( (tabuleiro[casa] !== '') );

	if(nivel > 0)
	{	
		jogadorA = verificarJogoJogador('X');
		if(jogadorA.jogadaExigida === 'S')
			casa = jogadorA.casa;		

		if(nivel > 1) 
		{	
			jogadorB = verificarJogoJogador('0');			
			if(jogadorB.jogadaExigida === 'S')
				casa = jogadorB.casa;
		}	
	}

	return casa;
}


function realizarJogadaJogadorEletronico()
{
	let jogadaFeita;
	let marcarDiv;
	let name;
	
	if(continuarJogando && (jogador == JOGADOR_ELETRONICO))
	{	
		jogadaFeita = realizarJogadaEletronica();
	
		name = "casa" + jogadaFeita.toString();

		marcarDiv = document.getElementById(name);
		marcarDiv.style.backgroundImage = "url('img/figura0.png')";

		marcarCasa(jogadaFeita, '0');
	
		exibirResultado('0');
		jogador = JOGADOR_HUMANO;

	}	
	
	exibirJogador();	
}


// o 'value' recebe X ou 0 
function exibirResultado(value)
{
	result = verificarSituacaoJogo(value); //, 1);

	if(result == CONTINUAR_JOGO)
		resultadoJogo.innerHTML = '';
	else 
	{
		let exibirResultado;
		if(result == EMPATE)				
			exibirResultado = 'Empate';
		else
		{
			exibirResultado = (result == JOGADOR_ELETRONICO) ? 'Jogador Eletrônico' : nomeJogador;											
			exibirResultado = 'Ganhador: ' + exibirResultado;
		}	
		resultadoJogo.innerHTML = exibirResultado;

		continuarJogando = false;
		pararTemporizador();
	}
		
}

function divCasaTabuleiroClick(e)
{
	if(continuarJogando && (jogador == JOGADOR_HUMANO))
	{	
		if (this.style.backgroundImage == 'none')
		{	
			this.style.backgroundImage = "url('img/figuraX.png')";

			let casa = parseInt(this.dataset.casa);
			marcarCasa(casa, "X");

			exibirResultado('X');
			jogador = JOGADOR_ELETRONICO;
		}	
	}	
	
	exibirJogador();

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

	jogadorLabel.innerHTML = '';			
	resultadoJogo.innerHTML = '';		

	if(temporizador != null || temporizador == undefined)
		pararTemporizador();
	
	temporizador = setInterval(realizarJogadaJogadorEletronico, tempoJogadorEletronico);

}

function comboNivelJogoChange(e)
{
	nivel = e.target.value;
//	tempoJogadorEletronico = (nivel == 0) ? 5000 : (nivel == 1) ? 2000 : 500;
}

function atribuirEventos()
{
	comboNivelJogo.addEventListener('change', comboNivelJogoChange);
	btnNovoJogo.onclick = iniciarNovoJogoClick; 				
	btnNomeJogador.onclick = btnNomeJogadorClick; 					
	
	for(let i=0; i<9; i++)
	{	
		casaTabuleiro.push( document.getElementById("casa" + i) );	
		casaTabuleiro[i].onclick = divCasaTabuleiroClick;
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


window.onload = () => {
	inicializarVariaveis();
	inicializarTabuleiro();
	limparDivs();
}