class Enemie {
    constructor(player, c, canvas) {
        this.c = c
        this.player = player
        this.canvas = canvas
        this.altura = 50
        this.dano = 2
        this.largura = 25
        this.knockback = 5
        this.cooldownAtaque = 60
        this.vida = 10
        this.atacando = false
        this.velocidade = 1.5
        this.chao = this.canvas.height / 1.7
        this.posicao = {
            x: Math.floor(Math.random() * (this.canvas.width - this.largura)),
            y: Math.floor(Math.random() * (this.chao - 75)) + 125
        }
        this.velocidadeY = 0;
        this.gravidade = 0.5;
        this.danificado = false;
        this.tempoDano = 0;

        this.ataque_d = {
            largura: 40,
            altura: 20,
            posicao: {
                x: this.posicao.x + this.largura,
                y: this.posicao.y + 15
            }
        };
    }

    drawEnemie = () => {
        const { c, danificado, knockback, velocidade, vida, tempoDano, player, posicao: { x, y }, largura, altura } = this
        c.fillStyle = '#0f0';
        c.fillRect(x, y, largura, altura);
        if (danificado && tempoDano > 0 && vida > 0) {
            this.posicao.x += knockback
            c.fillStyle = '#ad3636';
            c.fillRect(x, y, largura, altura);
            this.tempoDano--;
        } else {
            c.fillStyle = '#0f0';
            this.danificado = false;
            c.fillRect(x, y, largura, altura);
        }
    }

    atualizarAtaque = () => {
        const { posicao, largura, ataque_d } = this

        ataque_d.posicao.x = posicao.x + largura;
        ataque_d.posicao.y = posicao.y + 15;
        ataque_d.largura = 40;
        ataque_d.altura = 20;
    }

    atacarPlayer = () => {
        const { ataque_d, atacando, posicao, c } = this
        if (atacando) {
            c.fillStyle = '#f00';
            c.fillRect(ataque_d.posicao.x, ataque_d.posicao.y, ataque_d.largura, ataque_d.altura);
        }
    }

    moverParaJogador(player) {
        const { vida, danificado, cooldownAtaque, posicao, velocidade, largura, canvas: { width } } = this;
        if (vida <= 0) return;
        if (!danificado) {
            if (player.posicao.x < posicao.x) {
                this.posicao.x -= velocidade;
            } else if (player.posicao.x > posicao.x) {
                this.posicao.x += velocidade;
            }
            if (player.posicao.y < posicao.y) {
                this.posicao.y -= velocidade
            } else if (player.posicao.y > posicao.y) {
                this.posicao.y += velocidade
            }
        }
        const distancia = Math.abs(player.posicao.x - this.posicao.x);
        if (distancia < 50) {
            if (cooldownAtaque === 0) {
                this.atacando = true;
                this.cooldownAtaque = 60
            } else {
                this.atacando = false
                this.cooldownAtaque--
            }
        } else {
            this.atacando = false;
        }
    }

    execute = () => {
        const { player, c, posicao: { x, y }, vida } = this
        if (vida > 0) {
            this.atualizarAtaque()
            this.atacarPlayer()
            c.fillStyle = "#f00"
            c.fillText(`Inimigo - ${vida}`, x - 20, y - 10)
            this.drawEnemie()
            this.moverParaJogador(player)
        }
    }
}

export default Enemie