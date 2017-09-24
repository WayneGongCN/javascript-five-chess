const Room = require('./room');
const Player = require('./player');

const io = require('socket.io')();

module.exports = class FiveChess {
    constructor(cfg) {
        this._instanc;

        this.config = {
            roomTotal: cfg.roomTotal || 100,
            listenPort: cfg.listenPort || 8080,
            maxClientNum: cfg.maxClientNum || 300
        };

        this.roomList;
        this.playerList;

        this.init();
    }

    init() {
        this.playerList = [];

        this.initRoomList();
        this.initSocket();
    }

    initRoomList() {
        this.roomList = new Array(this.config.roomTotal)
            .fill(null)
            .map((item, index) => {
                return new Room(index);
            })
    }

    initSocket() {
        let self = this;

        io.listen(this.config.listenPort);

        io.sockets.on('connection', function (socket) {
            //断开
            socket.on("disconnect", function (data) {
                let socket = this;
                self.onClose(data, socket);
            });

            //登陆
            socket.on("login", function (data) {
                let socket = this;
                self.onLogin(data, socket);
            });

            //加入房间
            socket.on("joinRoom", function (data) {
                let socket = this;
                self.onJoinRoom(data, socket);
            });

            //离开房间
            socket.on("leaveRoom", function (data) {
                let socket = this;
                self.onLeaveRoom(data, socket);
            });

            //准备
            socket.on("ready", function (data) {
                let socket = this;
                self.onReady(data, socket);
            });

            //消息
            socket.on('message', function (data) {
                let socket = this;
                self.onMessage(data, socket);
            });
            //落子
            socket.on("drawChess", function (data) {
                let socket = this;
                self.onDrawChess(data, socket);
            });
        });
    }

    onClose(data, socket) {
        let sid = socket.id;
        let index;
        this.playerList.forEach((item, i) => {
            if (item.sid === sid) {
                index = i;
            }
        });
        if (index != undefined) {
            let player = this.playerList[index];
            player.leaveRoom();
            this.playerList.splice(index, 1);
        }
    }

    onLogin(data, socket) {
        let sid = socket.id;
        let players = this.playerList;

        if (players.length > this.config.maxClientNum) {
            socket.emit('error', { msg: '超过在线人数' })
        } else {
            let newPlayer = new Player({
                nickName: data.nickName,
                socket: socket
            });
            players.push(newPlayer);
            io.sockets.emit('join', {
                player: newPlayer.getInfo()
            });

            socket.emit('login', {
                player: newPlayer.getInfo(),
                roomList: new Array(100)
            });
        }
    }

    onJoinRoom(data, socket) {
        let sid = socket.id;
        let roomId = data.roomId;
        let room = this.roomList[roomId];
        let post = data.post;
        let player = this.getPlayerBySid(sid);

        if (room.players[post] === null) {
            player.joinRoom(room, post);
            socket.emit('joinRoom', room.getInfo())
            io.sockets.emit('join', {
                room: room.getInfo()
            })
        }
    }

    onLeaveRoom(data, socket) {
        let sid = socket.id;
        let player = this.getPlayerBySid(sid);

        player.leaveRoom();
        io.sockets.emit('leaveRoom', {
            player: player.getInfo(),
            room: player.room.getInfo()
        });

        player.room = null;
    }

    onReady(data, socket) {
        let sid = socket.id;
        let PR = this.getPlayerAndRoomBySid(sid);

        PR.player.ready();
        PR.room.players.forEach(x => {
            if (x) {
                x.socket.emit('ready', PR.player.getInfo())
            }
        });
    }

    onMessage(data, socket) {

    }

    onDrawChess(data, socket) {
        let sid = socket.id;
        let player = this.getPlayerBySid(sid);

        player.room.drawChess(data, sid);
    }

    getPlayerBySid(sid) {
        return this.playerList.filter(x => x.sid === sid)[0];
    }

    getRoomByRoomId(roomId) {
        return this.roomList[roomId];
    }

    getPlayerAndRoomBySid(sid) {
        let player = this.playerList.filter(x => x.sid === sid)[0];
        let room = player.room;
        return {
            player: player,
            room: room
        };
    }
}
