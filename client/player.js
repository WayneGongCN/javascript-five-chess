class Player {
    constructor(player) {
        this.nickName = ko.observable(player.nickName);
        this.post = ko.observable(player.post);
        this.room = ko.observable();
        this.status = ko.observable(player.status);
        this.sid = player.sid;
        this.index = player.index;
    }

    leaveRoom() {
        this.room()[this.post()] = null;
        this.room(null);
        this.post(null);
        this.status(0);
    }

    joinRoom(post,room) {
        this.post(post);
        this.room(room);
        room.players()[post] = this;
    }

    ready(){
        this.status(2);
    }
}