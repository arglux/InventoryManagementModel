window.onload = function () {
    const input = document.getElementById( 'data' );
    const fileName = document.getElementById( 'fileName' );
    const forData = document.getElementById( 'forData' );
    input.addEventListener( 'change', function showFileName( event ) {
        if (event.target.files.length===0) {
            fileName.innerText = "Select Data";
            forData.className="btn btn-outline-primary";
        } else {
            fileName.innerText = ''+ event.target.files[0].name;
            forData.className="btn btn-outline-success";
        }

    });
};

/*************Chart Functions*************/

const chart1 = document.getElementById("chart1");
const chart2 = document.getElementById("chart2");
const chartc = document.getElementById("chart-container");
let graph=false;
let barChart = new Chart(chart1, {});
let wide;

function drawChart() {
    graph=true;
    chartc.style.maxHeight="500px";
    chart2.style.display="none";
    barChart.destroy();
    barChart = new Chart(chart1, {
        type: "bar",
        data: {
            labels: X,
            datasets: [
                {
                    data: Y,
                    label: "Demand (Units)",
                    backgroundColor: "#118AB2",
                    categoryPercentage: 1.0,
                    barPercentage: 1
                },
                {
                    data: Q,
                    label: "Supply (Units)",
                    backgroundColor: "#06D6A0",
                    categoryPercentage: 1.0,
                    barPercentage: 1
                },
                {
                    data: B,
                    label: "Backorders (Units)",
                    backgroundColor: "#EF476F",
                    categoryPercentage: 1.0,
                    barPercentage: 1
                },
                {
                    data: I,
                    label: "Inventory (Units)",
                    borderColor: "#118AB2",
                    type: "line",
                    pointRadius:0
                },
            ]
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect:false
            },
            elements: {
                line: {
                    tension: 0
                }
            },
        }
    });
}

let tog;
function toggleChart() {
    if (graph) {
        tog=!tog;
        if (!tog) {
            chart2.style.display="none";
            chart1.style.display="block";
        } else {
            chart2.style.display="block";
            chart1.style.display="none";
        }
    }
}

let hide=true;
function hideChart() {
    if (graph) {
        hide=!hide;
        if (!hide) {
            chartc.style.maxHeight="0"
        } else {
            chartc.style.maxHeight="500px"
        }
    }
}

const chart3 = document.getElementById("chart3");
const chart4 = document.getElementById("chart4");
const chart5 = document.getElementById("chart5");
let lineChart1 = new Chart(chart3, {});
let lineChart2 = new Chart(chart4, {});
let lineChart3 = new Chart(chart5, {});
let options= {
    elements: {
        line: {
            tension: 0
        }
    },
    tooltips: {
        mode: 'index',
        intersect: false
    }
};
function drawChart2() {
    lineChart1.destroy();
    lineChart1 = new Chart(chart3, {
        type: "line",
        data: {
            labels: X,
            datasets: [
                {
                    data: I_optimized,
                    label: "Optimal Inventory Level",
                    borderColor:"rgba(0, 200, 81,1)",
                    backgroundColor: "rgba(0, 200, 81, 0.25)",
                    hoverBackgroundColor: "rgba(0, 200, 81, 0.75)",
                    fill:"start",
                    pointRadius:0,
                },
                {
                    data: I,
                    label: "Actual Inventory Level",
                    borderColor:"rgba(0,191,255,1)",
                    backgroundColor: "rgba(0,191,255,0.25)",
                    hoverBackgroundColor: "rgba(0,191,255,0.25)",
                    fill:"start",
                    pointRadius:0
                },
            ],
        },
        options: options
    });

    lineChart2.destroy();
    lineChart2 = new Chart(chart4, {
        type: "line",
        data: {
            labels: X,
            datasets: [
                {
                    data: B,
                    label: "Actual Backorder Level",
                    borderColor:"rgba(0,191,255,1)",
                    backgroundColor: "rgba(0,191,255,0.25)",
                    hoverBackgroundColor: "rgba(0,191,255,0.25)",
                    fill:"start",
                    pointRadius:0
                },
                {
                    data: B_optimized,
                    label: "Optimal Backorder Level",
                    borderColor:"rgba(0, 200, 81,1)",
                    backgroundColor: "rgba(0, 200, 81, 0.25)",
                    hoverBackgroundColor: "rgba(0, 200, 81, 0.75)",
                    fill:"start",
                    pointRadius:0,
                },
            ],
        },
        options: options
    });
    lineChart3.destroy();
    lineChart3 = new Chart(chart5, {
        type: "line",
        data: {
            labels: X,
            datasets: [
                {
                    data: cum_Tc,
                    label: "Estimated Actual Cumulative Cost",
                    borderColor:"rgba(0,191,255,1)",
                    backgroundColor: "rgba(0,191,255,0.25)",
                    hoverBackgroundColor: "rgba(0,191,255,0.25)",
                    fill:"start",
                    pointRadius:0
                },
                {
                    data: cum_Tc_optimized,
                    label: "Optimal Cumulative Cost",
                    borderColor:"rgba(0, 200, 81,1)",
                    backgroundColor: "rgba(0, 200, 81, 0.25)",
                    hoverBackgroundColor: "rgba(0, 200, 81, 0.75)",
                    fill:"start",
                    pointRadius:0,
                },
            ],
        },
        options: options
    });
}


