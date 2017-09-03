GREAT_BORDER_COLOR = "#724938";
LESS_BORDER_COLOR = "#B35C37";
BACKGROUND_COLOR = "#FFFFFF";
SELECTED_COLOR = "#DB8E71"; //"#AF5F3C";
RELATED_COLOR = "#EEDED7";
UNFIXED_COLOR = LESS_BORDER_COLOR; //"#DB8E71";
SAME_COLOR = "#F9BF45";
MARKED_COLOR = "#F4A7B9";
PAUSE_COLOR = "#AAAAAA";
BLACK_COLOR = "#000000";

ANY_OPERATION = false;

// initializer
function initGameTable() {
    for (var i = 0; i < 9; ++i) {
        var tr = $("<tr></tr>");
        for (var j = 0; j < 9; ++j) {
            var td = $("<td class=\"cell\" id=\"cell" + i + j + "\" onclick=\"onCellClick(" + i + ", " + j + ")\">" + i + j + "</td>");

            if (i % 3 == 0 && i > 0) td.css({ "border-top-width" : "2px", "border-top-color" : GREAT_BORDER_COLOR });
            if (i == 0) td.css({ "border-top-width" : "4px", "border-top-color" : GREAT_BORDER_COLOR });
            if (i % 3 == 2 && i < 8) td.css({ "border-bottom-width" : "2px", "border-bottom-color" : GREAT_BORDER_COLOR });
            if (i == 8) td.css({ "border-bottom-width" : "4px", "border-bottom-color" : GREAT_BORDER_COLOR });
            if (j % 3 == 0 && j > 0) td.css({ "border-left-width" : "2px", "border-left-color" : GREAT_BORDER_COLOR });
            if (j == 0) td.css({ "border-left-width" : "4px", "border-left-color" : GREAT_BORDER_COLOR });
            if (j % 3 == 2 && j < 8) td.css({ "border-right-width" : "2px", "border-right-color" : GREAT_BORDER_COLOR });
            if (j == 8) td.css({ "border-right-width" : "4px", "border-right-color" : GREAT_BORDER_COLOR });

            tr.append(td);
        }

        $("table.table_main").append(tr);
    }

    var tr2 = $("<tr></tr>");
    
    for (var i = 1; i <= 9; ++i) tr2.append("<td onclick=\"onNumberClick(" + i + ")\" id = \"number" + i + "\">" + i + "</td>");
    tr2.append("<td id=\"markButton\" onclick=\"onMarkClick()\"><p class=\"mediumchars\">标记</p></td>");
    tr2.append("<td onclick=\"onClearClick()\"><p class=\"mediumchars\">清空</p></td>");

    $("table.table_numbers").append(tr2);
}

DIFFICULTIES = 10
function initDifficultyTable() {
    var tr = $("<tr></tr>");

    for (var i = 1; i <= DIFFICULTIES; ++i) tr.append("<td onclick=\"onDifficultyChosen(" + i + ")\" id = \"diff" + i + "\">" + i + "</td>");
    $("table.table_difficulty").append(tr);
}

window.onload = function() {
    new QWebChannel(qt.webChannelTransport, function(channel) {
        window.conn = channel.objects.conn;

        conn.sendPuzzle.connect(function(puzzle) {
            obj = JSON.parse(puzzle);

            board = obj.board;
            fixed = obj.fixed;

            RAW_BOARD = board;
            RAW_FIXED = fixed;

            gameStartTrue();
        })
    });
}

// the cell class
function Cell(i, j, fixed) {
    this.i = i;
    this.j = j;
    this.selector = "#cell" + i + j;
    this.fixed = fixed;

    this.content = Cell.emptyContent();

    this.nums = [];
}

Cell.emptyContent = function() {
    var rv = [];
    for (var i = 0; i <= 9; ++i) rv.push(false);

    return rv;
}

Cell.setBackgroundColor = function(color) {
    $(this.selector).css("background-color", color);
}

        // content = bool[1 ~ 9]
Cell.setContent = function(content) {
    this.nums = [];
    for (var i = 1; i <= 9; ++i) if (this.content[i] = content[i]) this.nums.push(i);
}

Cell.setNums = function(nums) {
    this.content = Cell.emptyContent();
    this.nums = nums;
    for (var i in nums) this.content[nums[i]] = true;
}

Cell.getContent = function() { return this.content; }
Cell.getNums = function() { return this.nums; }

Cell.calcNums = function() {
    this.nums = [];
    for (var i = 1; i <= 9; ++i) if (this.content[i]) this.nums.push(i);
}

Cell.showContent = function() {
    len = this.nums.length;
    target = $(this.selector);

    if (len == 0) {
        target.text("　");
    } else if (len == 1) {
        target.text(this.nums[0]);
    } else { 
        cont = ""
        align = len <= 4 ? 2 : 3;
        fontClass = len <= 4 ? "mediumchars" : "smallchars";

        cont += this.nums[0];
        for (var i = 1; i < len; ++i) {
            cont += (i % align == 0) ? "<br/>" : " ";
            cont += this.nums[i];
        }

        target.html("<p class=\"" + fontClass + "\">" + cont + "</p>");
    }

    if (this.fixed) target.css("color", BLACK_COLOR);
    else target.css("color", UNFIXED_COLOR);
}

Cell.prototype = Cell;

// handler
function onStartClick() {
    setPause(false);
}

function onPauseClick() {
    setPause(true);
}

function onRestartClick() {
    if (ANY_OPERATION) gameStartTrue();
    else gameStart();
}

function onExitClick() {
    resetTimer();
    $(".horizen_wrapper").fadeOut();

    $("#difficulty").delay(200).slideDown(300);
    $("#game").delay(200).slideUp(300);
}

function onCellClick(i, j) {
    if (PAUSING) return;

    if (anyCellSelected()) {
        currI = CELL_SELECTED.i;
        currJ = CELL_SELECTED.j;

        cancelCellSelection();
        if ((currI == i && currJ == j) || TABLE[i][j].fixed)  return;
    }

    if (TABLE[i][j].fixed) return;

    selectCell(i, j);
}

function onNumberClick(i) {
    if (PAUSING || !anyCellSelected()) return;

    clearRedoStack();
    pushUndoStack({ "i" : CELL_SELECTED.i, "j" : CELL_SELECTED.j, "add" : CONTAINS[i] ? [i] : [], "remove" : CONTAINS[i] ? [] : [i]});

    CONTAINS[i] = !CONTAINS[i];
    CELL_SELECTED.calcNums();

    ANY_OPERATION = true;

    onSelectedCellContentChange();
}

function onClearClick() {
    if (PAUSING || !anyCellSelected()) return;

    clearRedoStack();
    pushUndoStack({ "i" : CELL_SELECTED.i, "j" : CELL_SELECTED.j, "add" : CELL_SELECTED.getNums(), "remove" : []});

    for (var i = 1; i <= 9; ++i) CONTAINS[i] = false;
    CELL_SELECTED.calcNums();

    onSelectedCellContentChange();
}

function onSelectedCellContentChange() {
    refreshNumberButtons();
    CELL_SELECTED.showContent();
    refreshTableBackgroundColor();

    checkFinished();
}

function onMarkClick() {
    if (PAUSING || !anyCellSelected()) return;

    MARKED[CELL_SELECTED.i][CELL_SELECTED.j] = !MARKED[CELL_SELECTED.i][CELL_SELECTED.j];
    refreshMarkButton();
}

function onUndoClick() {
    if (PAUSING) return;

    undo();
}

function onRedoClick() {
    if (PAUSING) return;

    redo();
}

// displayer
function displayDifficulty() {
    for (var i = 1; i <= DIFFICULTIES; ++i)
        if (i == CURR_DIFF) {
            $("#diff" + i).css("background-color", SELECTED_COLOR);
        } else {
            $("#diff" + i).css("background-color", BACKGROUND_COLOR);
        }

    $("#diff").text("" + CURR_DIFF);
}

function displayTime() {
    $("#time").text(getTimeStr()); 
}

function showTableContent() {
    for (var i = 0; i < 9; ++i) 
        for (var j = 0; j < 9; ++j) 
            TABLE[i][j].showContent();
}

function paintCellWithSameNumberAsSelectedOne() {
    if (CELL_SELECTED.getNums().length != 1) return;

    currI = CELL_SELECTED.i;
    currJ = CELL_SELECTED.j;

    for (var i = 0; i < 9; ++i) 
        for (var j = 0; j < 9; ++j) 
            if ((i != currI || j != currJ) && TABLE[i][j].getNums().length == 1 && TABLE[i][j].getNums()[0] == CELL_SELECTED.getNums()[0])
                TABLE[i][j].setBackgroundColor(SAME_COLOR);
}

function clearAllCellColor() {
    for (var i = 0; i < 9; ++i) for (var j = 0; j < 9; ++j) TABLE[i][j].setBackgroundColor(BACKGROUND_COLOR);
}

function refreshTableBackgroundColor() {
    clearAllCellColor();

    if (anyCellSelected()) {
        for (var it = 0; it < 9; ++it) TABLE[CELL_SELECTED.i][it].setBackgroundColor(RELATED_COLOR);
        for (var it = 0; it < 9; ++it) TABLE[it][CELL_SELECTED.j].setBackgroundColor(RELATED_COLOR);
    }

    paintMarkedCells();
    
    if (anyCellSelected()) {
        paintCellWithSameNumberAsSelectedOne();
        CELL_SELECTED.setBackgroundColor(SELECTED_COLOR);
    }
}

function clearAllNumberButtonColor() {
    for (var _i = 1; _i <= 9; ++_i) $("#number" + _i).css("background-color", BACKGROUND_COLOR);
}

function refreshNumberButtons() {
    for (var _i = 1; _i <= 9; ++_i) 
        if (CONTAINS[_i])
            $("#number" + _i).css("background-color", SELECTED_COLOR);
        else
            $("#number" + _i).css("background-color", BACKGROUND_COLOR);
}

MARKED = [];
function refreshMarkButton() {
    if (anyCellSelected() && MARKED[CELL_SELECTED.i][CELL_SELECTED.j]) $("#markButton").css("background-color", MARKED_COLOR);
    else $("#markButton").css("background-color", BACKGROUND_COLOR);
}

function paintMarkedCells() {
    for (var i = 0; i < 9; ++i) for (var j = 0; j < 9; ++j) if (MARKED[i][j]) TABLE[i][j].setBackgroundColor(MARKED_COLOR);
}

// function about timer
timerSum = 0;
lastStart = 0;
function startTimer() {
    lastStart = (new Date()).getTime();
}

function getTimeStr() {
    ticks = timerSum;
    if (lastStart != 0) ticks += (new Date()).getTime() - lastStart;

    sec = parseInt(ticks / 1000);

    min = parseInt(sec / 60);
    sec = sec % 60;

    return (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}

function pauseTimer() {
    timerSum += (new Date()).getTime() - lastStart;
    lastStart = 0;
}

function resetTimer() {
    timerSum = lastStart = 0;
}

PAUSING = false;
function setPause(pausing) {
    if (pausing) {
        $("#title_time").text("暂停中").css("color", LESS_BORDER_COLOR);
        $("#start").show();
        $("#pause").hide();

        pauseTimer();
    } else {
        $("#title_time").text("时间：").css("color", BLACK_COLOR);
        $("#start").hide();
        $("#pause").show();

        startTimer();
    }

    PAUSING = pausing;
}

// functions about game itself
TABLE = []

DEFAULT_MATRIX = [
    [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
    [ 4, 5, 6, 7, 8, 9, 1, 2, 3 ],
    [ 7, 8, 9, 1, 2, 3, 4, 5, 6 ],
    [ 2, 3, 4, 5, 6, 7, 8, 9, 1 ], 
    [ 5, 6, 7, 8, 9, 1, 2, 3, 4 ],
    [ 8, 9, 1, 2, 3, 4, 5, 6, 7 ],
    [ 3, 4, 5, 6, 7, 8, 9, 1, 2 ],
    [ 6, 7, 8, 9, 1, 2, 3, 4, 5 ],
    [ 9, 1, 2, 3, 4, 5, 6, 7, 8 ]
];

function makeDefaultStatus() {
    TABLE = [];

    for (var i = 0; i < 9; ++i) {
        TABLE[i] = [];

        for (var j = 0; j < 9; ++j) {
            TABLE[i][j] = new Cell(i, j, (Math.random() >= 0.1));
            TABLE[i][j].setNums(TABLE[i][j].fixed ? [DEFAULT_MATRIX[i][j]] : []);
        }
    }
}

function getPuzzle() {
    conn.requestPuzzle(CURR_DIFF);
}

INTERVAL_OBJ = null;
function gameStart() {
    getPuzzle();
}

RAW_BOARD = null;
RAW_FIXED = null;

function gameStartTrue() {
    ANY_OPERATION = false;

    TABLE = [];
    for (var i = 0; i < 9; ++i) {
        TABLE[i] = [];

        for (var j = 0; j < 9; ++j) {
            TABLE[i][j] = new Cell(i, j, RAW_FIXED[i][j]);
            TABLE[i][j].setNums(TABLE[i][j].fixed ? [RAW_BOARD[i][j]] : []);
        }
    }

    resetTimer();
    startTimer();
    setPause(false);

    if (INTERVAL_OBJ != null) clearInterval(INTERVAL_OBJ);
    INTERVAL_OBJ = setInterval("displayTime()", 200);

    // makeDefaultStatus();

    MARKED = []
    for (var i = 0; i < 9; ++i) {
        var r = [];

        for (var j = 0; j < 9; ++j) r.push(false);
        MARKED.push(r);
    }

    showTableContent();
    cancelCellSelection();
    
    $("#redo").css("visibility", "hidden");
    $("#undo").css("visibility", "hidden");
}

CELL_SELECTED = null;
CONTAINS = {}

function anyCellSelected() {
    return CELL_SELECTED != null;
}

function selectCell(i, j) {
    CELL_SELECTED = TABLE[i][j];

    CONTAINS = TABLE[i][j].getContent();

    refreshTableBackgroundColor();
    refreshNumberButtons();
    refreshMarkButton();
}

function cancelCellSelection() {
    CELL_SELECTED = null;
    
    refreshTableBackgroundColor();
    clearAllNumberButtonColor();
    refreshMarkButton();
}

CURR_DIFF = 0;
function onDifficultyChosen(dif) {
    CURR_DIFF = dif;
    displayDifficulty();

    $("#difficulty").delay(200).slideUp(300);
    $("#game").delay(200).slideDown(300);

    $(".horizen_wrapper").delay(600).fadeIn();

    gameStart();
}

// undo and redo
undoStack = [];
redoStack = [];

// stack frame in these two stacks is like
// { "i" : i, "j" : j, add : [ 1, 2, 3 ], remove : [] }
// the frame records what SHOULD be done when undo/redo, not what player did

function clearUndoRedoStack() {
    undoStack = [];
    redoStack = [];
}

function clearRedoStack() {
    redoStack = [];
    $("#redo").css("visibility", "hidden");
}

function pushUndoStack(frame) {
    undoStack.push(frame);
    $("#undo").css("visibility", "visible");
}

function undo() {
    if (undoStack.length == 0) return;

    var frame = undoStack.pop();
    redoStack.push({ "i" : frame.i, "j" : frame.j, "add" : frame.remove, "remove" : frame.add });
    $("#redo").css("visibility", "visible");

    selectCell(frame.i, frame.j);

    for (var i in frame.add) CONTAINS[frame.add[i]] = true;
    for (var i in frame.remove) CONTAINS[frame.remove[i]] = false;

    CELL_SELECTED.calcNums();

    onSelectedCellContentChange();

    if (undoStack.length == 0) $("#undo").css("visibility", "hidden");
}

function redo() {
    if (redoStack.length == 0) return;

    var frame = redoStack.pop();
    undoStack.push({ "i" : frame.i, "j" : frame.j, "add" : frame.remove, "remove" : frame.add });
    $("#undo").css("visibility", "visible");

    selectCell(frame.i, frame.j);

    for (var i in frame.add) CONTAINS[frame.add[i]] = true;
    for (var i in frame.remove) CONTAINS[frame.remove[i]] = false;

    CELL_SELECTED.calcNums();

    onSelectedCellContentChange();

    if (redoStack.length == 0) $("#redo").css("visibility", "hidden");
}

function isFinished() {
    finished = true;
    
    for (var i = 0; i < 9; ++i) {
        rowSum = 0; columnSum = 0; blockSum = 0;

        for (var j = 0; j < 9; ++j) {
            ii = parseInt(i / 3) * 3 + parseInt(j / 3);
            jj = parseInt(i % 3) * 3 + parseInt(j % 3);

            if (TABLE[i][j].getNums().length != 1 || TABLE[j][i].getNums().length != 1 || TABLE[ii][jj].getNums().length != 1) {
                finished = false; break;
            }

            rowSum += 1 << (TABLE[i][j].getNums()[0] - 1);
            columnSum += 1 << (TABLE[j][i].getNums()[0] - 1);
            blockSum += 1 << (TABLE[ii][jj].getNums()[0] - 1);
        }

        if (rowSum != 511 || columnSum != 511 || blockSum != 511) finished = false;
        if (!finished) break;
    }

    console.log("finished: " + finished);
    return finished;
}

function checkFinished() {
    if (isFinished()) {
        setPause(true);
        $("#undo").css("visibility", "hidden");
        $("#redo").css("visibility", "hidden");
        $("#start").css("visibility", "hidden");
        $("#pause").css("visibility", "hidden");

        $("#title_time").text("完成！").css("color", GREAT_BORDER_COLOR);

        cancelCellSelection();

        ANY_OPERATION = false; // don't do what you've done again
    }
}
