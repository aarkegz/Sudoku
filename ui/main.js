function initTable() {
    for (var i = 0; i < 9; ++i) {
        var tr = $("<tr></tr>");
        for (var j = 0; j < 9; ++j) {
            var td = $("<td class=\"cell\" name=\"cell" + i + j + "\">" + i + j + "</td>");

            if (i % 3 == 0 && i > 0) td.css({ "border-top-width" : "2px", "border-top-color" : "#724938" });
            if (i == 0) td.css({ "border-top-width" : "4px", "border-top-color" : "#724938" });
            if (i % 3 == 2 && i < 8) td.css({ "border-bottom-width" : "2px", "border-bottom-color" : "#724938" });
            if (i == 8) td.css({ "border-bottom-width" : "4px", "border-bottom-color" : "#724938" });
            if (j % 3 == 0 && j > 0) td.css({ "border-left-width" : "2px", "border-left-color" : "#724938" });
            if (j == 0) td.css({ "border-left-width" : "4px", "border-left-color" : "#724938" });
            if (j % 3 == 2 && j < 8) td.css({ "border-right-width" : "2px", "border-right-color" : "#724938" });
            if (j == 8) td.css({ "border-right-width" : "4px", "border-right-color" : "#724938" });

            tr.append(td);
        }

        $("table.table_main").append(tr);
    }
}