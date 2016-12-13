

function matchTime(secs) {
    var time = new Date(secs * 1000);
    return time.toDateString();
}

function arrRange(arr, values) {
    var endArr = [];
    for (var i=0;i<arr.length;i++) {
        endArr[i] = values ? i : "";
    }
    return endArr;
}

function capitalizeAll(string) {
    var stringArr = string.split("_");
    for (var i=0;i<stringArr.length;i++) {
        if (["xp", "id"].indexOf(stringArr[i]) !== -1) {
            stringArr[i] = stringArr[i].toUpperCase();
        } else {
            var firstChar = stringArr[i].charAt(0).toUpperCase();
            stringArr[i] = firstChar + stringArr[i].slice(1);
        }
    }
    return stringArr.join(" ")
}
