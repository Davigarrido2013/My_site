import Player from './Player.js';
import Enemie from './Enemie.js';

/************VARIÁVEIS****************/
const btn_inf = document.querySelector('.btn_information')
const inf = document.querySelector('.inf')
const tempo = document.getElementById('tempo')
const parte1 = document.querySelector('.form');
const nome = document.getElementById('nome');
const jogo = document.querySelector('.jogo');
const form = document.querySelector('form');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const cima = document.querySelector('.btn_cima');
const esquerda = document.querySelector('.btn_esquerda');
const direita = document.querySelector('.btn_direita');
const ataque = document.querySelector('.btn_ataque');
const infVelocidade = document.querySelector('#velocidade_inf')
const infNome = document.querySelector('#nome_inf')
const infDano = document.querySelector('#dano_inf')

// Definir tamanho do canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Criar instâncias
const player = new Player(c, canvas, ataque, cima, direita, esquerda);
const enemie = new Enemie(c, canvas);

// Loop principal
function startGame() {
    function loop() {
        c.clearRect(0, 0, canvas.width, canvas.height);

        const texto = nome.value
        const tam = texto <= 6 ? -c.measureText(texto).width : c.measureText(texto).width / 6

        c.font = "20px Poppins"
        c.fillStyle = "#000"
        c.fillText(nome.value, player.posicao.x - tam, player.posicao.y - 10)
        player.update();
        enemie.execute();

        const colisaoAtaque = player.ataque_d.posicao.x < enemie.posicao.x + enemie.largura && player.ataque_d.posicao.x + player.ataque_d.largura > enemie.posicao.x && player.ataque_d.posicao.y < enemie.posicao.y + enemie.altura && player.ataque_d.posicao.y + player.ataque_d.altura > enemie.posicao.y && player.atacando;

        if (enemie.vida > 0) {
            if (colisaoAtaque) {
                player.atacando = false
                enemie.danificado = true
                enemie.vida -= player.dano
                enemie.tempoDano = 12
                setTimeout(() => {
                    console.log(`${nome.value}, voce acertou!`)
                }, 200)
            }
        }
        requestAnimationFrame(loop);
    }
    loop();
}
startGame();

function rola() {
    let segundos = 0;
    let minutos = 0;
    let horas = 0;

    setInterval(() => {
        segundos++;
        
        if (segundos === 60) {
            segundos = 0;
            minutos++;
        }
        if (minutos === 60) {
            minutos = 0;
            horas++;
        }

        let segundoVisto = segundos < 10 ? "0" + segundos : segundos;
        let minutoVisto = minutos < 10 ? "0" + minutos : minutos;
        let horaVista = horas < 10 ? "0" + horas : horas;
        tempo.innerHTML = `Tempo de jogo: ${horaVista}:${minutoVisto}:${segundoVisto}`;
    }, 1000);
}
// Formulário
let nomeSalvo
if (!nomeSalvo) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        rola()
        infNome.textContent = `Nome de usuário: ${nome.value}`
        infDano.textContent = `Dano: ${player.dano}`
        infVelocidade.textContent = `Velocidade: ${player.velocidade}`
        parte1.style.display = "none";
        jogo.style.display = "flex";
        localStorage.setItem('Nome', nome.value)
        nomeSalvo = localStorage.getItem('Nome')
    });
} else {
    parte1.style.display = "none";
    jogo.style.display = "block";
}

btn_inf.addEventListener('click', () => inf.classList.toggle('aberto'))

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.chao = canvas.height / 1.7;
});