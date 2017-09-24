module.exports = class Player {
    constructor(opt) {
        this.socket = opt.socket;
        this.nickName = opt.nickName;
        this.room = null;
        this.status = 0;    // 0 大厅 1 房间 2 准备 3 游戏中
        this.post = null;
        this.sid = this.socket.id;
    }

    joinRoom(room, post) {
        room.players[post] = this;
        room.generatorList();

        this.post = post;
        this.room = room;
        this.status = 1;
    }

    leaveRoom() {
        this.room.players.splice(this.post, 1);
        this.post = null;
        this.status = 0;
    }

    ready() {
        this.status = 2;
    }

    getInfo() {
        return {
            nickName: this.nickName,
            room: this.room === null ? null : this.room.getInfo(),
            status: this.status,
            post: this.post,
            sid: this.sid
        }
    }
}