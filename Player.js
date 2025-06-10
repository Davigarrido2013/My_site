class Player {
    constructor(c, canvas, ataque, cima, direita, esquerda) {
        this.c = c;
        this.canvas = canvas;
        this.pulos = 0;
        this.maxPulos = 2;
        this.dano = 2;

        this.largura = 50;
        this.altura = 100;
        this.velocidade = 3;

        this.velocidadeY = 0;
        this.gravidade = 0.5;
        this.chao = canvas.height / 1.7;
        this.atacando = false;

        this.posicao = {
            x: 10,
            y: this.chao
        };
        this.ataque_d = {
            largura: 75,
            altura: 30,
            posicao: {
                x: this.posicao.x + this.largura,
                y: this.posicao.y + 15
            }
        };

        this.movendo = {
            cima: false,
            esquerda: false,
            direita: false
        };

        // CONTROLES TOUCH
        if (canvas.width < 1000) {
            cima.addEventListener('pointerdown', () => {
                if (this.pulos < this.maxPulos) {
                    this.velocidadeY = -10;
                    this.pulos++;
                }
            });

            ataque.addEventListener('pointerdown', () => this.atacando = true);
            ataque.addEventListener('pointerup', () => this.atacando = false);

            esquerda.addEventListener('pointerdown', () => this.movendo.esquerda = true);
            esquerda.addEventListener('pointerup', () => this.movendo.esquerda = false);

            direita.addEventListener('pointerdown', () => this.movendo.direita = true);
            direita.addEventListener('pointerup', () => this.movendo.direita = false);
        }
    }

    atualizarAtaque = () => {
        const { ataque_d } = this
        ataque_d.posicao.x = this.posicao.x + this.largura;
        ataque_d.posicao.y = this.posicao.y + 25;
        ataque_d.largura = 75;
        ataque_d.altura = 30;
    }

    drawPlayer = () => {
        const { c, posicao: { x, y }, altura, largura } = this;
        c.fillStyle = '#00f';
        c.fillRect(x, y, largura, altura);
    }

    drawFloor = () => {
        const { c, canvas: { width, height }, altura, chao } = this;
        c.fillStyle = "#00b929";
        c.fillRect(0, chao + altura, width, height - chao);
    }

    verificarMovimento = () => {
        const { movendo: { esquerda, direita }, posicao, velocidade, canvas: { width }, largura } = this;

        if (esquerda && posicao.x > 0) {
            posicao.x -= velocidade;
        }

        if (direita && posicao.x + largura < width) {
            posicao.x += velocidade;
        }
    }

    atacar = () => {
        const { c, atacando, ataque_d } = this;

        if (atacando) {
            c.fillStyle = '#f00';
            c.fillRect(ataque_d.posicao.x, ataque_d.posicao.y, ataque_d.largura, ataque_d.altura);
        }
    }

    aplicarGravidade = () => {
        const { velocidadeY, gravidade, chao, posicao } = this;
        this.velocidadeY += gravidade;
        posicao.y += velocidadeY;

        if (posicao.y > chao) {
            posicao.y = chao;
            this.velocidadeY = 0;
            this.pulos = 0;
        }
    }

    update = () => {
        this.drawFloor();
        this.drawPlayer();
        this.atacar();
        this.verificarMovimento();
        this.aplicarGravidade();
        this.atualizarAtaque(); // Atualiza ataque_d para sempre estar correto
    }
}

export default Player