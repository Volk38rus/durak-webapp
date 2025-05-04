function getGameIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("game_id") || "UNKNOWN";
}

function sendCard(card) {
    const gameId = getGameIdFromUrl();
    const data = {
        action: "move",
        card: card,
        game_id: gameId
    };
    Telegram.WebApp.sendData(JSON.stringify(data));
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
    const gameId = getGameIdFromUrl();
    document.getElementById("status").innerText = "Вы подключены к игре № " + gameId;

    const cards = generateCards();
    const container = document.getElementById("cardContainer");
    cards.forEach(card => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerText = card;
        div.onclick = () => sendCard(card);
        container.appendChild(div);
    });
};
