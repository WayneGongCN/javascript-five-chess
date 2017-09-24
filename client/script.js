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
    this.chat = ko.observable();
    this.room = ko.observable();

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
    this.nickName()
}

ViewModel.prototype.onLogin = function (data) {
    console.log('onLogin', data);
    let array = data.roomList.map(function (item, index) {
        return new Room(index);
    });
    this.roomList(array);
    this.player(new Player(data.player));
    this.isLogin(true);
}

//加入房间
ViewModel.prototype.joinRoom = function (room, post) {
    this.socket.emit('joinRoom', {
        roomId: room.id,
        post: post
    });
}

ViewModel.prototype.onJoinRoom = function (data, socket) {
    console.log('onJoinRoom', data)
    let sid = socket.id;
    if (sid === this.player().sid) {
        this.room(new Room(data));
        this.hasRoom(true);
    }
}

//离开房间
ViewModel.prototype.leaveRoom = function (data, socket) {
    this.socket.emit('leaveRoom');
}

ViewModel.prototype.onLeaveRoom = function (data, socket) {
    console.log(data);
    if (this.player().sid == socket.id) {
        this.player().leaveRoom()
        this.room(null);
        this.hasRoom(false)
    }
}

//准备
ViewModel.prototype.ready = function (data, socket) {
    this.player().status(2)
    this.socket.emit('ready');
}

ViewModel.prototype.onReady = function (data, socket) {
    console.log('onReady', data);
    let players = data.room.players;
    if(players[0].status == players[1].status && players[0].status === 2){
        alert('Start!')
    }
}

//加入
ViewModel.prototype.onJoin = function (data, socket) {
    console.log('join', data);
    if('player' in data){
        this.playerList.push(new Player(data.player));
    }else if('room' in data){
        this.roomList()[data.room.roomId].players()[0]
    }
}

ko.applyBindings(new ViewModel());





// const ROW = 15;

// function ViewModel() {
//     this.allBoxs = ko.observable(GeneratorList());      //所有格子二维数组
//     this.isBlack = ko.observable(true);                 //下一步是否黑子
//     this.winer = ko.observable(null);                   //赢家
//     this.history = [];                                  //历史
//     this.lineTotal = 0;                                 //某方向连子个数
// };

// //落子
// ViewModel.prototype.down = function (data,ev) {
//     // if (data.hasChess()) return;
//     // if (this.winer()) this.rePlay();
//     // // change
//     // data.hasChess(true);
//     // data.value(this.isBlack() ? 'X' : 'O');

//     // // add history
//     // this.history.push({
//     //     x: data.x,
//     //     y: data.y
//     // });

//     // //判断输赢
//     // this.referee(data);

//     // //换手
//     // this.isBlack(!this.isBlack());
//     var pageX = ev.pageX;
//     var pageY = ev.pageY;
//     var x = parseInt((pageX - $(this).offset().left - 5) / 35);
//     var y = parseInt((pageY - $(this).offset().top - 5) / 35);
//     console.log(ev)


// 		// 	g_Info.allowDraw = false;
// 		// 	$("div.room_chess").css("cursor", "no-drop");
// 		// }else{
// 		// 	g_Info.allowDraw = true;
// 		// 	$("div.room_chess").css("cursor", "pointer");
// }

// //悔棋
// ViewModel.prototype.goBack = function (data) {
//     if (this.winer()) this.rePlay();
//     if (this.history.length === 0) return;

//     let step = this.history.pop();
//     let x = step.x;
//     let y = step.y;
//     let box = this.allBoxs()[y][x];

//     box.hasChess(false);
//     box.value(null);
//     this.isBlack(!this.isBlack());
// }

// //设置方向
// ViewModel.prototype.referee = function (item) {
//     //四个方向
//     let change = [[0, -1], [-1, 0], [-1, -1], [1, -1]];

//     change.forEach(c => {
//         //朝某个方向递归
//         this.test(item, c);

//         //不足五连珠朝反方向递归
//         if (this.lineTotal <= 4) {
//             //反方向
//             let reveis = c.map(x => {
//                 return x * -1;
//             });

//             this.test(item, reveis)
//             this.lineTotal = 0
//         };
//     })
// }

// //判断连子
// ViewModel.prototype.test = function (item, change, total = 0) {
//     let cx = item.x + change[0];
//     let cy = item.y + change[1];

//     let isInBoard = (cx >= 0 && cx <= ROW - 1) && (cy >= 0 && cy <= ROW - 1);
//     let cItem = isInBoard && this.allBoxs()[cy][cx];
//     let isNull = cItem !== null;

//     if (isNull &&
//         isInBoard &&
//         item.value() === cItem.value()
//     ) {
//         total += 1;
//         //递归
//         this.test(cItem, change, total);
//     } else {
//         //跳出
//         this.lineTotal += total;
//     }

//     //win
//     if (this.lineTotal >= 4) {
//         this.win();
//     };
// }


// ViewModel.prototype.win = function () {
//     this.lineTotal = 0;
//     this.winer(this.isBlack() ? 'X' : 'O');
//     alert(`${this.winer()} Win !`);
// }

// ViewModel.prototype.rePlay = function () {
//     this.allBoxs(GeneratorList());
//     this.winer(null);
//     this.history = [];
//     this.isBlack(true);
// }

// function GeneratorList() {
//     let array = new Array(ROW).fill(null);

//     //生成二维数组
//     let result = array.map((value, y) => {
//         return array.map((value, x) => {
//             return {
//                 hasChess: ko.observable(false),
//                 value: ko.observable(null),
//                 x: x,
//                 y: y
//             }
//         });
//     });
//     return result;
// }

// ko.applyBindings(new ViewModel());