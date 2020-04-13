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

    })
};

/*************Chart Functions*************/

const chart1 = document.getElementById("chart1");
const chartc = document.getElementById("chart-container");
const chart2 = document.getElementById("chart2");
let graph=false;
let barChart = new Chart(chart1, {});

function drawChart() {
    graph=true;
    chartc.style.maxHeight="1000px";
    chart2.style.display="none";
    barChart.destroy();
    barChart = new Chart(chart1, {
        type: 'bar',
        data: {
            labels: X,
            datasets: [
                {
                    data: Y,
                    label: "Monthly Demand",
                    backgroundColor: "#007bff",
                    fill: false
                },
            ]
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


