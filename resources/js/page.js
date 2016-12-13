
var matchData = massData.slice(0);

matchData.reverse();

const mainChart = document.getElementById("main-chart")
const labelLimit = 50;

var currentChart = [];

var chartData = {
    labels: [0, 0],
    datasets: [{
        data: [0, 0],

        lineTension: 0.025,

        backgroundColor: "rgba(151,187,205,0.2)",

        borderColor: "rgba(151,187,205,1)",

        pointBackgroundColor: "rgba(151,187,205,1)",
        pointBorderColor: "rgba(200,200,200,1)",
        pointHoverBackgroundColor: "rgba(255,80,80,0.8)",
        pointHoverRadius: 5,
        pointHitRadius: 3
    }]
};

var options = {
    responsive: true,
    onClick: handlePointEvent,
    onResize: controlPosition,
    title: {
        display: false,
        text: "Dota Node"
    },
    legend: {
        display: false
    },
    tooltips: {
        enabled: true,
        displayColors: false,
        callbacks: {
            title: function(tooltip) {
                var obj = chartData.obj[tooltip[0].index],
                hero = getHero(obj.players.hero_id);
                return hero;
            },
            label: function(tooltip) {
                var obj = chartData.obj[tooltip.index],
                y = capitalizeAll(yAxis.value);
                return y + ": " + tooltip.yLabel
            },
            afterLabel: function(tooltip) {
                var obj = chartData.obj[tooltip.index],
                x = capitalizeAll(xAxis.value);
                return byTime.checked || byHero.checked ? null : x + ": " + tooltip.xLabel
            }
        }
    },
    scales: {
        xAxes: [{
            ticks: {
                autoSkip: true,
                autoSkipPadding: 25,
            }
        }]
    }
}

function handlePointEvent(e) {
    var activePoint = newChart.getElementsAtEvent(e)[0];
    if (activePoint) {
        displayTooltip(chartData.obj[activePoint._index])
    }
}

var ctx = mainChart.getContext("2d");
var newChart = new Chart(ctx, {
    type: "line",
    data: chartData,
    options: options
});



var toolTipBody = document.getElementById("tooltip-body");
var infoList = ["hero_id", "item_0", "item_1", "item_2", "item_3", "item_4", "item_5", "kills", "deaths", "assists", "last_hits", "denies", "gold_per_min", "xp_per_min", "gold", "gold_spent", "hero_damage", "tower_damage", "hero_healing", "level"];


var yAxis = document.querySelector("#y-axis-control select"),
xAxis = document.querySelector("#x-axis-control select"),
limit = document.querySelector("#limit-control select"),
byTime = document.querySelector(".check-box-control #by-time"),
byHero = document.querySelector(".check-box-control #by-hero");


function drawChart() {
    newChart.data.datasets[0] = chartData.datasets[0]
    newChart.data.labels = chartData.labels
    newChart.data.obj = chartData.obj

    newChart.update()
}

function getHeroValues(y) {
    var id = limit.value,
    allValues = getValue("hero_id"),
    endArr = [],
    currentChart = [];

    for (var i=0;i<allValues.length;i++) {
        if (allValues[i] == id) {
            endArr.push(matchData[i].players[y]);
            currentChart.push(matchData[i]);
        }
    }

    chartData.obj = [];
    currentChart.forEach(function(i, n) {
        chartData.obj[n] = i
    });

    return endArr;
}

function getValue(val) {
    var endArr = [];
    currentChart = [];

    for (var i=0;i<matchData.length;i++) {
        endArr.push(matchData[i].players[val]);
        currentChart.push(matchData[i]);
    }

    chartData.obj = [];
    currentChart.forEach(function(i, n) {
        chartData.obj[n] = i
    });

    return endArr;
}

function sortXBy(cat) {
    if (!cat) cat = "start_time";
    if (!massData[0].hasOwnProperty(cat)) {
        matchData.sort(function(a, b) {
            return a.players[cat] - b.players[cat];
        });
    } else {
        matchData.sort(function(a, b) {
            return a[cat] - b[cat];
        });
    }
}

function chartControl(x, y, xSrc) {
    var endData = [];
    if (xSrc == "limit") {
        sortXBy();
        endData = getHeroValues(y);
    } else if (!x) {
        sortXBy();
        endData = getValue(y);
    } else {
        sortXBy(x);
        endData = getValue(y);
    }

    chartData.datasets[0].data = endData;
    chartData.labels = isNaN(x) ? getValue(x) : arrRange(endData, false);
    if (endData.length > 1) drawChart();
}

function readControls() {
    var x, y;
    var xSrc = "";
    y = yAxis.value;
    if (!xAxis.hasAttribute("disabled")) {
        x = xAxis.value;
        xSrc = "xAxis";
    } else if (!limit.hasAttribute("disabled")) {
        x = limit.value;
        xSrc = "limit";
    } else {
        x = null;
        xSrc = "time"
    }
    chartControl(x, y, xSrc);
}

function controlHandler() {
    if (byHero.checked) {
        limit.removeAttribute("disabled");
    } else {
        limit.setAttribute("disabled", true);
    }
    if (byTime.checked) {
        xAxis.setAttribute("disabled", true);
        byHero.setAttribute("disabled", true);
        limit.setAttribute("disabled", true);
    } else {
        xAxis.removeAttribute("disabled");
        byHero.removeAttribute("disabled");
    }
    if (byHero.checked) {
        xAxis.setAttribute("disabled", true);
    }
    readControls();
}



function axisOptions(elem) {
    var options = listOptions
    frag = new window.DocumentFragment();
    options.forEach(function(i) {
        var opt = new Option(capitalizeAll(i));
        opt.value = i;
        frag.appendChild(opt);
    });
    elem.insertBefore(frag, null);
}

function heroOptions(elem) {
    var frag = new window.DocumentFragment();
    heroes.forEach(function(hero) {
        var opt = new Option(hero.localized_name);
        opt.value = hero.id;
        frag.appendChild(opt)
    });
    elem.insertBefore(frag, null);
}

function selectHandler() {
    var controllers = [yAxis, xAxis, limit];
    controllers.forEach(function(i, n) {
        i.addEventListener("change", readControls);
        if (n < 2) {
            axisOptions(i);
        } else {
            heroOptions(i);
        }
    });
}

function sortHeroes() {
    var list = [],
    l = limit;

    for (var i=0;i<l.length;i++) {
        list[i] = [l.options[i].text, l.options[i].value]
    }
    list.sort();
    list.forEach(function(i, x) {
        l.options[x].text = i[0];
        l.options[x].value = i[1];
    });
}

function controlPosition() {
    var control = document.querySelector("#controllers");
    control.style.top = mainChart.offsetTop + mainChart.height + 25 + "px";
    control.style.left = mainChart.offsetLeft + (mainChart.width/2) - (control.clientWidth/2) + "px";
}

function setUpControls() {
    selectHandler();
    sortHeroes();
    controlPosition();
    byTime.addEventListener("change", controlHandler);
    byHero.addEventListener("change", controlHandler);
    window.addEventListener("resize", controlPosition);
}
setUpControls();
controlHandler();

displayTooltip(currentChart[currentChart.length - 1])
