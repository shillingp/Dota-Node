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

// var ctx = mainChart.getContext("2d");
// var newChart = new Chart(ctx, {
//     type: "line",
//     data: chartData,
//     options: options
// });

function handlePointEvent(e) {
    var activePoint = newChart.getElementsAtEvent(e)[0];
    if (activePoint) {
        displayTooltip(chartData.obj[activePoint._index])
    }
}
