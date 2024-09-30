// Função para o computador jogar uma carta
function computerPlay(scene) {
  let card = opponentHand.pop();
  let cardSprite = scene.add.image(400, 100, card.image);
  playedCards.push(card);
  // Aqui você pode adicionar lógica para o computador escolher cartas com base na dificuldade
}

// Função para pedir Truco (ou 6, 9, 12)
function askTruco(scene, playerOrComputer) {
  let trucoRequested = confirm(playerOrComputer + " pediu Truco! Aceitar?");
  if (trucoRequested) {
    roundPoints += 3; // Aumenta os pontos da rodada
  } else {
    // Finaliza a rodada se o truco for recusado
    endRound(playerOrComputer === "Jogador" ? "Computador" : "Jogador");
  }
}

// Função para encerrar a rodada e dar os pontos para o vencedor
function endRound(winner) {
  if (winner === "Jogador") {
    playerPoints += roundPoints;
  } else {
    opponentPoints += roundPoints;
  }
  roundPoints = 1; // Reseta os pontos para a próxima rodada
  checkGameEnd();
}

// Verifica se algum jogador atingiu 12 pontos e encerra o jogo
function checkGameEnd() {
  if (playerPoints >= 12 || opponentPoints >= 12) {
    let winner = playerPoints >= 12 ? "Jogador" : "Computador";
    endGame(winner);
  }
}

// Função para finalizar o jogo
function endGame(winner) {
  alert(winner + " venceu a partida!");
  resetGame();
}

// Reseta o jogo para começar de novo
function resetGame() {
  playerPoints = 0;
  opponentPoints = 0;
  createDeck();
  distributeCards();
}
