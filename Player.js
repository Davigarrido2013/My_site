class Player {
    constructor(c, canvas, cima, baixo, ataque, dash, direita, esquerda) {
        this.c = c;
        this.canvas = canvas;
        this.dash = dash
        this.direcao
        this.tempo = 0
        this.direcaoId = 0
        this.largSprite = 0
        this.largTotal = 232
        this.vida = 25
        this.parado = true
        this.dano = 3
        this.playerCarregado = false
        this.tempoDash = 15
        this.cooldownDash = 120
        this.dandoDash = false
        this.playerimg = new Image()

        this.largura = 25;
        this.altura = 50;
        this.velocidade = 3;

        this.chao = canvas.height / 1.7;
        this.atacando = false;

        this.posicao = {
            x: 10,
            y: (this.canvas.height/2) - (this.altura/2)
        };
        this.ataque_d = {
            largura: 40,
            altura: 20,
            posicao: {
                x: this.posicao.x + this.largura,
                y: this.posicao.y + 15
            }
        };

        this.movendo = {
            esquerda: false,
            cima: false,
            baixo: false,
            direita: false
        };

        this.playerimg.src = "https://jogoveio.com.br/wp-content/uploads/2018/04/personagem-sprite-sheet-jogoveio-234x350.png"
        this.playerimg.onload = () => this.playerCarregado = true

        // CONTROLES TOUCH
        if (canvas.width < 1000) {
            ataque.addEventListener('pointerdown', () => this.atacando = true);
            ataque.addEventListener('pointerup', () => this.atacando = false);

            dash.addEventListener('pointerdown', () => {
                if (this.cooldownDash === 0 && !this.dandoDash) {
                    this.dandoDash = true
                    this.tempoDash = 15
                    dash.disabled = true
                }
            });

            esquerda.addEventListener('pointerdown', () => {
                this.movendo.esquerda = true
                this.parado = false
                this.direcaoId = 2
            });
            esquerda.addEventListener('pointerup', () => {
                this.movendo.esquerda = false
                this.parado = true
            });

            direita.addEventListener('pointerdown', () => {
                this.movendo.direita = true
                this.direcaoId = 3
                this.parado = false
            });
            direita.addEventListener('pointerup', () => {
                this.movendo.direita = false
                this.parado = true
            });

            cima.addEventListener('pointerdown', () => {
                this.movendo.cima = true
                this.direcaoId = 1
                this.parado = false
            });
            cima.addEventListener('pointerup', () => {
                this.movendo.cima = false
                this.parado = true
            });

            baixo.addEventListener('pointerdown', () => {
                this.movendo.baixo = true
                this.direcaoId = 0
                this.parado = false
            });
            baixo.addEventListener('pointerup', () => {
                this.movendo.baixo = false
                this.parado = true
            });
        }
    }

    atualizarAtaque = () => {
        const { ataque_d } = this
        ataque_d.posicao.x = this.posicao.x + this.largura;
        ataque_d.posicao.y = this.posicao.y + 15;
        ataque_d.largura = 40;
        ataque_d.altura = 20;
    }

    drawPlayer = () => {
    const { c, largSprite, direcao, parado, velocidade, playerimg, largTotal, direcaoId, playerCarregado, posicao: { x, y }, altura, largura } = this;

    if (playerCarregado) {
        if (largSprite < largTotal) {
            if (!parado) {
                if (this.tempo >= velocidade * 3) {
                    this.largSprite += 58;
                    this.tempo = 0;
                } else {
                    this.tempo++;
                }
            } else {
                if (direcao === "direita") {
                    this.largSprite = 58
                } else {
                    this.largSprite = 0
                }
            }
        } else {
            this.largSprite = 0;
        }
        c.drawImage(playerimg, largSprite, direcaoId * 87, 58, 87, x, y, largura, altura);
    }
}

    drawFloor = () => {
        const { c, canvas: { width, height }, altura, chao } = this;
        c.fillStyle = "#8f8f8f";
        c.fillRect(0, chao + 100, width, height - chao);
    }

    verificarMovimento = () => {
        const {
            movendo: { cima, baixo, esquerda, direita },
            dash,
            chao,
            dandoDash,
            tempoDash,
            cooldownDash,
            direcao,
            posicao,
            canvas: { width },
            largura
        } = this;
    
        // Movimento básico
        if (esquerda && !direita && posicao.x > 0) {
            this.direcao = "esquerda";
            posicao.x -= this.velocidade;
        }
    
        if (direita && !esquerda && posicao.x + largura < width) {
            this.direcao = "direita";
            posicao.x += this.velocidade;
        }
        

        if (cima && !baixo && posicao.y > 125) {
            this.direcao = "cima"
            posicao.y -= this.velocidade
        }

        if (baixo && !cima && posicao.y < chao + 50) {
            this.direcao = "baixo"
            posicao.y += this.velocidade
        }

        // Dash
        if (dandoDash) {
            if (tempoDash > 0) {
                const dashSpeed = 10;
                if (direcao === "direita" && posicao.x + largura < width) {
                    posicao.x += dashSpeed;
                }
                if (direcao === "esquerda" && posicao.x > 0) {
                    posicao.x -= dashSpeed;
                }
                if (direcao === "cima" && posicao.y > 125) {
                    posicao.y -= dashSpeed
                }
                if (direcao === "baixo" && posicao.y < chao + 50) {
                    posicao.y += dashSpeed
                }

                this.tempoDash--
            } else {
                this.dandoDash = false // Encerra o dash
                this.cooldownDash = 120
                dash.disabled = true
            }
        } else if (this.cooldownDash > 0) {
            this.cooldownDash--
            if (this.cooldownDash === 0) {
                dash.disabled = false
            }
        }
    }

    atacar = () => {
        const { c, atacando, ataque_d } = this;

        if (atacando) {
            c.fillStyle = '#f00'
            c.fillRect(ataque_d.posicao.x, ataque_d.posicao.y, ataque_d.largura, ataque_d.altura);
        }
    }

    update = () => {
        this.drawFloor();
        if (this.vida > 0) {
            this.drawPlayer();
            this.atacar();
            this.verificarMovimento();
            this.atualizarAtaque();
        }
    }
}

export default Player