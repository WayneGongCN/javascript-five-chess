function ViewModel() {
    this.socketURL = 'http://127.0.0.1:8080';
    this.socket;

    this.isLogin = ko.observable(false);
    this.hasRoom = ko.observable(false);
    this.isMeDown = ko.observable(true);

    this.nickName = ko.observable('');

    this.roomList = ko.observableArray([]);
    this.playerList = ko.observableArray([]);
    this.player = ko.observable();

    this.init();
    window['vm'] = this;
};

ViewModel.prototype.init = function () {
    let self = this;
    this.socket = io(this.socketURL);

    //登陆
    this.socket.on('login', function (data) {
        let socket = this;
        self.onLogin(data, socket);
    });

    //加入房间    
    this.socket.on('joinRoom', function (data) {
        let socket = this;
        self.onJoinRoom(data, socket);
    })

    //离开房间
    this.socket.on('leaveRoom', function (data) {
        let socket = this;
        self.onLeaveRoom(data, socket);
    })

    //准备
    this.socket.on('ready', function (data) {
        let socket = this;
        self.onReady(data, socket);
    })


    this.socket.on('join', function (data) {
        let socket = this;
        self.onJoin(data, socket);
    })
}

//登陆
ViewModel.prototype.login = function () {
    this.socket.emit('login', { nickName: this.nickName() });
    this.nickName('');
}

ViewModel.prototype.onLogin = function (data, socket) {
    console.log('onLogin', data);
    let array = data.roomList.map(item => {
        return new Room(item);
    });
    let player = new Player(data.playerList.filter(x => x.sid === socket.id)[0]);

    this.roomList(array);
    this.player(player);
    this.playerList()[player.index] = player;
    this.isLogin(true);
}

//加入房间
ViewModel.prototype.joinRoom = function (room, post) {
    this.socket.emit('joinRoom', {
        roomId: room.roomId,
        post: post
    });
}

ViewModel.prototype.onJoinRoom = function (data, socket) {
    console.log('onJoinRoom', data)
    let sid = socket.id;
    let roomId = data.room.roomId;
    let post = data.post;

    let room = this.getRoomByRoomId(roomId);
    this.player().joinRoom(data.post, room)
    this.hasRoom(true);
}

//离开房间
ViewModel.prototype.leaveRoom = function (data, socket) {
    this.socket.emit('leaveRoom');
}

ViewModel.prototype.onLeaveRoom = function (data, socket) {
    console.log(data);
    this.player().leaveRoom()
    this.hasRoom(false)
}

//准备
ViewModel.prototype.ready = function (data, socket) {
    this.player().status(2)
    this.socket.emit('ready');
}

ViewModel.prototype.onReady = function (data, socket) {
    console.log('onReady', data);
    this.player().room().players()[data.post].ready();
}

//加入
ViewModel.prototype.onJoin = function (data, socket) {
    console.log('join', data);
}

ViewModel.prototype.getRoomByRoomId = function (roomId) {
    return this.roomList()[roomId];
}

ko.applyBindings(new ViewModel());