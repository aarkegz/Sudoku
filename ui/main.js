GREAT_BORDER_COLOR = "#724938";
LESS_BORDER_COLOR = "#B47157"
BACKGROUND_COLOR = "#FFFFFF";
CHOSEN_COLOR = "#DB8E71";
PAUSE_COLOR = "#AAAAAA";
BLACK_COLOR = "#000000"


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
    tr2.append("<td><p class=\"mediumchars\">标记</p></td>");
    tr2.append("<td><p class=\"mediumchars\">清空</p></td>");

    $("table.table_numbers").append(tr2);
}

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
    select("" + i + j);
}

DIFFICULTIES = 10
function initDifficultyTable() {
    var tr = $("<tr></tr>");

    for (var i = 1; i <= DIFFICULTIES; ++i) tr.append("<td onclick=\"onDifficultyChosen(" + i + ")\" id = \"diff" + i + "\">" + i + "</td>");
    $("table.table_difficulty").append(tr);
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

function displayDifficulty() {
    for (var i = 1; i <= DIFFICULTIES; ++i)
        if (i == CURR_DIFF) {
            $("#diff" + i).css("background-color", CHOSEN_COLOR);
        } else {
            $("#diff" + i).css("background-color", BACKGROUND_COLOR);
        }

    $("#diff").text("" + CURR_DIFF);
}

function displayTime() {
    $("#time").text(getTimeStr()); 
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

INTERVAL_OBJ = null
function gameStart() {
    resetTimer();
    startTimer();
    setPause(false);

    if (INTERVAL_OBJ != null) clearInterval(INTERVAL_OBJ);
    INTERVAL_OBJ = setInterval("displayTime()", 200);
}

function select(name) {
    
}
