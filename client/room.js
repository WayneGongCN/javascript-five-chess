class Room{
    constructor(item){
        this.id = item;
        this.players = ko.observable(new Array(2).fill(null));
        
        this.chessBoard = [];
    }
}