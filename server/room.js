module.exports = class Room {
    constructor(roomId) {
        this.roomId = roomId;
        this.isPlaying = false;
        this.chessBoard = [];
        this.players = new Array(2).fill(null);
    }

    getRoomInfo() {
        return {
            roomId: this.roomId,
            players: this.players.map(x => {
                return x && x.getUserInfo();
            })
        }
    }

    // generatorList() {
    //     let array = new Array(15).fill(null);

    //     //生成二维数组
    //     let result = array.map((value, y) => {
    //         return array.map((value, x) => {
    //             return {
    //                 hasChess: false,
    //                 value: null,
    //                 x: x,
    //                 y: y
    //             }
    //         });
    //     });

    //     this.chessBoard = result;
    // }

    // drawChess(data, sid) {

    // }
}