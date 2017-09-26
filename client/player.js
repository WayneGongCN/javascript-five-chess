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
        this.room().players.splice(this.post(), 1, null);
        this.room(null);
        this.post(null);
        this.status(0);
    }

    joinRoom(post, room) {
        this.post(post);
        this.room(room);
        room.players.splice(post, 1, this);
    }

    ready() {
        this.status(2);
    }
}