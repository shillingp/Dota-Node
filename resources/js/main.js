

var fs = require("fs");

var key = "FBA2AB0FC3F9FA47FE85267ACB48FE47",
    // player = "shillingdoto",
    account = "102598445";

var storage = "resources/json/mass.json";

var settings = {
    path: "resources/json/setting.json",
    start_time: 0
};

const Dota2Api = require("dota2-api");

const da = Dota2Api.create(key);

var massData = [],
    matchesData = [],
    newLength;

var ignoreModes = [0, 7, 8, 9, 10, 11, 14, 15, 18, 19, 20, 21];


function setTimeStamps() {
    var sett = JSON.stringify(settings);
    fs.writeFileSync(settings.path, sett);
}

function saveNewData() {
    var saveData = JSON.stringify(matchesData);
    fs.writeFileSync(storage, saveData);
    getMassData();
}

function filterDetails(data) {
    if (ignoreModes.indexOf(data.game_mode) === -1) {
        data.players.forEach(function(player) {
            if (player.account_id == account) {
                data.players = player;
            }
        });
        matchesData.push(data);
    } else {
        newLength -= 1;
    }
    if (matchesData.length === newLength) {
        matchesData.sort(function(a, b) {
            return b.match_id - a.match_id;
        });
        setTimeStamps();
        saveNewData();
    }
}

function getDetails(match_id) {
    var req = da.getMatchDetails(match_id);
    req.then(function(result) {
        filterDetails(result.result);
    }, function(error) {
        console.log(error);
    });
}

function getMatchStats(data) {
    newLength = data.length;
    try {
        data.delayedForEach(function(match) {
            if (settings.start_time > match.start_time) {
                throw BreakException;
            } else {
                getDetails({match_id: match.match_id});
                settings.start_time = match.start_time
            }
        }, 1000); // Speed is 1000ms RECOMMENDED
    } catch(e) {
        if (e !== BreakException) throw e
    }
}

function getRecent(start_id) {
    // REFETCH ALL THE RESULTS AND REPLACE CURRENT COPIES
    var req = da.getMatchHistory({
        account_id: account,
        start_at_match_id: start_id
    });
    req.then(function(res) {
        var result = res.result.matches;
        result.reverse();
        result = [].concat.apply([], result)

        getMatchStats(result);
    }, function(error) {
        console.log(error);
    });
}

function getMassData() {
    var oldData = fs.readFileSync(storage, "utf8");
    massData = JSON.parse(oldData)
    getRecent()
}

function getSettings() {
    sett = fs.readFileSync(settings.path, "utf8");
    sett = JSON.parse(sett);
    settings = sett;
    getMassData();
}

getSettings();
