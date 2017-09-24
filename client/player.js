class Player {
    constructor(player){
        this.nickName = ko.observable(player.nickName);
        this.post = ko.observable(player.post);
        this.room = ko.observable();
        this.status = ko.observable(player.status);
        this.sid = player.sid;
    }

    leaveRoom(){
       this.room(null);
       this.post(null);
       this.status(0);
    }
}