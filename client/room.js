class Room {
    constructor(item) {
        this.roomId = item.roomId;
        this.players = ko.observableArray(item.players.map(x => {
            return x && new Player(x);
        }));

        this.chessBoard = [];
    }
}