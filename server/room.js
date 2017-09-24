module.exports = class Room {
    constructor(id) {
        this.id = id;
        this.players = new Array(2).fill(null);

        this.chessBoard = []
    }

    getInfo() {
        return {
            roomId: this.id,
            players: this.players.map(x => {
                return {
                    sid: x ? x.sid : null,
                    nickName: x ? x.nickName : null,
                    post: x ? x.post : null,
                    status: x ? x.status : null,
                }
            })
        }
    }

    generatorList() {
        let array = new Array(15).fill(null);

        //生成二维数组
        let result = array.map((value, y) => {
            return array.map((value, x) => {
                return {
                    hasChess: false,
                    value: null,
                    x: x,
                    y: y
                }
            });
        });

        this.chessBoard = result;
    }

    drawChess(data, sid) {

    }
}