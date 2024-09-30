class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    this.difficulty = data.difficulty || "easy";
    this.playerPoints = 0; // Pontos do jogador
    this.computerPoints = 0; // Pontos do computador
    this.roundPoints = 1; // Quantos pontos a rodada vale
    this.currentRound = 0; // Rodada atual (máx. 3 por mão)
    this.playerRoundWins = 0; // Quantas rodadas o jogador venceu
    this.computerRoundWins = 0; // Quantas rodadas o computador venceu
    this.playerCardsPlayed = []; // Cartas jogadas pelo jogador
    this.computerCardsPlayed = []; // Cartas jogadas pelo computador
  }

  preload() {
    // Carregar imagens
    this.load.image("background", "assets/background.jpg");
    this.load.image("card_back", "assets/card_back.jpg");
    for (let i = 1; i <= 10; i++) {
      this.load.image(`paus_${i}`, `assets/${i}_of_paus.jpg`);
      this.load.image(`copas_${i}`, `assets/${i}_of_copas.jpg`);
      this.load.image(`espadas_${i}`, `assets/${i}_of_espadas.jpg`);
      this.load.image(`ouros_${i}`, `assets/${i}_of_ouros.jpg`);
    }
  }

  create() {
    this.add.image(400, 300, "background");

    this.createDeck();
    this.distributeCards();

    this.displayPlayerHand(this);
    this.displayOpponentHand(this);

    // Define o vira e a manilha
    this.vira = this.deck.pop();
    this.showVira(this.vira);
    this.manilha = this.calculateManilha(this.vira);

    // Exibe o placar inicial
    this.playerScoreText = this.add.text(50, 50, "Jogador: 0", {
      fontSize: "24px",
      fill: "#fff",
    });
    this.computerScoreText = this.add.text(600, 50, "Computador: 0", {
      fontSize: "24px",
      fill: "#fff",
    });

    console.log("Dificuldade: " + this.difficulty);
  }

  update() {
    // Lógica de atualização (se necessário)
  }

  createDeck() {
    let suits = ["paus", "copas", "espadas", "ouros"];
    this.deck = [];
    for (let suit of suits) {
      for (let value = 1; value <= 10; value++) {
        this.deck.push({ suit: suit, value: value, image: `${suit}_${value}` });
      }
    }
    Phaser.Utils.Array.Shuffle(this.deck);
  }

  distributeCards() {
    this.playerHand = [];
    this.opponentHand = [];
    for (let i = 0; i < 3; i++) {
      this.playerHand.push(this.deck.pop());
      this.opponentHand.push(this.deck.pop());
    }
  }

  displayPlayerHand(scene) {
    for (let i = 0; i < this.playerHand.length; i++) {
      let card = this.playerHand[i];
      let cardSprite = scene.add.image(150 + i * 150, 500, card.image);
      cardSprite.setInteractive();
      cardSprite.on("pointerdown", function () {
        scene.playCard(scene, card, cardSprite);
      });
    }
  }

  displayOpponentHand(scene) {
    for (let i = 0; i < this.opponentHand.length; i++) {
      scene.add.image(150 + i * 150, 100, "card_back"); // Exibe as cartas viradas do oponente
    }
  }

  showVira(vira) {
    this.add.text(350, 250, "Vira:", { fontSize: "24px", fill: "#fff" });
    this.add.image(450, 250, vira.image); // Exibe a carta que é o vira
  }

  calculateManilha(vira) {
    // A manilha é a próxima carta após o vira, seguindo a ordem circular
    let nextValue = vira.value + 1;
    if (nextValue > 10) nextValue = 1; // A manilha "circular" volta para o valor 1
    return nextValue;
  }

  playCard(scene, card, cardSprite) {
    cardSprite.x = 400;
    cardSprite.y = 300;
    this.playerHand = this.playerHand.filter((c) => c !== card); // Remove a carta jogada da mão do jogador
    this.playerCardsPlayed.push(card); // Armazena a carta jogada

    // Após o jogador jogar, o computador joga
    setTimeout(() => {
      scene.computerPlay(scene, card);
    }, 1000); // Adiciona um pequeno atraso para o turno do computador
  }

  computerPlay(scene, playerCard) {
    if (this.opponentHand.length > 0) {
      let computerCard = this.opponentHand.pop(); // O computador joga sua última carta
      let cardSprite = scene.add.image(400, 100, computerCard.image); // Exibe a carta jogada pelo computador
      this.computerCardsPlayed.push(computerCard); // Armazena a carta jogada
      this.compareCards(playerCard, computerCard); // Compara as cartas jogadas
    }
  }

  compareCards(playerCard, computerCard) {
    let winner;

    // Verifica se a carta jogada é manilha
    if (this.isManilha(playerCard) && !this.isManilha(computerCard)) {
      winner = "Jogador";
      this.playerRoundWins++;
    } else if (!this.isManilha(playerCard) && this.isManilha(computerCard)) {
      winner = "Computador";
      this.computerRoundWins++;
    } else if (playerCard.value > computerCard.value) {
      winner = "Jogador";
      this.playerRoundWins++;
    } else if (playerCard.value < computerCard.value) {
      winner = "Computador";
      this.computerRoundWins++;
    } else {
      winner = "Empate"; // Caso as cartas sejam iguais
    }

    // Incrementa a rodada
    this.currentRound++;

    // Checa se já jogaram as três rodadas
    if (this.currentRound === 3) {
      this.determineMatchWinner();
    }
  }

  isManilha(card) {
    return card && card.value === this.manilha;
  }

  determineMatchWinner() {
    let winner;

    if (this.playerRoundWins > this.computerRoundWins) {
      winner = "Jogador";
      this.playerPoints++;
    } else if (this.computerRoundWins > this.playerRoundWins) {
      winner = "Computador";
      this.computerPoints++;
    } else {
      winner = "Empate";
      // Em caso de empate nas três rodadas, ganha quem venceu a primeira rodada (se houve um vencedor)
      if (this.playerRoundWins > 0) {
        winner = "Jogador";
        this.playerPoints++;
      } else if (this.computerRoundWins > 0) {
        winner = "Computador";
        this.computerPoints++;
      }
    }

    this.updateScore();

    if (this.playerPoints >= 12 || this.computerPoints >= 12) {
      this.endGame(winner);
    } else {
      this.resetRound();
    }
  }

  updateScore() {
    this.playerScoreText.setText("Jogador: " + this.playerPoints);
    this.computerScoreText.setText("Computador: " + this.computerPoints);
  }

  resetRound() {
    this.currentRound = 0;
    this.playerRoundWins = 0;
    this.computerRoundWins = 0;
    this.playerCardsPlayed = [];
    this.computerCardsPlayed = [];
    this.createDeck();
    this.distributeCards();
    this.displayPlayerHand(this);
    this.displayOpponentHand(this);
  }

  endGame(winner) {
    alert(winner + " venceu o jogo!");
    this.scene.restart(); // Reinicia o jogo
  }
}

// Configuração do Phaser
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MenuScene, GameScene], // Primeiro MenuScene, depois GameScene
};

// Inicializando o Phaser com a configuração
const game = new Phaser.Game(config);
