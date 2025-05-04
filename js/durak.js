function getGameIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("game_id") || "UNKNOWN";
}

function sendMove() {
    const gameId = getGameIdFromUrl();
    const moveData = {
        action: "move",
        card: "6♠",
        game_id: gameId
    };
    Telegram.WebApp.sendData(JSON.stringify(moveData));
}

window.onload = function () {
    const gameId = getGameIdFromUrl();
    document.getElementById("status").innerText = "Вы подключены к игре № " + gameId;
    Telegram.WebApp.ready();
};