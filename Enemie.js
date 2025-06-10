class Enemie {
    constructor(c, canvas) {
        this.c = c
        this.canvas = canvas
        this.altura = 100
        this.largura = 50
        this.vida = 10
        this.velocidade = 3
        this.chao = this.canvas.height / 1.7
        this.posicao = {
            x: canvas.width - 90,
            y: this.chao
        }
        this.velocidadeY = 0;
        this.gravidade = 0.5;
        this.danificado = false;
        this.tempoDano = 0;
    }
    drawEnemie = () => {
        const { c, danificado, vida, tempoDano, posicao: { x, y }, largura, altura } = this;
        c.fillStyle = '#0f0';
        c.fillRect(x, y, largura, altura);
        if (danificado && tempoDano > 0 && vida > 0) {
            c.fillStyle = '#ad3636';
            c.fillRect(x, y, largura, altura);
            this.tempoDano--;
        } else {
            c.fillStyle = '#0f0';
            this.danificado = false;
            c.fillRect(x, y, largura, altura);
        }
    }

    aplicarGravidade = () => {
        const { velocidadeY, gravidade, chao, posicao } = this;
        this.velocidadeY += gravidade;
        posicao.y += velocidadeY;

        if (posicao.y > chao) {
            posicao.y = chao;
            this.velocidadeY = 0;
        }
    }

    execute = () => {
        const { c, posicao: { x, y }, vida } = this
        this.aplicarGravidade()
        if (vida > 0) {
            c.fillStyle = "#f00"
            c.fillText(`Inimigo - ${vida}`, x - 20, y - 10)
            this.drawEnemie()
        }
    }
}

export default Enemie