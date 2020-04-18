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
    chartc.style.maxHeight="1000px";
    chart2.style.display="none";
    barChart.destroy();
    if (X.length<=20) {
        wide=0.75
    } else wide =1;
    barChart = new Chart(chart1, {
        type: "bar",
        data: {
            labels: X,
            datasets: [
                {
                    data: Y,
                    label: "Daily Demand",
                    backgroundColor: "#007bff",
                    categoryPercentage: 1.0,
                    barPercentage: wide
                },
            ]
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect:false
            }
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
            chartc.style.maxHeight="9999px"
        }
    }
}

const chart3 = document.getElementById("chart3");
let lineChart = new Chart(chart3, {});
function drawChart2() {
    lineChart.destroy();
    lineChart = new Chart(chart3, {
        type: "line",
        data: {
            labels: X,
            datasets: [
                {
                    data: I,
                    label: "Inventory",
                    borderColor:"rgba(0, 200, 81,1)",
                    backgroundColor: "rgba(0, 200, 81,0.25)",
                    hoverBackgroundColor: "rgba(0, 200, 81,0.25)",
                    fill:"start",
                    pointRadius:0
                },
                {
                    data: B,
                    label: "Backorders",
                    borderColor:"rgba(255, 68, 68,1)",
                    backgroundColor: "rgba(255, 68, 68, 0.25)",
                    hoverBackgroundColor: "rgba(255, 68, 68, 0.75)",
                    fill:"start",
                    pointRadius:0,
                },
            ],
        },
        options: {
            elements: {
                line: {
                    tension: 0
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false
            }
        }
    });
}


