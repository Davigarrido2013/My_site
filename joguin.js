// Importações
import Player from './Player.js';
import Enemie from './Enemie.js';

/************ VARIÁVEIS ****************/
const btn_inf = document.querySelector('.btn_information');
const telaGameOver = document.querySelector('.gameOverScreen');
const botaoGameOver = document.querySelector('.gameOverScreen button');
const inf = document.querySelector('.inf'); const tempo = document.getElementById('tempo');
const parte1 = document.querySelector('.form');
const nome = document.getElementById('nome');
const jogo = document.querySelector('.jogo');
const form = document.querySelector('form');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const cima = document.querySelector('.btn_cima');
const baixo = document.querySelector('.btn_baixo');
const dash = document.querySelector('.btn_dash');
const esquerda = document.querySelector('.btn_esquerda');
const direita = document.querySelector('.btn_direita');
const ataque = document.querySelector('.btn_ataque');
const infVelocidade = document.querySelector('#velocidade_inf');
const infNome = document.querySelector('#nome_inf');
const infDano = document.querySelector('#dano_inf');
const tempogo = document.getElementById('tempogo');
const btns = [...document.querySelectorAll('.btn')];
const volControl = document.querySelector('.inf input[type="range"]')
const volRes = document.getElementById('volRes')

let temaLiberado = false
let intervaloTempo = null;
let jogando = false;
let parouMusica = false;
const audioTema = new Audio();
let selecionado = false;
let nomeSalvo = localStorage.getItem('Nome');
const stop = document.querySelector('.stop')
const btnAlterar = document.getElementById('alterar-nome');
const div_volume = document.querySelector('.volume')

// Áudio
let audiosCarregados = false;
let audioEspada = new Audio("./audiosJogo/espada.mp3");
let audioUgh = new Audio("./audiosJogo/ugh.mp3");
const audios = [audioEspada, audioUgh];
let ac = 0;
audios.forEach((audio) => {
    audio.addEventListener("canplaythrough", () => {
        ac++
        if (ac === audios.length)
            audiosCarregados = true;
    });
});

navigator.getBattery().then(battery => {
    console.log("Nível de bateria:", battery.level * 100 + "%");
});

btns.forEach((btn) => {
    btn.addEventListener("touchstart", e => btn.blur());
    btn.addEventListener("click", e => btn.blur());
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = new Player(c, canvas, cima, baixo, ataque, dash, direita, esquerda);
const enemie = new Enemie(player, c, canvas);

function colideRetangulos(r1, r2, ataque = false) {
    if (ataque) {
        return (
            r1.ataque_d.posicao.x < r2.posicao.x + r2.largura &&
            r1.ataque_d.posicao.x + r1.ataque_d.largura > r2.posicao.x &&
            r1.ataque_d.posicao.y < r2.posicao.y + r2.altura &&
            r1.ataque_d.posicao.y + r1.ataque_d.altura > r2.posicao.y &&
            r1.atacando
        )
    } else {
        return (
            r1.posicao.x < r2.posicao.x + r2.largura &&
            r1.posicao.x + r1.largura > r2.posicao.x &&
            r1.posicao.y < r2.posicao.y + r2.altura &&
            r1.posicao.y + r1.altura > r2.posicao.y
        )
    }
}

function startGame() {
    function loop() {
        c.clearRect(0, 0, canvas.width, canvas.height);
        const texto = `Vida - ${player.vida}`;
        const tam = texto.length <= 6 ? -c.measureText(texto).width : c.measureText(texto).width / 6;
        
        if (player.vida > 0) {
          c.font = "15px Poppins";
          c.fillStyle = "#000";
          c.fillText(texto, player.posicao.x - tam, player.posicao.y - 10);
        }
        
        player.update();
        enemie.execute();
        
        // Som da espada (uma vez por ataque)
        if (player.atacando && !player.audioTocado && audiosCarregados) {
            audioEspada.currentTime = 0.4;
            audioEspada.play();
            player.audioTocado = true;
        }
        if (!player.atacando) {
            player.audioTocado = false;
        }
        
        if (enemie.vida > 0 && colideRetangulos(player, enemie, true)) {
            player.atacando = false;
            enemie.danificado = true;
            enemie.vida -= player.dano;
            enemie.tempoDano = 9;
            setTimeout(() => console.log(`${nome.value}, você acertou!`), 200);
        }
        
        if (player.vida > 0 && colideRetangulos(enemie, player, true)) {
            enemie.atacando = true;
            player.vida -= enemie.dano;
            if (audiosCarregados) {
                audioUgh.currentTime = 0;
                audioUgh.play();
            }
            setTimeout(() => console.log(`Você foi acertado, ${nome.value}!`), 200);
        } else if (player.vida <= 0) {
            telaGameOver.style.visibility = "visible";
            tempogo.textContent = tempo.textContent;
            jogando = true;
            player.vida = 25;
            botaoGameOver.addEventListener('click', () => {
                telaGameOver.style.visibility = "hidden";
                nome.value = "Elior";
                jogo.style.animation = "desaparece 1s ease forwards";
                setTimeout(() => {
                  jogo.style.display = "none";
                  jogo.style.animation = "none";
                  parte1.style.display = "block";
                  parte1.style.animation = "none";
                }, 1000);
            });
        }
        requestAnimationFrame(loop);
    }
    loop();
}

function rola() {
    let segundos = 0, minutos = 0, horas = 0;
    if (intervaloTempo) clearInterval(intervaloTempo);
    intervaloTempo = setInterval(() => {
        if (player.vida <= 0) return
        segundos++
        if (segundos === 60) {
            segundos = 0;
            minutos++
        } if (minutos === 60) {
            minutos = 0;
            horas++
        }
        const segundoVisto = segundos < 10 ? "0" + segundos : segundos
        const minutoVisto = minutos < 10 ? "0" + minutos : minutos
        const horaVista = horas < 10 ? "0" + horas : horas
        tempo.innerHTML = `${horaVista}:${minutoVisto}:${segundoVisto}`;
    }, 1000);
}

if (!nomeSalvo) {
    nome.value = "Elior";
} else {
    nome.value = nomeSalvo;
    infNome.textContent = `Nome de usuário: ${nomeSalvo}`;
    infDano.textContent = `Dano: ${player.dano}`;
    infVelocidade.textContent = `Velocidade: ${player.velocidade}`;
    parte1.style.display = "none";
    jogo.style.display = "block";
    if (!jogando) {
        jogando = true;
        startGame();
    }
    rola();
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('Nome', nome.value);
    parte1.style.animation = "desaparece 1s ease forwards";
    setTimeout(() => {
        parte1.style.display = "none";
        parte1.style.animation = "none";
        jogo.style.display = "block";
        jogo.style.animation = "none";
        if (!jogando) {
            jogando = true;
            startGame();
        }
        rola();
    }, 1000);
});

btnAlterar.addEventListener('click', () => {
    localStorage.removeItem('Nome');
    nomeSalvo = null;
    nome.value = "Elior";
    jogando = true;
    jogo.style.animation = "desaparece 1s ease forwards";
    setTimeout(() => {
        jogo.style.display = "none";
        jogo.style.animation = "none";
        parte1.style.display = "block";
        parte1.style.animation = "none";
    }, 1000);
});

btn_inf.addEventListener('click', () => {
    inf.classList.toggle('aberto');
    btn_inf.ariaPressed = selecionado ? "false" : "true";
    btn_inf.ariaExpanded = selecionado ? "false" : "true";
    selecionado = !selecionado;
});

function erroInput(element, errEl, msg) {
    element.style.border = "2px solid red";
    errEl.style.display = "block";
    errEl.textContent = msg;
    setTimeout(() => {
        errEl.style.display = "none";
        element.style.border = "none";
    }, 2000);
}

const erro = document.getElementById('erro');

nome.addEventListener('input', () => {
    if (nome.value.includes(' ')) {
        erroInput(nome, erro, "Não é permitido espaço no nome!");
        nome.value = nome.value.replace(/\s/g, '');
    } else if (nome.value.split('').some(n => /\D/.test(n)) && nome.value.split('').some(n => /\W/.test(n))) {
        erroInput(nome, erro, "Não é permitido caracteres especiais ou acentos no nome!");
        nome.value = nome.value.replace(/\W/g, "");
    }
});

stop.addEventListener("click", () => {
    if (temaLiberado) {
        if (parouMusica) {
            audioTema.play()
            div_volume.style.visibility = "visible"
            stop.textContent = "Parar música"
        } else {
            audioTema.pause()
            div_volume.style.visibility = "hidden"
            stop.textContent = "Continuar música"
        }
        parouMusica = !parouMusica
    }
})

function musicaTema() {
    audioTema.loop = true
    audioTema.volume = 0.5
    audioTema.src = "./audiosJogo/musica_calma.mp3"
    audioTema.oncanplaythrough = () => {
        audioTema.play()
        temaLiberado = true
        volRes.textContent = "Volume - 70%"
    }
    window.removeEventListener("click", musicaTema)
}

window.addEventListener("click", musicaTema)
volControl.addEventListener('change', () => {
    if (temaLiberado) {
        audioTema.volume = volControl.value / 100
        volRes.textContent = `Volume - ${volControl.value}%`
        if (!parouMusica)
            audioTema.volume = volControl.value / 100
        if (volControl.value < 80) {
            volRes.style.color = "green"
        } else {
            volRes.style.color = "red"
        }
    }
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.chao = canvas.height / 1.7;
});