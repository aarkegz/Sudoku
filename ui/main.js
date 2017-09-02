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

// the cell class
function Cell(i, j, fixed) {
    this.i = i;
    this.j = j;
    this.selector = "#cell" + i + j;
    this.fixed = fixed;

    this.content = emptyContent();

    this.nums = [];
}

Cell.emptyContent = function() {
    var rv = [];
    for (var i = 0; i < 9; ++i) rv.push(false);

    return rv;
}

Cell.setBackgroundColor = function(color) {
    $(this.selector).css("background-color", color);
}

        // content = [bool * 9]
Cell.setContent = function(content) {
    this.nums = [];
    for (var i = 0; i < 9; ++i) if (this.content[i] = content[i]) this.nums.push(i + 1);
}

Cell.setNums = function(nums) {
    this.content = emptyContent();
    this.nums = nums;
    for (var i in nums) this.content[i] = true;
}

Cell.getContent = function() { return this.content; }
Cell.getNums = function() { return this.Nums; }

Cell.showContent = function() {
    len = this.nums.length;
    target = $(this.selector);

    if (len == 0) {
        target.text("");
    } else if (len == 1) {
        target.text(nums[0]);
    } else { 
        cont = ""
        align = len <= 4 ? 2 : 3;
        fontClass = len <= 4 ? "mediumchars" : "smallchars";

        cont += nums[0];
        for (var i = 1; i < len; ++i) {
            cont += (i % align == 0) ? "<br/>" : " ";
            cont += nums[i];
        }

        target.html("<p class=\"" + fontClass + "\">" + cont + "</p>");
    }

    if (this.fixed) target.css("color", BLACK_COLOR);
    else target.css("color", UNFIXED_COLOR);
}

// handler
function onStartClick() {
    setPause(false);
}

function onPauseClick() {
    setPause(true);
}

function onRestartClick() {
    gameStart();
}

function onExitClick() {
    resetTimer();
    $(".horizen_wrapper").fadeOut();

    $("#difficulty").delay(200).slideDown(300);
    $("#game").delay(200).slideUp(300);
}

function onCellClick(i, j) {
    if (PAUSING) return;

    if (CELL_SELECTED) {
        cancelCellSelection();
        if ((CURR_I == i && CURR_J == j) || GAMESTATUS["" + i + j + "_fixed"])  return;
    }

    if (GAMESTATUS["" + i + j + "_fixed"]) return;

    selectCell(i, j);
}

function onNumberClick(i) {
    if (PAUSING || !CELL_SELECTED) return;

    CONTAINS[i] = !CONTAINS[i];
    refreshStatus();
    refreshNumberDisplay();
    drawCell(CURR_I, CURR_J);
    drawSelectedCell();
}

function onClearClick() {
    if (PAUSING || !CELL_SELECTED) return;

    for (var i = 1; i <= 9; ++i) CONTAINS[i] = false;

    refreshStatus();
    refreshNumberDisplay();
    drawCell(CURR_I, CURR_J);
    drawSelectedCell();
}

function onMarkClick() {
    if (PAUSING || !CELL_SELECTED) return;

    MARKED[CURR_I][CURR_J] = !MARKED[CURR_I][CURR_J];
    refreshMarkButton();
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

function setRowColor(i, color) {
    for (var it = 0; it < 9; ++it) $("#cell" + i + it).css("background-color", color);
}

function setColumnColor(i, color) {
    for (var it = 0; it < 9; ++it) $("#cell" + it + i).css("background-color", color);
}

function setCellColor(i, j, color) {
    $("#cell" + i + j).css("background-color", color);
}

function drawTable() {
    for (var i = 0; i < 9; ++i) 
        for (var j = 0; j < 9; ++j) 
            drawCell(i, j);
}

function drawCell(i, j) {
    name = "" + i + j;
    nums = GAMESTATUS[name];
    fixed = GAMESTATUS[name + "_fixed"];

    if (nums.length == 0) {
        $("#cell" + name).text("");
    } else if (nums.length == 1) {
        $("#cell" + name).text(nums[0]);
    } else if (nums.length <= 4) {
        cont = ""
        for (var i = 0; i < nums.length; ++i) {
            cont += nums[i];

            if (i < nums.length - 1) {
                if (i % 2 == 1) cont += "<br/>";
                else cont += " ";
            }
        }

        $("#cell" + name).html("<p class=\"mediumchars\">" + cont + "</p>");
    } else {
        cont = ""
        for (var i = 0; i < nums.length; ++i) {
            cont += nums[i];

            if (i < nums.length - 1) {
                if (i % 3 == 2) cont += "<br/>";
                else cont += " ";
            }
        }

        $("#cell" + name).html("<p class=\"smallchars\">" + cont + "</p>");
    }

    if (fixed) $("#cell" + name).css("color", BLACK_COLOR);
    else $("#cell" + name).css("color", UNFIXED_COLOR);
}

function clearAllCellColor() {
    for (var _i = 0; _i < 9; ++_i) for (var _j = 0; _j < 9; ++_j) setCellColor(_i, _j, BACKGROUND_COLOR);
}

function paintCellWithSameNumber(i, j) {
    if (GAMESTATUS["" + i + j].length != 1) return;

    for (var _i = 0; _i < 9; ++_i) 
        for (var _j = 0; _j < 9; ++_j) 
            if ((i != _i || j != _j) && GAMESTATUS["" + _i + _j].length == 1 && GAMESTATUS["" + i + j][0] == GAMESTATUS["" + _i + _j][0])
                $("#cell" + _i + _j).css("background-color", SAME_COLOR);
}

function clearAllNumberColor() {
    for (var _i = 1; _i <= 9; ++_i) $("#number" + _i).css("background-color", BACKGROUND_COLOR);
}

function refreshNumberDisplay() {
    for (var _i = 1; _i <= 9; ++_i) 
        if (CONTAINS[_i])
            $("#number" + _i).css("background-color", SELECTED_COLOR);
        else
            $("#number" + _i).css("background-color", BACKGROUND_COLOR);
}

function refreshMarkButton() {
    if (CELL_SELECTED && MARKED[CURR_I][CURR_J]) $("#markButton").css("background-color", MARKED_COLOR);
    else $("#markButton").css("background-color", BACKGROUND_COLOR);
}

function drawSelectedCell() {
    clearAllCellColor();

    setRowColor(CURR_I, RELATED_COLOR);
    setColumnColor(CURR_J, RELATED_COLOR);

    paintMarkedCells();
    paintCellWithSameNumber(CURR_I, CURR_J);

    setCellColor(CURR_I, CURR_J, SELECTED_COLOR);
}

MARKED = [];
function paintMarkedCells() {
    for (var i = 0; i < 9; ++i) for (var j = 0; j < 9; ++j) if (MARKED[i][j]) $("#cell" + i + j).css("background-color", MARKED_COLOR);
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
GAMESTATUS = null;
/* GAMESTATUS is a json object following the following format
{
    "00" : [ 1, 2, 3 ],           <- numbers in this cell
    "00_fixed" : false，          <- is this cell fixed (filled in the origin status)
    "01" : [],                    <- an empty cell
    "01_fixed" : false,
    "02" : [ 4 ],
    "02_fixed" : true,
    ...
    "08" : [ 7 ],
    "08_fixed" : true,
    "10" : [5],
    "10_fixed" : false,
    ...
    "88" : [9],
    "88_fixed" : true             <- though the order is not quite important ...
}
*/
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
    rv = { };
    TABLE = [];

    for (var i = 0; i < 9; ++i) {
        TABLE[i] = [];

        for (var j = 0; j < 9; ++j) {
            TABLE[i][j] = new Cell(i, j, (Math.random() >= 0.5));

            rv["" + i + j + "_fixed"] = (Math.random() >= 0.5);
            rv["" + i + j] = rv["" + i + j + "_fixed"] ? [DEFAULT_MATRIX[i][j]] : [];


        }
    }

    GAMESTATUS = rv;
}

INTERVAL_OBJ = null;
function gameStart() {
    resetTimer();
    startTimer();
    setPause(false);

    if (INTERVAL_OBJ != null) clearInterval(INTERVAL_OBJ);
    INTERVAL_OBJ = setInterval("displayTime()", 200);

    makeDefaultStatus();
    drawTable();

    for (var i = 0; i < 9; ++i) {
        var r = [];

        for (var j = 0; j < 9; ++j) r.push(false);
        MARKED.push(r);
    }
}

CELL_SELECTED = false;
CURR_I = 0; CURR_J = 0;
CONTAINS = {}
function selectCell(i, j) {
    CELL_SELECTED = true;
    CURR_I = i; CURR_J = j;

    CONTAINS = {}
    nums = GAMESTATUS["" + i + j];
    for (var _i = 1; _i <= 9; ++_i) {
        CONTAINS[_i] = ($.inArray(_i, nums) != -1);
    }

    drawCell(i, j);
    drawSelectedCell();
    refreshNumberDisplay();
    refreshMarkButton();
}

function cancelCellSelection() {
    CELL_SELECTED = false;
    clearAllCellColor();
    paintMarkedCells();

    clearAllNumberColor();
}

function refreshStatus() {
    val = [];

    for (var _i = 1; _i <= 9; ++_i) if (CONTAINS[_i]) val.push(_i);

    GAMESTATUS["" + CURR_I + CURR_J] = val;
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
