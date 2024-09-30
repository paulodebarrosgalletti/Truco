class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  preload() {
    // Carregar qualquer recurso de imagem ou som para o menu, se necessário
    this.load.image("background", "assets/background.jpg");
  }

  create() {
    // Exibe o fundo
    this.add.image(400, 300, "background");

    // Exibe o texto "Jogo de Truco" como título
    this.add.text(300, 150, "Jogo de Truco", {
      fontSize: "48px",
      fill: "#fff",
    });

    // Botão "Iniciar Jogo"
    let startButton = this.add
      .text(350, 300, "Iniciar Jogo", { fontSize: "32px", fill: "#0f0" })
      .setInteractive()
      .on("pointerdown", () => this.startGame());

    // Adiciona dificuldades (opcional)
    this.difficulty = "easy"; // Padrão

    let easyButton = this.add
      .text(350, 400, "Fácil", { fontSize: "28px", fill: "#fff" })
      .setInteractive()
      .on("pointerdown", () => this.setDifficulty("easy"));

    let hardButton = this.add
      .text(450, 400, "Difícil", { fontSize: "28px", fill: "#fff" })
      .setInteractive()
      .on("pointerdown", () => this.setDifficulty("hard"));
  }

  // Função para iniciar o jogo
  startGame() {
    this.scene.start("GameScene", { difficulty: this.difficulty }); // Passa a dificuldade para a próxima cena
  }

  // Função para definir dificuldade
  setDifficulty(level) {
    this.difficulty = level;
    console.log("Dificuldade definida para: " + level);
  }
}
