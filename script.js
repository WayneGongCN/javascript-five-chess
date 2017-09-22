const ROW = 15;

function ViewModel() {
    this.allBoxs = ko.observable(GeneratorList());      //所有格子二维数组
    this.isBlack = ko.observable(true);                 //下一步是否黑子
    this.winer = ko.observable(null);                   //赢家
    this.history = [];                                  //历史
    this.lineTotal = 0;                                 //某方向连子个数
};

//落子
ViewModel.prototype.down = function (data) {
    if (data.hasChess()) return;
    if (this.winer()) this.rePlay();
    // change
    data.hasChess(true);
    data.value(this.isBlack() ? 'X' : 'O');

    // add history
    this.history.push({
        x: data.x,
        y: data.y
    });

    //判断输赢
    this.referee(data);

    //换手
    this.isBlack(!this.isBlack());
}

//悔棋
ViewModel.prototype.goBack = function (data) {
    if (this.winer()) this.rePlay();
    if (this.history.length === 0) return;

    let step = this.history.pop();
    let x = step.x;
    let y = step.y;
    let box = this.allBoxs()[y][x];

    box.hasChess(false);
    box.value(null);
    this.isBlack(!this.isBlack());
}

//设置方向
ViewModel.prototype.referee = function (item) {
    //四个方向
    let change = [[0, -1], [-1, 0], [-1, -1], [1, -1]];

    change.forEach(c => {
        //朝某个方向递归
        this.test(item, c);

        //不足五连珠朝反方向递归
        if (this.lineTotal <= 4) {
            //反方向
            let reveis = c.map(x => {
                return x * -1;
            });

            this.test(item, reveis)
            this.lineTotal = 0
        };
    })
}

//判断连子
ViewModel.prototype.test = function (item, change, total = 0) {
    let cx = item.x + change[0];
    let cy = item.y + change[1];

    let isInBoard = (cx >= 0 && cx <= ROW - 1) && (cy >= 0 && cy <= ROW - 1);
    let cItem = isInBoard && this.allBoxs()[cy][cx];
    let isNull = cItem !== null;

    if (isNull &&
        isInBoard &&
        item.value() === cItem.value()
    ) {
        total += 1;
        //递归
        this.test(cItem, change, total);
    } else {
        //跳出
        this.lineTotal += total;
    }

    //win
    if (this.lineTotal >= 4) {
        this.win();
    };
}


ViewModel.prototype.win = function () {
    this.lineTotal = 0;
    this.winer(this.isBlack() ? 'X' : 'O');
    alert(`${this.winer()} Win !`);
}

ViewModel.prototype.rePlay = function () {
    this.allBoxs(GeneratorList());
    this.winer(null);
    this.history = [];
    this.isBlack(true);
}

function GeneratorList() {
    let array = new Array(ROW).fill(null);

    //生成二维数组
    let result = array.map((value, y) => {
        return array.map((value, x) => {
            return {
                hasChess: ko.observable(false),
                value: ko.observable(null),
                x: x,
                y: y
            }
        });
    });
    return result;
}

ko.applyBindings(new ViewModel());