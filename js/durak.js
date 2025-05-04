function getGameIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("game_id") || "UNKNOWN";
}

function getPlayerId() {
    return Telegram.WebApp.initDataUnsafe.user?.id?.toString() || "0";
}

async function sendMove(card) {
    const game_id = getGameIdFromUrl();
    const player_id = getPlayerId();

    await fetch("http://localhost:8000/api/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id, player_id, card })
    });

    await updateGameState();
}

async function updateGameState() {
    const game_id = getGameIdFromUrl();
    const player_id = getPlayerId();

    const response = await fetch(`http://localhost:8000/api/game-state?game_id=${game_id}&player_id=${player_id}`);
    const state = await response.json();

    if (state.last_move && state.last_move.player !== player_id) {
        document.getElementById("enemyMove").innerText =
            "Соперник сходил: " + state.last_move.card;
    }
}

function generateCards() {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const hand = new Set();
    while (hand.size < 6) {
        const card = ranks[Math.floor(Math.random() * ranks.length)] + suits[Math.floor(Math.random() * suits.length)];
        hand.add(card);
    }
    return [...hand];
}

window.onload = function () {
    Telegram.WebApp.ready();

    const game_id = getGameIdFromUrl();
    document.getElementById("status").innerText =
        "Вы подключены к игре № " + game_id;

    const cards = generateCards();
    const container = document.getElementById("cardContainer");
    cards.forEach(card => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerText = card;
        div.onclick = () => sendMove(card);
        container.appendChild(div);
    });

    updateGameState();
};
