class Room {
    constructor(item) {
        this.roomId = item.roomId;
        this.players = ko.observableArray(new Array(2).fill(null));
        this.chessBoard = [];
    }
}